[SIP.js](../README.md) / [Exports](../modules.md) / OutgoingInviteRequestDelegate

# Interface: OutgoingInviteRequestDelegate

Delegate providing custom handling of outgoing INVITE requests.

## Hierarchy

- [`OutgoingRequestDelegate`](OutgoingRequestDelegate.md)

  ↳ **`OutgoingInviteRequestDelegate`**

## Table of contents

### Methods

- [onAccept](OutgoingInviteRequestDelegate.md#onaccept)
- [onProgress](OutgoingInviteRequestDelegate.md#onprogress)
- [onRedirect](OutgoingInviteRequestDelegate.md#onredirect)
- [onReject](OutgoingInviteRequestDelegate.md#onreject)
- [onTrying](OutgoingInviteRequestDelegate.md#ontrying)

## Methods

### onAccept

▸ `Optional` **onAccept**(`response`): `void`

Received a 2xx positive final response to this request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | [`AckableIncomingResponseWithSession`](AckableIncomingResponseWithSession.md) | Incoming response (including a confirmed Session). |

#### Returns

`void`

#### Overrides

[OutgoingRequestDelegate](OutgoingRequestDelegate.md).[onAccept](OutgoingRequestDelegate.md#onaccept)

#### Defined in

sip.js/lib/core/messages/methods/invite.d.ts:54

___

### onProgress

▸ `Optional` **onProgress**(`response`): `void`

Received a 1xx provisional response to this request. Excluding 100 responses.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | [`PrackableIncomingResponseWithSession`](PrackableIncomingResponseWithSession.md) | Incoming response (including an early Session). |

#### Returns

`void`

#### Overrides

[OutgoingRequestDelegate](OutgoingRequestDelegate.md).[onProgress](OutgoingRequestDelegate.md#onprogress)

#### Defined in

sip.js/lib/core/messages/methods/invite.d.ts:59

___

### onRedirect

▸ `Optional` **onRedirect**(`response`): `void`

Received a 3xx negative final response to this request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | [`IncomingResponse`](IncomingResponse.md) | Incoming response. |

#### Returns

`void`

#### Inherited from

[OutgoingRequestDelegate](OutgoingRequestDelegate.md).[onRedirect](OutgoingRequestDelegate.md#onredirect)

#### Defined in

sip.js/lib/core/messages/outgoing-request.d.ts:46

___

### onReject

▸ `Optional` **onReject**(`response`): `void`

Received a 4xx, 5xx, or 6xx negative final response to this request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | [`IncomingResponse`](IncomingResponse.md) | Incoming response. |

#### Returns

`void`

#### Inherited from

[OutgoingRequestDelegate](OutgoingRequestDelegate.md).[onReject](OutgoingRequestDelegate.md#onreject)

#### Defined in

sip.js/lib/core/messages/outgoing-request.d.ts:51

___

### onTrying

▸ `Optional` **onTrying**(`response`): `void`

Received a 100 provisional response.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | [`IncomingResponse`](IncomingResponse.md) | Incoming response. |

#### Returns

`void`

#### Inherited from

[OutgoingRequestDelegate](OutgoingRequestDelegate.md).[onTrying](OutgoingRequestDelegate.md#ontrying)

#### Defined in

sip.js/lib/core/messages/outgoing-request.d.ts:56
