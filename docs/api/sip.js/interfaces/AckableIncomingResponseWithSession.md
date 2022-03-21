[SIP.js](../README.md) / [Exports](../modules.md) / AckableIncomingResponseWithSession

# Interface: AckableIncomingResponseWithSession

Incoming INVITE response received when request is accepted.

## Hierarchy

- [`IncomingResponse`](IncomingResponse.md)

  ↳ **`AckableIncomingResponseWithSession`**

## Table of contents

### Properties

- [message](AckableIncomingResponseWithSession.md#message)
- [session](AckableIncomingResponseWithSession.md#session)

### Methods

- [ack](AckableIncomingResponseWithSession.md#ack)

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

Session associated with outgoing request acceptance.

#### Defined in

sip.js/lib/core/messages/methods/invite.d.ts:67

## Methods

### ack

▸ **ack**(`options?`): [`OutgoingAckRequest`](OutgoingAckRequest.md)

Send an ACK to acknowledge this response.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`RequestOptions`](RequestOptions.md) | Request options bucket. |

#### Returns

[`OutgoingAckRequest`](OutgoingAckRequest.md)

#### Defined in

sip.js/lib/core/messages/methods/invite.d.ts:72
