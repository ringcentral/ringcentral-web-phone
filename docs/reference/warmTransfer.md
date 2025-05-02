# "Warm" transfer

The original caller is placed on hold while the person handling the call (the
transferor) speaks with the person to whom the call will be transferred (the
transferee). The transferor introduces the caller, provides context, and
confirms that the transferee is ready to take the call before connecting the
two.

```ts
const { complete, cancel } = await session.warmTransfer(transferToNumber);
```

After this method call, the current call session will be put on hold. A new call
session will be created to the `transferToNumber`. Then the transferor will have
a chance to talk to the transferee. After that, depending on the transferor's
decision, the app can call `complete()` to complete the transfer, or call
`cancel()` to cancel the transfer.

