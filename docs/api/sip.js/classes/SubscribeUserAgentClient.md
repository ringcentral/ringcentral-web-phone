[SIP.js](../README.md) / [Exports](../modules.md) / SubscribeUserAgentClient

# Class: SubscribeUserAgentClient

SUBSCRIBE UAC.

**`remarks`**
4.1.  Subscriber Behavior
https://tools.ietf.org/html/rfc6665#section-4.1

User agent client for installation of a single subscription per SUBSCRIBE request.
TODO: Support for installation of multiple subscriptions on forked SUBSCRIBE requests.

## Hierarchy

- [`UserAgentClient`](UserAgentClient.md)

  ↳ **`SubscribeUserAgentClient`**

## Implements

- [`OutgoingSubscribeRequest`](../interfaces/OutgoingSubscribeRequest.md)

## Table of contents

### Constructors

- [constructor](SubscribeUserAgentClient.md#constructor)

### Properties

- [delegate](SubscribeUserAgentClient.md#delegate)
- [message](SubscribeUserAgentClient.md#message)

### Methods

- [dispose](SubscribeUserAgentClient.md#dispose)
- [onNotify](SubscribeUserAgentClient.md#onnotify)
- [waitNotifyStart](SubscribeUserAgentClient.md#waitnotifystart)
- [waitNotifyStop](SubscribeUserAgentClient.md#waitnotifystop)
- [cancel](SubscribeUserAgentClient.md#cancel)

### Accessors

- [loggerFactory](SubscribeUserAgentClient.md#loggerfactory)
- [transaction](SubscribeUserAgentClient.md#transaction)

## Constructors

### constructor

• **new SubscribeUserAgentClient**(`core`, `message`, `delegate?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `core` | [`UserAgentCore`](UserAgentCore.md) |
| `message` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) |
| `delegate?` | [`OutgoingSubscribeRequestDelegate`](../interfaces/OutgoingSubscribeRequestDelegate.md) |

#### Overrides

[UserAgentClient](UserAgentClient.md).[constructor](UserAgentClient.md#constructor)

#### Defined in

sip.js/lib/core/user-agents/subscribe-user-agent-client.d.ts:31

## Properties

### delegate

• **delegate**: [`OutgoingSubscribeRequestDelegate`](../interfaces/OutgoingSubscribeRequestDelegate.md)

Delegate providing custom handling of this outgoing SUBSCRIBE request.

#### Implementation of

[OutgoingSubscribeRequest](../interfaces/OutgoingSubscribeRequest.md).[delegate](../interfaces/OutgoingSubscribeRequest.md#delegate)

#### Overrides

[UserAgentClient](UserAgentClient.md).[delegate](UserAgentClient.md#delegate)

#### Defined in

sip.js/lib/core/user-agents/subscribe-user-agent-client.d.ts:16

___

### message

• **message**: [`OutgoingRequestMessage`](OutgoingRequestMessage.md)

The outgoing message.

#### Implementation of

[OutgoingSubscribeRequest](../interfaces/OutgoingSubscribeRequest.md).[message](../interfaces/OutgoingSubscribeRequest.md#message)

#### Inherited from

[UserAgentClient](UserAgentClient.md).[message](UserAgentClient.md#message)

#### Defined in

sip.js/lib/core/user-agents/user-agent-client.d.ts:26

## Methods

### dispose

▸ **dispose**(): `void`

Destructor.
Note that Timer N may live on waiting for an initial NOTIFY and
the delegate may still receive that NOTIFY. If you don't want
that behavior then either clear the delegate so the delegate
doesn't get called (a 200 will be sent in response to the NOTIFY)
or call `waitNotifyStop` which will clear Timer N and remove this
UAC from the core (a 481 will be sent in response to the NOTIFY).

#### Returns

`void`

#### Implementation of

[OutgoingSubscribeRequest](../interfaces/OutgoingSubscribeRequest.md).[dispose](../interfaces/OutgoingSubscribeRequest.md#dispose)

#### Overrides

[UserAgentClient](UserAgentClient.md).[dispose](UserAgentClient.md#dispose)

#### Defined in

sip.js/lib/core/user-agents/subscribe-user-agent-client.d.ts:41

___

### onNotify

▸ **onNotify**(`uas`): `void`

Handle out of dialog NOTIFY associated with SUBSCRIBE request.
This is the first NOTIFY received after the SUBSCRIBE request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uas` | [`NotifyUserAgentServer`](NotifyUserAgentServer.md) | User agent server handling the subscription creating NOTIFY. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/user-agents/subscribe-user-agent-client.d.ts:47

___

### waitNotifyStart

▸ **waitNotifyStart**(): `void`

#### Returns

`void`

#### Defined in

sip.js/lib/core/user-agents/subscribe-user-agent-client.d.ts:48

___

### waitNotifyStop

▸ **waitNotifyStop**(): `void`

Stop waiting for an inital subscription creating NOTIFY.

#### Returns

`void`

#### Implementation of

[OutgoingSubscribeRequest](../interfaces/OutgoingSubscribeRequest.md).[waitNotifyStop](../interfaces/OutgoingSubscribeRequest.md#waitnotifystop)

#### Defined in

sip.js/lib/core/user-agents/subscribe-user-agent-client.d.ts:49

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
