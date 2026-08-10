# RingCentral Web Phone

RingCentral Web Phone exposes calls and their signaling to browser applications.

## Language

**Call Session**:
A single inbound or outbound call attempt as exposed by the Web Phone, from setup through termination. It may exist before a SIP dialog is established and does not represent multiple concurrent dialogs.
_Avoid_: SIP dialog, call leg
