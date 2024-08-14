# RingCentral Web Phone 2

This is a complete rewrite of the RingCentral Web Phone SDK.

It is NOT yet producion ready. It is still in development.


## Demo

- [Online Demo](https://chuntaoliu.com/rc-web-phone-demo-2/)
- [Source Code](https://github.com/tylerlong/rc-web-phone-demo-2)


## Pre-requisites

This SDK assumes that you have basic knowledge of RingCentral Platform. You have created a RingCentral app and you know how to invoke RingCentral APIs. If you don't know how to do that, please read the following document first: https://developers.ringcentral.com/guide/voice/call-log/quick-start. The document is about how to create a RingCentral app and how to use the RingCentral API to access call log data. It is a good starting point for you to understand the RingCentral API. This SDK doesn't use/require call log API, the document is just for you to get familiar with RingCentral API.

This SDKs assumes that you can use RingCentral SDKs to generate RingCentral API access token and manage the token. This SDK assumes that you know how to invoke [Device SIP Registration](https://developers.ringcentral.com/api-reference/Device-SIP-Registration/createSIPRegistration) to get a `SIPInfo` object.

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
  await rc.logout(); // Web Phone SDK doesn't need a long-living access token, you MAY logout after getting sipInfo
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
  await rc.revoke(); // Web Phone SDK doesn't need a long-living access token, you MAY logout after getting sipInfo
};
main();
```

## Installation

```
yarn add ringcentral-web-phone@2.0.0-alpha.1
```

At the time I am writing this document, the latest version is `2.0.0-alpha.1`. 
Please replace it with the latest version.
Find the latest version here https://www.npmjs.com/package/ringcentral-web-phone


## Initialization

```ts
import WebPhone from 'ringcentral-web-phone';

const webPhone = new WebPhone({ sipInfo, instanceId });
await webPhone.register();
```

What is `sipInfo`? Please read [Pre-requisites](#pre-requisites) section.

What is `instanceId`? This is the unique ID of your web phone device.
If you want like to run multiple web phone devices in multiple tabs, you need to generate a unique `instanceId` for each device.
It MUST be persistent across power cycles of the device.
It MUST NOT change as the device moves from one network to another.
Ref: https://datatracker.ietf.org/doc/html/rfc5626#section-4.1

## Debug Mode

```ts
await webPhone.enableDebugMode();
```

In debug mode, the SDK will print all SIP messages to the console. It is useful for debugging.


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

### Actions to take on inbound call

#### Answer the call

```ts
await inbundCallSession.answer();
```

#### Decline the call

```ts
await inbundCallSession.decline();
```

#### Send the call to voicemail

```ts
await inbundCallSession.toVoicemail();
```

#### Forward the call

```ts
await inbundCallSession.forward(targetNumber);
```

#### Reply the call

```ts
await inbundCallSession.reply(text);
```

After this method call, the call session will be ended for the callee.
But the call session will not end yet for the caller. And the caller will receive the replied `text` via text-to-speech. 
The caller will have several options:
1. repeat the message
2. to leave a voicemail
3. reply with "yes"
4. reply with "no"
5. reply with "urgent, please call immediately"
6. to disconnect


## Breaking changes

### API changes

2.0 version is a complete rewrite of the RingCentral Web Phone SDK. The API is completely different from the previous version.

### Behavior changes

This SDK doesn't play ringing audio when there is incoming call or outgoing call.
It's up to the app to play the audio. It's a by design change.


## Maintainers Notes

Content below is for the maintainers of this project.

- ref: https://www.ietf.org/rfc/rfc3261.txt

### Two kinds of special messages

Before an incoming call is answered, client may send special messages with **XML** body to confirmReceive/toVoicemail/decline/forward/reply the call.

In an ongoing call (either inbound or outbound), client may send special messages with **JSON** body to startCallRecord/stopCallRecord/flip/park the call.

### Todo:

- create some slides to talk about the reasoning for getting rid of SIP.js
- integration tests
  - better to test the SIP message flow
- documentation
