# Managing Web Phone instances

## Creating an instance

```ts
import WebPhone from "ringcentral-web-phone";

const webPhone = new WebPhone({ sipInfo });
await webPhone.start();
```

What is `sipInfo`? Please read [Pre-requisites](#pre-requisites) section.

### Specifying an instance ID manually

Optionally, you can specify `instanceId`: `new WebPhone({ sipInfo, instanceId })`. `instanceId` is the unique ID of your web phone device.

If you want like to run multiple web phone devices in multiple tabs, you need to generate a unique `instanceId` for each device. It MUST be persistent across power cycles of the device. It MUST NOT change as the device moves from one network to another. Ref:
https://datatracker.ietf.org/doc/html/rfc5626#section-4.1

If you start two web phone instances with the same `instanceId`, only the second instance will work. SIP server will not route calls to the first instance. (The first instance will still be able to make outbound calls, but it will not receive inbound calls.)

If you don't specify `instanceId`, the SDK by default will use `sipInfo.authorizationId` as `instanceId`. It won't change unless you generate a new `sipInfo`.

If you start two web phone instances with different `instanceId`, both instances will work. SIP server will send messages to both instances.

The maximum unique live instances allowed for an extension is 5. If you try to register more, SIP server will reply with "SIP/2.0 603 Too Many Contacts".

If you keep refreshing a browser page, and each refresh you use an unique `instanceId` to register a web phone instance. Registration will fail when you try to create the 6th web phone instance (when you refresh the page the 5th time).

It takes around 1 minute for SIP server to mark an instance as expired (if client doesn't refresh it any more). So after you meet "SIP/2.0 603 Too Many Contacts" error, wait for 1 minute and try again.

You may also invoke `await webPhone.dispose();` to dispose a web phone instance before you close/refresh a browser page. That way, the web phone instance registration is removed from SIP server immediately without waiting for 1 minute.

### Debug mode

```ts
const webPhone = new WebPhone({ sipInfo, debug: true });
```

In debug mode, the SDK will print all SIP messages to the console. It is useful for debugging.

## Disposing of an instance

When you no longer need the web phone instance, or you are going to
close/refresh the browser page/tab, it is good practice to invoke:

```ts
await webPhone.dispose();
```

## Mutiple instances and shared worker

Some application allows users to open multiple tabs to run multiple instances.
If you want all of the web phones to work properly, you need to assign them
different `instanceId`. If you don't know what is `instanceId`, please read
[Initialization](#initialization) section.

But there is a limit of how many instances you can run for each extension. What
if the user opens too many tabs? A better solution is to have one tab run a
"real" phone while all other tabs run "dummy" phones. Dummy phones don't
register itself to RingCentral Server. Real phone syncs its state to all dummy
phones so that dummy phones are always in sync with the real phone. When user
performs an action on a dummy phone, the dummy phone forwards the action to the
real phone. The real phone then performs the action and syncs the state back to
all dummy phones.

In order to achieve this, you will need to use
[SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker).

1. The real phone sends state to SharedWorker. SharedWorker sends state to all
   dummy phones. Dummy phones update their state and UI. So that dummy phones
   look identical to the real phone.
2. When end user performs an action on a dummy phone, the dummy phone forwards
   the action to SharedWorker. SharedWorker forwards the action to the real
   phone. The real phone performs the action and update its state. Go to step 1.

When the real phone quits (tab closing, navigating to another page, etc), a
dummy phone will be prompted to a real phone.

This way, there is always one and only one real phone. All other phones are
dummy phones. Dummy phones always look identical to a real phone because they
will always get the latest state of a real phone. All actions are performed by
the real phone.

### Technical details

A real phone is initiated like this:

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

You may need to re-initiate a dummy phone to a real phone when the previous real
phone quits.

A `DummySipClient` doesn't register itself to RingCentral Server. It doesn't
send any SIP messages to RingCentral Server. It does nothing.

You will need to implement a SharedWorker to:

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

### Working sample

A fully working sample is here
https://github.com/tylerlong/rc-web-phone-demo-2/tree/shared-worker You may run
mutiple tabs to see how it works.

