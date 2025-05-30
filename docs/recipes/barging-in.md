# Taking action on a live call as a third-party

WebPhone SDK allows you to monitor, whisper, barge in on, coach, and take over a
phone call. These features are available to all phone clients, not just clients
powered by this SDK.

Please refer to our
[support article](https://support.ringcentral.com/article-v2/8086.html?brand=RC_US&product=RingEX&language=en_US)
on the procedure that involves dialing certain numbers, e.g. `*80`.

## Barge-in

To barge in on a call (join an existing call) which is being handled by
extension 102, do the following:

```ts
const callSession = await webPhone.call("*82");
// optionally wait for 1 - 3 seconds here
await callSession.sendDtmf("102#");
```

## Take-over

Taking over a call requires a little more finesse, as it process a little bit
differently. When you send a request for taking over an existing call, you will
receive an extra inbound call from '\*83'. You need to answer that inbound call
for the "take over" to complete. You also need to keep both calls alive,
otherwise the customer will be disconnected.

For example, a customer is talking to extension 102, and you want to take over
the call:

```ts
const callSession1 = await webPhone.call("*83");
// optionally wait for 1 - 3 seconds here
await callSession1.sendDtmf("102#");
webPhone.on("inboundCall", async (callSession2: InboundCallSession) => {
  if (callSession2.remoteNumber === "*83") {
    await callSession2.answer(); // this could be done manually by user instead of automatically here.
  }
});
```

You will need to keep both `callSession1` and `callSession2` alive in order to
keep the conversation alive with the customer. If you hang up either one, the
customer will be disconnected.
