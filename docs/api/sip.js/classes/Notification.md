[SIP.js](../README.md) / [Exports](../modules.md) / Notification

# Class: Notification

A notification of an event (incoming NOTIFY).

## Table of contents

### Constructors

- [constructor](Notification.md#constructor)

### Accessors

- [request](Notification.md#request)

### Methods

- [accept](Notification.md#accept)
- [reject](Notification.md#reject)

## Constructors

### constructor

• **new Notification**(`incomingNotifyRequest`)

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `incomingNotifyRequest` | [`IncomingNotifyRequest`](../interfaces/IncomingNotifyRequest.md) |

#### Defined in

sip.js/lib/api/notification.d.ts:9

## Accessors

### request

• `get` **request**(): [`IncomingRequestMessage`](IncomingRequestMessage.md)

Incoming NOTIFY request message.

#### Returns

[`IncomingRequestMessage`](IncomingRequestMessage.md)

#### Defined in

sip.js/lib/api/notification.d.ts:11

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

sip.js/lib/api/notification.d.ts:13

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

sip.js/lib/api/notification.d.ts:15
