## How to test

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
