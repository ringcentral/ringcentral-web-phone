# callSession.warmTransfer()

A warm transfer is a type of call transfer in which the original caller is first introduced or announced to the next party (usually another agent or department) before the handoff is completed. This typically involves the first agent speaking briefly with the next agent to explain the context of the call, then connecting all parties together or passing the caller along.

When this method is called, the current call session is put on hold. A new call session is then created with the `transferToNumber`. The agent is now free to talk to the person who will be receiving the call. The app can execute one two callbacks to either complete the transfer or return to the previous state (cancel). 

See also:

* [`transfer()`](transfer.md)

## Sample

```ts
const { complete, cancel } = await callSession.warmTransfer(transferToNumber);
```

## Inputs

| Parameter          | Description                                               |
|--------------------|-----------------------------------------------------------|
| `transferToNumber` | The phone number destination the transferee will be sent. |

## Outputs 

| Parameter    | Description                                                                          |
|--------------|--------------------------------------------------------------------------------------|
| `complete()` | A callback to be executed when you wish to complete the transfer to the destination. |
| `cancel()`   | A callback to cancel the transfer, and not connecting the two parties.               |
