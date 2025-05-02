This is useful when an ongoing call becomes broken after you switch from one
network to another. Let's say you are having a call with your friend and you
switch from WiFi network to cellular. The call will become "silent". You can
restore the call by invoking `callSession.reInvite()`.

Network outage/issue/change is a big topic and we have a dedicated section for
that. For example, if the network change, the WebSocket connection will break
too. So, it is not as easy as invoking `callSession.reInvite()`. Please read the
"Recover from network outage/issue/change" section for more details.

`callSession.reInvite()` accept an option boolean argument. By default it is
true. Sometimes you may want to specify a false value:
`callSession.reInvite(false)`. For example, if the call was on hold. You want to
recover the call but keep it on hold.

Some technical details: `reInvite()` will generate new local SDP and do
iceRestart. And after server replies with remote SDP, it will be set:
`rtcPeerConnection.setRemoteDescription(remoteSDP)`. This is required because if
network information changed, old SDPs won't work any more.

