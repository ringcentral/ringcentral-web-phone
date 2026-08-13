---
status: proposed
---

# Case-insensitive SIP header access, preserving wire case

The SDK reads inbound SIP headers by hardcoded, case-sensitive strings
(`headers["Call-Id"]`), which silently returns `undefined` whenever the peer
sends a header under a different casing than the SDK assumes. We decided to (1)
keep `sipMessage.headers` as a raw public record stored in the peer's exact
wire case, (2) add a case-insensitive `SipMessage.getHeader(name)` accessor and
route all inbound reads through it, and (3) have outbound replies echo the
inbound message's header casing verbatim rather than imposing a canonical
casing. We chose this over normalizing header names to a canonical case at
parse time because normalizing would be a breaking change to the public
`headers` API and require rewriting every existing read site, while the
accessor keeps the change non-breaking and localized. SIP header names are
case-insensitive on the wire (RFC 3261), so storing wire case is safe.

## Considered options

- **Normalize header names at parse time** (lowercase or canonical case in
  `fromString`). Cleaner storage, but a breaking API change to `headers` and a
  rewrite of every read site; rejected as too invasive for the benefit.
- **Canonicalize on output** (write replies under a fixed canonical case).
  Rejected: diverging from the server's casing risks interoperability
  surprises and is inconsistent with the peer; mirroring the wire case is
  strictly more consistent.

## Consequences

- `headers` remains case-dependent. Consumers who read it directly must use
  `getHeader` (or their own case-insensitive lookup) or they will hit the same
  bug; the accessor is the sanctioned path.