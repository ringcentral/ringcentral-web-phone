[SIP.js](../README.md) / [Exports](../modules.md) / Subscription

# Class: Subscription

A subscription provides [Notification](Notification.md) of events.

**`remarks`**
See [Subscriber](Subscriber.md) for details on establishing a subscription.

## Hierarchy

- **`Subscription`**

  ↳ [`Subscriber`](Subscriber.md)

## Table of contents

### Properties

- [data](Subscription.md#data)
- [delegate](Subscription.md#delegate)

### Methods

- [dispose](Subscription.md#dispose)
- [subscribe](Subscription.md#subscribe)
- [unsubscribe](Subscription.md#unsubscribe)

### Accessors

- [dialog](Subscription.md#dialog)
- [disposed](Subscription.md#disposed)
- [state](Subscription.md#state)
- [stateChange](Subscription.md#statechange)

## Properties

### data

• **data**: `unknown`

Property reserved for use by instance owner.

**`defaultvalue`** `undefined`

#### Defined in

sip.js/lib/api/subscription.d.ts:22

___

### delegate

• **delegate**: [`SubscriptionDelegate`](../interfaces/SubscriptionDelegate.md)

Subscription delegate. See [SubscriptionDelegate](../interfaces/SubscriptionDelegate.md) for details.

**`defaultvalue`** `undefined`

#### Defined in

sip.js/lib/api/subscription.d.ts:27

## Methods

### dispose

▸ **dispose**(): `Promise`<`void`\>

Destructor.

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/subscription.d.ts:51

___

### subscribe

▸ `Abstract` **subscribe**(`options?`): `Promise`<`void`\>

Sends a re-SUBSCRIBE request if the subscription is "active".

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`SubscriptionSubscribeOptions`](../interfaces/SubscriptionSubscribeOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/subscription.d.ts:74

___

### unsubscribe

▸ `Abstract` **unsubscribe**(`options?`): `Promise`<`void`\>

Unsubscribe from event notifications.

**`remarks`**
If the subscription state is SubscriptionState.Subscribed, sends an in dialog SUBSCRIBE request
with expires time of zero (an un-subscribe) and terminates the subscription.
Otherwise a noop.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`SubscriptionUnsubscribeOptions`](../interfaces/SubscriptionUnsubscribeOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/subscription.d.ts:83

## Accessors

### dialog

• `get` **dialog**(): [`Subscription`](../interfaces/Subscription.md)

The subscribed subscription dialog.

#### Returns

[`Subscription`](../interfaces/Subscription.md)

#### Defined in

sip.js/lib/api/subscription.d.ts:55

___

### disposed

• `get` **disposed**(): `boolean`

True if disposed.

**`internal`**

#### Returns

`boolean`

#### Defined in

sip.js/lib/api/subscription.d.ts:60

___

### state

• `get` **state**(): [`SubscriptionState`](../enums/SubscriptionState.md)

Subscription state. See [SubscriptionState](../enums/SubscriptionState.md) for details.

#### Returns

[`SubscriptionState`](../enums/SubscriptionState.md)

#### Defined in

sip.js/lib/api/subscription.d.ts:64

___

### stateChange

• `get` **stateChange**(): [`Emitter`](../interfaces/Emitter.md)<[`SubscriptionState`](../enums/SubscriptionState.md)\>

Emits when the subscription `state` property changes.

#### Returns

[`Emitter`](../interfaces/Emitter.md)<[`SubscriptionState`](../enums/SubscriptionState.md)\>

#### Defined in

sip.js/lib/api/subscription.d.ts:68
