# callSession.startReply()

!!! info "This is reserved for inbound call sessions only."

You can optionally tell the server that the user has started replying the call. The server will give the user more time to edit the reply message before ending the call or redirecting the call to voicemail.

See also:

* [`reply()`](reply.md)

## Sample

```ts
await callSession.startReply();
```

## Inputs

None.

## Outputs

None.
