[SIP.js](../README.md) / [Exports](../modules.md) / OutgoingSubscribeRequestDelegate

# Interface: OutgoingSubscribeRequestDelegate

Delegate providing custom handling of outgoing SUBSCRIBE requests.

## Hierarchy

- [`OutgoingRequestDelegate`](OutgoingRequestDelegate.md)

  ↳ **`OutgoingSubscribeRequestDelegate`**

## Table of contents

### Methods

- [onNotify](OutgoingSubscribeRequestDelegate.md#onnotify)
- [onNotifyTimeout](OutgoingSubscribeRequestDelegate.md#onnotifytimeout)
- [onAccept](OutgoingSubscribeRequestDelegate.md#onaccept)
- [onProgress](OutgoingSubscribeRequestDelegate.md#onprogress)
- [onRedirect](OutgoingSubscribeRequestDelegate.md#onredirect)
- [onReject](OutgoingSubscribeRequestDelegate.md#onreject)
- [onTrying](OutgoingSubscribeRequestDelegate.md#ontrying)

## Methods

### onNotify

▸ `Optional` **onNotify**(`request`): `void`

Received the initial subscription creating NOTIFY in response to this request.
Called for out of dialog SUBSCRIBE requests only (not called for re-SUBSCRIBE requests).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingRequestWithSubscription`](IncomingRequestWithSubscription.md) | Incoming NOTIFY request (including a Subscription). |

#### Returns

`void`

#### Defined in

sip.js/lib/core/messages/methods/subscribe.d.ts:38

___

### onNotifyTimeout

▸ `Optional` **onNotifyTimeout**(): `void`

Timed out waiting to receive the initial subscription creating NOTIFY in response to this request.
Called for out of dialog SUBSCRIBE requests only (not called for re-SUBSCRIBE requests).

#### Returns

`void`

#### Defined in

sip.js/lib/core/messages/methods/subscribe.d.ts:43

___

### onAccept

▸ `Optional` **onAccept**(`response`): `void`

Received a 2xx positive final response to this request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | [`IncomingResponse`](IncomingResponse.md) | Incoming response. |

#### Returns

`void`

#### Inherited from

[OutgoingRequestDelegate](OutgoingRequestDelegate.md).[onAccept](OutgoingRequestDelegate.md#onaccept)

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

#### Inherited from

[OutgoingRequestDelegate](OutgoingRequestDelegate.md).[onProgress](OutgoingRequestDelegate.md#onprogress)

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
