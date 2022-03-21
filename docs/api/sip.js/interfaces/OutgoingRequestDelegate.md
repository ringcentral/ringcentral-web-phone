[SIP.js](../README.md) / [Exports](../modules.md) / OutgoingRequestDelegate

# Interface: OutgoingRequestDelegate

Delegate providing custom handling of outgoing requests.

## Hierarchy

- **`OutgoingRequestDelegate`**

  ↳ [`OutgoingInviteRequestDelegate`](OutgoingInviteRequestDelegate.md)

  ↳ [`OutgoingSubscribeRequestDelegate`](OutgoingSubscribeRequestDelegate.md)

## Table of contents

### Methods

- [onAccept](OutgoingRequestDelegate.md#onaccept)
- [onProgress](OutgoingRequestDelegate.md#onprogress)
- [onRedirect](OutgoingRequestDelegate.md#onredirect)
- [onReject](OutgoingRequestDelegate.md#onreject)
- [onTrying](OutgoingRequestDelegate.md#ontrying)

## Methods

### onAccept

▸ `Optional` **onAccept**(`response`): `void`

Received a 2xx positive final response to this request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | [`IncomingResponse`](IncomingResponse.md) | Incoming response. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/messages/outgoing-request.d.ts:36

___

### onProgress

▸ `Optional` **onProgress**(`response`): `void`

Received a 1xx provisional response to this request. Excluding 100 responses.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | [`IncomingResponse`](IncomingResponse.md) | Incoming response. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/messages/outgoing-request.d.ts:41

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

#### Defined in

sip.js/lib/core/messages/outgoing-request.d.ts:56
