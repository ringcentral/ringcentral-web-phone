# Subscribing to events

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

- answered
  - Triggered when the call is answered.
  - Note: There is a [known issue](#known-issue) affecting outbound calls.
- disposed
  - For answered calls, this event is triggered when either you or the remote peer hangs up.
  - For inbound calls, it is triggered if the caller hangs up or if the call is answered on another device.

#### Where is the `ringing` event?

`ringing` event is implicit.

When you make an outbound call: `const callSession = await webPhone.call(...)`, at the time that you get the `callSession` object, the call is already ringing.

Similarly, when you handle an inbound call: `webPhone.on('inboundCall', callSession => {...})`, at the time that you get the `callSession` object, the call is already ringing.

#### Known issue

Outbound calls are always "answered" immediately. This is because SIP server always reply "200 OK" immediately after we send out a INVITE message.

Server side engineers said it is by design. But, this SDK won't be able to tell you when an outbound call is answered. It's an known issue. The SDK can do little about it since it is a SIP server behavior.

This makes the `answered` event less useful. For outbound call, it is a fake event that triggers immediately. For inbound call, since it is your own code that answers the call, you probably don't need the event at all.

