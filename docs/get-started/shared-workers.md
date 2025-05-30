# Managing multiple WebPhone instances using SharedWorker

Most browser-based applications allow users to open multiple tabs. In each tab
you may have a distinct WebPhone instance. However, there is a limit of how many
instances you can run per each extension. So what if the user opens too many
tabs? This will lead to unpredictable results.

To allow a user to open an unlimitted number of tabs without ever hitting a
limit, one cab have one tab run a **primary phone** while all other tabs run
secondary or **dummy phones**. Dummy phones don't register themselves to the
RingCentral Server. Instead, only the primary phone does, and then it syncs its
state to all the dummy phones. When user performs an action on a dummy phone,
the dummy phone forwards the action to the primary phone. The primary phone then
performs the action and syncs the state back to all the other dummy phones.

To achieve this, you will need to use a
[SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker).

## How SharedWorkers work

This is how a shared worker functons:

1. The primary phone sends its state to SharedWorker.
2. SharedWorker transmits that state to all available dummy phones.
3. The dummy phones update their state and UI accordingly.

Conversely, when the user performs an action on a dummy phone:

1. The dummy phone forwards the action to SharedWorker.
2. SharedWorker forwards the action to the primary phone.
3. The primary phone performs the action and sends its new state to
   SharedWorker.

And the process repeats itself.

When the primary phone quits (the browser tab closes, the user navigates away to
another page, etc), then a dummy phone is automatically promoted to become the
new primary phone. This way, there is always one and only one primary phone.

## Sample code and technical details

A primary phone is initiated like this:

```ts
import SipClient from "ringcentral-web-phone/sip-client";

new WebPhone({ sipInfo, sipClient: new SipClient({ sipInfo }) });
```

Or even simpler (since `sipClient` is optional with default value
`new SipClient({ sipInfo })`):

```ts
new WebPhone({ sipInfo });
```

A dummy phone is initiated like this:

```ts
import { DummySipClient } from "ringcentral-web-phone/sip-client";

new WebPhone({ sipInfo, sipClient: new DummySipClient() });
```

You may need to re-initiate a dummy phone to a real phone when the previous
primary phone quits.

A `DummySipClient` doesn't register itself with the RingCentral Server, nor does
it send any SIP messages to the RingCentral Server. It is effectively inert.

Then, you will need to implement a SharedWorker to:

- sync the state from the real phone to all dummy phones.
- forward actions from dummy phones to the real phone.

### Sample SharedWorker

```ts
const dummyPorts = new Set<MessagePort>();
let realPort: MessagePort | undefined;

let syncCache: any;
self.onconnect = (e) => {
  const port = e.ports[0];
  if (realPort) {
    dummyPorts.add(port);
    port.postMessage({ type: "role", role: "dummy" });
  } else {
    realPort = port;
    port.postMessage({ type: "role", role: "real" });
  }
  port.onmessage = (e) => {
    // a new dummy is ready to receive state
    if (e.data.type === "ready") {
      if (port !== realPort && syncCache) {
        port.postMessage(syncCache);
      }
    } // a tab closed
    else if (e.data.type === "close") {
      if (port === realPort) {
        realPort = undefined;

        // if real closes, all call sessions are over.
        dummyPorts.forEach((dummyPort) =>
          dummyPort.postMessage({ type: "sync", jsonStr: "[]" })
        );

        // prompt a dummy to be a real
        if (dummyPorts.size > 0) {
          realPort = Array.from(dummyPorts)[0];
          dummyPorts.delete(realPort);
          realPort.postMessage({ type: "role", role: "real" });
        }
      } else {
        dummyPorts.delete(port);
      }
    } else if (e.data.type === "action") {
      // forward action to real
      if (realPort) {
        realPort.postMessage(e.data);
      }
    } else if (e.data.type === "sync") {
      // sync state to all dummies
      syncCache = e.data;
      dummyPorts.forEach((dummyPort) => dummyPort.postMessage(e.data));
    }
  };
};
```

### Sample client code

```ts
worker.port.onmessage = (e) => {
  if (e.data.type === "role") {
    // role assigned/updated
    store.role = e.data.role;
    // you may need to (re-)initiate the web phone
  } else if (store.role === "real" && e.data.type === "action") {
    // real gets action from dummy
  } else if (store.role === "dummy" && e.data.type === "sync") {
    // dummy gets state from real
  }
};
```

### A sample action processing code

```ts
public async transfer(callId: string, transferToNumber: string) {
  if (this.role === 'dummy') {
    worker.port.postMessage({ type: 'action', name: 'transfer', args: { callId, transferToNumber } });
    return;
  }
  await this.webPhone.callSessions.find((cs) => cs.callId === callId)!.transfer(transferToNumber);
}
```

## Full working example

A
[fully working example](https://github.com/tylerlong/rc-web-phone-demo-2/tree/shared-worker)
is available so that you can see it working with multiple browser tabs.
