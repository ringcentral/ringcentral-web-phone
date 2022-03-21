[SIP.js](../README.md) / [Exports](../modules.md) / IncomingRequestWithSubscription

# Interface: IncomingRequestWithSubscription

Incoming NOTIFY request with associated [Subscription](../classes/Subscription.md).

## Table of contents

### Properties

- [request](IncomingRequestWithSubscription.md#request)
- [subscription](IncomingRequestWithSubscription.md#subscription)

## Properties

### request

• `Readonly` **request**: [`IncomingNotifyRequest`](IncomingNotifyRequest.md)

The NOTIFY request which established the subscription.

#### Defined in

sip.js/lib/core/messages/methods/subscribe.d.ts:51

___

### subscription

• `Optional` `Readonly` **subscription**: [`Subscription`](Subscription.md)

If subscription state is not "terminated", then the subscription. Otherwise undefined.

#### Defined in

sip.js/lib/core/messages/methods/subscribe.d.ts:53
