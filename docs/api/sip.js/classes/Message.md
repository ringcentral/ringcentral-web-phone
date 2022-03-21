[SIP.js](../README.md) / [Exports](../modules.md) / Message

# Class: Message

A received message (incoming MESSAGE).

## Table of contents

### Constructors

- [constructor](Message.md#constructor)

### Accessors

- [request](Message.md#request)

### Methods

- [accept](Message.md#accept)
- [reject](Message.md#reject)

## Constructors

### constructor

• **new Message**(`incomingMessageRequest`)

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `incomingMessageRequest` | [`IncomingMessageRequest`](../interfaces/IncomingMessageRequest.md) |

#### Defined in

sip.js/lib/api/message.d.ts:9

## Accessors

### request

• `get` **request**(): [`IncomingRequestMessage`](IncomingRequestMessage.md)

Incoming MESSAGE request message.

#### Returns

[`IncomingRequestMessage`](IncomingRequestMessage.md)

#### Defined in

sip.js/lib/api/message.d.ts:11

## Methods

### accept

▸ **accept**(`options?`): `Promise`<`void`\>

Accept the request.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`ResponseOptions`](../interfaces/ResponseOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/message.d.ts:13

___

### reject

▸ **reject**(`options?`): `Promise`<`void`\>

Reject the request.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`ResponseOptions`](../interfaces/ResponseOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/message.d.ts:15
