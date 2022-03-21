[SIP.js](../README.md) / [Exports](../modules.md) / Invitation

# Class: Invitation

An invitation is an offer to establish a [Session](Session.md) (incoming INVITE).

## Hierarchy

- [`Session`](Session.md)

  ↳ **`Invitation`**

## Table of contents

### Constructors

- [constructor](Invitation.md#constructor)

### Methods

- [dispose](Invitation.md#dispose)
- [accept](Invitation.md#accept)
- [progress](Invitation.md#progress)
- [reject](Invitation.md#reject)
- [\_onCancel](Invitation.md#_oncancel)
- [bye](Invitation.md#bye)
- [info](Invitation.md#info)
- [invite](Invitation.md#invite)
- [message](Invitation.md#message)
- [refer](Invitation.md#refer)
- [\_bye](Invitation.md#_bye)
- [\_info](Invitation.md#_info)
- [\_message](Invitation.md#_message)
- [\_refer](Invitation.md#_refer)

### Accessors

- [autoSendAnInitialProvisionalResponse](Invitation.md#autosendaninitialprovisionalresponse)
- [body](Invitation.md#body)
- [localIdentity](Invitation.md#localidentity)
- [remoteIdentity](Invitation.md#remoteidentity)
- [request](Invitation.md#request)
- [assertedIdentity](Invitation.md#assertedidentity)
- [dialog](Invitation.md#dialog)
- [id](Invitation.md#id)
- [replacee](Invitation.md#replacee)
- [sessionDescriptionHandler](Invitation.md#sessiondescriptionhandler)
- [sessionDescriptionHandlerFactory](Invitation.md#sessiondescriptionhandlerfactory)
- [sessionDescriptionHandlerModifiers](Invitation.md#sessiondescriptionhandlermodifiers)
- [sessionDescriptionHandlerOptions](Invitation.md#sessiondescriptionhandleroptions)
- [sessionDescriptionHandlerModifiersReInvite](Invitation.md#sessiondescriptionhandlermodifiersreinvite)
- [sessionDescriptionHandlerOptionsReInvite](Invitation.md#sessiondescriptionhandleroptionsreinvite)
- [state](Invitation.md#state)
- [stateChange](Invitation.md#statechange)
- [userAgent](Invitation.md#useragent)

### Properties

- [data](Invitation.md#data)
- [delegate](Invitation.md#delegate)
- [\_contact](Invitation.md#_contact)
- [\_referral](Invitation.md#_referral)
- [\_replacee](Invitation.md#_replacee)

## Constructors

### constructor

• **new Invitation**(`userAgent`, `incomingInviteRequest`)

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `userAgent` | [`UserAgent`](UserAgent.md) |
| `incomingInviteRequest` | [`IncomingInviteRequest`](../interfaces/IncomingInviteRequest.md) |

#### Overrides

Session.constructor

#### Defined in

sip.js/lib/api/invitation.d.ts:40

## Methods

### dispose

▸ **dispose**(): `Promise`<`void`\>

Destructor.

#### Returns

`Promise`<`void`\>

#### Overrides

[Session](Session.md).[dispose](Session.md#dispose)

#### Defined in

sip.js/lib/api/invitation.d.ts:44

___

### accept

▸ **accept**(`options?`): `Promise`<`void`\>

Accept the invitation.

**`remarks`**
Accept the incoming INVITE request to start a Session.
Replies to the INVITE request with a 200 Ok response.
Resolves once the response sent, otherwise rejects.

This method may reject for a variety of reasons including
the receipt of a CANCEL request before `accept` is able
to construct a response.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`InvitationAcceptOptions`](../interfaces/InvitationAcceptOptions.md) | Options bucket. |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/invitation.d.ts:83

___

### progress

▸ **progress**(`options?`): `Promise`<`void`\>

Indicate progress processing the invitation.

**`remarks`**
Report progress to the the caller.
Replies to the INVITE request with a 1xx provisional response.
Resolves once the response sent, otherwise rejects.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`InvitationProgressOptions`](../interfaces/InvitationProgressOptions.md) | Options bucket. |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/invitation.d.ts:93

___

### reject

▸ **reject**(`options?`): `Promise`<`void`\>

Reject the invitation.

**`remarks`**
Replies to the INVITE request with a 4xx, 5xx, or 6xx final response.
Resolves once the response sent, otherwise rejects.

The expectation is that this method is used to reject an INVITE request.
That is indeed the case - a call to `progress` followed by `reject` is
a typical way to "decline" an incoming INVITE request. However it may
also be called after calling `accept` (but only before it completes)
which will reject the call and cause `accept` to reject.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`InvitationRejectOptions`](../interfaces/InvitationRejectOptions.md) | Options bucket. |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/invitation.d.ts:108

___

### \_onCancel

▸ **_onCancel**(`message`): `void`

Handle CANCEL request.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`IncomingRequestMessage`](IncomingRequestMessage.md) | CANCEL message. |

#### Returns

`void`

#### Defined in

sip.js/lib/api/invitation.d.ts:115

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

#### Inherited from

[Session](Session.md).[bye](Session.md#bye)

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

#### Inherited from

[Session](Session.md).[info](Session.md#info)

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

#### Inherited from

[Session](Session.md).[invite](Session.md#invite)

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

#### Inherited from

[Session](Session.md).[message](Session.md#message)

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

#### Inherited from

[Session](Session.md).[refer](Session.md#refer)

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

#### Inherited from

[Session](Session.md).[_bye](Session.md#_bye)

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

#### Inherited from

[Session](Session.md).[_info](Session.md#_info)

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

#### Inherited from

[Session](Session.md).[_message](Session.md#_message)

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

#### Inherited from

[Session](Session.md).[_refer](Session.md#_refer)

#### Defined in

sip.js/lib/api/session.d.ts:236

## Accessors

### autoSendAnInitialProvisionalResponse

• `get` **autoSendAnInitialProvisionalResponse**(): `boolean`

If true, a first provisional response after the 100 Trying
will be sent automatically. This is false it the UAC required
reliable provisional responses (100rel in Require header) or
the user agent configuration has specified to not send an
initial response, otherwise it is true. The provisional is sent by
calling `progress()` without any options.

#### Returns

`boolean`

#### Defined in

sip.js/lib/api/invitation.d.ts:53

___

### body

• `get` **body**(): `string`

Initial incoming INVITE request message body.

#### Returns

`string`

#### Defined in

sip.js/lib/api/invitation.d.ts:57

___

### localIdentity

• `get` **localIdentity**(): [`NameAddrHeader`](NameAddrHeader.md)

The identity of the local user.

#### Returns

[`NameAddrHeader`](NameAddrHeader.md)

#### Overrides

Session.localIdentity

#### Defined in

sip.js/lib/api/invitation.d.ts:61

___

### remoteIdentity

• `get` **remoteIdentity**(): [`NameAddrHeader`](NameAddrHeader.md)

The identity of the remote user.

#### Returns

[`NameAddrHeader`](NameAddrHeader.md)

#### Overrides

Session.remoteIdentity

#### Defined in

sip.js/lib/api/invitation.d.ts:65

___

### request

• `get` **request**(): [`IncomingRequestMessage`](IncomingRequestMessage.md)

Initial incoming INVITE request message.

#### Returns

[`IncomingRequestMessage`](IncomingRequestMessage.md)

#### Defined in

sip.js/lib/api/invitation.d.ts:69

___

### assertedIdentity

• `get` **assertedIdentity**(): [`NameAddrHeader`](NameAddrHeader.md)

The asserted identity of the remote user.

#### Returns

[`NameAddrHeader`](NameAddrHeader.md)

#### Inherited from

Session.assertedIdentity

#### Defined in

sip.js/lib/api/session.d.ts:101

___

### dialog

• `get` **dialog**(): [`Session`](../interfaces/Session.md)

The confirmed session dialog.

#### Returns

[`Session`](../interfaces/Session.md)

#### Inherited from

Session.dialog

#### Defined in

sip.js/lib/api/session.d.ts:105

___

### id

• `get` **id**(): `string`

A unique identifier for this session.

#### Returns

`string`

#### Inherited from

Session.id

#### Defined in

sip.js/lib/api/session.d.ts:109

___

### replacee

• `get` **replacee**(): [`Session`](Session.md)

The session being replace by this one.

#### Returns

[`Session`](Session.md)

#### Inherited from

Session.replacee

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

#### Inherited from

Session.sessionDescriptionHandler

#### Defined in

sip.js/lib/api/session.d.ts:125

___

### sessionDescriptionHandlerFactory

• `get` **sessionDescriptionHandlerFactory**(): [`SessionDescriptionHandlerFactory`](../interfaces/SessionDescriptionHandlerFactory.md)

Session description handler factory.

#### Returns

[`SessionDescriptionHandlerFactory`](../interfaces/SessionDescriptionHandlerFactory.md)

#### Inherited from

Session.sessionDescriptionHandlerFactory

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

#### Inherited from

Session.sessionDescriptionHandlerModifiers

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

#### Inherited from

Session.sessionDescriptionHandlerModifiers

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

#### Inherited from

Session.sessionDescriptionHandlerOptions

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

#### Inherited from

Session.sessionDescriptionHandlerOptions

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

#### Inherited from

Session.sessionDescriptionHandlerModifiersReInvite

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

#### Inherited from

Session.sessionDescriptionHandlerModifiersReInvite

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

#### Inherited from

Session.sessionDescriptionHandlerOptionsReInvite

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

#### Inherited from

Session.sessionDescriptionHandlerOptionsReInvite

#### Defined in

sip.js/lib/api/session.d.ts:169

___

### state

• `get` **state**(): [`SessionState`](../enums/SessionState.md)

Session state.

#### Returns

[`SessionState`](../enums/SessionState.md)

#### Inherited from

Session.state

#### Defined in

sip.js/lib/api/session.d.ts:173

___

### stateChange

• `get` **stateChange**(): [`Emitter`](../interfaces/Emitter.md)<[`SessionState`](../enums/SessionState.md)\>

Session state change emitter.

#### Returns

[`Emitter`](../interfaces/Emitter.md)<[`SessionState`](../enums/SessionState.md)\>

#### Inherited from

Session.stateChange

#### Defined in

sip.js/lib/api/session.d.ts:177

___

### userAgent

• `get` **userAgent**(): [`UserAgent`](UserAgent.md)

The user agent.

#### Returns

[`UserAgent`](UserAgent.md)

#### Inherited from

Session.userAgent

#### Defined in

sip.js/lib/api/session.d.ts:181

## Properties

### data

• **data**: `unknown`

Property reserved for use by instance owner.

**`defaultvalue`** `undefined`

#### Inherited from

[Session](Session.md).[data](Session.md#data)

#### Defined in

sip.js/lib/api/session.d.ts:30

___

### delegate

• **delegate**: [`SessionDelegate`](../interfaces/SessionDelegate.md)

The session delegate.

**`defaultvalue`** `undefined`

#### Inherited from

[Session](Session.md).[delegate](Session.md#delegate)

#### Defined in

sip.js/lib/api/session.d.ts:35

___

### \_contact

• **\_contact**: `string`

**`internal`**

#### Inherited from

[Session](Session.md).[_contact](Session.md#_contact)

#### Defined in

sip.js/lib/api/session.d.ts:37

___

### \_referral

• **\_referral**: [`Inviter`](Inviter.md)

**`internal`**

#### Inherited from

[Session](Session.md).[_referral](Session.md#_referral)

#### Defined in

sip.js/lib/api/session.d.ts:39

___

### \_replacee

• **\_replacee**: [`Session`](Session.md)

**`internal`**

#### Inherited from

[Session](Session.md).[_replacee](Session.md#_replacee)

#### Defined in

sip.js/lib/api/session.d.ts:41
