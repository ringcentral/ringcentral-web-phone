[SIP.js](../README.md) / [Exports](../modules.md) / Referral

# Class: Referral

A request to establish a [Session](Session.md) elsewhere (incoming REFER).

## Table of contents

### Constructors

- [constructor](Referral.md#constructor)

### Accessors

- [referTo](Referral.md#referto)
- [referredBy](Referral.md#referredby)
- [replaces](Referral.md#replaces)
- [request](Referral.md#request)

### Methods

- [accept](Referral.md#accept)
- [reject](Referral.md#reject)
- [makeInviter](Referral.md#makeinviter)

## Constructors

### constructor

• **new Referral**(`incomingReferRequest`, `session`)

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `incomingReferRequest` | [`IncomingReferRequest`](../interfaces/IncomingReferRequest.md) |
| `session` | [`Session`](Session.md) |

#### Defined in

sip.js/lib/api/referral.d.ts:14

## Accessors

### referTo

• `get` **referTo**(): [`NameAddrHeader`](NameAddrHeader.md)

#### Returns

[`NameAddrHeader`](NameAddrHeader.md)

#### Defined in

sip.js/lib/api/referral.d.ts:15

___

### referredBy

• `get` **referredBy**(): `string`

#### Returns

`string`

#### Defined in

sip.js/lib/api/referral.d.ts:16

___

### replaces

• `get` **replaces**(): `string`

#### Returns

`string`

#### Defined in

sip.js/lib/api/referral.d.ts:17

___

### request

• `get` **request**(): [`IncomingRequestMessage`](IncomingRequestMessage.md)

Incoming REFER request message.

#### Returns

[`IncomingRequestMessage`](IncomingRequestMessage.md)

#### Defined in

sip.js/lib/api/referral.d.ts:19

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

sip.js/lib/api/referral.d.ts:21

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

sip.js/lib/api/referral.d.ts:23

___

### makeInviter

▸ **makeInviter**(`options?`): [`Inviter`](Inviter.md)

Creates an inviter which may be used to send an out of dialog INVITE request.

**`remarks`**
This a helper method to create an Inviter which will execute the referral
of the `Session` which was referred. The appropriate headers are set and
the referred `Session` is linked to the new `Session`. Note that only a
single instance of the `Inviter` will be created and returned (if called
more than once a reference to the same `Inviter` will be returned every time).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`InviterOptions`](../interfaces/InviterOptions.md) | Options bucket. |

#### Returns

[`Inviter`](Inviter.md)

#### Defined in

sip.js/lib/api/referral.d.ts:37
