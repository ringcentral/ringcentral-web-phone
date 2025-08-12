# RingCentral Web Phone SDK

## Version 1.x

For those who want to check documentation for verison 1.x, please
[click here](https://github.com/ringcentral/ringcentral-web-phone/tree/1.x). We
will continue to support 1.x. There is no plan to deprecate it.

## Version 2.x

2.x version is a complete rewrite. We recommend new users to use the latest
version.

For the reasoning about why we release a brand new 2.0 version and all the
breaking changes, please read
[this article](https://medium.com/@tylerlong/ringcentral-web-phone-sdk-2-0-8e55a4f6e2b2).

## Demo

- [Online Demo](https://ringcentral.github.io/web-phone-demo/)
- [Source Code](https://github.com/ringcentral/web-phone-demo)

## Pre-requisites

This SDK assumes that you have basic knowledge of RingCentral Platform. You have
created a RingCentral app and you know how to invoke RingCentral APIs.

This SDK assumes that you know how to invoke
[Device SIP Registration](https://developers.ringcentral.com/api-reference/Device-SIP-Registration/createSIPRegistration)
to get a `sipInfo` object.

With `@rc-ex/core`, it is done like this:

```ts
import RingCentral from "@rc-ex/core";

const rc = new RingCentral({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const main = async () => {
  await rc.authorize({
    jwt: process.env.RINGCENTRAL_JWT_TOKEN!,
  });
  const r = await rc
    .restapi()
    .clientInfo()
    .sipProvision()
    .post({
      sipInfo: [{ transport: "WSS" }],
    });
  const sipInfo = r.sipInfo![0];
  console.log(sipInfo); // this is what we need

  const deviceId = r.device!.id; // Web Phone SDK doesn't need `deviceId`, just for your information.
  await rc.revoke(); // Web Phone SDK doesn't need a long-living Restful API access token, you MAY logout
};
main();
```

Please note that, you may save and re-use `sipInfo` for a long time. You don't
need to invoke `Device SIP Registration` every time you start the web phone.

In the sample code above, I also showed you how to get the `deviceId`. Web Phone
SDK doesn't need `deviceId`, it is just for your information. Just in case you
may need it for
[RingCentral Call Control API](https://developers.ringcentral.com/api-reference/Call-Control/createCallOutCallSession).

## Installation

```
yarn add ringcentral-web-phone
```

### Without a bundling tool

You can use this library without a bundling tool:

```html
<script src="/path/to/ringcentral-web-phone/dist/esm/index.umd.js"></script>
```

Or you could use a CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/ringcentral-web-phone@2.1.13/dist/esm/index.umd.js"></script>
```

You may need to replace 2.1.13 with latest version number. For latest version
please check here:
https://www.npmjs.com/package/ringcentral-web-phone?activeTab=versions

## Initialization

```ts
import WebPhone from "ringcentral-web-phone";

const webPhone = new WebPhone({ sipInfo });
await webPhone.start();
```

What is `sipInfo`? Please read [Pre-requisites](#pre-requisites) section.

### `instanceId` Behavior and Best Practices

You can optionally specify an instanceId when creating a WebPhone instance:

```ts
const webPhone = new WebPhone({ sipInfo, instanceId });
```

The instanceId is used to uniquely identify each WebPhone instance (or "device")
on the SIP server. It controls how inbound calls are routed and how many
simultaneous instances are allowed.

#### Default behavior

If you do not explicitly set an `instanceId`, the SDK will use
`sipInfo.authorizationId` as the default. This means all WebPhone instances
using the same `sipInfo` will share the same instanceId.

#### Sharing the Same `instanceId`

When multiple instances share the same `instanceId` (e.g., across tabs or
windows):

- Only the most recently registered instance will receive inbound calls.
- Older instances can still make outbound calls, but will not receive inbound
  calls.
- This is suitable if only one active tab needs to receive calls, and the rest
  are considered fallback or auxiliary tabs.

#### Using unique `instanceId`s

If each instance uses a unique instanceId (e.g., generated per tab):

- All instances can receive inbound calls.
- However, the SIP server enforces a limit of 5 simultaneous active instances
  per extension.
- If you try to register a 6th unique instanceId, the server will reject it
  with:
  ```ts
  SIP/2.0 603 Too Many Contacts
  ```
- This limit applies per extension and includes all devices and tabs.

> Note: A valid instanceId must be persistent and stable across device reboots
> and network changes. See
> [RFC 5626 §4.1](https://datatracker.ietf.org/doc/html/rfc5626#section-4.1) for
> guidance.

#### Instance Lifecycle and Cleanup

- When a WebPhone instance becomes inactive (e.g., browser closed or page
  reloaded), it may take the SIP server ~2 minutes to detect expiration and free
  up the slot.
- To avoid hitting the 5-instance limit unnecessarily, manually dispose
  instances using:
  ```ts
  await webPhone.dispose();
  ```
  This immediately unregisters the instance from the SIP server and releases the
  associated slot, without needing to wait for expiration.

## Debug Mode

```ts
const webPhone = new WebPhone({ sipInfo, debug: true });
```

In debug mode, the SDK will print all SIP messages to the console. It is useful
for debugging.

## Dispose

When you no longer need the web phone instance, or you are going to
close/refresh the browser page/tab, it is good practice to invoke:

```ts
await webPhone.dispose();
```

## Make an outbound call

```ts
const callSession = await webPhone.call(callee, callerId);
```

`callee` is the phone number you want to call. Format is like `16506668888`.
`callerId` is the phone number you want to display on the callee's phone. Format
is like `16506668888`.

To get all the `callerId` that you can use, you can call the following API:
https://developers.ringcentral.com/api-reference/Phone-Numbers/listExtensionPhoneNumbers.
Don't forget to filter the phone numbers that have
`"features": [..., "CallerId", ...]`.

## Get inbound call sessions

To get inbound call sessions, you can listen to the `inboundCall` event:

```ts
webPhone.on("inboundCall", (inbundCallSession: InboundCallSession) => {
  // do something with the inbound call session
});
```

### Actions to take on inbound call session

#### Answer the call

```ts
await inbundCallSession.answer();
```

#### Decline the call

```ts
await inbundCallSession.decline();
```

Please note that, decline the inbound call will not terminate the call session
for the caller immediately. The caller will hear the ringback tone for a while
until he/she hears "I am sorry, no one is available to take your call. Thank you
for calling. Goodbye." And the call will not reach your voicemail.

#### Send the call to voicemail

```ts
await inbundCallSession.toVoicemail();
```

#### Forward the call

```ts
await inbundCallSession.forward(targetNumber);
```

#### Reply the call

Optionally, you can tell the server that the user has started replying the call.
The server will give the user more time to edit the reply message before ending
the call or redirecting the call to voicemail.

```ts
await inbundCallSession.startReply();
```

Reply the call with text:

```ts
const response = await inbundCallSession.reply(text);
```

After this method call, the call session will be ended for the callee. But the
call session will not end yet for the caller. And the caller will receive the
replied `text` via text-to-speech. The caller will then have several options:

- press 1 to repeat the message
- press 2 to leave a voicemail
- press 3 to reply with "yes"
- press 4 to reply with "no"
- press 5 to reply with "urgent, please call immediately"
  - the caller will be prompted to specify a callback number
- press 6 to to disconnect

`if (response.body.Sts === '0')`, it means that the caller replied to your
message(he/she pressed 3, 4, 5). Then you need to check `response.body.Resp`:

- if it's `'1'`, it means that the caller replied with "yes" (he/she pressed 3)
- if it's `'2'`, it means that the caller replied with "no" (he/she pressed 4)
- if it's `'3'`, it means that the caller replied with "urgent, please call
  [number] immediately". (he/she pressed 5)
  - in this case, there is also an urgent number provided by the caller which
    can be accessed by `response.body.ExtNfo`.

Below is some code snippet for your reference:

```ts
const response = await session.reply(
  "I am busy now, can I call you back later?",
);
if (response.body.Sts === "0") {
  const message = `${response.body.Phn} ${response.body.Nm}`;
  let description = "";
  switch (response.body.Resp) {
    case "1":
      description = "Yes";
      break;
    case "2":
      description = "No";
      break;
    case "3":
      description = `Urgent, please call ${response.body.ExtNfo} immediately!`;
      break;
    default:
      break;
  }
  globalThis.notifier.info({
    message, // who replied
    description, // what replied
    duration: 0,
  });
}
```

## Actions to take on answered call sessions

This part applies to both inbound and outbound call sessions. Once the call is
answered, you can do the following actions:

### Transfer the call

#### "Cold" transfer

It is also called blind transfer. Transfer the call to another number directly,
without any introduction or context to the person to whom the call will be
transferred (the transferee).

```ts
await callSession.transfer(targetNumber);
```

#### "Warm" transfer

The original caller is placed on hold while the person handling the call (the
transferor) speaks with the person to whom the call will be transferred (the
transferee). The transferor introduces the caller, provides context, and
confirms that the transferee is ready to take the call before connecting the
two.

```ts
const { complete, cancel, newSession } = await session.warmTransfer(
  transferToNumber,
);
```

After this method call, the current call session will be put on hold. A new call
session (`newSession`) will be created to the `transferToNumber`. Then the
transferor will have a chance to talk to the transferee. After that, depending
on the transferor's decision, the app can call `complete()` to complete the
transfer, or call `cancel()` to cancel the transfer.

#### "Warm" transfer to an existing call session

Instead of letting this SDK to create the new call session, some apps prefer to
let end user to use the dialpad to create a new session manually. If that is the
case, you may use the `completeWarmTransfer` method:

```ts
await session.completeWarmTransfer(existingSession);
```

### Hang up the call

```ts
await callSession.hangup();
```

### Start/Stop call recording

```ts
await callSession.startRecording();
await callSession.stopRecording();
```

### Flip the call

```ts
const result = await callSession.flip(targetNumber);
```

Most popular use case of call flip is for you to switch the current call to your
other devices. Let's say you are talking to someone on your desktop, and you
want to switch to your mobile phone. You can use call flip to achieve this:
`await callSession.flip(mobilePhoneNumber)`.

As soon as the flip starts, the remote peer will be put on hold (I wish the
remote peer will not be put on hold, it would be a more seamless experience) and
your mobile phone will get a call.

Please note that, after you mobile phone answers the call, you need to
**manually** end the call session on your desktop, otherwise you won't be able
to talk/listen on your mobile phone.

Please also note that, this SDK allows you to flip the call to any phone number,
not just your own phone numbers. But if it is not your number, you probably
should transfer the call instead of flipping the call.

A sample result of `flip` is like this:

```json
{
  "code": 0,
  "description": "Succeeded",
  "number": "+16506668888",
  "target": "16506668888"
}
```

I don't think you need to do anything based on the result. It is just for your
information.

Personally I don't think the flip feature is of much value, since it's basically
the same as "cold" transfer. Compare flip to "cold" transfer, there is only one
difference that I can tell:

- after you initiate "cold" transfer, the current call session will auto end
  since SIP server will send a "BYE" message to you.
- after you intiate a flip, the current call will not auto end. And you will
  need to manually end it for the flip to complete.
  - for more details, check the instructions above.

### Park the call

```ts
const result = await callSession.park();
```

After this method call, the call session will be ended for you. And the remote
peer will be put on hold and parked on an extension. You will be able to
retrieve the parked call by dialing `*[parked-extension]`. Sample result:

```json
{
  "code": 0,
  "description": "Succeeded",
  "park extension": "813"
}
```

Take the sample result above as an example, you can retrieve the parked call by
dialing `*813`.

### Private parking

RingCentral supports
[park location](https://support.ringcentral.com/article-v2/8355.html?brand=RC_US&product=RingEX&language=en_US)
feature. You may create a park location with a name, and specify who can
park/retrieve calls to/from this location.

To park to a predefined location, you need to get the location's ID. You will
need to login https://service.ringcentral.com and go to "Phone System > Groups >
Park Locations". Click the park location and you will see its ID in browser URL.
Save it as `parkLocationId`.

To park a call to a park location, just do this:

```ts
await callSession.transfer(`prk${parkLocationId}`);
```

Please note that, the call must be answered before it can be private parked. You
cannot park a still ringing call. As I tested, parking an unanswered call will
receive `SIP/2.0 202 Accepted` from server but the call is not parked at all.

#### Retrieve private parked calls

This part requires you to invoke RESTful API and setup subscriptions. It's out
of the scope of this SDK. Here I just provide the information for your
reference:

You will need to subscribe to
`/restapi/v1.0/account/~/extension/{parkLocationId}/presence?detailedTelephonyState=true&sipData=true`
events.

When some one private parks a call, you will be able to get a notification like
this one:

```
"body": {
 "extensionId": <parkLocationId>,
 "telephonyStatus": "ParkedCall",
 "activeCalls": [
   {
     "sipData": {
       "toTag": "gK061ccd05",
       "fromTag": "10.14.22.230-5070-fd226b1e-f8bd-43aa",
     },
     "telephonySessionId": "s-a0e16e61c511cz1935660a889zd0e85b0000"
   }
 ],
 ...
```

You need to write code like this to retrieve it:

```ts
await webPhone.call(`prk${parkLocationId}`, undefined, {
  headers: {
    Replaces:
      `${telephonySessionId};to-tag=${fromTag};from-tag=${toTag};early-only`,
  },
});
```

Please pay attention to `to-tag=${fromTag};from-tag=${toTag}`, it is NOT
`to-tag=${toTag};from-tag=${fromTag}`!

Demo application: https://github.com/tylerlong/rc-web-phone-private-parking-demo

### Hold/Unhold the call

```ts
await callSession.hold();
await callSession.unhold();
```

If you put the call on hold, the remote peer will hear hold music. Neither you
nor the remote peer can hear each other. If you unhold the call, you and the
remote peer can hear each other again.

### Mute/Unmute the call

```ts
await callSession.mute();
await callSession.unmute();
```

If you mute the call, the remote peer can't hear you. If you unmute the call,
the remote peer can hear you again.

### Send DTMF

```ts
await callSession.sendDtmf(dtmf);
```

`dtmf` is a string, like `*123#`. Valid characters are `0123456789*#ABCD`.
`ABCD` are less commonly used but are part of the DTMF standard. They were
originally intended for special signaling in military and network control
systems.

Receving DTMF is not supported. Because it's not supported by WebRTC.

### re-INVITE

This is useful when an ongoing call becomes broken after you switch from one
network to another. Let's say you are having a call with your friend and you
switch from WiFi network to cellular. The call will become "silent". You can
restore the call by invoking `callSession.reInvite()`.

Network outage/issue/change is a big topic and we have a dedicated section for
that. For example, if the network change, the WebSocket connection will break
too. So, it is not as easy as invoking `callSession.reInvite()`. Please read the
"Recover from network outage/issue/change" section for more details.

`callSession.reInvite()` accept an option boolean argument. By default it is
true. Sometimes you may want to specify a false value:
`callSession.reInvite(false)`. For example, if the call was on hold. You want to
recover the call but keep it on hold.

Some technical details: `reInvite()` will generate new local SDP and do
iceRestart. And after server replies with remote SDP, it will be set:
`rtcPeerConnection.setRemoteDescription(remoteSDP)`. This is required because if
network information changed, old SDPs won't work any more.

## Events

You may subscribe to events, examples:

```ts
webPhone.on("inboundCall", (inboundCall: InboundCallSession) => {
  // do something with the inbound call
});
```

```ts
callSession.on("disposed", () => {
  // do something when the call session is disposed
});
```

### WebPhone Events

- `inboundCall`
  - new inbound call session, payload type:
    [InboundCallSession](./src/call-session/inbound.ts)
- `outboundCall`
  - new outbound call session, payload type:
    [OutboundCallSession](./src/call-session/outbound.ts)

### CallSession Events

#### `answered` event

- Triggered when the call is answered.
- Note: There is a [known issue](#known-issue) affecting outbound calls.

#### `disposed` event

- For answered calls, this event is triggered when either you or the remote peer
  hangs up.
- For inbound calls, it is triggered if the caller hangs up or if the call is
  answered on another device.
- For outbound calls, if call failed (for example, invalid callee number), it
  will be disposed automatically. So, this event will be triggered.

#### `failed` event

- This is for outbound call only. It means the outbound call was not successful
- It may be caused by invalid target number
- It may be caused by invalid emergency address configuration.
  - If you extension doesn't have emergency address configured, it couldn't make
    outbound calls.
- Please note that, this call will be disposed automatically. So you will also
  get a `disposed` event.

The following code works:

```ts
webPhone.on("outboundCall", (callSession) => {
  callSession.once("failed", (message) => {
    console.log("Outbound call failed, message is", message);
  });
});
```

However, the following code will not capture the `failed` event:

```ts
const callSession = await webPhone.call("12345678987");
callSession.once("failed", (message) => {
  console.log("Outbound call failed, message is", message);
});
```

This is because `await webPhone.call("12345678987")` will wait for the call to
be answered or fail before resolving. After this statement, the call is already
answered or failed, it's too late to listen for events.

Instead, you may check the status directly:

```ts
const callSession = await webPhone.call("12345678987");
if (callSession.state === "failed" || callSession.state === "disposed") {
  console.log("Oubound call failed");
}
```

Failed call sessions will be disposed automatically, so the state will become
"disposed". "failed" is just a temporary state.

#### `mediaStreamSet` event

This is triggered when `callSession.mediaStream` is set. An interesting use case
is to apply noise reduction to this object.

```ts
callSession.on("mediaStreamSet", (mediaStream) => {
  console.log("a new mediaStream object is set");
});
```

When you make an outbound call: `const callSession = await webPhone.call(...)`,
at the time that you get the `callSession` object, `callSession.mediaStream` is
already set. It would be too late to subscribe for `mediaStreamSet` event. In
such case you can access `callSession.mediaStream` directly.

#### Where is the `ringing` event?

`ringing` event is implicit.

When you make an outbound call: `const callSession = await webPhone.call(...)`,
at the time that you get the `callSession` object, the call is already ringing.

Similarly, when you handle an inbound call:
`webPhone.on('inboundCall', callSession => {...})`, at the time that you get the
`callSession` object, the call is already ringing.

#### Known issue

Outbound calls are always "answered" immediately. This is because SIP server
always reply "200 OK" immediately after we send out a INVITE message.

Server side engineers said it is by design. But, this SDK won't be able to tell
you when an outbound call is answered. It's an known issue. The SDK can do
little about it since it is a SIP server behavior.

This makes the `answered` event less useful. For outbound call, it is a fake
event that triggers immediately. For inbound call, since it is your own code
that answers the call, you probably don't need the event at all.

### SIP Client Events

- `inboundMessage`
- `outboundMessage`

These events represent low-level SIP messages received from or sent to the SIP
server by the web phone instance. Most developers won’t need to interact with
these directly, but they’re exposed for advanced use cases that require greater
flexibility.

**Example:**

```ts
webPhone.sipClient.on("inboundMessage", (message) => {
  console.log("Received an inbound SIP message from the server.");
});

webPhone.sipClient.on("outboundMessage", (message) => {
  console.log("Sent an outbound SIP message to the server.");
});
```

## Audio Devices

By default, this SDK will use the default audio input device and output device
available.

### Change default devices

If you would like to change the default audio input and output devices, you may
create your own `DeviceManager` class:

```ts
import { DefaultDeviceManager } from 'ringcentral-web-phone/device-manager';

class MyDeviceManager extends DefaultDeviceManager {
  public async getInputDeviceId(): Promise<string> {
    return 'my-preferred-input-device-id';
  }

  public async getOutputDeviceId(): Promise<string | undefined> {
    return 'my-preferred-output-device-id';
  }
}

...

const deviceManager = new MyDeviceManager();
const webPhone = new WebPhone({ sipInfo, deviceManager });

// or you can change it afterwards at any time:
// webPhone.deviceManager = deviceManager;
```

To get all the devices available, please refer to
[MediaDevices: enumerateDevices() method](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices).

Please note that, changing `deviceManager` will only affect future calls. It
won't change the device of ongoing calls.

### Change device of ongoing calls

```ts
await callSession.changeInputDevice("my-preferred-input-device-id");
await callSession.changeOutputDevice("my-preferred-output-device-id");
```

### firefox

Firefox doesn't support output device selection. Please use `undefined` as
`outputDeviceId`.

## Recover from network outage/issue/change

Please note that, this SDK doesn't detect network outage/issue/change. Our
philosophy is to avoid adding any magic logic to the SDK.

For a working example to handle network outage/issue/change, please refer to
https://github.com/ringcentral/web-phone-demo/blob/main/src/store/after-login.ts.
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
https://github.com/ringcentral/web-phone-demo/blob/main/src/store/after-login.ts
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

## Custom SIP message headers

### Add headers to outbound call

```ts
await webPhone.call("callee", "caller-id (optional)", {
  headers: { "Custom-Header": "CustomHeaderValue" },
});
```

### Add headers to outbound messages

This is an advanced topic that most developers won't need to use.

You can add arbitrary headers to outgoing SIP messages by extending the
`DefaultSipClient` class and overriding its `send` method:

```ts
import WebPhone from "ringcentral-web-phone";
import type { WebPhoneOptions } from "ringcentral-web-phone/types";
import { DefaultSipClient } from "ringcentral-web-phone/sip-client";
import OutboundMessage from "ringcentral-web-phone/sip-message/outbound/index";
import InboundMessage from "ringcentral-web-phone/sip-message/inbound";

class MySipClient extends DefaultSipClient {
  constructor(options: SipClientOptions) {
    super(options);
  }
  public send(
    message: OutboundMessage,
    waitForReply = false,
  ): Promise<InboundMessage> {
    // You may write your own logic here, like only adding headers to REGISTER messages (not other messages)
    message.headers["Custom-Header"] = "CustomHeaderValue";
    return super.send(message, waitForReply);
  }
}

const options: WebPhoneOptions = {
  sipInfo,
  // other options here
};
options.sipClient = new MySipClient(options);
const webPhone = new WebPhone(options);
await webPhone.start();
// ...
```

## Conference

Conference is out of the scope of this SDK. Because conferences are mainly done
with Restful API. With above being said, I will provide some code snippets for
your reference.

### Create a conference

To create a conference:
https://developers.ringcentral.com/api-reference/Call-Control/createConferenceCallSession
If you are using SDK `@rc-ex/core`, you can do it like this:

```ts
const r = await rc.restapi().account().telephony().conference().post();
```

In the response of the above API call, you will get a
`r.session!.voiceCallToken!`. As the host, you will need to dial in:

```ts
const confSession = await webPhone.call(r.session!.voiceCallToken!);
```

### Invite a number to the conference

Make a call to the number you want to invite to the conference:

```ts
const callSession = await this.webPhone.call(targetNumber);
```

Then you can bring in the call to the conference.

```ts
await rc.restapi().account().telephony().sessions(confSession.sessionId)
  .parties().bringIn().post({
    sessionId: callSession.sessionId,
    partyId: callSession.partyId,
  });
```

### Merge an existing ongoing call to the conference

Let's say an existing call session is `callSession`.

```ts
await rc.restapi().account().telephony().sessions(confSession.sessionId)
  .parties().bringIn().post({
    sessionId: callSession.sessionId,
    partyId: callSession.partyId,
  });
```

You can see that it doesn't matter how the call is created, it could be either
an outbound call or an inbound call. You could create it on-the-fly or you can
find an existing call session.

### A live sample

https://github.com/ringcentral/web-phone-demo provides conference features. You
may create conference, invite a number to the conference, merge an existing call
to the conference, etc.

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
https://github.com/ringcentral/web-phone-demo/tree/shared-worker You may run
mutiple tabs to see how it works.

## monitor/whisper/barge/coach/takeover

These features are available to all phone clients, not just clients powered by
this SDK.

Please refer to
[Monitor a Call on Desk Phone | RingCentral](https://support.ringcentral.com/article-v2/8086.html?brand=RC_US&product=RingEX&language=en_US).

For example, to barge a call (join an existing call) which is being handled by
extension 102:

```ts
const callSession = await webPhone.call("*82");
// optionally wait for 1 - 3 seconds here
await callSession.sendDtmf("102#");
```

### Technical Details About Call Takeover

In most cases, developers don't need to worry about the technical aspects of
call takeover, as the SDK handles everything automatically. However, for those
who are curious, here’s how it works under the hood:

When you initiate a takeover by dialing `*83`, followed by the agent's extension
and `#`, the system sends you an inbound call from `*83`. This inbound call
shares the same `Call-ID` as the outbound request you just made. Technically,
this is treated as a re-INVITE from the server.

The SDK automatically processes this re-INVITE and finalizes the takeover. Once
complete, you are connected directly to the customer, and the original agent is
disconnected.

## Switch call to this device

Let's say you are having a phone call on your mobile phone app. And you would
like to switch the call to desktop app.

The official RingCentral apps for mobile and desktop already supports it, please
refer to
[this article](https://support.ringcentral.com/article-v2/Switching-a-call-or-meeting-between-desktop-and-mobile-in-the-RingCentral-app.html?brand=RingCentral&product=RingEX&language=en_US&pills-nav=call).

But how do we achieve the same with this SDK?

First of all, you will need the `sipData` of the ongoing call. Especially, the
`telephonySessionId`, the `fromTag` and the `toTag`. How to get the data? You
will need to create a subscription to
[Telephony Events](https://developers.ringcentral.com/api-reference/Extension-Telephony-Sessions-Event).
How to create such a subscription? You will need to use RingCentral Restful API
and subscription API, which is out of the scope of this SDK. You may read this
article:
[Create WebSocket subscriptions using RingCentral JavaScript SDKs](https://medium.com/@tylerlong/create-websocket-subscriptions-using-ringcentral-javascript-sdks-1204ce5843b8)

Once you have the data, it is easy to switch the call to this device:

```ts
this.webPhone.call("whatever", undefined, {
  headers: {
    Replaces:
      `${telephonySessionId};to-tag=${toTag};from-tag=${fromTag};early-only`,
  },
});
```

The "callee" number we specified above is "whatever". Since we are not making a
new outbound call, we just try to replace an existing call. The callee number
could be fake.

### Other ways to get sipData?

We have mentioned that you could use subscriptions to get the
`telephonySessionId`, the `fromTag` and the `toTag`. Are there any other ways?

If you are using some SDKs, like this SDK, or the softphone SDK, you will be
able to get them via the headers of SIP messages. But it won't be your current
web phone instance, since if it's already your current web phone instance, there
is no need to "switch call to this device". You will need to figure out ways to
pass the data from other phone instances to your current phone instance. And
once your current phone instance have the required data, it could run the code
snippet above to "switch the call to this device".

## Auto Answer

This feature is by default disabled. To enable it when you create a new phone
instance:

```ts
const webPhone = new WebPhone({ sipInfo, autoAnswer: true });
```

Or you can enable this feature afterwards:

```ts
webPhone.autoAnswer = true;
```

When this feature is enbled, whenever there is an inbound call, the SIP `INVITE`
message will be inspected. If there is a header "Alert-Info: Auto Answer", the
call will be auto answered. The `Call-Info` header will also be checked, if it
contains `Answer-After=<a-number-here>`, that would be the delay before the call
is answered.

For example, if the inbound call `INVITE` message has the following headers, the
call will be auto answered immediately:

```ts
Alert-Info: Auto Answer
Call-Info: <224981555_132089748@10.13.116.50>;purpose=info;Answer-After=0
```

This feature is the key for some call control APIs to work. For example:
[answer call party API](https://developers.ringcentral.com/api-reference/Call-Control/answerCallParty).
When this API is invoked, the current call session will be cancelled. And a new
inbound call will be sent to the target device. And there will be auto answer
headers in that inbound call. If the target device has auto answer feature
enabled, the call will be auto answered.

### What if I want to auto answer all calls?

If you want to auto answer all calls, regardless of the SIP message headers,
just do this:

```ts
webPhone.on("inboundCall", async (callSession) => {
  await callSession.answer();
});
```

## Call control APIs

Ref:
https://developers.ringcentral.com/api-reference/Call-Control/createCallOutCallSession

Call control APIs are out of scope of this SDK, since they are all Restful APIs.
I will provide some brief information here.

I believe **most users/developers of this SDK don't need to use call control
API**. Since the SDK can control calls already, like answer/hang
up/transfer/hold/park...etc. There is really no good reason to not use the SDK
provided call control, but to use Restful API call control.

With above being said, it is easy to use Restful call control API together with
this SDK.

### Answer call party

[answer call party API](https://developers.ringcentral.com/api-reference/Call-Control/answerCallParty)

```ts
import RingCentral from '@rc-ex/core';

public async callControlAnswer(callSession: CallSession) {
  const rc = new RingCentral({ server });
  rc.token = { access_token }; // re-use existing access token. You may generate new token instead
  await rc
    .restapi()
    .account()
    .telephony()
    .sessions(callSession.sessionId) // sessionId and partyId are accessible directly
    .parties(callSession.partyId)
    .answer()
    .post({
      deviceId, // where to get deviceId? refer to "Pre-requisites" section of this README file
    });
}
```

After you make this API call, the current call session will be cancelled and new
incoming call with Auto Answer SIP headers will be received. If you enabled auto
answer feature of this SDK, the call will be auto answered.

The example above is just to demonstrate how to use call control API with this
SDK. It's unnecessarily complicated compared to:

```ts
await callSession.answer();
```

### Make Call out

```ts
const rc = new RingCentral({ server: this.server });
rc.token = { access_token: this.rcToken }; // re-use existing token
await rc
  .restapi()
  .account()
  .telephony()
  .callOut().post({
    from: { deviceId }, // where to get deviceId? refer to "Pre-requisites" section of this README file
    to: { phoneNumber: toNumber },
  });
```

After invoking this API, the current webPhone instance will receive an incoming
call with auto answer SIP headers. If you enabled auto answer feature of this
SDK, the call will be auto answered. The `toNumber` will also receive an
incoming call. If he/she answers it too, you two can talk to each other.

To me, it is similar to
[RingOut](https://developers.ringcentral.com/api-reference/RingOut/createRingOutCall),
differences are:

- CallOut let you specify deviceID instead of phone number. So, it's more
  specific about which device is going to get the phone call.
- For callout, inbound call to the device will have auto answer headers. It
  could be auto answered if the device supports it.

Again, you are not required to use the RESTful API to do a call out. This is way
simpler:

```ts
const callSession = await webPhone.call(callee);
```

# Maintainers Notes

Content below is for the maintainers of this project.

## webPhone vs webPhone.sipClient

`webPhone` is mainly about call sessions and WebRTC. `webPhone.sipClient` is
mainly about SIP signaling. We would like to decouple these two.

### References

- ref: https://www.ietf.org/rfc/rfc3261.txt

### How to test

rename `.env.sample` to `.env` and fill in the correct values. You will need two
RingCentral extensions to test the SDK, one as the caller and the other as the
callee. You will need the `sipInfo` json string of the two extensions. Invoke
[this API](https://developers.ringcentral.com/api-reference/Device-SIP-Registration/createSIPRegistration)
to get `sipInfo`.

You may need to `yarn playwright install chromium` if playwright cannot find
chromium.

You will need one more number to test call forwarding/transferring.

To run all tests:

```
yarn test
```

To run a test file:

```
yarn test test/inbound/forward.spec.ts
```

### Two kinds of special messages

Before an inbound call is answered, client may send special messages with
**XML** body to confirmReceive/toVoicemail/decline/forward/reply the call.

In an ongoing call (either inbound or outbound), client may send special
messages with **JSON** body to startCallRecord/stopCallRecord/flip/park the
call.

### webPhone unregister

Register the SIP client with expires time 0. It means that the SIP client will
be unregistered immediately after the registration. After this method call, no
inbound call will be received. If you try to make an outbound call, you will get
a `SIP/2.0 403 Forbidden` response.

### multiple instances

Every time you get a new `sipInfo`, you will get a new `authorizationId`. So
different instances will have different `authorizationId`, unless you share the
same `sipInfo`.

If there are 3 instances, after an inbound call is answered, each instance will
receive 3 messages with Cmd="7" with different Cln="xxx". "xxx" here is
authorizationId.
