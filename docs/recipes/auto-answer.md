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

