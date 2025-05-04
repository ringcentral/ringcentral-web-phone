# callSession.on('answered')

Outbound calls are always "answered" immediately. This is because SIP server
always reply "200 OK" immediately after we send out a INVITE message.

Server side engineers said it is by design. But, this SDK won't be able to tell
you when an outbound call is answered. It's an known issue. The SDK can do
little about it since it is a SIP server behavior.

This makes the `answered` event less useful. For outbound call, it is a fake
event that triggers immediately. For inbound call, since it is your own code
that answers the call, you probably don't need the event at all.

