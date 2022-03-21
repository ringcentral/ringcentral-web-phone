[SIP.js](../README.md) / [Exports](../modules.md) / OutgoingSubscribeRequest

# Interface: OutgoingSubscribeRequest

Outgoing SUBSCRIBE request.

## Hierarchy

- [`OutgoingRequest`](OutgoingRequest.md)

  ↳ **`OutgoingSubscribeRequest`**

## Implemented by

- [`ReSubscribeUserAgentClient`](../classes/ReSubscribeUserAgentClient.md)
- [`SubscribeUserAgentClient`](../classes/SubscribeUserAgentClient.md)

## Table of contents

### Properties

- [delegate](OutgoingSubscribeRequest.md#delegate)
- [message](OutgoingSubscribeRequest.md#message)

### Methods

- [waitNotifyStop](OutgoingSubscribeRequest.md#waitnotifystop)
- [dispose](OutgoingSubscribeRequest.md#dispose)
- [cancel](OutgoingSubscribeRequest.md#cancel)

## Properties

### delegate

• `Optional` **delegate**: [`OutgoingSubscribeRequestDelegate`](OutgoingSubscribeRequestDelegate.md)

Delegate providing custom handling of this outgoing SUBSCRIBE request.

#### Overrides

[OutgoingRequest](OutgoingRequest.md).[delegate](OutgoingRequest.md#delegate)

#### Defined in

sip.js/lib/core/messages/methods/subscribe.d.ts:24

___

### message

• `Readonly` **message**: [`OutgoingRequestMessage`](../classes/OutgoingRequestMessage.md)

The outgoing message.

#### Inherited from

[OutgoingRequest](OutgoingRequest.md).[message](OutgoingRequest.md#message)

#### Defined in

sip.js/lib/core/messages/outgoing-request.d.ts:15

## Methods

### waitNotifyStop

▸ **waitNotifyStop**(): `void`

Stop waiting for an inital subscription creating NOTIFY.

#### Returns

`void`

#### Defined in

sip.js/lib/core/messages/methods/subscribe.d.ts:26

___

### dispose

▸ **dispose**(): `void`

Destroy request.

#### Returns

`void`

#### Inherited from

[OutgoingRequest](OutgoingRequest.md).[dispose](OutgoingRequest.md#dispose)

#### Defined in

sip.js/lib/core/messages/outgoing-request.d.ts:19

___

### cancel

▸ **cancel**(`reason?`, `options?`): `void`

Sends a CANCEL message targeting this request to the UAS.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `reason?` | `string` | Reason for canceling request. |
| `options?` | [`RequestOptions`](RequestOptions.md) | Request options bucket. |

#### Returns

`void`

#### Inherited from

[OutgoingRequest](OutgoingRequest.md).[cancel](OutgoingRequest.md#cancel)

#### Defined in

sip.js/lib/core/messages/outgoing-request.d.ts:25
