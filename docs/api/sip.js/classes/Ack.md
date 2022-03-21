[SIP.js](../README.md) / [Exports](../modules.md) / Ack

# Class: Ack

A request to confirm a [Session](Session.md) (incoming ACK).

## Table of contents

### Constructors

- [constructor](Ack.md#constructor)

### Accessors

- [request](Ack.md#request)

## Constructors

### constructor

• **new Ack**(`incomingAckRequest`)

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `incomingAckRequest` | [`IncomingAckRequest`](../interfaces/IncomingAckRequest.md) |

#### Defined in

sip.js/lib/api/ack.d.ts:9

## Accessors

### request

• `get` **request**(): [`IncomingRequestMessage`](IncomingRequestMessage.md)

Incoming ACK request message.

#### Returns

[`IncomingRequestMessage`](IncomingRequestMessage.md)

#### Defined in

sip.js/lib/api/ack.d.ts:11
