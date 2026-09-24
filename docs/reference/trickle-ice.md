# Trickle ICE

SDK-managed WebRTC uses Trickle ICE by default. This applies to initial offers
and answers, re-INVITEs, and ICE restarts; there is no enablement option.

For inbound SDK-managed calls, the Web Phone reads `p-rc-ice-servers` from the
INVITE before constructing the peer connection. A present list replaces
registration-provided STUN servers for that Call Session; an absent header
keeps the registration configuration. A malformed present header makes
`answer()` reject and leaves the Call Session ringing. Delegated WebRTC is
unchanged. The header supplies server configuration, not candidates: browser
WebRTC gathers candidates from those servers, and later candidates continue
through the existing SIP INFO path.

## Candidate ownership boundary

The Web Phone owns SIP signaling, dialog routing, candidate ordering, and ICE
generation lifetime. It sends the generated offer or answer SDP immediately,
keeping the candidates already present in it: a candidate that is part of the
sent SDP is not signaled again by INFO. Later local candidates are sent in
gathering order, one SIP INFO request at a time, followed by
end-of-candidates. If a candidate INFO request is rejected or receives a
non-success response, the Web Phone stops that ICE generation; the Call Session
remains active and no fallback re-INVITE is started.

Incoming SDP fragments are converted once into browser-shaped
`RTCIceCandidateInit` values, preserving each candidate value, and forwarded in
wire order. Candidates are held in a small buffer until the remote description
is ready and are then applied in arrival order. The SDK validates nothing about
ordinary candidates: browser WebRTC validates its candidate input, and a
delegated application owns its `addRemoteCandidate` implementation. The SDK
checks only an incoming `null` end marker, ignoring it when its username
fragment does not match the active remote ICE generation. Incoming parsing and
application failures are nonfatal to the Call Session; later valid candidates
continue.

When a re-INVITE or ICE restart starts a newer ICE generation, or the Call
Session is disposed, the queued candidate work of superseded generations is
dropped.

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
`setLocalCandidateHandler`; it emits one `null` end-of-candidates marker per ICE
generation. Emitted candidates are forwarded as received, so candidate
validation stays with the application.
Incoming candidates are passed to `addRemoteCandidate` for the application to
apply. The Web Phone owns SIP construction, dialog routing, candidate ordering,
and generation lifetime.

An opted-in session's offer and answer SDP must contain one audio media section
and `a=ice-options:trickle`. The Web Phone rejects missing advertisements
rather than rewriting application-owned SDP. A delegated session without the
complete capability retains the existing complete-SDP behavior.

## Supported scope

This is the Trickle ICE subset supported by RingCentral Web Phone audio calls.
It does not claim complete RFC 8840 interoperability or support for arbitrary
SIP servers.
