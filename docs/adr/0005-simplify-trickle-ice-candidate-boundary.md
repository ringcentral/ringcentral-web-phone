---
status: accepted
---

# Keep Trickle ICE conversion at the WebRTC boundary

The SDK's RingCentral calling flow is audio only. Incoming SIP INFO bodies are SDP-fragment text, while SDK-managed WebRTC and the delegated `trickleIce` capability accept `RTCIceCandidateInit | null`; the agreed refactor will extract candidate lines, MID, and ICE username fragment and forward every candidate in order without rewriting its value. Browser WebRTC or the delegated application owns candidate validity and media matching, so the refactor will remove the SDK's second remote SDP traversal and candidate matching. The SDK will retain a generation check before forwarding a `null` end marker, which has no embedded identity, and will avoid sending a local candidate by INFO when it was already included in the sent SDP. Candidate emitters will be responsible for reporting local completion once per generation. This decision reduces duplicate conversion and validation while preserving SIP routing, readiness, ordering, and failure behavior.
