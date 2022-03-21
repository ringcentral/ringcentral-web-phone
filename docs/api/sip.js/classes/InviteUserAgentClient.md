[SIP.js](../README.md) / [Exports](../modules.md) / InviteUserAgentClient

# Class: InviteUserAgentClient

INVITE UAC.

**`remarks`**
13 Initiating a Session
https://tools.ietf.org/html/rfc3261#section-13
13.1 Overview
https://tools.ietf.org/html/rfc3261#section-13.1
13.2 UAC Processing
https://tools.ietf.org/html/rfc3261#section-13.2

## Hierarchy

- [`UserAgentClient`](UserAgentClient.md)

  ↳ **`InviteUserAgentClient`**

## Implements

- [`OutgoingInviteRequest`](../interfaces/OutgoingInviteRequest.md)

## Table of contents

### Constructors

- [constructor](InviteUserAgentClient.md#constructor)

### Properties

- [delegate](InviteUserAgentClient.md#delegate)
- [message](InviteUserAgentClient.md#message)

### Methods

- [dispose](InviteUserAgentClient.md#dispose)
- [cancel](InviteUserAgentClient.md#cancel)

### Accessors

- [loggerFactory](InviteUserAgentClient.md#loggerfactory)
- [transaction](InviteUserAgentClient.md#transaction)

## Constructors

### constructor

• **new InviteUserAgentClient**(`core`, `message`, `delegate?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `core` | [`UserAgentCore`](UserAgentCore.md) |
| `message` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) |
| `delegate?` | [`OutgoingInviteRequestDelegate`](../interfaces/OutgoingInviteRequestDelegate.md) |

#### Overrides

[UserAgentClient](UserAgentClient.md).[constructor](UserAgentClient.md#constructor)

#### Defined in

sip.js/lib/core/user-agents/invite-user-agent-client.d.ts:21

## Properties

### delegate

• **delegate**: [`OutgoingInviteRequestDelegate`](../interfaces/OutgoingInviteRequestDelegate.md)

Delegate providing custom handling of this outgoing INVITE request.

#### Implementation of

[OutgoingInviteRequest](../interfaces/OutgoingInviteRequest.md).[delegate](../interfaces/OutgoingInviteRequest.md#delegate)

#### Overrides

[UserAgentClient](UserAgentClient.md).[delegate](UserAgentClient.md#delegate)

#### Defined in

sip.js/lib/core/user-agents/invite-user-agent-client.d.ts:17

___

### message

• **message**: [`OutgoingRequestMessage`](OutgoingRequestMessage.md)

The outgoing message.

#### Implementation of

[OutgoingInviteRequest](../interfaces/OutgoingInviteRequest.md).[message](../interfaces/OutgoingInviteRequest.md#message)

#### Inherited from

[UserAgentClient](UserAgentClient.md).[message](UserAgentClient.md#message)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:26

## Methods

### dispose

▸ **dispose**(): `void`

Destroy request.

#### Returns

`void`

#### Implementation of

[OutgoingInviteRequest](../interfaces/OutgoingInviteRequest.md).[dispose](../interfaces/OutgoingInviteRequest.md#dispose)

#### Overrides

[UserAgentClient](UserAgentClient.md).[dispose](UserAgentClient.md#dispose)

#### Defined in

sip.js/lib/core/user-agents/invite-user-agent-client.d.ts:22

___

### cancel

▸ **cancel**(`reason?`, `options?`): [`OutgoingRequestMessage`](OutgoingRequestMessage.md)

Since requests other than INVITE are responded to immediately, sending a
CANCEL for a non-INVITE request would always create a race condition.
A CANCEL request SHOULD NOT be sent to cancel a request other than INVITE.
https://tools.ietf.org/html/rfc3261#section-9.1

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `reason?` | `string` | - |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | Cancel options bucket. |

#### Returns

[`OutgoingRequestMessage`](OutgoingRequestMessage.md)

#### Implementation of

[OutgoingInviteRequest](../interfaces/OutgoingInviteRequest.md).[cancel](../interfaces/OutgoingInviteRequest.md#cancel)

#### Inherited from

[UserAgentClient](UserAgentClient.md).[cancel](UserAgentClient.md#cancel)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:45

## Accessors

### loggerFactory

• `get` **loggerFactory**(): [`LoggerFactory`](LoggerFactory.md)

#### Returns

[`LoggerFactory`](LoggerFactory.md)

#### Inherited from

UserAgentClient.loggerFactory

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:35

___

### transaction

• `get` **transaction**(): [`ClientTransaction`](ClientTransaction.md)

The transaction associated with this request.

#### Returns

[`ClientTransaction`](ClientTransaction.md)

#### Inherited from

UserAgentClient.transaction

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:37
