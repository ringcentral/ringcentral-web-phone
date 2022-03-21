[SIP.js](../README.md) / [Exports](../modules.md) / Bye

# Class: Bye

A request to end a [Session](Session.md) (incoming BYE).

## Table of contents

### Constructors

- [constructor](Bye.md#constructor)

### Accessors

- [request](Bye.md#request)

### Methods

- [accept](Bye.md#accept)
- [reject](Bye.md#reject)

## Constructors

### constructor

• **new Bye**(`incomingByeRequest`)

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `incomingByeRequest` | [`IncomingByeRequest`](../interfaces/IncomingByeRequest.md) |

#### Defined in

sip.js/lib/api/bye.d.ts:9

## Accessors

### request

• `get` **request**(): [`IncomingRequestMessage`](IncomingRequestMessage.md)

Incoming BYE request message.

#### Returns

[`IncomingRequestMessage`](IncomingRequestMessage.md)

#### Defined in

sip.js/lib/api/bye.d.ts:11

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

sip.js/lib/api/bye.d.ts:13

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

sip.js/lib/api/bye.d.ts:15
