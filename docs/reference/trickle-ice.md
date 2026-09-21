# Trickle ICE

SDK-managed WebRTC uses Trickle ICE by default. This applies to initial offers
and answers, re-INVITEs, and ICE restarts; there is no enablement option.

The Web Phone sends the generated SDP immediately and preserves any candidates
already present in it. Later candidates are sent in gathering order, one SIP
INFO request at a time, followed by end-of-candidates. SIP construction and
candidate ordering remain owned by the Web Phone.

## Delegated WebRTC

A delegated `WebRtcSession` opts in by exposing the complete optional
`trickleIce` capability:

```ts
trickleIce: {
  setLocalCandidateHandler(
    handler: (candidate: RTCIceCandidateInit | null) => void,
  ): void;
  addRemoteCandidate(candidate: RTCIceCandidateInit | null): Promise<void>;
}
```

The application registers and emits browser-shaped local candidates through
`setLocalCandidateHandler`; `null` marks end-of-candidates. It applies incoming
candidates passed to `addRemoteCandidate`. The Web Phone owns SIP construction,
dialog routing, candidate ordering, and generation lifetime.

An opted-in session's offer and answer SDP must contain
`a=ice-options:trickle`. The Web Phone rejects missing advertisements rather
than rewriting application-owned SDP. A delegated session without the complete
capability retains the existing complete-SDP behavior.

If a candidate INFO request is rejected or receives a non-success response,
the Web Phone stops that ICE generation. The Call Session remains active and no
fallback re-INVITE is started.

Incoming candidate parsing or application failures are also nonfatal to the
Call Session; later valid candidates continue in arrival order.

This is the Trickle ICE subset supported by RingCentral Web Phone calls. It does
not claim complete RFC 8840 interoperability or support for arbitrary SIP
servers.
