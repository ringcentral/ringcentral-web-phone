Optionally, you can tell the server that the user has started replying the call.
The server will give the user more time to edit the reply message before ending
the call or redirecting the call to voicemail.

```ts
await inboundCallSession.startReply();
```
