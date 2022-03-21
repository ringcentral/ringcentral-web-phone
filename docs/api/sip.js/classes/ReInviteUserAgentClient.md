[SIP.js](../README.md) / [Exports](../modules.md) / ReInviteUserAgentClient

# Class: ReInviteUserAgentClient

Re-INVITE UAC.

**`remarks`**
14 Modifying an Existing Session
https://tools.ietf.org/html/rfc3261#section-14
14.1 UAC Behavior
https://tools.ietf.org/html/rfc3261#section-14.1

## Hierarchy

- [`UserAgentClient`](UserAgentClient.md)

  ↳ **`ReInviteUserAgentClient`**

## Implements

- [`OutgoingInviteRequest`](../interfaces/OutgoingInviteRequest.md)

## Table of contents

### Constructors

- [constructor](ReInviteUserAgentClient.md#constructor)

### Properties

- [delegate](ReInviteUserAgentClient.md#delegate)
- [message](ReInviteUserAgentClient.md#message)

### Methods

- [dispose](ReInviteUserAgentClient.md#dispose)
- [cancel](ReInviteUserAgentClient.md#cancel)

### Accessors

- [loggerFactory](ReInviteUserAgentClient.md#loggerfactory)
- [transaction](ReInviteUserAgentClient.md#transaction)

## Constructors

### constructor

• **new ReInviteUserAgentClient**(`dialog`, `delegate?`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dialog` | [`SessionDialog`](SessionDialog.md) |
| `delegate?` | [`OutgoingInviteRequestDelegate`](../interfaces/OutgoingInviteRequestDelegate.md) |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) |

#### Overrides

[UserAgentClient](UserAgentClient.md).[constructor](UserAgentClient.md#constructor)

#### Defined in

sip.js/lib/core/user-agents/re-invite-user-agent-client.d.ts:16

## Properties

### delegate

• **delegate**: [`OutgoingInviteRequestDelegate`](../interfaces/OutgoingInviteRequestDelegate.md)

Delegate providing custom handling of this outgoing INVITE request.

#### Implementation of

[OutgoingInviteRequest](../interfaces/OutgoingInviteRequest.md).[delegate](../interfaces/OutgoingInviteRequest.md#delegate)

#### Overrides

[UserAgentClient](UserAgentClient.md).[delegate](UserAgentClient.md#delegate)

#### Defined in

sip.js/lib/core/user-agents/re-invite-user-agent-client.d.ts:14

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

#### Inherited from

[UserAgentClient](UserAgentClient.md).[dispose](UserAgentClient.md#dispose)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:34

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
