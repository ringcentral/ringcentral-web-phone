# callSession.decline()

!!! info "This is reserved for inbound call sessions only."

Decline an incoming call. Do not send it to voicemail.

Declining an inbound call will not terminate the call session for the caller
immediately. The caller will hear the ringback tone for a while until he/she
hears "I am sorry, no one is available to take your call. Thank you for calling.
Goodbye." And the call will not reach your voicemail.

## Sample

```ts
await callSession.decline();
```

## Inputs

None.

## Outputs

None.
