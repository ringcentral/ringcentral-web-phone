[SIP.js](../README.md) / [Exports](../modules.md) / RegisterUserAgentClient

# Class: RegisterUserAgentClient

REGISTER UAC.

## Hierarchy

- [`UserAgentClient`](UserAgentClient.md)

  ↳ **`RegisterUserAgentClient`**

## Implements

- [`OutgoingRegisterRequest`](../interfaces/OutgoingRegisterRequest.md)

## Table of contents

### Constructors

- [constructor](RegisterUserAgentClient.md#constructor)

### Properties

- [message](RegisterUserAgentClient.md#message)
- [delegate](RegisterUserAgentClient.md#delegate)

### Methods

- [dispose](RegisterUserAgentClient.md#dispose)
- [cancel](RegisterUserAgentClient.md#cancel)

### Accessors

- [loggerFactory](RegisterUserAgentClient.md#loggerfactory)
- [transaction](RegisterUserAgentClient.md#transaction)

## Constructors

### constructor

• **new RegisterUserAgentClient**(`core`, `message`, `delegate?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `core` | [`UserAgentCore`](UserAgentCore.md) |
| `message` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) |

#### Overrides

[UserAgentClient](UserAgentClient.md).[constructor](UserAgentClient.md#constructor)

#### Defined in

sip.js/lib/core/user-agents/register-user-agent-client.d.ts:9

## Properties

### message

• **message**: [`OutgoingRequestMessage`](OutgoingRequestMessage.md)

The outgoing message.

#### Implementation of

[OutgoingRegisterRequest](../interfaces/OutgoingRegisterRequest.md).[message](../interfaces/OutgoingRegisterRequest.md#message)

#### Inherited from

[UserAgentClient](UserAgentClient.md).[message](UserAgentClient.md#message)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:26

___

### delegate

• `Optional` **delegate**: [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md)

Delegate providing custom handling of this outgoing request.

#### Implementation of

[OutgoingRegisterRequest](../interfaces/OutgoingRegisterRequest.md).[delegate](../interfaces/OutgoingRegisterRequest.md#delegate)

#### Inherited from

[UserAgentClient](UserAgentClient.md).[delegate](UserAgentClient.md#delegate)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:27

## Methods

### dispose

▸ **dispose**(): `void`

Destroy request.

#### Returns

`void`

#### Implementation of

[OutgoingRegisterRequest](../interfaces/OutgoingRegisterRequest.md).[dispose](../interfaces/OutgoingRegisterRequest.md#dispose)

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

[OutgoingRegisterRequest](../interfaces/OutgoingRegisterRequest.md).[cancel](../interfaces/OutgoingRegisterRequest.md#cancel)

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
