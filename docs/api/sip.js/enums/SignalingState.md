[SIP.js](../README.md) / [Exports](../modules.md) / SignalingState

# Enumeration: SignalingState

Offer/Answer state.

**`remarks`**
```txt
        Offer                Answer             RFC    Ini Est Early
 -------------------------------------------------------------------
 1. INVITE Req.          2xx INVITE Resp.     RFC 3261  Y   Y    N
 2. 2xx INVITE Resp.     ACK Req.             RFC 3261  Y   Y    N
 3. INVITE Req.          1xx-rel INVITE Resp. RFC 3262  Y   Y    N
 4. 1xx-rel INVITE Resp. PRACK Req.           RFC 3262  Y   Y    N
 5. PRACK Req.           200 PRACK Resp.      RFC 3262  N   Y    Y
 6. UPDATE Req.          2xx UPDATE Resp.     RFC 3311  N   Y    Y

      Table 1: Summary of SIP Usage of the Offer/Answer Model
```
https://tools.ietf.org/html/rfc6337#section-2.2

## Table of contents

### Enumeration members

- [Initial](SignalingState.md#initial)
- [HaveLocalOffer](SignalingState.md#havelocaloffer)
- [HaveRemoteOffer](SignalingState.md#haveremoteoffer)
- [Stable](SignalingState.md#stable)
- [Closed](SignalingState.md#closed)

## Enumeration members

### Initial

• **Initial** = `"Initial"`

#### Defined in

sip.js/lib/core/session/session.d.ts:129

___

### HaveLocalOffer

• **HaveLocalOffer** = `"HaveLocalOffer"`

#### Defined in

sip.js/lib/core/session/session.d.ts:130

___

### HaveRemoteOffer

• **HaveRemoteOffer** = `"HaveRemoteOffer"`

#### Defined in

sip.js/lib/core/session/session.d.ts:131

___

### Stable

• **Stable** = `"Stable"`

#### Defined in

sip.js/lib/core/session/session.d.ts:132

___

### Closed

• **Closed** = `"Closed"`

#### Defined in

sip.js/lib/core/session/session.d.ts:133
