# Trickle ICE

SDK-managed WebRTC uses Trickle ICE by default. This applies to initial offers
and answers, re-INVITEs, and ICE restarts; there is no enablement option.

The Web Phone sends the generated SDP immediately and preserves any candidates
already present in it. Later candidates are sent in gathering order, one SIP
INFO request at a time, followed by end-of-candidates. SIP construction and
candidate ordering remain owned by the Web Phone.

If a candidate INFO request is rejected or receives a non-success response,
the Web Phone stops that ICE generation. The Call Session remains active and no
fallback re-INVITE is started.

This is the Trickle ICE subset supported by RingCentral Web Phone calls. It does
not claim complete RFC 8840 interoperability or support for arbitrary SIP
servers.
