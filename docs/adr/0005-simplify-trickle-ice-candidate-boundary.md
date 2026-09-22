---
status: accepted
---

# Keep Trickle ICE conversion at the WebRTC boundary

The SDK's RingCentral calling flow is audio only. It converts incoming SIP INFO fragments to `RTCIceCandidateInit | null`, preserving candidate values and order. Browser WebRTC or the delegated application owns ordinary candidate validity and media matching; the SDK checks the active generation before forwarding a `null` end marker and avoids sending by INFO a local candidate already in the sent SDP. Candidate emitters report local completion once per generation. This boundary keeps SIP routing, readiness, ordering, and failure behavior in the SDK without a second remote SDP traversal.

The SIP INFO method and `Info-Package: trickle-ice` identify RingCentral's candidate messages; a second `Content-Type` check is unnecessary for RingCentral-controlled signaling. The supported local SDP shape is one audio media section, including delegated sessions, so the SDK does not search for a later media section. The SDK still checks for the minimum fields needed to construct a browser candidate or outgoing INFO, and delegated opt-in still requires `a=ice-options:trickle` because that SDP comes from the application, not RingCentral.
