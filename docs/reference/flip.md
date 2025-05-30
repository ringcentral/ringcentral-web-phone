# callSession.flip()

Call flipping refers to the ability to seamlessly transfer an active phone call
from one device to another without interrupting the conversation.

The most popular use case of call flip is to switch the current call to your
other devices. Let's say you are talking to someone on your desktop, and you
want to switch to your mobile phone. You can use call flip to achieve this.

As soon as the flip starts, the remote peer will be put on hold and your target
phone will receive a call. You answer the call, and then terminate the call on
the originating device to complete the process.

!!! note "Flipping versus transferring" Please also note that, this SDK allows
you to flip the call to any phone number, not just your own phone numbers. But
if it is not your number, we recommend you transfer the call instead of flipping
the call.

**Sample response**

```json
{
  "code": 0,
  "description": "Succeeded",
  "number": "+16506668888",
  "target": "16506668888"
}
```

Flipping a call is functionally similar to a cold transfer, with one small
difference:

- after you initiate cold transfer, the current call session will auto end since
  SIP server will send a "BYE" message to you.
- after you intiate a flip, the current call will not auto end, and you will
  need to manually end it for the flip to complete.

See also:

- [`transfer()`](transfer.md)

## Sample

```ts
const result = await callSession.flip(targetNumber);
```

## Inputs

| Parameters     | Description                           |
| -------------- | ------------------------------------- |
| `targetNumber` | The phone number to flip the call to. |

## Outputs

| Parameters           | Description                                       |
| -------------------- | ------------------------------------------------- |
| `result`             | The response returned from the call.              |
| `result.code`        | The response code. A zero indicates success.      |
| `result.description` | A string describing the result, e.g. "succeeded". |
| `result.number`      |                                                   |
| `result.target`      |                                                   |
