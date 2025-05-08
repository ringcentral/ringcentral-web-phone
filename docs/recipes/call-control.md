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

