# RingCentral Web Phone

RingCentral Web Phone exposes calls and their signaling to browser applications.

## Language

**Call Session**:
A single inbound or outbound call attempt as exposed by the Web Phone, from setup through termination. It may exist before a SIP dialog is established and does not represent multiple concurrent dialogs. One exact Call-ID maps to at most one live Call Session; an inbound INVITE reusing a live Call Session's Call-ID is handled by that session as a re-INVITE.
_Avoid_: SIP dialog, call leg

**Wire case**:
The casing a SIP header name carries on the wire, as sent by the peer or emitted by the SDK. SIP header names are case-insensitive, so inbound headers are stored in the exact wire case received rather than being normalized; reads are case-insensitive and replies echo the wire case unchanged.
_Avoid_: canonical case, assuming a fixed casing
