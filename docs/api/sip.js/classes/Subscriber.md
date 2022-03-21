[SIP.js](../README.md) / [Exports](../modules.md) / Subscriber

# Class: Subscriber

A subscriber establishes a [Subscription](Subscription.md) (outgoing SUBSCRIBE).

**`remarks`**
This is (more or less) an implementation of a "subscriber" as
defined in RFC 6665 "SIP-Specific Event Notifications".
https://tools.ietf.org/html/rfc6665

**`example`**
```ts
// Create a new subscriber.
const targetURI = new URI("sip", "alice", "example.com");
const eventType = "example-name"; // https://www.iana.org/assignments/sip-events/sip-events.xhtml
const subscriber = new Subscriber(userAgent, targetURI, eventType);

// Add delegate to handle event notifications.
subscriber.delegate = {
  onNotify: (notification: Notification) => {
    // handle notification here
  }
};

// Monitor subscription state changes.
subscriber.stateChange.addListener((newState: SubscriptionState) => {
  if (newState === SubscriptionState.Terminated) {
    // handle state change here
  }
});

// Attempt to establish the subscription
subscriber.subscribe();

// Sometime later when done with subscription
subscriber.unsubscribe();
```

## Hierarchy

- [`Subscription`](Subscription.md)

  ↳ **`Subscriber`**

## Table of contents

### Constructors

- [constructor](Subscriber.md#constructor)

### Methods

- [dispose](Subscriber.md#dispose)
- [subscribe](Subscriber.md#subscribe)
- [unsubscribe](Subscriber.md#unsubscribe)
- [\_refresh](Subscriber.md#_refresh)

### Properties

- [data](Subscriber.md#data)
- [delegate](Subscriber.md#delegate)

### Accessors

- [dialog](Subscriber.md#dialog)
- [disposed](Subscriber.md#disposed)
- [state](Subscriber.md#state)
- [stateChange](Subscriber.md#statechange)

## Constructors

### constructor

• **new Subscriber**(`userAgent`, `targetURI`, `eventType`, `options?`)

Constructor.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userAgent` | [`UserAgent`](UserAgent.md) | User agent. See [UserAgent](UserAgent.md) for details. |
| `targetURI` | [`URI`](URI.md) | The request URI identifying the subscribed event. |
| `eventType` | `string` | The event type identifying the subscribed event. |
| `options?` | [`SubscriberOptions`](../interfaces/SubscriberOptions.md) | Options bucket. See [SubscriberOptions](../interfaces/SubscriberOptions.md) for details. |

#### Overrides

Subscription.constructor

#### Defined in

sip.js/lib/api/subscriber.d.ts:63

## Methods

### dispose

▸ **dispose**(): `Promise`<`void`\>

Destructor.

**`internal`**

#### Returns

`Promise`<`void`\>

#### Overrides

[Subscription](Subscription.md).[dispose](Subscription.md#dispose)

#### Defined in

sip.js/lib/api/subscriber.d.ts:68

___

### subscribe

▸ **subscribe**(`options?`): `Promise`<`void`\>

Subscribe to event notifications.

**`remarks`**
Send an initial SUBSCRIBE request if no subscription as been established.
Sends a re-SUBSCRIBE request if the subscription is "active".

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`SubscriberSubscribeOptions`](../interfaces/SubscriberSubscribeOptions.md) |

#### Returns

`Promise`<`void`\>

#### Overrides

[Subscription](Subscription.md).[subscribe](Subscription.md#subscribe)

#### Defined in

sip.js/lib/api/subscriber.d.ts:76

___

### unsubscribe

▸ **unsubscribe**(`options?`): `Promise`<`void`\>

{@inheritDoc Subscription.unsubscribe}

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`SubscriptionUnsubscribeOptions`](../interfaces/SubscriptionUnsubscribeOptions.md) |

#### Returns

`Promise`<`void`\>

#### Overrides

[Subscription](Subscription.md).[unsubscribe](Subscription.md#unsubscribe)

#### Defined in

sip.js/lib/api/subscriber.d.ts:80

___

### \_refresh

▸ **_refresh**(): `Promise`<`void`\>

Sends a re-SUBSCRIBE request if the subscription is "active".

**`deprecated`** Use `subscribe` instead.

**`internal`**

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/subscriber.d.ts:86

## Properties

### data

• **data**: `unknown`

Property reserved for use by instance owner.

**`defaultvalue`** `undefined`

#### Inherited from

[Subscription](Subscription.md).[data](Subscription.md#data)

#### Defined in

sip.js/lib/api/subscription.d.ts:22

___

### delegate

• **delegate**: [`SubscriptionDelegate`](../interfaces/SubscriptionDelegate.md)

Subscription delegate. See [SubscriptionDelegate](../interfaces/SubscriptionDelegate.md) for details.

**`defaultvalue`** `undefined`

#### Inherited from

[Subscription](Subscription.md).[delegate](Subscription.md#delegate)

#### Defined in

sip.js/lib/api/subscription.d.ts:27

## Accessors

### dialog

• `get` **dialog**(): [`Subscription`](../interfaces/Subscription.md)

The subscribed subscription dialog.

#### Returns

[`Subscription`](../interfaces/Subscription.md)

#### Inherited from

Subscription.dialog

#### Defined in

sip.js/lib/api/subscription.d.ts:55

___

### disposed

• `get` **disposed**(): `boolean`

True if disposed.

**`internal`**

#### Returns

`boolean`

#### Inherited from

Subscription.disposed

#### Defined in

sip.js/lib/api/subscription.d.ts:60

___

### state

• `get` **state**(): [`SubscriptionState`](../enums/SubscriptionState.md)

Subscription state. See [SubscriptionState](../enums/SubscriptionState.md) for details.

#### Returns

[`SubscriptionState`](../enums/SubscriptionState.md)

#### Inherited from

Subscription.state

#### Defined in

sip.js/lib/api/subscription.d.ts:64

___

### stateChange

• `get` **stateChange**(): [`Emitter`](../interfaces/Emitter.md)<[`SubscriptionState`](../enums/SubscriptionState.md)\>

Emits when the subscription `state` property changes.

#### Returns

[`Emitter`](../interfaces/Emitter.md)<[`SubscriptionState`](../enums/SubscriptionState.md)\>

#### Inherited from

Subscription.stateChange

#### Defined in

sip.js/lib/api/subscription.d.ts:68
