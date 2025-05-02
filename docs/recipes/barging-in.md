## monitor/whisper/barge/coach/take over

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

### take over

Please note that, "take over" is special. Because after you request for taking
over an existing call, you will receive an extra inbound call from '\*83'. You
need to answer that inbound call for "take over" to complete. And you need to
keep both calls alive, otherwise customer will be disconnected.

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

