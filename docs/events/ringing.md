# webPhone.on('ringing')

`ringing` event is implicit.

When you make an outbound call: `const callSession = await webPhone.call(...)`,
at the time that you get the `callSession` object, the call is already ringing.

Similarly, when you handle an inbound call:
`webPhone.on('inboundCall', callSession => {...})`, at the time that you get the
`callSession` object, the call is already ringing.

