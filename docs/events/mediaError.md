# callSession.on('mediaError', callback)

This event is triggered when the media provider cannot apply an SDP answer after
the SIP ACK has already been sent. The call remains in its current signaling
state; handle this event to recover or report the media failure.

## Sample

```ts
callSession.on("mediaError", (error) => {
  console.error("Media setup failed", error);
});
```
