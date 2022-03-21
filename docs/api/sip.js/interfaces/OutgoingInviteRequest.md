[SIP.js](../README.md) / [Exports](../modules.md) / OutgoingInviteRequest

# Interface: OutgoingInviteRequest

Outgoing INVITE request.

## Hierarchy

- [`OutgoingRequest`](OutgoingRequest.md)

  ↳ **`OutgoingInviteRequest`**

## Implemented by

- [`InviteUserAgentClient`](../classes/InviteUserAgentClient.md)
- [`ReInviteUserAgentClient`](../classes/ReInviteUserAgentClient.md)

## Table of contents

### Properties

- [delegate](OutgoingInviteRequest.md#delegate)
- [message](OutgoingInviteRequest.md#message)

### Methods

- [dispose](OutgoingInviteRequest.md#dispose)
- [cancel](OutgoingInviteRequest.md#cancel)

## Properties

### delegate

• `Optional` **delegate**: [`OutgoingInviteRequestDelegate`](OutgoingInviteRequestDelegate.md)

Delegate providing custom handling of this outgoing INVITE request.

#### Overrides

[OutgoingRequest](OutgoingRequest.md).[delegate](OutgoingRequest.md#delegate)

#### Defined in

sip.js/lib/core/messages/methods/invite.d.ts:43

___

### message

• `Readonly` **message**: [`OutgoingRequestMessage`](../classes/OutgoingRequestMessage.md)

The outgoing message.

#### Inherited from

[OutgoingRequest](OutgoingRequest.md).[message](OutgoingRequest.md#message)

#### Defined in

sip.js/lib/core/messages/outgoing-request.d.ts:15

## Methods

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
