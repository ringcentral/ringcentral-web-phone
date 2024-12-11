# RingCentral Web Phone SDK

## Version 1.x

For those who want to check documentation for verison 1.x, please [click here](https://github.com/ringcentral/ringcentral-web-phone/tree/1.x).

## Version 2.x

2.x version is a complete rewrite. We recommend all users to use the latest version.

For the reasoning about why we release a brand new 2.0 version and all the breaking changes, please read [this article](https://medium.com/@tylerlong/ringcentral-web-phone-sdk-2-0-8e55a4f6e2b2).

## Demo

- [Online Demo](https://chuntaoliu.com/rc-web-phone-demo-2/)
- [Source Code](https://github.com/tylerlong/rc-web-phone-demo-2)

## Pre-requisites

This SDK assumes that you have basic knowledge of RingCentral Platform. You have created a RingCentral app and you know how to invoke RingCentral APIs. If you don't know how to do that, please read the following document first: https://developers.ringcentral.com/guide/voice/call-log/quick-start. The document is about how to create a RingCentral app and how to use the RingCentral API to access call log data. It is a good starting point for you to understand the RingCentral API. This SDK doesn't use/require call log API, the document is just for you to get familiar with RingCentral API.

This SDK assumes that you know how to invoke [Device SIP Registration](https://developers.ringcentral.com/api-reference/Device-SIP-Registration/createSIPRegistration) to get a `sipInfo` object.

With `@ringcentral/sdk`, it is done like this:

```ts
import { SDK } from '@ringcentral/sdk';

const rc = new SDK({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const main = async () => {
  await rc.login({
    jwt: process.env.RINGCENTRAL_JWT_TOKEN,
  });
  const r = await rc.platform().post('/restapi/v1.0/client-info/sip-provision', {
    sipInfo: [{ transport: 'WSS' }],
  });
  const jsonData = await r.json();
  const sipInfo = jsonData.sipInfo[0];
  console.log(sipInfo); // this is what we need

  const deviceId = jsonData.device.id; // Web Phone SDK doesn't need `deviceId`, just for your information.
  await rc.logout(); // Web Phone SDK doesn't need a long-living Restful API access token, you MAY logout
};
main();
```

With `@rc-ex/core`, it is done like this:

```ts
import RingCentral from '@rc-ex/core';

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
      sipInfo: [{ transport: 'WSS' }],
    });
  const sipInfo = r.sipInfo![0];
  console.log(sipInfo); // this is what we need

  const deviceId = r.device!.id; // Web Phone SDK doesn't need `deviceId`, just for your information.
  await rc.revoke(); // Web Phone SDK doesn't need a long-living Restful API access token, you MAY logout
};
main();
```

Please note that, you may save and re-use `sipInfo` for a long time. You don't need to invoke `Device SIP Registration` every time you start the web phone.

In the sample code above, I also showed you how to get the `deviceId`. Web Phone SDK doesn't need `deviceId`, it is just for your information.
Just in case you may need it for [RingCentral Call Control API](https://developers.ringcentral.com/api-reference/Call-Control/createCallOutCallSession).

## Installation

```
yarn add ringcentral-web-phone
```

## Initialization

```ts
import WebPhone from 'ringcentral-web-phone';

const webPhone = new WebPhone({ sipInfo });
await webPhone.start();
```

What is `sipInfo`? Please read [Pre-requisites](#pre-requisites) section.

### instanceId

Optionally, you can specify `instanceId`: `new WebPhone({ sipInfo, instanceId })`.
`instanceId` is the unique ID of your web phone device.

If you want like to run multiple web phone devices in multiple tabs, you need to generate a unique `instanceId` for each device.
It MUST be persistent across power cycles of the device. It MUST NOT change as the device moves from one network to another.
Ref: https://datatracker.ietf.org/doc/html/rfc5626#section-4.1

If you start two web phone instances with the same `instanceId`, only the second instance will work. SIP server will not route calls to the first instance. (The first instance will still be able to make outbound calls, but it will not receive inbound calls.)

If you don't specify `instanceId`, the SDK by default will use `sipInfo.authorizationId` as `instanceId`. Which means, if you don't specify `instanceId`, you should only run one web phone instance in one tab.

If you start two web phone instances with different `instanceId`, both instances will work. SIP server will send messages to both instances.

The maximum unique live instances allowed for an extension is 5. If you try to register more, SIP server will reply with "SIP/2.0 603 Too Many Contacts".

If you keep refreshing a browser page, and each refresh you use an unique `instanceId` to register a web phone instance. Registration will fail when you try to create the 6th web phone instance (when you refresh the page the 5th time).

It takes around 1 minute for SIP server to mark an instance as expired (if client doesn't refresh it any more). So after you meet "SIP/2.0 603 Too Many Contacts" error, wait for 1 minute and try again.

You may also invoke `await webPhone.dispose();` to dispose a web phone instance before you close/refresh a browser page. That way, the web phone instance registration is removed from SIP server immediately without waiting for 1 minute.

## Debug Mode

```ts
const webPhone = new WebPhone({ sipInfo, debug: true });
```

In debug mode, the SDK will print all SIP messages to the console. It is useful for debugging.

## Dispose

When you no longer need the web phone instance, or you are going to close/refresh the browser page/tab, it is good practice to invoke:

```ts
await webPhone.dispose();
```

## Recover from network outage

If you believe your app just recovered from network outage and the underlying websocket connection is broken, you may call `webPhone.start()`.
It will create a brand new websocket connection to the SIP server and re-register the SIP client.

A sample implemetation with the ability to auto reconnect WebSocket:

```ts
import waitFor from 'wait-for-async';

const closeListener = async (e) => {
  webPhone.sipClient.wsc.removeEventListener('close', closeListener);
  if (webPhone.sipClient.disposed) {
    // webPhone.dispose() has been called, no need to reconnect
    return;
  }
  console.log('WebSocket disconnected unexpectedly', e);
  let connected = false;
  let delay = 2000; // initial delay
  while (!connected) {
    console.log(`Reconnect WebSocket in ${delay / 1000} seconds`);
    await waitFor({ interval: delay });
    try {
      await webPhone.start();
      connected = true;
    } catch (e) {
      console.log('Error connecting to WebSocket', e);
      delay *= 2; // exponential backoff
      delay = Math.min(delay, 60000); // max delay 60s
    }
  }
  // because webPhone.start() will create a new webPhone.sipClient.wsc
  webPhone.sipClient.wsc.addEventListener('close', closeListener);
};
webPhone.sipClient.wsc.addEventListener('close', closeListener);
```

## Make an outbound call

```ts
const callSession = await webPhone.call(callee, callerId);
```

`callee` is the phone number you want to call. Format is like `16506668888`.
`callerId` is the phone number you want to display on the callee's phone. Format is like `16506668888`.

To get all the `callerId` that you can use, you can call the following API: https://developers.ringcentral.com/api-reference/Phone-Numbers/listExtensionPhoneNumbers. Don't forget to filter the phone numbers that have `"features": [..., "CallerId", ...]`.

## Get inbound call sessions

To get inbound call sessions, you can listen to the `inboundCall` event:

```ts
webPhone.on('inboundCall', (inbundCallSession: InboundCallSession) => {
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

Please note that, decline the inbound call will not terminate the call session for the caller immediately.
The caller will hear the ringback tone for a while until he/she hears "I am sorry, no one is available to take your call. Thank you for calling. Goodbye." And the call will not reach your voicemail.

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
The server will give the user more time to edit the reply message before ending the call or redirecting the call to voicemail.

```ts
await inbundCallSession.startReply();
```

Reply the call with text:

```ts
const response = await inbundCallSession.reply(text);
```

After this method call, the call session will be ended for the callee.
But the call session will not end yet for the caller. And the caller will receive the replied `text` via text-to-speech.
The caller will then have several options:

- press 1 to repeat the message
- press 2 to leave a voicemail
- press 3 to reply with "yes"
- press 4 to reply with "no"
- press 5 to reply with "urgent, please call immediately"
  - the caller will be prompted to specify a callback number
- press 6 to to disconnect

`if (response.body.Sts === '0')`, it means that the caller replied to your message(he/she pressed 3, 4, 5).
Then you need to check `response.body.Resp`:

- if it's `'1'`, it means that the caller replied with "yes" (he/she pressed 3)
- if it's `'2'`, it means that the caller replied with "no" (he/she pressed 4)
- if it's `'3'`, it means that the caller replied with "urgent, please call [number] immediately". (he/she pressed 5)
  - in this case, there is also an urgent number provided by the caller which can be accessed by `response.body.ExtNfo`.

Below is some code snippet for your reference:

```ts
const response = await session.reply('I am busy now, can I call you back later?');
if (response.body.Sts === '0') {
  const message = `${response.body.Phn} ${response.body.Nm}`;
  let description = '';
  switch (response.body.Resp) {
    case '1':
      description = 'Yes';
      break;
    case '2':
      description = 'No';
      break;
    case '3':
      description = `Urgent, please call ${response.body.ExtNfo} immediately!`;
      break;
    default:
      break;
  }
  global.notifier.info({
    message, // who replied
    description, // what replied
    duration: 0,
  });
}
```

## Actions to take on answered call sessions

This part applies to both inbound and outbound call sessions.
Once the call is answered, you can do the following actions:

### Transfer the call

#### "Cold" transfer

It is also called blind transfer. Transfer the call to another number directly, without any introduction or context to the person to whom the call will be transferred (the transferee).

```ts
await callSession.transfer(targetNumber);
```

#### "Warm" transfer

The original caller is placed on hold while the person handling the call (the transferor) speaks with the person to whom the call will be transferred (the transferee). The transferor introduces the caller, provides context, and confirms that the transferee is ready to take the call before connecting the two.

```ts
const { complete, cancel } = await session.warmTransfer(transferToNumber);
```

After this method call, the current call session will be put on hold.
A new call session will be created to the `transferToNumber`. Then the transferor will have a chance to talk to the transferee.
After that, depending on the transferor's decision, the app can call `complete()` to complete the transfer, or call `cancel()` to cancel the transfer.

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

Most popular use case of call flip is for you to switch the current call to your other devices.
Let's say you are talking to someone on your desktop, and you want to switch to your mobile phone.
You can use call flip to achieve this: `await callSession.flip(mobilePhoneNumber)`.

Please note that, after you mobile phone answers the call, you need to **manually** end the call session on your desktop, otherwise you won't be able to talk/listen on your mobile phone.

Please also note that, this SDK allows you to flip the call to any phone number, not just your own phone numbers. But if it is not your number, you probably should transfer the call instead of flipping the call.

A sample result of `flip` is like this:

```json
{
  "code": 0,
  "description": "Succeeded",
  "number": "+16506668888",
  "target": "16506668888"
}
```

I don't think you need to do anything based on the result. It is just for your information.

### Park the call

```ts
const result = await callSession.park();
```

After this method call, the call session will be ended for you. And the remote peer will be put on hold and parked on an extension.
You will be able to retrieve the parked call by dialing `*[parked-extension]`.
Sample result:

```json
{
  "code": 0,
  "description": "Succeeded",
  "park extension": "813"
}
```

Take the sample result above as an example, you can retrieve the parked call by dialing `*813`.

### Private parking

RingCentral supports [park location](https://support.ringcentral.com/article-v2/8355.html?brand=RC_US&product=RingEX&language=en_US) feature. You may create a park location with a name, and specify who can park/retrieve calls to/from this location.

To park to a predefined location, you need to get the location's ID. You will need to login https://service.ringcentral.com and go to "Phone System > Groups > Park Locations". Click the park location and you will see its ID in browser URL. Save it as `parkLocationId`.

To park a call to a park location, just do this:

```ts
await callSession.transfer(`prk${parkLocationId}`);
```

Please note that, the call must be answered before it can be parked. You cannot park a still ringing call.

#### Retrieve private parked calls

This part requires you to invoke RESTful API and setup subscriptions. It's out of the scope of this SDK. Here I just provide the information for your reference:

You will need to subscribe to `/restapi/v1.0/account/~/extension/{parkLocationId}/presence?detailedTelephonyState=true&sipData=true` events.

When some one private parks a call, you will be able to get a notification like this one:

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
    Replaces: `${telephonySessionId};to-tag=${toTag};from-tag=${fromTag};early-only`,
  },
});
```

### Hold/Unhold the call

```ts
await callSession.hold();
await callSession.unhold();
```

If you put the call on hold, the remote peer will hear hold music. Neither you nor the remote peer can hear each other.
If you unhold the call, you and the remote peer can hear each other again.

### Mute/Unmute the call

```ts
await callSession.mute();
await callSession.unmute();
```

If you mute the call, the remote peer can't hear you.
If you unmute the call, the remote peer can hear you again.

### Send DTMF

```ts
await callSession.sendDtmf(dtmf);
```

`dtmf` is a string, like `*123#`. Valid characters are `0123456789*#ABCD`.
`ABCD` are less commonly used but are part of the DTMF standard. They were originally intended for special signaling in military and network control systems.

Receving DTMF is not supported. Because it's not supported by WebRTC.

## Events

You may subscribe to events, examples:

```ts
webPhone.on('inboundCall', (inboundCall: InboundCallSession) => {
  // do something with the inbound call
});
```

```ts
callSession.on('disposed', () => {
  // do something when the call session is disposed
});
```

### WebPhone Events

- `inboundCall`
  - new inbound call session, payload type: [InboundCallSession](./src/call-session/inbound.ts)
- `outboundCall`
  - new outbound call session, payload type: [OutboundCallSession](./src/call-session/outbound.ts)

### CallSession Events

- `answered`
- `disposed`

#### Where is the `ringing` event?

`ringing` event is implicit.

When you make an outbound call: `const callSession = await webPhone.call(...)`, at the time that you get the `callSession` object, the call is already ringing.

Similarly, when you handle an inbound call: `webPhone.on('inboundCall', callSession => {...})`, at the time that you get the `callSession` object, the call is already ringing.

#### Known issue

Outbound calls are always "answered" immediately. This is because SIP server always reply "200 OK" immediately after we send out a INVITE message.

Server side engineers said it is by design. But, this SDK won't be able to tell you when an outbound call is answered. It's an known issue. The SDK can do little about it since it is a SIP server behavior.

This makes the `answered` event less useful. For outbound call, it is a fake event that triggers immediately. For inbound call, since it is your own code that answers the call, you probably don't need the event at all.

## Audio Devices

By default, this SDK will use the default audio input device and output device available.

### Change default devices

If you would like to change the default audio input and output devices, you may create your own `DeviceManager` class:

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

To get all the devices available, please refer to [MediaDevices: enumerateDevices() method](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/enumerateDevices).

Please note that, changing `deviceManager` will only affect future calls. It won't change the device of ongoing calls.

### Change device of ongoing calls

```ts
await callSession.changeInputDevice('my-preferred-input-device-id');
await callSession.changeOutputDevice('my-preferred-output-device-id');
```

### firefox

Firefox doesn't support output device selection. Please use `undefined` as `outputDeviceId`.

## Conference

Conference is out of the scope of this SDK. Because conferences are mainly done with Restful API.
With above being said, I will provide some code snippets for your reference.

### Create a conference

To create a conference: https://developers.ringcentral.com/api-reference/Call-Control/createConferenceCallSession
If you are using SDK `@rc-ex/core`, you can do it like this:

```ts
const r = await rc.restapi().account().telephony().conference().post();
```

In the response of the above API call, you will get a `r.session!.voiceCallToken!`.
As the host, you will need to dial in:

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
await rc.restapi().account().telephony().sessions(confSession.sessionId).parties().bringIn().post({
  sessionId: callSession.sessionId,
  partyId: callSession.partyId,
});
```

### Merge an existing ongoing call to the conference

Let's say an existing call session is `callSession`.

```ts
await rc.restapi().account().telephony().sessions(confSession.sessionId).parties().bringIn().post({
  sessionId: callSession.sessionId,
  partyId: callSession.partyId,
});
```

You can see that it doesn't matter how the call is created, it could be either an outbound call or an inbound call.
You could create it on-the-fly or you can find an existing call session.

### A live sample

https://github.com/tylerlong/rc-web-phone-demo-2 provides conference features.
You may create conference, invite a number to the conference, merge an existing call to the conference, etc.

## Mutiple instances and shared worker

Some application allows users to open multiple tabs to run multiple instances.
If you want all of the web phones to work properly, you need to assign them different `instanceId`.
If you don't know what is `instanceId`, please read [Initialization](#initialization) section.

But there is a limit of how many instances you can run for each extension. What if the user opens too many tabs?
A better solution is to have one tab run a "real" phone while all other tabs run "dummy" phones. Dummy phones don't register itself to RingCentral Server. Real phone syncs its state to all dummy phones so that dummy phones are always in sync with the real phone.
When user performs an action on a dummy phone, the dummy phone forwards the action to the real phone. The real phone then performs the action and syncs the state back to all dummy phones.

In order to achieve this, you will need to use [SharedWorker](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker).

1. The real phone sends state to SharedWorker. SharedWorker sends state to all dummy phones. Dummy phones update their state and UI. So that dummy phones look identical to the real phone.
2. When end user performs an action on a dummy phone, the dummy phone forwards the action to SharedWorker. SharedWorker forwards the action to the real phone. The real phone performs the action and update its state. Go to step 1.

When the real phone quits (tab closing, navigating to another page, etc), a dummy phone will be prompted to a real phone.

This way, there is always one and only one real phone. All other phones are dummy phones. Dummy phones always look identical to a real phone because they will always get the latest state of a real phone. All actions are performed by the real phone.

### Technical details

A real phone is initiated like this:

```ts
import SipClient from 'ringcentral-web-phone/sip-client';

new WebPhone({ sipInfo, sipClient: new SipClient({ sipInfo }) });
```

Or even simpler (since `sipClient` is optional with default value `new SipClient({ sipInfo })`):

```ts
new WebPhone({ sipInfo });
```

A dummy phone is initiated like this:

```ts
import { DummySipClient } from 'ringcentral-web-phone/sip-client';

new WebPhone({ sipInfo, sipClient: new DummySipClient() });
```

You may need to re-initiate a dummy phone to a real phone when the previous real phone quits.

A `DummySipClient` doesn't register itself to RingCentral Server. It doesn't send any SIP messages to RingCentral Server. It does nothing.

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
    port.postMessage({ type: 'role', role: 'dummy' });
  } else {
    realPort = port;
    port.postMessage({ type: 'role', role: 'real' });
  }
  port.onmessage = (e) => {
    // a new dummy is ready to receive state
    if (e.data.type === 'ready') {
      if (port !== realPort && syncCache) {
        port.postMessage(syncCache);
      }
    }
    // a tab closed
    else if (e.data.type === 'close') {
      if (port === realPort) {
        realPort = undefined;

        // if real closes, all call sessions are over.
        dummyPorts.forEach((dummyPort) => dummyPort.postMessage({ type: 'sync', jsonStr: '[]' }));

        // prompt a dummy to be a real
        if (dummyPorts.size > 0) {
          realPort = Array.from(dummyPorts)[0];
          dummyPorts.delete(realPort);
          realPort.postMessage({ type: 'role', role: 'real' });
        }
      } else {
        dummyPorts.delete(port);
      }
    } else if (e.data.type === 'action') {
      // forward action to real
      if (realPort) {
        realPort.postMessage(e.data);
      }
    } else if (e.data.type === 'sync') {
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
  if (e.data.type === 'role') {
    // role assigned/updated
    store.role = e.data.role;
    // you may need to (re-)initiate the web phone
  } else if (store.role === 'real' && e.data.type === 'action') {
    // real gets action from dummy
  } else if (store.role === 'dummy' && e.data.type === 'sync') {
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

A fully working sample is here https://github.com/tylerlong/rc-web-phone-demo-2/tree/shared-worker
You may run mutiple tabs to see how it works.

## monitor/whisper/barge/coach/take over

These features are available to all phone clients, not just clients powered by this SDK.

Please refer to [Monitor a Call on Desk Phone | RingCentral](https://support.ringcentral.com/article-v2/8086.html?brand=RC_US&product=RingEX&language=en_US).

For example, to barge a call (join an existing call) which is being handled by extension 102:

```ts
const callSession = await webPhone.call('*82');
// optionally wait for 1 - 3 seconds here
await callSession.sendDtmf('102#');
```

### take over

Please note that, "take over" is special. Because after you request for taking over an existing call, you will receive an extra incoming call from '\*83'. You need to answer that incoming call for "take over" to complete. And you need to keep both calls alive, otherwise customer will be disconnected.

For example, a customer is talking to extension 102, and you want to take over the call:

```ts
const callSession1 = await webPhone.call('*83');
// optionally wait for 1 - 3 seconds here
await callSession1.sendDtmf('102#');
webPhone.on('inboundCall', async (callSession2: InboundCallSession) => {
  if (callSession2.remoteNumber === '*83') {
    await callSession2.answer(); // this could be done manually by user instead of automatically here.
  }
});
```

You will need to keep both `callSession1` and `callSession2` alive in order to keep the conversation alive with the customer.
If you hang up either one, the customer will be disconnected.

# Maintainers Notes

Content below is for the maintainers of this project.

## webPhone vs webPhone.sipClient

`webPhone` is mainly about call sessions and WebRTC.
`webPhone.sipClient` is mainly about SIP signaling.
We would like to decouple these two.

### References

- ref: https://www.ietf.org/rfc/rfc3261.txt

### How to test

rename `.env.sample` to `.env` and fill in the correct values.
You will need two RingCentral extensions to test the SDK, one as the caller and the other as the callee.
You will need the `sipInfo` json string of the two extensions. Invoke [this API](https://developers.ringcentral.com/api-reference/Device-SIP-Registration/createSIPRegistration) to get `sipInfo`.

You may need to `yarn playwright install chromium` if playwright cannot find chromium.

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

Before an incoming call is answered, client may send special messages with **XML** body to confirmReceive/toVoicemail/decline/forward/reply the call.

In an ongoing call (either inbound or outbound), client may send special messages with **JSON** body to startCallRecord/stopCallRecord/flip/park the call.

### webPhone unregister

Register the SIP client with expires time 0. It means that the SIP client will be unregistered immediately after the registration.
After this method call, no incoming call will be received. If you try to make an outbound call, you will get a `SIP/2.0 403 Forbidden` response.

### Call-Id

SIP headers are case insensitive. SIP server INVITE message uses Call-Id, so this project uses Call-Id.

Caller outbound INVITE and callee inbound INVITE don't have the same Call-Id. They are different. I am not sure it is a bug or not.

### multiple instances

Every time you get a new `sipInfo`, you will get a new `authorizationId`. So different instances will have different `authorizationId`, unless you share the same `sipInfo`.

If there are 3 instances, after an incoming call is answered, each instance will receive 3 messages with Cmd="7" with different Cln="xxx". "xxx" here is authorizationId.

## Todo:

- generate api reference
- test recovery from computer sleep
- When private park a ringing call, server will NOTIFY "SIP/2.0 486 Busy Here", does the SDK handle it?
- support picking up a private parked call
