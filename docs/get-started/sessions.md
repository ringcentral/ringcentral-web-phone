# Call sessions

Once you have instantiated a WebPhone instance, you need to establish a session
in order to perform many of the actions you would associate with phone calls.
Sessions are created in of two quite logical ways:

1. You can place a call by dialing a phone number.
2. You can receive a call.

## Outbound call sessions

To initiate a phone call, you use the [`call()`](../reference/call.md) method.

```ts
const callSession = await webPhone.call(callee, callerId);
```

## Inbound call sessions

To obtain a session associated with an inbound call, you will need to
[subscribe](../events/index.md) to the `inboundCall` event:

```ts
webPhone.on("inboundCall", (inboundCallSession: InboundCallSession) => {
  // do something with the inbound call session
});
```

## Next steps

With a call session in hand, you can call any number of methods associated with
call sessions found in our [reference](../reference/index.md).
