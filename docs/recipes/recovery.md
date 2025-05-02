## Recover from network outage/issue/change

Please note that, this SDK doesn't detect network outage/issue/change. Our
philosophy is to avoid adding any magic logic to the SDK.

For a working example to handle network outage/issue/change, please refer to
https://github.com/tylerlong/rc-web-phone-demo-2/blob/main/src/store/after-login.ts.
Scroll to the bottom part where it handles network outage/issue/change.

### network outage

If you believe your app just recovered from network outage and the underlying
WebSocket connection is broken, you may call `webPhone.start()`. It will create
a brand new websocket connection to the SIP server and re-register the SIP
client.

A sample implemetation could be as simple as this:

```ts
// browser issues network online event.
window.addEventListener("online", () => webPhone.start());
```

Please note that, in this case, existing calls will recover automatically by
WebRTC unless the network changed(like from one WiFi to another, or from WiFi to
cellular). For network change, please read sections below.

### network issue

What if network is not offline, but underlying WebSocket connection is broken?
This is very unlikely to happen, but if it happens, the following code will try
to bring your web phone back to work:

```ts
import waitFor from "wait-for-async";

const closeListener = async (e) => {
  webPhone.sipClient.wsc.removeEventListener("close", closeListener);
  if (webPhone.disposed) {
    // webPhone.dispose() has been called, no need to reconnect
    return;
  }
  console.log("WebSocket disconnected unexpectedly", e);
  let connected = false;
  let delay = 2000; // initial delay
  while (!connected) {
    console.log(`Reconnect WebSocket in ${delay / 1000} seconds`);
    await waitFor({ interval: delay });
    try {
      await webPhone.start();
      connected = true;
    } catch (e) {
      console.log("Error connecting to WebSocket", e);
      delay *= 2; // exponential backoff
      delay = Math.min(delay, 60000); // max delay 60s
    }
  }
  // because webPhone.start() will create a new webPhone.sipClient.wsc
  webPhone.sipClient.wsc.addEventListener("close", closeListener);
};
webPhone.sipClient.wsc.addEventListener("close", closeListener);
```

By default the SDK will send a `register` message around every 60 seconds. If
there is no response from server in 5 seconds(which indicates that the WebSocket
connection is probably broken), the SDK will proactively close the WebSocket
connection, which will trigger the logic above to invoke `webPhone.start()`.

### network change

Like switching from WiFi to mobile hot spot, or switching from one WiFi to
another.

In such cases, both the WebSocket connection and the WebRTC connections will
break.

`webPhone.start()` will recover the WebSocket connection. But WebRTC connections
are still broken.

This is not an issue if there are no active call sessions ongoing. But if there
are active call sessions when the network switches from one to another, the
existing call sessions will become "silent".

The solution is to send "re-INVITE" for each ongoing call session:

```ts
webPhone.callSessions.forEach((callSession) => {
  if (callSession.state === "answered") {
    callSession.reInvite();
  }
});
```

"re-INVITE" will re-establish the WebRTC connections based on latest network
information.

### Sample code to handle all cases (network outage/issue/change)

```ts
const recover = async () => {
  await webPhone.start();
  webPhone.callSessions.forEach((callSession) => {
    if (callSession.state === "answered") {
      // in case the network switches from one to another
      callSession.reInvite();
    }
  });
};

// handle network outage
window.addEventListener("online", async () => {
  await recover();
});

// handle network issues
const closeListener = async (e) => {
  webPhone.sipClient.wsc.removeEventListener("close", closeListener);
  if (webPhone.disposed) {
    // webPhone.dispose() has been called, no need to reconnect
    return;
  }
  console.log("WebSocket disconnected unexpectedly", e);
  let connected = false;
  let delay = 2000; // initial delay
  while (!connected) {
    console.log(`Reconnect WebSocket in ${delay / 1000} seconds`);
    await waitFor({ interval: delay });
    try {
      await recover();
      connected = true;
    } catch (e) {
      console.log("Error connecting to WebSocket", e);
      delay *= 2; // exponential backoff
      delay = Math.min(delay, 60000); // max delay 60s
    }
  }
  // because webPhone.start() will create a new webPhone.sipClient.wsc
  webPhone.sipClient.wsc.addEventListener("close", closeListener);
};
webPhone.sipClient.wsc.addEventListener("close", closeListener);
```

Latest tested code could be found here:
https://github.com/tylerlong/rc-web-phone-demo-2/blob/main/src/store/after-login.ts
Scroll to the bottom part where it handles network outage/issue/change.

### switch to backup outbound proxy

There are both `sipInfo.outboundProxy` and `sipInfo.outboundProxyBackup`. By
default `sipInfo.outboundProxy` is used. In very rare cases,
`sipInfo.outboundProxy` is broken and you will need to connect to
`sipInfo.outboundProxyBackup` instead. First of all, this shouldn't happen at
all. RingCentral will make sure that `sipInfo.outboundProxy` is always up and
running. So `sipInfo.outboundProxyBackup` is just in case.

The SDK doesn't automatically switch to backup outbound proxy because we don't
want to add any magical logic to the code base. As we said you probably don't
need to do this, but if you have to do, we have you covered.

We allow you to use your own SipClient:
`const webPhone = new WebPhone({sipClient: new MyOwnSipClient()})`. If you do
so, you gain extreme flexibility. How to switch to backup outbound proxy is up
to you.

If you didn't specify your own `SipClient` implementation,
[DefaultSipClient](https://github.com/ringcentral/ringcentral-web-phone/blob/main/src/sip-client.ts)
will be used. And to switch to backup outbound proxy:
`(webPhone.sipClient as DefaultSipClient).toggleBackupOutboundProxy(true)`. To
switch back to the original outbound proxy:
`(webPhone.sipClient as DefaultSipClient).toggleBackupOutboundProxy(false)`.

You will need to invoke `webPhone.start()` to re-create the WebSocket
connection, otherwise it is still the old outbound proxy.

