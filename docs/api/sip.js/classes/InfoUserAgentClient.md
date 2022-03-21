[SIP.js](../README.md) / [Exports](../modules.md) / InfoUserAgentClient

# Class: InfoUserAgentClient

INFO UAC.

## Hierarchy

- [`UserAgentClient`](UserAgentClient.md)

  ↳ **`InfoUserAgentClient`**

## Implements

- [`OutgoingInfoRequest`](../interfaces/OutgoingInfoRequest.md)

## Table of contents

### Constructors

- [constructor](InfoUserAgentClient.md#constructor)

### Properties

- [message](InfoUserAgentClient.md#message)
- [delegate](InfoUserAgentClient.md#delegate)

### Methods

- [dispose](InfoUserAgentClient.md#dispose)
- [cancel](InfoUserAgentClient.md#cancel)

### Accessors

- [loggerFactory](InfoUserAgentClient.md#loggerfactory)
- [transaction](InfoUserAgentClient.md#transaction)

## Constructors

### constructor

• **new InfoUserAgentClient**(`dialog`, `delegate?`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dialog` | [`SessionDialog`](SessionDialog.md) |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) |

#### Overrides

[UserAgentClient](UserAgentClient.md).[constructor](UserAgentClient.md#constructor)

#### Defined in

sip.js/lib/core/user-agents/info-user-agent-client.d.ts:9

## Properties

### message

• **message**: [`OutgoingRequestMessage`](OutgoingRequestMessage.md)

The outgoing message.

#### Implementation of

[OutgoingInfoRequest](../interfaces/OutgoingInfoRequest.md).[message](../interfaces/OutgoingInfoRequest.md#message)

#### Inherited from

[UserAgentClient](UserAgentClient.md).[message](UserAgentClient.md#message)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:26

___

### delegate

• `Optional` **delegate**: [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md)

Delegate providing custom handling of this outgoing request.

#### Implementation of

[OutgoingInfoRequest](../interfaces/OutgoingInfoRequest.md).[delegate](../interfaces/OutgoingInfoRequest.md#delegate)

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

[OutgoingInfoRequest](../interfaces/OutgoingInfoRequest.md).[dispose](../interfaces/OutgoingInfoRequest.md#dispose)

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

[OutgoingInfoRequest](../interfaces/OutgoingInfoRequest.md).[cancel](../interfaces/OutgoingInfoRequest.md#cancel)

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
