```ts
await inboundCallSession.decline();
```

Please note that, decline the inbound call will not terminate the call session
for the caller immediately. The caller will hear the ringback tone for a while
until he/she hears "I am sorry, no one is available to take your call. Thank you
for calling. Goodbye." And the call will not reach your voicemail.

