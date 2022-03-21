[SIP.js](../README.md) / [Exports](../modules.md) / UserAgentClient

# Class: UserAgentClient

User Agent Client (UAC).

**`remarks`**
A user agent client is a logical entity
that creates a new request, and then uses the client
transaction state machinery to send it.  The role of UAC lasts
only for the duration of that transaction.  In other words, if
a piece of software initiates a request, it acts as a UAC for
the duration of that transaction.  If it receives a request
later, it assumes the role of a user agent server for the
processing of that transaction.
https://tools.ietf.org/html/rfc3261#section-6

## Hierarchy

- **`UserAgentClient`**

  ↳ [`ByeUserAgentClient`](ByeUserAgentClient.md)

  ↳ [`CancelUserAgentClient`](CancelUserAgentClient.md)

  ↳ [`InfoUserAgentClient`](InfoUserAgentClient.md)

  ↳ [`InviteUserAgentClient`](InviteUserAgentClient.md)

  ↳ [`MessageUserAgentClient`](MessageUserAgentClient.md)

  ↳ [`NotifyUserAgentClient`](NotifyUserAgentClient.md)

  ↳ [`PrackUserAgentClient`](PrackUserAgentClient.md)

  ↳ [`PublishUserAgentClient`](PublishUserAgentClient.md)

  ↳ [`ReInviteUserAgentClient`](ReInviteUserAgentClient.md)

  ↳ [`ReSubscribeUserAgentClient`](ReSubscribeUserAgentClient.md)

  ↳ [`ReferUserAgentClient`](ReferUserAgentClient.md)

  ↳ [`RegisterUserAgentClient`](RegisterUserAgentClient.md)

  ↳ [`SubscribeUserAgentClient`](SubscribeUserAgentClient.md)

## Implements

- [`OutgoingRequest`](../interfaces/OutgoingRequest.md)

## Table of contents

### Constructors

- [constructor](UserAgentClient.md#constructor)

### Properties

- [message](UserAgentClient.md#message)
- [delegate](UserAgentClient.md#delegate)

### Methods

- [dispose](UserAgentClient.md#dispose)
- [cancel](UserAgentClient.md#cancel)

### Accessors

- [loggerFactory](UserAgentClient.md#loggerfactory)
- [transaction](UserAgentClient.md#transaction)

## Constructors

### constructor

• **new UserAgentClient**(`transactionConstructor`, `core`, `message`, `delegate?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionConstructor` | `ClientTransactionConstructor` |
| `core` | [`UserAgentCore`](UserAgentCore.md) |
| `message` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) |

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:33

## Properties

### message

• **message**: [`OutgoingRequestMessage`](OutgoingRequestMessage.md)

The outgoing message.

#### Implementation of

[OutgoingRequest](../interfaces/OutgoingRequest.md).[message](../interfaces/OutgoingRequest.md#message)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:26

___

### delegate

• `Optional` **delegate**: [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md)

Delegate providing custom handling of this outgoing request.

#### Implementation of

[OutgoingRequest](../interfaces/OutgoingRequest.md).[delegate](../interfaces/OutgoingRequest.md#delegate)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:27

## Methods

### dispose

▸ **dispose**(): `void`

Destroy request.

#### Returns

`void`

#### Implementation of

[OutgoingRequest](../interfaces/OutgoingRequest.md).[dispose](../interfaces/OutgoingRequest.md#dispose)

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

[OutgoingRequest](../interfaces/OutgoingRequest.md).[cancel](../interfaces/OutgoingRequest.md#cancel)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:45

## Accessors

### loggerFactory

• `get` **loggerFactory**(): [`LoggerFactory`](LoggerFactory.md)

#### Returns

[`LoggerFactory`](LoggerFactory.md)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:35

___

### transaction

• `get` **transaction**(): [`ClientTransaction`](ClientTransaction.md)

The transaction associated with this request.

#### Returns

[`ClientTransaction`](ClientTransaction.md)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:37
