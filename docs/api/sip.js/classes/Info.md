[SIP.js](../README.md) / [Exports](../modules.md) / Info

# Class: Info

An exchange of information (incoming INFO).

## Table of contents

### Constructors

- [constructor](Info.md#constructor)

### Accessors

- [request](Info.md#request)

### Methods

- [accept](Info.md#accept)
- [reject](Info.md#reject)

## Constructors

### constructor

• **new Info**(`incomingInfoRequest`)

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `incomingInfoRequest` | [`IncomingInfoRequest`](../interfaces/IncomingInfoRequest.md) |

#### Defined in

sip.js/lib/api/info.d.ts:9

## Accessors

### request

• `get` **request**(): [`IncomingRequestMessage`](IncomingRequestMessage.md)

Incoming MESSAGE request message.

#### Returns

[`IncomingRequestMessage`](IncomingRequestMessage.md)

#### Defined in

sip.js/lib/api/info.d.ts:11

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

sip.js/lib/api/info.d.ts:13

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

sip.js/lib/api/info.d.ts:15
