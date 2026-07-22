# webPhone.dispose()

This method properly disposes of a WebPhone instance so that an instance can be
freed for use. There is a limit of five instances per extension.

See also:

- [Instances](../get-started/instances.md)

## Sample

```ts
await webPhone.dispose();
```

## Inputs

None.

## Outputs

None.

## Media provider cleanup

Call-session disposal is owned by the SDK. If a custom media provider performs
cleanup in another process or tab, the SDK requests that cleanup but does not
wait for it to finish. A call session transitions to `disposed` independently.
Remote providers own eventual cleanup, timeouts, and retries.
