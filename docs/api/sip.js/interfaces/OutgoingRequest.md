[SIP.js](../README.md) / [Exports](../modules.md) / OutgoingRequest

# Interface: OutgoingRequest

A SIP message sent from a local client to a remote server.

**`remarks`**
For the purpose of invoking a particular operation.
https://tools.ietf.org/html/rfc3261#section-7.1

## Hierarchy

- **`OutgoingRequest`**

  ↳ [`OutgoingByeRequest`](OutgoingByeRequest.md)

  ↳ [`OutgoingCancelRequest`](OutgoingCancelRequest.md)

  ↳ [`OutgoingInfoRequest`](OutgoingInfoRequest.md)

  ↳ [`OutgoingInviteRequest`](OutgoingInviteRequest.md)

  ↳ [`OutgoingMessageRequest`](OutgoingMessageRequest.md)

  ↳ [`OutgoingNotifyRequest`](OutgoingNotifyRequest.md)

  ↳ [`OutgoingPrackRequest`](OutgoingPrackRequest.md)

  ↳ [`OutgoingPublishRequest`](OutgoingPublishRequest.md)

  ↳ [`OutgoingReferRequest`](OutgoingReferRequest.md)

  ↳ [`OutgoingRegisterRequest`](OutgoingRegisterRequest.md)

  ↳ [`OutgoingSubscribeRequest`](OutgoingSubscribeRequest.md)

## Implemented by

- [`UserAgentClient`](../classes/UserAgentClient.md)

## Table of contents

### Properties

- [delegate](OutgoingRequest.md#delegate)
- [message](OutgoingRequest.md#message)

### Methods

- [dispose](OutgoingRequest.md#dispose)
- [cancel](OutgoingRequest.md#cancel)

## Properties

### delegate

• `Optional` **delegate**: [`OutgoingRequestDelegate`](OutgoingRequestDelegate.md)

Delegate providing custom handling of this outgoing request.

#### Defined in

sip.js/lib/core/messages/outgoing-request.d.ts:13

___

### message

• `Readonly` **message**: [`OutgoingRequestMessage`](../classes/OutgoingRequestMessage.md)

The outgoing message.

#### Defined in

sip.js/lib/core/messages/outgoing-request.d.ts:15

## Methods

### dispose

▸ **dispose**(): `void`

Destroy request.

#### Returns

`void`

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

#### Defined in

sip.js/lib/core/messages/outgoing-request.d.ts:25
