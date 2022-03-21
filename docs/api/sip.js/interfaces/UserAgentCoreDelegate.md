[SIP.js](../README.md) / [Exports](../modules.md) / UserAgentCoreDelegate

# Interface: UserAgentCoreDelegate

User Agent Core delegate.

## Table of contents

### Methods

- [onInvite](UserAgentCoreDelegate.md#oninvite)
- [onMessage](UserAgentCoreDelegate.md#onmessage)
- [onNotify](UserAgentCoreDelegate.md#onnotify)
- [onRefer](UserAgentCoreDelegate.md#onrefer)
- [onRegister](UserAgentCoreDelegate.md#onregister)
- [onSubscribe](UserAgentCoreDelegate.md#onsubscribe)

## Methods

### onInvite

▸ `Optional` **onInvite**(`request`): `void`

Receive INVITE request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingInviteRequest`](IncomingInviteRequest.md) | Incoming INVITE request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-delegate.d.ts:11

___

### onMessage

▸ `Optional` **onMessage**(`request`): `void`

Receive MESSAGE request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingMessageRequest`](IncomingMessageRequest.md) | Incoming MESSAGE request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-delegate.d.ts:16

___

### onNotify

▸ `Optional` **onNotify**(`request`): `void`

DEPRECATED. Receive NOTIFY request.

#### Parameters

| Name | Type |
| :------ | :------ |
| `request` | [`IncomingNotifyRequest`](IncomingNotifyRequest.md) |

#### Returns

`void`

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-delegate.d.ts:21

___

### onRefer

▸ `Optional` **onRefer**(`request`): `void`

Receive REFER request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingReferRequest`](IncomingReferRequest.md) | Incoming REFER request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-delegate.d.ts:26

___

### onRegister

▸ `Optional` **onRegister**(`request`): `void`

Receive REGISTER request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingRegisterRequest`](IncomingRegisterRequest.md) | Incoming REGISTER request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-delegate.d.ts:31

___

### onSubscribe

▸ `Optional` **onSubscribe**(`request`): `void`

Receive SUBSCRIBE request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingSubscribeRequest`](IncomingSubscribeRequest.md) | Incoming SUBSCRIBE request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-delegate.d.ts:36
