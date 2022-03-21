[SIP.js](../README.md) / [Exports](../modules.md) / UserAgentDelegate

# Interface: UserAgentDelegate

Delegate for [UserAgent](../classes/UserAgent.md).

## Table of contents

### Methods

- [onConnect](UserAgentDelegate.md#onconnect)
- [onDisconnect](UserAgentDelegate.md#ondisconnect)
- [onInvite](UserAgentDelegate.md#oninvite)
- [onMessage](UserAgentDelegate.md#onmessage)
- [onNotify](UserAgentDelegate.md#onnotify)
- [onRefer](UserAgentDelegate.md#onrefer)
- [onRegister](UserAgentDelegate.md#onregister)
- [onSubscribe](UserAgentDelegate.md#onsubscribe)
- [onReferRequest](UserAgentDelegate.md#onreferrequest)
- [onRegisterRequest](UserAgentDelegate.md#onregisterrequest)
- [onSubscribeRequest](UserAgentDelegate.md#onsubscriberequest)

## Methods

### onConnect

▸ `Optional` **onConnect**(): `void`

Called upon transport transitioning to connected state.

#### Returns

`void`

#### Defined in

sip.js/lib/api/user-agent-delegate.d.ts:15

___

### onDisconnect

▸ `Optional` **onDisconnect**(`error?`): `void`

Called upon transport transitioning from connected state.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error?` | `Error` | An error if disconnect triggered by transport. Otherwise undefined. |

#### Returns

`void`

#### Defined in

sip.js/lib/api/user-agent-delegate.d.ts:20

___

### onInvite

▸ `Optional` **onInvite**(`invitation`): `void`

Called upon receipt of an invitation.

**`remarks`**
Handler for incoming out of dialog INVITE requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `invitation` | [`Invitation`](../classes/Invitation.md) | The invitation. |

#### Returns

`void`

#### Defined in

sip.js/lib/api/user-agent-delegate.d.ts:27

___

### onMessage

▸ `Optional` **onMessage**(`message`): `void`

Called upon receipt of a message.

**`remarks`**
Handler for incoming out of dialog MESSAGE requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`Message`](../classes/Message.md) | The message. |

#### Returns

`void`

#### Defined in

sip.js/lib/api/user-agent-delegate.d.ts:34

___

### onNotify

▸ `Optional` **onNotify**(`notification`): `void`

Called upon receipt of a notification.

**`remarks`**
Handler for incoming out of dialog NOTIFY requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `notification` | [`Notification`](../classes/Notification.md) | The notification. |

#### Returns

`void`

#### Defined in

sip.js/lib/api/user-agent-delegate.d.ts:41

___

### onRefer

▸ `Optional` **onRefer**(`referral`): `void`

**`alpha`**
Called upon receipt of a referral.

**`remarks`**
Handler for incoming out of dialog REFER requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `referral` | [`Referral`](../classes/Referral.md) | The referral. |

#### Returns

`void`

#### Defined in

sip.js/lib/api/user-agent-delegate.d.ts:49

___

### onRegister

▸ `Optional` **onRegister**(`registration`): `void`

**`alpha`**
Called upon receipt of a registration.

**`remarks`**
Handler for incoming out of dialog REGISTER requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `registration` | `unknown` | The registration. |

#### Returns

`void`

#### Defined in

sip.js/lib/api/user-agent-delegate.d.ts:57

___

### onSubscribe

▸ `Optional` **onSubscribe**(`subscription`): `void`

**`alpha`**
Called upon receipt of a subscription.

**`remarks`**
Handler for incoming out of dialog SUBSCRIBE requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `subscription` | [`Subscription`](../classes/Subscription.md) | The subscription. |

#### Returns

`void`

#### Defined in

sip.js/lib/api/user-agent-delegate.d.ts:65

___

### onReferRequest

▸ `Optional` **onReferRequest**(`request`): `void`

**`internal`**
Called upon receipt of an out of dialog REFER. Used by test suite.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingReferRequest`](IncomingReferRequest.md) | The request. |

#### Returns

`void`

#### Defined in

sip.js/lib/api/user-agent-delegate.d.ts:71

___

### onRegisterRequest

▸ `Optional` **onRegisterRequest**(`request`): `void`

**`internal`**
Called upon receipt of a REGISTER request. Used by test suite.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingRegisterRequest`](IncomingRegisterRequest.md) | The request. |

#### Returns

`void`

#### Defined in

sip.js/lib/api/user-agent-delegate.d.ts:77

___

### onSubscribeRequest

▸ `Optional` **onSubscribeRequest**(`request`): `void`

**`internal`**
Called upon receipt of an out of dialog SUBSCRIBE request. Used by test suite.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingSubscribeRequest`](IncomingSubscribeRequest.md) | The request. |

#### Returns

`void`

#### Defined in

sip.js/lib/api/user-agent-delegate.d.ts:83
