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

https://github.com/tylerlong/rc-web-phone-demo-2 provides conference features.
You may create conference, invite a number to the conference, merge an existing
call to the conference, etc.

