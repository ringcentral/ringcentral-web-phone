[SIP.js](../README.md) / [Exports](../modules.md) / Session

# Class: Session

A session provides real time communication between one or more participants.

**`remarks`**
The transport behaves in a deterministic manner according to the
the state defined in [SessionState](../enums/SessionState.md).

## Hierarchy

- **`Session`**

  ↳ [`Invitation`](Invitation.md)

  ↳ [`Inviter`](Inviter.md)

## Table of contents

### Properties

- [data](Session.md#data)
- [delegate](Session.md#delegate)
- [\_contact](Session.md#_contact)
- [\_referral](Session.md#_referral)
- [\_replacee](Session.md#_replacee)
- [localIdentity](Session.md#localidentity)
- [remoteIdentity](Session.md#remoteidentity)

### Methods

- [dispose](Session.md#dispose)
- [bye](Session.md#bye)
- [info](Session.md#info)
- [invite](Session.md#invite)
- [message](Session.md#message)
- [refer](Session.md#refer)
- [\_bye](Session.md#_bye)
- [\_info](Session.md#_info)
- [\_message](Session.md#_message)
- [\_refer](Session.md#_refer)

### Accessors

- [assertedIdentity](Session.md#assertedidentity)
- [dialog](Session.md#dialog)
- [id](Session.md#id)
- [replacee](Session.md#replacee)
- [sessionDescriptionHandler](Session.md#sessiondescriptionhandler)
- [sessionDescriptionHandlerFactory](Session.md#sessiondescriptionhandlerfactory)
- [sessionDescriptionHandlerModifiers](Session.md#sessiondescriptionhandlermodifiers)
- [sessionDescriptionHandlerOptions](Session.md#sessiondescriptionhandleroptions)
- [sessionDescriptionHandlerModifiersReInvite](Session.md#sessiondescriptionhandlermodifiersreinvite)
- [sessionDescriptionHandlerOptionsReInvite](Session.md#sessiondescriptionhandleroptionsreinvite)
- [state](Session.md#state)
- [stateChange](Session.md#statechange)
- [userAgent](Session.md#useragent)

## Properties

### data

• **data**: `unknown`

Property reserved for use by instance owner.

**`defaultvalue`** `undefined`

#### Defined in

sip.js/lib/api/session.d.ts:30

___

### delegate

• **delegate**: [`SessionDelegate`](../interfaces/SessionDelegate.md)

The session delegate.

**`defaultvalue`** `undefined`

#### Defined in

sip.js/lib/api/session.d.ts:35

___

### \_contact

• **\_contact**: `string`

**`internal`**

#### Defined in

sip.js/lib/api/session.d.ts:37

___

### \_referral

• **\_referral**: [`Inviter`](Inviter.md)

**`internal`**

#### Defined in

sip.js/lib/api/session.d.ts:39

___

### \_replacee

• **\_replacee**: [`Session`](Session.md)

**`internal`**

#### Defined in

sip.js/lib/api/session.d.ts:41

___

### localIdentity

• `Readonly` `Abstract` **localIdentity**: [`NameAddrHeader`](NameAddrHeader.md)

The identity of the local user.

#### Defined in

sip.js/lib/api/session.d.ts:77

___

### remoteIdentity

• `Readonly` `Abstract` **remoteIdentity**: [`NameAddrHeader`](NameAddrHeader.md)

The identity of the remote user.

#### Defined in

sip.js/lib/api/session.d.ts:81

## Methods

### dispose

▸ **dispose**(): `Promise`<`void`\>

Destructor.

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/session.d.ts:97

___

### bye

▸ **bye**(`options?`): `Promise`<[`OutgoingByeRequest`](../interfaces/OutgoingByeRequest.md)\>

End the [Session](Session.md). Sends a BYE.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`SessionByeOptions`](../interfaces/SessionByeOptions.md) | Options bucket. See [SessionByeOptions](../interfaces/SessionByeOptions.md) for details. |

#### Returns

`Promise`<[`OutgoingByeRequest`](../interfaces/OutgoingByeRequest.md)\>

#### Defined in

sip.js/lib/api/session.d.ts:186

___

### info

▸ **info**(`options?`): `Promise`<[`OutgoingInfoRequest`](../interfaces/OutgoingInfoRequest.md)\>

Share [Info](Info.md) with peer. Sends an INFO.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`SessionInfoOptions`](../interfaces/SessionInfoOptions.md) | Options bucket. See [SessionInfoOptions](../interfaces/SessionInfoOptions.md) for details. |

#### Returns

`Promise`<[`OutgoingInfoRequest`](../interfaces/OutgoingInfoRequest.md)\>

#### Defined in

sip.js/lib/api/session.d.ts:191

___

### invite

▸ **invite**(`options?`): `Promise`<[`OutgoingInviteRequest`](../interfaces/OutgoingInviteRequest.md)\>

Renegotiate the session. Sends a re-INVITE.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`SessionInviteOptions`](../interfaces/SessionInviteOptions.md) | Options bucket. See [SessionInviteOptions](../interfaces/SessionInviteOptions.md) for details. |

#### Returns

`Promise`<[`OutgoingInviteRequest`](../interfaces/OutgoingInviteRequest.md)\>

#### Defined in

sip.js/lib/api/session.d.ts:196

___

### message

▸ **message**(`options?`): `Promise`<[`OutgoingMessageRequest`](../interfaces/OutgoingMessageRequest.md)\>

Deliver a [Message](Message.md). Sends a MESSAGE.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`SessionMessageOptions`](../interfaces/SessionMessageOptions.md) | Options bucket. See [SessionMessageOptions](../interfaces/SessionMessageOptions.md) for details. |

#### Returns

`Promise`<[`OutgoingMessageRequest`](../interfaces/OutgoingMessageRequest.md)\>

#### Defined in

sip.js/lib/api/session.d.ts:201

___

### refer

▸ **refer**(`referTo`, `options?`): `Promise`<[`OutgoingReferRequest`](../interfaces/OutgoingReferRequest.md)\>

Proffer a [Referral](Referral.md). Send a REFER.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `referTo` | [`Session`](Session.md) \| [`URI`](URI.md) | The referral target. If a `Session`, a REFER w/Replaces is sent. |
| `options?` | [`SessionReferOptions`](../interfaces/SessionReferOptions.md) | Options bucket. See [SessionReferOptions](../interfaces/SessionReferOptions.md) for details. |

#### Returns

`Promise`<[`OutgoingReferRequest`](../interfaces/OutgoingReferRequest.md)\>

#### Defined in

sip.js/lib/api/session.d.ts:207

___

### \_bye

▸ **_bye**(`delegate?`, `options?`): `Promise`<[`OutgoingByeRequest`](../interfaces/OutgoingByeRequest.md)\>

Send BYE.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) | Request delegate. |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | Request options bucket. |

#### Returns

`Promise`<[`OutgoingByeRequest`](../interfaces/OutgoingByeRequest.md)\>

#### Defined in

sip.js/lib/api/session.d.ts:214

___

### \_info

▸ **_info**(`delegate?`, `options?`): `Promise`<[`OutgoingInfoRequest`](../interfaces/OutgoingInfoRequest.md)\>

Send INFO.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) | Request delegate. |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | Request options bucket. |

#### Returns

`Promise`<[`OutgoingInfoRequest`](../interfaces/OutgoingInfoRequest.md)\>

#### Defined in

sip.js/lib/api/session.d.ts:221

___

### \_message

▸ **_message**(`delegate?`, `options?`): `Promise`<[`OutgoingMessageRequest`](../interfaces/OutgoingMessageRequest.md)\>

Send MESSAGE.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) | Request delegate. |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | Request options bucket. |

#### Returns

`Promise`<[`OutgoingMessageRequest`](../interfaces/OutgoingMessageRequest.md)\>

#### Defined in

sip.js/lib/api/session.d.ts:228

___

### \_refer

▸ **_refer**(`onNotify?`, `delegate?`, `options?`): `Promise`<[`OutgoingByeRequest`](../interfaces/OutgoingByeRequest.md)\>

Send REFER.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onNotify?` | (`notification`: [`Notification`](Notification.md)) => `void` | Notification callback. |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) | Request delegate. |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | Request options bucket. |

#### Returns

`Promise`<[`OutgoingByeRequest`](../interfaces/OutgoingByeRequest.md)\>

#### Defined in

sip.js/lib/api/session.d.ts:236

## Accessors

### assertedIdentity

• `get` **assertedIdentity**(): [`NameAddrHeader`](NameAddrHeader.md)

The asserted identity of the remote user.

#### Returns

[`NameAddrHeader`](NameAddrHeader.md)

#### Defined in

sip.js/lib/api/session.d.ts:101

___

### dialog

• `get` **dialog**(): [`Session`](../interfaces/Session.md)

The confirmed session dialog.

#### Returns

[`Session`](../interfaces/Session.md)

#### Defined in

sip.js/lib/api/session.d.ts:105

___

### id

• `get` **id**(): `string`

A unique identifier for this session.

#### Returns

`string`

#### Defined in

sip.js/lib/api/session.d.ts:109

___

### replacee

• `get` **replacee**(): [`Session`](Session.md)

The session being replace by this one.

#### Returns

[`Session`](Session.md)

#### Defined in

sip.js/lib/api/session.d.ts:113

___

### sessionDescriptionHandler

• `get` **sessionDescriptionHandler**(): [`SessionDescriptionHandler`](../interfaces/SessionDescriptionHandler.md)

Session description handler.

**`remarks`**
If `this` is an instance of `Invitation`,
`sessionDescriptionHandler` will be defined when the session state changes to "established".
If `this` is an instance of `Inviter` and an offer was sent in the INVITE,
`sessionDescriptionHandler` will be defined when the session state changes to "establishing".
If `this` is an instance of `Inviter` and an offer was not sent in the INVITE,
`sessionDescriptionHandler` will be defined when the session state changes to "established".
Otherwise `undefined`.

#### Returns

[`SessionDescriptionHandler`](../interfaces/SessionDescriptionHandler.md)

#### Defined in

sip.js/lib/api/session.d.ts:125

___

### sessionDescriptionHandlerFactory

• `get` **sessionDescriptionHandlerFactory**(): [`SessionDescriptionHandlerFactory`](../interfaces/SessionDescriptionHandlerFactory.md)

Session description handler factory.

#### Returns

[`SessionDescriptionHandlerFactory`](../interfaces/SessionDescriptionHandlerFactory.md)

#### Defined in

sip.js/lib/api/session.d.ts:129

___

### sessionDescriptionHandlerModifiers

• `get` **sessionDescriptionHandlerModifiers**(): [`SessionDescriptionHandlerModifier`](../interfaces/SessionDescriptionHandlerModifier.md)[]

SDH modifiers for the initial INVITE transaction.

**`remarks`**
Used in all cases when handling the initial INVITE transaction as either UAC or UAS.
May be set directly at anytime.
May optionally be set via constructor option.
May optionally be set via options passed to Inviter.invite() or Invitation.accept().

#### Returns

[`SessionDescriptionHandlerModifier`](../interfaces/SessionDescriptionHandlerModifier.md)[]

#### Defined in

sip.js/lib/api/session.d.ts:138

• `set` **sessionDescriptionHandlerModifiers**(`modifiers`): `void`

SDH modifiers for the initial INVITE transaction.

**`remarks`**
Used in all cases when handling the initial INVITE transaction as either UAC or UAS.
May be set directly at anytime.
May optionally be set via constructor option.
May optionally be set via options passed to Inviter.invite() or Invitation.accept().

#### Parameters

| Name | Type |
| :------ | :------ |
| `modifiers` | [`SessionDescriptionHandlerModifier`](../interfaces/SessionDescriptionHandlerModifier.md)[] |

#### Returns

`void`

#### Defined in

sip.js/lib/api/session.d.ts:139

___

### sessionDescriptionHandlerOptions

• `get` **sessionDescriptionHandlerOptions**(): [`SessionDescriptionHandlerOptions`](../interfaces/SessionDescriptionHandlerOptions.md)

SDH options for the initial INVITE transaction.

**`remarks`**
Used in all cases when handling the initial INVITE transaction as either UAC or UAS.
May be set directly at anytime.
May optionally be set via constructor option.
May optionally be set via options passed to Inviter.invite() or Invitation.accept().

#### Returns

[`SessionDescriptionHandlerOptions`](../interfaces/SessionDescriptionHandlerOptions.md)

#### Defined in

sip.js/lib/api/session.d.ts:148

• `set` **sessionDescriptionHandlerOptions**(`options`): `void`

SDH options for the initial INVITE transaction.

**`remarks`**
Used in all cases when handling the initial INVITE transaction as either UAC or UAS.
May be set directly at anytime.
May optionally be set via constructor option.
May optionally be set via options passed to Inviter.invite() or Invitation.accept().

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`SessionDescriptionHandlerOptions`](../interfaces/SessionDescriptionHandlerOptions.md) |

#### Returns

`void`

#### Defined in

sip.js/lib/api/session.d.ts:149

___

### sessionDescriptionHandlerModifiersReInvite

• `get` **sessionDescriptionHandlerModifiersReInvite**(): [`SessionDescriptionHandlerModifier`](../interfaces/SessionDescriptionHandlerModifier.md)[]

SDH modifiers for re-INVITE transactions.

**`remarks`**
Used in all cases when handling a re-INVITE transaction as either UAC or UAS.
May be set directly at anytime.
May optionally be set via constructor option.
May optionally be set via options passed to Session.invite().

#### Returns

[`SessionDescriptionHandlerModifier`](../interfaces/SessionDescriptionHandlerModifier.md)[]

#### Defined in

sip.js/lib/api/session.d.ts:158

• `set` **sessionDescriptionHandlerModifiersReInvite**(`modifiers`): `void`

SDH modifiers for re-INVITE transactions.

**`remarks`**
Used in all cases when handling a re-INVITE transaction as either UAC or UAS.
May be set directly at anytime.
May optionally be set via constructor option.
May optionally be set via options passed to Session.invite().

#### Parameters

| Name | Type |
| :------ | :------ |
| `modifiers` | [`SessionDescriptionHandlerModifier`](../interfaces/SessionDescriptionHandlerModifier.md)[] |

#### Returns

`void`

#### Defined in

sip.js/lib/api/session.d.ts:159

___

### sessionDescriptionHandlerOptionsReInvite

• `get` **sessionDescriptionHandlerOptionsReInvite**(): [`SessionDescriptionHandlerOptions`](../interfaces/SessionDescriptionHandlerOptions.md)

SDH options for re-INVITE transactions.

**`remarks`**
Used in all cases when handling a re-INVITE transaction as either UAC or UAS.
May be set directly at anytime.
May optionally be set via constructor option.
May optionally be set via options passed to Session.invite().

#### Returns

[`SessionDescriptionHandlerOptions`](../interfaces/SessionDescriptionHandlerOptions.md)

#### Defined in

sip.js/lib/api/session.d.ts:168

• `set` **sessionDescriptionHandlerOptionsReInvite**(`options`): `void`

SDH options for re-INVITE transactions.

**`remarks`**
Used in all cases when handling a re-INVITE transaction as either UAC or UAS.
May be set directly at anytime.
May optionally be set via constructor option.
May optionally be set via options passed to Session.invite().

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`SessionDescriptionHandlerOptions`](../interfaces/SessionDescriptionHandlerOptions.md) |

#### Returns

`void`

#### Defined in

sip.js/lib/api/session.d.ts:169

___

### state

• `get` **state**(): [`SessionState`](../enums/SessionState.md)

Session state.

#### Returns

[`SessionState`](../enums/SessionState.md)

#### Defined in

sip.js/lib/api/session.d.ts:173

___

### stateChange

• `get` **stateChange**(): [`Emitter`](../interfaces/Emitter.md)<[`SessionState`](../enums/SessionState.md)\>

Session state change emitter.

#### Returns

[`Emitter`](../interfaces/Emitter.md)<[`SessionState`](../enums/SessionState.md)\>

#### Defined in

sip.js/lib/api/session.d.ts:177

___

### userAgent

• `get` **userAgent**(): [`UserAgent`](UserAgent.md)

The user agent.

#### Returns

[`UserAgent`](UserAgent.md)

#### Defined in

sip.js/lib/api/session.d.ts:181
