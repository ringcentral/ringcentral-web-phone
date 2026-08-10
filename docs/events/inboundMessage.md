# inboundMessage

The SIP Client and Call Session expose the same raw `InboundMessage` object at
different scopes:

| Subscription | Scope |
| --- | --- |
| `webPhone.sipClient.on("inboundMessage", callback)` | Every inbound SIP message received by the SIP Client. |
| `callSession.on("inboundMessage", callback)` | Inbound SIP messages whose exact, case-sensitive Call-ID value matches that live Call Session. |

Call-ID header names use the normal case-insensitive SIP header matching, so
`Call-Id`, `Call-ID`, and `call-id` are supported. The compact `i` header is not
supported. From and To tags do not affect the match.

The initial inbound INVITE creates its Call Session and is not replayed on the
scoped event. Later matching messages, including terminal messages, are
eligible.

## Global SIP Client feed

```ts
webPhone.sipClient.on("inboundMessage", (message) => {
  console.log("Received an inbound SIP message:", message.subject);
});
```

## Call-ID-scoped Call Session feed

```ts
callSession.on("inboundMessage", (message) => {
  console.log("Received a message for this Call Session:", message.subject);
});
```

Both callbacks receive the original `InboundMessage`, with its `subject`,
`headers`, and `body`.
