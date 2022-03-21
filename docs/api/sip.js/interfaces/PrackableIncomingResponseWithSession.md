[SIP.js](../README.md) / [Exports](../modules.md) / PrackableIncomingResponseWithSession

# Interface: PrackableIncomingResponseWithSession

Incoming INVITE response received when request is progressed.

## Hierarchy

- [`IncomingResponse`](IncomingResponse.md)

  ↳ **`PrackableIncomingResponseWithSession`**

## Table of contents

### Properties

- [message](PrackableIncomingResponseWithSession.md#message)
- [session](PrackableIncomingResponseWithSession.md#session)

### Methods

- [prack](PrackableIncomingResponseWithSession.md#prack)

## Properties

### message

• `Readonly` **message**: [`IncomingResponseMessage`](../classes/IncomingResponseMessage.md)

The incoming message.

#### Inherited from

[IncomingResponse](IncomingResponse.md).[message](IncomingResponse.md#message)

#### Defined in

sip.js/lib/core/messages/incoming-response.d.ts:11

___

### session

• `Readonly` **session**: [`Session`](Session.md)

Session associated with outgoing request progress. If out of dialog request, an early dialog.

#### Defined in

sip.js/lib/core/messages/methods/invite.d.ts:80

## Methods

### prack

▸ **prack**(`options?`): [`OutgoingPrackRequest`](OutgoingPrackRequest.md)

Send an PRACK to acknowledge this response.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`RequestOptions`](RequestOptions.md) | Request options bucket. |

#### Returns

[`OutgoingPrackRequest`](OutgoingPrackRequest.md)

#### Defined in

sip.js/lib/core/messages/methods/invite.d.ts:85
