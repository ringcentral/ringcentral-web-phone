# callSession.reInvite()

This is useful when an ongoing call becomes broken after you switch from one
network to another. Let's say you are having a call with your friend and you
switch from WiFi network to cellular. The call will become "silent". You can
restore the call by invoking `callSession.reInvite()`.

!!! tip "Recovering from an outage is complex" While this page discussing a
single method related to recovering from an outage, it is not sufficient by
itself. For example, if a network change, the WebSocket connection will also
break - preventing your soft phone from received needed events from RingCentral.
Please read our guide on
[recovering from a network issue](../recipes/recovery.md).

This method accepts an optional boolean argument, which defaults to `true`. A
false value will result in the caller not being reconnected to the user upon
recovery. For example, if the call was on hold, you want to recover the call but
keep it on hold.

!!! info "Technical details" `reInvite()` will generate new local SDP and do
iceRestart. And after server replies with remote SDP, it will be set:
`rtcPeerConnection.setRemoteDescription(remoteSDP)`. This is required because if
network information changed, old SDPs won't work any more.

See also:

- [Recovering from an outage](../recipes/recovery.md)

## Sample

```js
callSession.reInvite(false);
```

## Inputs

| Parameters    | Description                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------- |
| `connectCall` | A boolean value (true or false) to indicate whether to reconnect the call to caller after recovery. |

## Outputs

None.
