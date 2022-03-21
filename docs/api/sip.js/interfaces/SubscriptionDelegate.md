[SIP.js](../README.md) / [Exports](../modules.md) / SubscriptionDelegate

# Interface: SubscriptionDelegate

Subscription delegate.

## Table of contents

### Methods

- [onNotify](SubscriptionDelegate.md#onnotify)
- [onRefresh](SubscriptionDelegate.md#onrefresh)
- [onTerminated](SubscriptionDelegate.md#onterminated)

## Methods

### onNotify

▸ `Optional` **onNotify**(`request`): `void`

Receive NOTIFY request. This includes in dialog NOTIFY requests only.
Thus the first NOTIFY (the subscription creating NOTIFY) will not be provided.
https://tools.ietf.org/html/rfc6665#section-4.1.3

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingNotifyRequest`](IncomingNotifyRequest.md) | Incoming NOTIFY request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/subscription/subscription-delegate.d.ts:13

___

### onRefresh

▸ `Optional` **onRefresh**(`request`): `void`

Sent a SUBSCRIBE request. This includes "auto refresh" in dialog SUBSCRIBE requests only.
Thus SUBSCRIBE requests triggered by calls to `refresh()` or `subscribe()` will not be provided.
Thus the first SUBSCRIBE (the subscription creating SUBSCRIBE) will not be provided.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`OutgoingSubscribeRequest`](OutgoingSubscribeRequest.md) | Outgoing SUBSCRIBE request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/subscription/subscription-delegate.d.ts:20

___

### onTerminated

▸ `Optional` **onTerminated**(): `void`

Subscription termination. This includes non-NOTIFY termination causes only.
Thus this will not be called if a NOTIFY is the cause of termination.
https://tools.ietf.org/html/rfc6665#section-4.4.1

#### Returns

`void`

#### Defined in

sip.js/lib/core/subscription/subscription-delegate.d.ts:26
