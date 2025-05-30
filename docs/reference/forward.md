# callSession.forward()

!!! info "This is reserved for inbound call sessions only."

For incoming calls, this will forward the call do a different number. This
happens invisibily to the caller. This is different from a transfer that take
effect on a call once answered.

See also:

- [`transfer()`](transfer.md)

## Sample

```ts
await callSession.forward(targetNumber);
```

## Inputs

| Parameters     | Description                                |
| -------------- | ------------------------------------------ |
| `targetNumber` | The phone number to forward the caller to. |

## Outputs

None.
