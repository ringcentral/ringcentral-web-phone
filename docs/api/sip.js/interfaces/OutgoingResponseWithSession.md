[SIP.js](../README.md) / [Exports](../modules.md) / OutgoingResponseWithSession

# Interface: OutgoingResponseWithSession

Outgoing INVITE response with the associated [Session](../classes/Session.md).

## Hierarchy

- [`OutgoingResponse`](OutgoingResponse.md)

  ↳ **`OutgoingResponseWithSession`**

## Table of contents

### Properties

- [session](OutgoingResponseWithSession.md#session)
- [message](OutgoingResponseWithSession.md#message)

## Properties

### session

• `Readonly` **session**: [`Session`](Session.md)

Session associated with incoming request acceptance, or
Session associated with incoming request progress (if an out of dialog request, an early dialog).

#### Defined in

sip.js/lib/core/messages/methods/invite.d.ts:35

___

### message

• `Readonly` **message**: `string`

The outgoing message.

#### Inherited from

[OutgoingResponse](OutgoingResponse.md).[message](OutgoingResponse.md#message)

#### Defined in

sip.js/lib/core/messages/outgoing-response.d.ts:12
