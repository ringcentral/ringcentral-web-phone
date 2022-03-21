[SIP.js](../README.md) / [Exports](../modules.md) / ReSubscribeUserAgentClient

# Class: ReSubscribeUserAgentClient

Re-SUBSCRIBE UAC.

## Hierarchy

- [`UserAgentClient`](UserAgentClient.md)

  ↳ **`ReSubscribeUserAgentClient`**

## Implements

- [`OutgoingSubscribeRequest`](../interfaces/OutgoingSubscribeRequest.md)

## Table of contents

### Constructors

- [constructor](ReSubscribeUserAgentClient.md#constructor)

### Methods

- [waitNotifyStop](ReSubscribeUserAgentClient.md#waitnotifystop)
- [dispose](ReSubscribeUserAgentClient.md#dispose)
- [cancel](ReSubscribeUserAgentClient.md#cancel)

### Properties

- [message](ReSubscribeUserAgentClient.md#message)
- [delegate](ReSubscribeUserAgentClient.md#delegate)

### Accessors

- [loggerFactory](ReSubscribeUserAgentClient.md#loggerfactory)
- [transaction](ReSubscribeUserAgentClient.md#transaction)

## Constructors

### constructor

• **new ReSubscribeUserAgentClient**(`dialog`, `delegate?`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dialog` | [`SubscriptionDialog`](SubscriptionDialog.md) |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) |

#### Overrides

[UserAgentClient](UserAgentClient.md).[constructor](UserAgentClient.md#constructor)

#### Defined in

sip.js/lib/core/user-agents/re-subscribe-user-agent-client.d.ts:10

## Methods

### waitNotifyStop

▸ **waitNotifyStop**(): `void`

Stop waiting for an inital subscription creating NOTIFY.

#### Returns

`void`

#### Implementation of

[OutgoingSubscribeRequest](../interfaces/OutgoingSubscribeRequest.md).[waitNotifyStop](../interfaces/OutgoingSubscribeRequest.md#waitnotifystop)

#### Defined in

sip.js/lib/core/user-agents/re-subscribe-user-agent-client.d.ts:11

___

### dispose

▸ **dispose**(): `void`

Destroy request.

#### Returns

`void`

#### Implementation of

[OutgoingSubscribeRequest](../interfaces/OutgoingSubscribeRequest.md).[dispose](../interfaces/OutgoingSubscribeRequest.md#dispose)

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

[OutgoingSubscribeRequest](../interfaces/OutgoingSubscribeRequest.md).[cancel](../interfaces/OutgoingSubscribeRequest.md#cancel)

#### Inherited from

[UserAgentClient](UserAgentClient.md).[cancel](UserAgentClient.md#cancel)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:45

## Properties

### message

• **message**: [`OutgoingRequestMessage`](OutgoingRequestMessage.md)

The outgoing message.

#### Implementation of

[OutgoingSubscribeRequest](../interfaces/OutgoingSubscribeRequest.md).[message](../interfaces/OutgoingSubscribeRequest.md#message)

#### Inherited from

[UserAgentClient](UserAgentClient.md).[message](UserAgentClient.md#message)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:26

___

### delegate

• `Optional` **delegate**: [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md)

Delegate providing custom handling of this outgoing SUBSCRIBE request.

#### Implementation of

[OutgoingSubscribeRequest](../interfaces/OutgoingSubscribeRequest.md).[delegate](../interfaces/OutgoingSubscribeRequest.md#delegate)

#### Inherited from

[UserAgentClient](UserAgentClient.md).[delegate](UserAgentClient.md#delegate)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:27

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
