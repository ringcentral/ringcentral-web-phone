# callSession.on('disposed', callback)

This event is triggered when the web phone instance is properly disposed of. This event does not fire when an instance [expires](../get-started/instances.md#instance-expiry). This event is useful if garbage collection is required when web phone are disposed of. 

## Sample

```ts
callSession.on("disposed", () => {
  // do something with the inbound call
});
```

