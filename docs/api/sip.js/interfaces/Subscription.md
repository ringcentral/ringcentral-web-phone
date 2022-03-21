[SIP.js](../README.md) / [Exports](../modules.md) / Subscription

# Interface: Subscription

Subscription.

**`remarks`**
https://tools.ietf.org/html/rfc6665

## Implemented by

- [`SubscriptionDialog`](../classes/SubscriptionDialog.md)

## Table of contents

### Properties

- [delegate](Subscription.md#delegate)
- [id](Subscription.md#id)
- [subscriptionExpires](Subscription.md#subscriptionexpires)
- [subscriptionState](Subscription.md#subscriptionstate)
- [autoRefresh](Subscription.md#autorefresh)

### Methods

- [dispose](Subscription.md#dispose)
- [subscribe](Subscription.md#subscribe)
- [refresh](Subscription.md#refresh)
- [unsubscribe](Subscription.md#unsubscribe)

## Properties

### delegate

• **delegate**: [`SubscriptionDelegate`](SubscriptionDelegate.md)

Subscription delegate.

#### Defined in

sip.js/lib/core/subscription/subscription.d.ts:11

___

### id

• `Readonly` **id**: `string`

The subscription id.

#### Defined in

sip.js/lib/core/subscription/subscription.d.ts:13

___

### subscriptionExpires

• `Readonly` **subscriptionExpires**: `number`

Subscription expires. Number of seconds until the subscription expires.

#### Defined in

sip.js/lib/core/subscription/subscription.d.ts:15

___

### subscriptionState

• `Readonly` **subscriptionState**: [`SubscriptionState`](../enums/SubscriptionState.md)

Subscription state.

#### Defined in

sip.js/lib/core/subscription/subscription.d.ts:17

___

### autoRefresh

• **autoRefresh**: `boolean`

If true, refresh subscription prior to expiration. Default is false.

#### Defined in

sip.js/lib/core/subscription/subscription.d.ts:19

## Methods

### dispose

▸ **dispose**(): `void`

Destroy subscription.

#### Returns

`void`

#### Defined in

sip.js/lib/core/subscription/subscription.d.ts:23

___

### subscribe

▸ **subscribe**(`delegate?`, `options?`): [`OutgoingSubscribeRequest`](OutgoingSubscribeRequest.md)

Send re-SUBSCRIBE request.
Refreshing a subscription and unsubscribing.
https://tools.ietf.org/html/rfc6665#section-4.1.2.2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingSubscribeRequestDelegate`](OutgoingSubscribeRequestDelegate.md) | Request delegate. |
| `options?` | [`RequestOptions`](RequestOptions.md) | Options bucket |

#### Returns

[`OutgoingSubscribeRequest`](OutgoingSubscribeRequest.md)

#### Defined in

sip.js/lib/core/subscription/subscription.d.ts:31

___

### refresh

▸ **refresh**(): [`OutgoingSubscribeRequest`](OutgoingSubscribeRequest.md)

4.1.2.2.  Refreshing of Subscriptions
https://tools.ietf.org/html/rfc6665#section-4.1.2.2

#### Returns

[`OutgoingSubscribeRequest`](OutgoingSubscribeRequest.md)

#### Defined in

sip.js/lib/core/subscription/subscription.d.ts:36

___

### unsubscribe

▸ **unsubscribe**(): [`OutgoingSubscribeRequest`](OutgoingSubscribeRequest.md)

4.1.2.3.  Unsubscribing
https://tools.ietf.org/html/rfc6665#section-4.1.2.3

#### Returns

[`OutgoingSubscribeRequest`](OutgoingSubscribeRequest.md)

#### Defined in

sip.js/lib/core/subscription/subscription.d.ts:41
