```ts
await callSession.sendDtmf(dtmf);
```

`dtmf` is a string, like `*123#`. Valid characters are `0123456789*#ABCD`.
`ABCD` are less commonly used but are part of the DTMF standard. They were
originally intended for special signaling in military and network control
systems.

Receving DTMF is not supported. Because it's not supported by WebRTC.

