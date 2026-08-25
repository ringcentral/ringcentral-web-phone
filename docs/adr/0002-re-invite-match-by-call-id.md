---
status: accepted
---

# Match inbound re-INVITEs by Call-ID, preserving the session's dialog identity

An inbound INVITE used to be treated as a re-INVITE only when its Call-ID, To,
and From all matched an existing Call Session; a same-Call-ID INVITE carrying
different peer tags fell through that check and spawned a second Call Session
with a second `inboundCall` event. Because other lifecycle paths find sessions
by Call-ID alone, duplicate live sessions could then be torn down incoherently.
We decided to route every inbound INVITE to its live Call Session by Call-ID
alone: a same-Call-ID, different-tag INVITE is handled by the existing session
as a re-INVITE and acknowledged with the current SDP, while the session keeps
its original To/From dialog identity. This enforces the invariant that one exact
Call-ID maps to at most one live Call Session. It is a deliberate trade-off:
a same-Call-ID/different-tag INVITE is not a genuine in-dialog re-INVITE, yet
treating it as one keeps the ongoing call working, at the cost of not forking a
new dialog or re-basing dialog identity on the new tags.

## Considered options

- **Match by Call-ID, To, and From.** The prior behavior. Genuine re-INVITEs
  are matched precisely, but a same-Call-ID/different-tag INVITE is rejected,
  leading to a duplicate session and duplicate `inboundCall`. Rejected because
  it breaks the "one Call-ID maps to at most one live Call Session" invariant.
- **Match by Call-ID alone and re-base dialog identity on the new tags.**
  Enforces the invariant, but mutates the established dialog identity and
  breaks later signaling (BYE, transfer, hold/unhold) that still references the
  original To/From. Rejected.
- **Match by Call-ID alone and preserve the session's original identity.**
  Chosen: enforces the invariant and keeps the ongoing dialog working, with the
  surprising-but-safe cost that a different-tag INVITE is answered as a
  re-INVITE rather than forking a new dialog.

## Consequences

- Any same-Call-ID inbound INVITE, regardless of To/From tags, is routed to the
  existing live session as a re-INVITE; it never grows `callSessions` and never
  emits a second `inboundCall`.
- The handled session keeps its original dialog identity, so later in-dialog
  signaling still refers to the established dialog.
- Multi-dialog/SIP-forking support remains out of scope.