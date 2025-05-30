# callSession.transfer()

This method executes a cold or blind transfer. This is a type of call transfer
in which the caller is transferred immediately to the destination with no prior
screening.

See also:

- [`warmTrasnfer()`](warmTransfer.md)

## Sample

```ts
await callSession.transfer(transferToNumber);
```

## Inputs

| Parameter          | Description                                               |
| ------------------ | --------------------------------------------------------- |
| `transferToNumber` | The phone number destination the transferee will be sent. |

## Outputs

None.
