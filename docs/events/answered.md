# callSession.on('answered', callback)

Registers a callback to be invoked when a call is answered.

The `answered` event is triggered when a call transitions from the ringing state to the connected state—i.e., when the call is answered by the remote party.

!!! warning "Important Limitation: Due to the behavior of the underlying SIP infrastructure, this event behaves differently for inbound and outbound calls"

### Outbound call limitation

The SIP server responds with a 200 OK immediately after the INVITE is sent, regardless of whether the remote party has actually answered. This means the answered event is triggered immediately after initiating the call, giving the illusion that the call was answered.

This is by design on the server side and is a known limitation.

As a result, the answered event is not reliable for detecting when an outbound call is truly answered.

### Inbound calls

When your application code explicitly accepts the call (e.g., via `callSession.accept()`), the call is considered answered. In this case, triggering the answered event may be redundant since your code already initiated the answer action.

## Sample

```js
callSession.on('answered', () => {
  console.log('Call has been marked as answered.');
});
```
