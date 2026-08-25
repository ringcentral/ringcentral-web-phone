---
status: accepted
---

# Model one live Call Session per Call-ID in the RingCentral topology

Standard SIP (RFC 3261) identifies a dialog by Call-ID, local tag, and remote
tag so that one call can contain multiple dialogs, including dialogs created by
forking.
RingCentral Web Phone is not a generic SIP user agent: it targets the
RingCentral B2BUA topology, which exposes one client-visible call for each
exact, case-sensitive Call-ID and hides downstream dialog and forking
complexity. The supported server contract does not expose forked early or final
responses as separate client-visible dialogs under the same Call-ID. We
therefore model at most one live Call Session per Call-ID and use that Call-ID
as the application-level key for associating inbound signaling with the
session. This is a closed-ecosystem compatibility boundary, not a redefinition
of the SIP dialog identifier.

The SDK still preserves the established To and From values, including their
tags, and uses them when constructing in-dialog signaling and `Replaces`
operations. Reliable WSS transport reduces transaction-layer retransmissions,
but it does not distinguish SIP dialogs and is not the basis for this decision.

## Considered options

- **Model sessions by the full SIP dialog identifier.** This would support
  generic SIP forking and multiple concurrent dialogs under one Call-ID, but it
  would add state the RingCentral client-facing topology does not expose.
- **Model one live Call Session per Call-ID.** Chosen because it matches the
  supported topology and keeps call routing and lifecycle ownership coherent.

## Consequences

- A second client-visible dialog with the same Call-ID is not supported and
  must not create another live Call Session; ADR 0002 applies this rule to
  inbound re-INVITEs while preserving the session's established dialog
  identity.
- Generic SIP PBX interoperability, multi-dialog calls, and client-visible SIP
  forking remain out of scope.
- If the RingCentral topology begins exposing multiple concurrent dialogs with
  one Call-ID, or the SDK adds generic SIP interoperability, this decision must
  be revisited and Call Sessions must be keyed by full dialog identity.
