[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / WebPhoneInvitation

# Interface: WebPhoneInvitation

This is an extension of the Invitation class of SIP.js

[Reference](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.invitation.md)

## Hierarchy

- `Invitation`

- [`CommonSession`](../classes/CommonSession.md)

  ↳ **`WebPhoneInvitation`**

## Table of contents

### Methods

- [dispose](WebPhoneInvitation.md#dispose)
- [progress](WebPhoneInvitation.md#progress)
- [reject](WebPhoneInvitation.md#reject)
- [\_onCancel](WebPhoneInvitation.md#_oncancel)
- [bye](WebPhoneInvitation.md#bye)
- [info](WebPhoneInvitation.md#info)
- [invite](WebPhoneInvitation.md#invite)
- [message](WebPhoneInvitation.md#message)
- [refer](WebPhoneInvitation.md#refer)
- [\_bye](WebPhoneInvitation.md#_bye)
- [\_info](WebPhoneInvitation.md#_info)
- [\_message](WebPhoneInvitation.md#_message)
- [\_refer](WebPhoneInvitation.md#_refer)

### Accessors

- [autoSendAnInitialProvisionalResponse](WebPhoneInvitation.md#autosendaninitialprovisionalresponse)
- [body](WebPhoneInvitation.md#body)
- [localIdentity](WebPhoneInvitation.md#localidentity)
- [remoteIdentity](WebPhoneInvitation.md#remoteidentity)
- [request](WebPhoneInvitation.md#request)
- [assertedIdentity](WebPhoneInvitation.md#assertedidentity)
- [dialog](WebPhoneInvitation.md#dialog)
- [id](WebPhoneInvitation.md#id)
- [replacee](WebPhoneInvitation.md#replacee)
- [sessionDescriptionHandler](WebPhoneInvitation.md#sessiondescriptionhandler)
- [sessionDescriptionHandlerFactory](WebPhoneInvitation.md#sessiondescriptionhandlerfactory)
- [sessionDescriptionHandlerModifiers](WebPhoneInvitation.md#sessiondescriptionhandlermodifiers)
- [sessionDescriptionHandlerOptions](WebPhoneInvitation.md#sessiondescriptionhandleroptions)
- [sessionDescriptionHandlerModifiersReInvite](WebPhoneInvitation.md#sessiondescriptionhandlermodifiersreinvite)
- [sessionDescriptionHandlerOptionsReInvite](WebPhoneInvitation.md#sessiondescriptionhandleroptionsreinvite)
- [state](WebPhoneInvitation.md#state)
- [stateChange](WebPhoneInvitation.md#statechange)

### Properties

- [data](WebPhoneInvitation.md#data)
- [delegate](WebPhoneInvitation.md#delegate)
- [\_contact](WebPhoneInvitation.md#_contact)
- [\_referral](WebPhoneInvitation.md#_referral)
- [\_replacee](WebPhoneInvitation.md#_replacee)
- [held](WebPhoneInvitation.md#held)
- [media](WebPhoneInvitation.md#media)
- [mediaStatsStarted](WebPhoneInvitation.md#mediastatsstarted)
- [mediaStreams](WebPhoneInvitation.md#mediastreams)
- [muted](WebPhoneInvitation.md#muted)
- [noAudioReportCount](WebPhoneInvitation.md#noaudioreportcount)
- [rcHeaders](WebPhoneInvitation.md#rcheaders)
- [reinviteForNoAudioSent](WebPhoneInvitation.md#reinvitefornoaudiosent)
- [addListener](WebPhoneInvitation.md#addlistener)
- [addTrack](WebPhoneInvitation.md#addtrack)
- [barge](WebPhoneInvitation.md#barge)
- [blindTransfer](WebPhoneInvitation.md#blindtransfer)
- [canUseRCMCallControl](WebPhoneInvitation.md#canusercmcallcontrol)
- [createSessionMessage](WebPhoneInvitation.md#createsessionmessage)
- [dtmf](WebPhoneInvitation.md#dtmf)
- [emit](WebPhoneInvitation.md#emit)
- [flip](WebPhoneInvitation.md#flip)
- [forward](WebPhoneInvitation.md#forward)
- [hold](WebPhoneInvitation.md#hold)
- [ignore](WebPhoneInvitation.md#ignore)
- [mute](WebPhoneInvitation.md#mute)
- [off](WebPhoneInvitation.md#off)
- [on](WebPhoneInvitation.md#on)
- [park](WebPhoneInvitation.md#park)
- [reinvite](WebPhoneInvitation.md#reinvite)
- [removeListener](WebPhoneInvitation.md#removelistener)
- [replyWithMessage](WebPhoneInvitation.md#replywithmessage)
- [sendInfoAndRecieveResponse](WebPhoneInvitation.md#sendinfoandrecieveresponse)
- [sendMoveResponse](WebPhoneInvitation.md#sendmoveresponse)
- [sendReceiveConfirm](WebPhoneInvitation.md#sendreceiveconfirm)
- [sendSessionMessage](WebPhoneInvitation.md#sendsessionmessage)
- [startRecord](WebPhoneInvitation.md#startrecord)
- [stopMediaStats](WebPhoneInvitation.md#stopmediastats)
- [stopRecord](WebPhoneInvitation.md#stoprecord)
- [toVoicemail](WebPhoneInvitation.md#tovoicemail)
- [transfer](WebPhoneInvitation.md#transfer)
- [unhold](WebPhoneInvitation.md#unhold)
- [unmute](WebPhoneInvitation.md#unmute)
- [warmTransfer](WebPhoneInvitation.md#warmtransfer)
- [whisper](WebPhoneInvitation.md#whisper)
- [accept](WebPhoneInvitation.md#accept)
- [userAgent](WebPhoneInvitation.md#useragent)

## Methods

### dispose

▸ **dispose**(): `Promise`<`void`\>

Destructor.

#### Returns

`Promise`<`void`\>

#### Inherited from

Invitation.dispose

#### Defined in

node_modules/sip.js/lib/api/invitation.d.ts:44

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
| `options?` | `InvitationProgressOptions` | Options bucket. |

#### Returns

`Promise`<`void`\>

#### Inherited from

Invitation.progress

#### Defined in

node_modules/sip.js/lib/api/invitation.d.ts:93

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
| `options?` | `InvitationRejectOptions` | Options bucket. |

#### Returns

`Promise`<`void`\>

#### Inherited from

Invitation.reject

#### Defined in

node_modules/sip.js/lib/api/invitation.d.ts:108

___

### \_onCancel

▸ **_onCancel**(`message`): `void`

Handle CANCEL request.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `IncomingRequestMessage` | CANCEL message. |

#### Returns

`void`

#### Inherited from

Invitation.\_onCancel

#### Defined in

node_modules/sip.js/lib/api/invitation.d.ts:115

___

### bye

▸ **bye**(`options?`): `Promise`<`OutgoingByeRequest`\>

End the [Session](WebPhoneEvents.md#session). Sends a BYE.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `SessionByeOptions` | Options bucket. See {@link SessionByeOptions} for details. |

#### Returns

`Promise`<`OutgoingByeRequest`\>

#### Inherited from

Invitation.bye

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:186

___

### info

▸ **info**(`options?`): `Promise`<`OutgoingInfoRequest`\>

Share {@link Info} with peer. Sends an INFO.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `SessionInfoOptions` | Options bucket. See {@link SessionInfoOptions} for details. |

#### Returns

`Promise`<`OutgoingInfoRequest`\>

#### Inherited from

Invitation.info

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:191

___

### invite

▸ **invite**(`options?`): `Promise`<`OutgoingInviteRequest`\>

Renegotiate the session. Sends a re-INVITE.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `SessionInviteOptions` | Options bucket. See {@link SessionInviteOptions} for details. |

#### Returns

`Promise`<`OutgoingInviteRequest`\>

#### Inherited from

Invitation.invite

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:196

___

### message

▸ **message**(`options?`): `Promise`<`OutgoingMessageRequest`\>

Deliver a {@link Message}. Sends a MESSAGE.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `SessionMessageOptions` | Options bucket. See {@link SessionMessageOptions} for details. |

#### Returns

`Promise`<`OutgoingMessageRequest`\>

#### Inherited from

Invitation.message

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:201

___

### refer

▸ **refer**(`referTo`, `options?`): `Promise`<`OutgoingReferRequest`\>

Proffer a {@link Referral}. Send a REFER.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `referTo` | `Session` \| `URI` | The referral target. If a `Session`, a REFER w/Replaces is sent. |
| `options?` | `SessionReferOptions` | Options bucket. See {@link SessionReferOptions} for details. |

#### Returns

`Promise`<`OutgoingReferRequest`\>

#### Inherited from

Invitation.refer

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:207

___

### \_bye

▸ **_bye**(`delegate?`, `options?`): `Promise`<`OutgoingByeRequest`\>

Send BYE.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | `OutgoingRequestDelegate` | Request delegate. |
| `options?` | `RequestOptions` | Request options bucket. |

#### Returns

`Promise`<`OutgoingByeRequest`\>

#### Inherited from

Invitation.\_bye

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:214

___

### \_info

▸ **_info**(`delegate?`, `options?`): `Promise`<`OutgoingInfoRequest`\>

Send INFO.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | `OutgoingRequestDelegate` | Request delegate. |
| `options?` | `RequestOptions` | Request options bucket. |

#### Returns

`Promise`<`OutgoingInfoRequest`\>

#### Inherited from

Invitation.\_info

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:221

___

### \_message

▸ **_message**(`delegate?`, `options?`): `Promise`<`OutgoingMessageRequest`\>

Send MESSAGE.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | `OutgoingRequestDelegate` | Request delegate. |
| `options?` | `RequestOptions` | Request options bucket. |

#### Returns

`Promise`<`OutgoingMessageRequest`\>

#### Inherited from

Invitation.\_message

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:228

___

### \_refer

▸ **_refer**(`onNotify?`, `delegate?`, `options?`): `Promise`<`OutgoingByeRequest`\>

Send REFER.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `onNotify?` | (`notification`: `Notification`) => `void` | Notification callback. |
| `delegate?` | `OutgoingRequestDelegate` | Request delegate. |
| `options?` | `RequestOptions` | Request options bucket. |

#### Returns

`Promise`<`OutgoingByeRequest`\>

#### Inherited from

Invitation.\_refer

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:236

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

#### Inherited from

Invitation.autoSendAnInitialProvisionalResponse

#### Defined in

node_modules/sip.js/lib/api/invitation.d.ts:53

___

### body

• `get` **body**(): `string`

Initial incoming INVITE request message body.

#### Returns

`string`

#### Inherited from

Invitation.body

#### Defined in

node_modules/sip.js/lib/api/invitation.d.ts:57

___

### localIdentity

• `get` **localIdentity**(): `NameAddrHeader`

The identity of the local user.

#### Returns

`NameAddrHeader`

#### Inherited from

Invitation.localIdentity

#### Defined in

node_modules/sip.js/lib/api/invitation.d.ts:61

___

### remoteIdentity

• `get` **remoteIdentity**(): `NameAddrHeader`

The identity of the remote user.

#### Returns

`NameAddrHeader`

#### Inherited from

Invitation.remoteIdentity

#### Defined in

node_modules/sip.js/lib/api/invitation.d.ts:65

___

### request

• `get` **request**(): `IncomingRequestMessage`

Initial incoming INVITE request message.

#### Returns

`IncomingRequestMessage`

#### Inherited from

Invitation.request

#### Defined in

node_modules/sip.js/lib/api/invitation.d.ts:69

___

### assertedIdentity

• `get` **assertedIdentity**(): `NameAddrHeader`

The asserted identity of the remote user.

#### Returns

`NameAddrHeader`

#### Inherited from

Invitation.assertedIdentity

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:101

___

### dialog

• `get` **dialog**(): `Session`

The confirmed session dialog.

#### Returns

`Session`

#### Inherited from

Invitation.dialog

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:105

___

### id

• `get` **id**(): `string`

A unique identifier for this session.

#### Returns

`string`

#### Inherited from

Invitation.id

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:109

___

### replacee

• `get` **replacee**(): `Session`

The session being replace by this one.

#### Returns

`Session`

#### Inherited from

Invitation.replacee

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:113

___

### sessionDescriptionHandler

• `get` **sessionDescriptionHandler**(): `SessionDescriptionHandler`

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

`SessionDescriptionHandler`

#### Inherited from

Invitation.sessionDescriptionHandler

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:125

___

### sessionDescriptionHandlerFactory

• `get` **sessionDescriptionHandlerFactory**(): `SessionDescriptionHandlerFactory`

Session description handler factory.

#### Returns

`SessionDescriptionHandlerFactory`

#### Inherited from

Invitation.sessionDescriptionHandlerFactory

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:129

___

### sessionDescriptionHandlerModifiers

• `get` **sessionDescriptionHandlerModifiers**(): `SessionDescriptionHandlerModifier`[]

SDH modifiers for the initial INVITE transaction.

**`remarks`**
Used in all cases when handling the initial INVITE transaction as either UAC or UAS.
May be set directly at anytime.
May optionally be set via constructor option.
May optionally be set via options passed to Inviter.invite() or Invitation.accept().

#### Returns

`SessionDescriptionHandlerModifier`[]

#### Inherited from

Invitation.sessionDescriptionHandlerModifiers

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:138

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
| `modifiers` | `SessionDescriptionHandlerModifier`[] |

#### Returns

`void`

#### Inherited from

Invitation.sessionDescriptionHandlerModifiers

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:139

___

### sessionDescriptionHandlerOptions

• `get` **sessionDescriptionHandlerOptions**(): `SessionDescriptionHandlerOptions`

SDH options for the initial INVITE transaction.

**`remarks`**
Used in all cases when handling the initial INVITE transaction as either UAC or UAS.
May be set directly at anytime.
May optionally be set via constructor option.
May optionally be set via options passed to Inviter.invite() or Invitation.accept().

#### Returns

`SessionDescriptionHandlerOptions`

#### Inherited from

Invitation.sessionDescriptionHandlerOptions

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:148

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
| `options` | `SessionDescriptionHandlerOptions` |

#### Returns

`void`

#### Inherited from

Invitation.sessionDescriptionHandlerOptions

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:149

___

### sessionDescriptionHandlerModifiersReInvite

• `get` **sessionDescriptionHandlerModifiersReInvite**(): `SessionDescriptionHandlerModifier`[]

SDH modifiers for re-INVITE transactions.

**`remarks`**
Used in all cases when handling a re-INVITE transaction as either UAC or UAS.
May be set directly at anytime.
May optionally be set via constructor option.
May optionally be set via options passed to Session.invite().

#### Returns

`SessionDescriptionHandlerModifier`[]

#### Inherited from

Invitation.sessionDescriptionHandlerModifiersReInvite

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:158

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
| `modifiers` | `SessionDescriptionHandlerModifier`[] |

#### Returns

`void`

#### Inherited from

Invitation.sessionDescriptionHandlerModifiersReInvite

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:159

___

### sessionDescriptionHandlerOptionsReInvite

• `get` **sessionDescriptionHandlerOptionsReInvite**(): `SessionDescriptionHandlerOptions`

SDH options for re-INVITE transactions.

**`remarks`**
Used in all cases when handling a re-INVITE transaction as either UAC or UAS.
May be set directly at anytime.
May optionally be set via constructor option.
May optionally be set via options passed to Session.invite().

#### Returns

`SessionDescriptionHandlerOptions`

#### Inherited from

Invitation.sessionDescriptionHandlerOptionsReInvite

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:168

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
| `options` | `SessionDescriptionHandlerOptions` |

#### Returns

`void`

#### Inherited from

Invitation.sessionDescriptionHandlerOptionsReInvite

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:169

___

### state

• `get` **state**(): `SessionState`

Session state.

#### Returns

`SessionState`

#### Inherited from

Invitation.state

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:173

___

### stateChange

• `get` **stateChange**(): `Emitter`<`SessionState`\>

Session state change emitter.

#### Returns

`Emitter`<`SessionState`\>

#### Inherited from

Invitation.stateChange

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:177

## Properties

### data

• **data**: `unknown`

Property reserved for use by instance owner.

**`defaultvalue`** `undefined`

#### Inherited from

Invitation.data

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:30

___

### delegate

• **delegate**: `SessionDelegate`

The session delegate.

**`defaultvalue`** `undefined`

#### Inherited from

Invitation.delegate

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:35

___

### \_contact

• **\_contact**: `string`

**`internal`**

#### Inherited from

Invitation.\_contact

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:37

___

### \_referral

• **\_referral**: `Inviter`

**`internal`**

#### Inherited from

Invitation.\_referral

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:39

___

### \_replacee

• **\_replacee**: `Session`

**`internal`**

#### Inherited from

Invitation.\_replacee

#### Defined in

node_modules/sip.js/lib/api/session.d.ts:41

___

### held

• `Optional` **held**: `boolean`

Flag to check if the call is on hold or not

#### Inherited from

[CommonSession](../classes/CommonSession.md).[held](../classes/CommonSession.md#held)

#### Defined in

[src/session.ts:88](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L88)

___

### media

• `Optional` **media**: `Object`

Options to represent dom elements where media stream should be loaded

#### Type declaration

| Name | Type |
| :------ | :------ |
| `local?` | `HTMLMediaElement` |
| `remote?` | `HTMLMediaElement` |

#### Inherited from

[CommonSession](../classes/CommonSession.md).[media](../classes/CommonSession.md#media)

#### Defined in

[src/session.ts:90](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L90)

___

### mediaStatsStarted

• `Optional` **mediaStatsStarted**: `boolean`

Flag to indicate if media stats are being collected

#### Inherited from

[CommonSession](../classes/CommonSession.md).[mediaStatsStarted](../classes/CommonSession.md#mediastatsstarted)

#### Defined in

[src/session.ts:92](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L92)

___

### mediaStreams

• `Optional` **mediaStreams**: [`MediaStreams`](../classes/MediaStreams.md)

MediaStreams class instance which has the logic to collect media stream stats

#### Inherited from

[CommonSession](../classes/CommonSession.md).[mediaStreams](../classes/CommonSession.md#mediastreams)

#### Defined in

[src/session.ts:94](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L94)

___

### muted

• `Optional` **muted**: `boolean`

Flag to check if the call is muted or not

#### Inherited from

[CommonSession](../classes/CommonSession.md).[muted](../classes/CommonSession.md#muted)

#### Defined in

[src/session.ts:96](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L96)

___

### noAudioReportCount

• `Optional` **noAudioReportCount**: `number`

Counter to represent how many media stats report were missed becuase of no audio

#### Inherited from

[CommonSession](../classes/CommonSession.md).[noAudioReportCount](../classes/CommonSession.md#noaudioreportcount)

#### Defined in

[src/session.ts:98](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L98)

___

### rcHeaders

• `Optional` **rcHeaders**: [`RCHeaders`](RCHeaders.md)

JOSN representation of RC headers received for an incoming call

#### Inherited from

[CommonSession](../classes/CommonSession.md).[rcHeaders](../classes/CommonSession.md#rcheaders)

#### Defined in

[src/session.ts:100](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L100)

___

### reinviteForNoAudioSent

• `Optional` **reinviteForNoAudioSent**: `boolean`

Flag to represent if reinvite request was sent because there was no audio reported

#### Inherited from

[CommonSession](../classes/CommonSession.md).[reinviteForNoAudioSent](../classes/CommonSession.md#reinvitefornoaudiosent)

#### Defined in

[src/session.ts:102](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L102)

___

### addListener

• `Optional` **addListener**: (`eventName`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

Method to attach event listener for session specific events

#### Type declaration

▸ (`eventName`, `listener`): `EventEmitter`

Alias for `emitter.on(eventName, listener)`.

**`since`** v0.1.26

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Inherited from

[CommonSession](../classes/CommonSession.md).[addListener](../classes/CommonSession.md#addlistener)

#### Defined in

[src/session.ts:108](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L108)

___

### addTrack

• `Optional` **addTrack**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `remoteAudioEle?`: `any`, `localAudioEle?`: `any`) => `void`

Add track to media source

#### Type declaration

▸ (`this`, `remoteAudioEle?`, `localAudioEle?`): `void`

Add track to media source

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `remoteAudioEle?` | `any` |
| `localAudioEle?` | `any` |

##### Returns

`void`

#### Inherited from

[CommonSession](../classes/CommonSession.md).[addTrack](../classes/CommonSession.md#addtrack)

#### Defined in

[src/session.ts:110](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L110)

___

### barge

• `Optional` **barge**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`any`\>

RingCentral barge implementation

#### Type declaration

▸ (`this`): `Promise`<`any`\>

RingCentral barge implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`any`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[barge](../classes/CommonSession.md#barge)

#### Defined in

[src/session.ts:112](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L112)

___

### blindTransfer

• `Optional` **blindTransfer**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `target`: `string` \| [`WebPhoneSession`](../modules.md#webphonesession) \| `URI`, `options`: `SessionReferOptions`) => `Promise`<`OutgoingReferRequest`\>

RingCentral blind transfer implementation

#### Type declaration

▸ (`this`, `target`, `options?`): `Promise`<`OutgoingReferRequest`\>

RingCentral blind transfer implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `target` | `string` \| [`WebPhoneSession`](../modules.md#webphonesession) \| `URI` |
| `options` | `SessionReferOptions` |

##### Returns

`Promise`<`OutgoingReferRequest`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[blindTransfer](../classes/CommonSession.md#blindtransfer)

#### Defined in

[src/session.ts:114](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L114)

___

### canUseRCMCallControl

• `Optional` **canUseRCMCallControl**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `boolean`

#### Type declaration

▸ (`this`): `boolean`

**`internal`**
Helper function which represents if call control features can be used or not

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`boolean`

#### Inherited from

[CommonSession](../classes/CommonSession.md).[canUseRCMCallControl](../classes/CommonSession.md#canusercmcallcontrol)

#### Defined in

[src/session.ts:119](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L119)

___

### createSessionMessage

• `Optional` **createSessionMessage**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `options`: [`RCHeaders`](RCHeaders.md)) => `string`

#### Type declaration

▸ (`this`, `options`): `string`

**`internal`**
Create session message which would be sent to the RingCentral backend

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `options` | [`RCHeaders`](RCHeaders.md) |

##### Returns

`string`

#### Inherited from

[CommonSession](../classes/CommonSession.md).[createSessionMessage](../classes/CommonSession.md#createsessionmessage)

#### Defined in

[src/session.ts:124](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L124)

___

### dtmf

• `Optional` **dtmf**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `dtmf`: `string`, `duration`: `number`, `interToneGap`: `number`) => `void`

Sends a DTMF over the call

#### Type declaration

▸ (`this`, `dtmf`, `duration?`, `interToneGap?`): `void`

Sends a DTMF over the call

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) | `undefined` |
| `dtmf` | `string` | `undefined` |
| `duration` | `number` | `100` |
| `interToneGap` | `number` | `50` |

##### Returns

`void`

#### Inherited from

[CommonSession](../classes/CommonSession.md).[dtmf](../classes/CommonSession.md#dtmf)

#### Defined in

[src/session.ts:126](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L126)

___

### emit

• `Optional` **emit**: (`eventName`: `string` \| `symbol`, ...`args`: `any`[]) => `boolean`

Emit session specific events which will trigger all the event listeners attached

#### Type declaration

▸ (`eventName`, ...`args`): `boolean`

Synchronously calls each of the listeners registered for the event named`eventName`, in the order they were registered, passing the supplied arguments
to each.

Returns `true` if the event had listeners, `false` otherwise.

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

**`since`** v0.1.26

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `...args` | `any`[] |

##### Returns

`boolean`

#### Inherited from

[CommonSession](../classes/CommonSession.md).[emit](../classes/CommonSession.md#emit)

#### Defined in

[src/session.ts:128](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L128)

___

### flip

• `Optional` **flip**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `target`: `any`) => `Promise`<`any`\>

RingCentral flip implementation

#### Type declaration

▸ (`this`, `target`): `Promise`<`any`\>

RingCentral flip implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `target` | `any` |

##### Returns

`Promise`<`any`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[flip](../classes/CommonSession.md#flip)

#### Defined in

[src/session.ts:130](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L130)

___

### forward

• `Optional` **forward**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `target`: [`WebPhoneSession`](../modules.md#webphonesession), `acceptOptions`: `InvitationAcceptOptions`, `transferOptions`: `SessionReferOptions`) => `Promise`<`OutgoingReferRequest`\>

RingCentral flip implementation

#### Type declaration

▸ (`this`, `target`, `acceptOptions`, `transferOptions`): `Promise`<`OutgoingReferRequest`\>

RingCentral flip implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `target` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `acceptOptions` | `InvitationAcceptOptions` |
| `transferOptions` | `SessionReferOptions` |

##### Returns

`Promise`<`OutgoingReferRequest`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[forward](../classes/CommonSession.md#forward)

#### Defined in

[src/session.ts:132](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L132)

___

### hold

• `Optional` **hold**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`void`\>

Put the call on hold

#### Type declaration

▸ (`this`): `Promise`<`void`\>

Put the call on hold

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`void`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[hold](../classes/CommonSession.md#hold)

#### Defined in

[src/session.ts:134](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L134)

___

### ignore

• `Optional` **ignore**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`IncomingResponse`\>

Ignore incoming call

#### Type declaration

▸ (`this`): `Promise`<`IncomingResponse`\>

Ignore incoming call

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`IncomingResponse`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[ignore](../classes/CommonSession.md#ignore)

#### Defined in

[src/session.ts:136](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L136)

___

### mute

• `Optional` **mute**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `silent?`: `boolean`) => `void`

Mute the call

#### Type declaration

▸ (`this`, `silent?`): `void`

Mute the call

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `silent?` | `boolean` |

##### Returns

`void`

#### Inherited from

[CommonSession](../classes/CommonSession.md).[mute](../classes/CommonSession.md#mute)

#### Defined in

[src/session.ts:138](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L138)

___

### off

• `Optional` **off**: (`eventName`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

Remove event listener

#### Type declaration

▸ (`eventName`, `listener`): `EventEmitter`

Alias for `emitter.removeListener()`.

**`since`** v10.0.0

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Inherited from

[CommonSession](../classes/CommonSession.md).[off](../classes/CommonSession.md#off)

#### Defined in

[src/session.ts:140](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L140)

___

### on

• `Optional` **on**: (`eventName`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

Add event listener. Same as addListener

#### Type declaration

▸ (`eventName`, `listener`): `EventEmitter`

Adds the `listener` function to the end of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The`emitter.prependListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

**`since`** v0.1.101

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

##### Returns

`EventEmitter`

#### Inherited from

[CommonSession](../classes/CommonSession.md).[on](../classes/CommonSession.md#on)

#### Defined in

[src/session.ts:142](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L142)

___

### park

• `Optional` **park**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`any`\>

RingCentral park implementation

#### Type declaration

▸ (`this`): `Promise`<`any`\>

RingCentral park implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`any`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[park](../classes/CommonSession.md#park)

#### Defined in

[src/session.ts:144](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L144)

___

### reinvite

• `Optional` **reinvite**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `options`: `SessionInviteOptions`) => `Promise`<`OutgoingInviteRequest`\>

Send a session reinvite

#### Type declaration

▸ (`this`, `options?`): `Promise`<`OutgoingInviteRequest`\>

Send a session reinvite

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) | WebPhoneSessionSessionInviteOptions |
| `options` | `SessionInviteOptions` |  |

##### Returns

`Promise`<`OutgoingInviteRequest`\>

Promise<OutgoingInviteRequest>

Sends a reinvite. Also makes sure to regenrate a new SDP by passing offerToReceiveAudio: true, offerToReceiveVideo: false  and iceRestart: true
Once the SDP is ready, the local description is set and the SDP is sent to the remote peer along with an INVITE request

#### Inherited from

[CommonSession](../classes/CommonSession.md).[reinvite](../classes/CommonSession.md#reinvite)

#### Defined in

[src/session.ts:146](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L146)

___

### removeListener

• `Optional` **removeListener**: (`eventName`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

Remove event listener

#### Type declaration

▸ (`eventName`, `listener`): `EventEmitter`

Removes the specified `listener` from the listener array for the event named`eventName`.

```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener()` will remove, at most, one instance of a listener from the
listener array. If any single listener has been added multiple times to the
listener array for the specified `eventName`, then `removeListener()` must be
called multiple times to remove each instance.

Once an event is emitted, all listeners attached to it at the
time of emitting are called in order. This implies that any`removeListener()` or `removeAllListeners()` calls _after_ emitting and_before_ the last listener finishes execution will
not remove them from`emit()` in progress. Subsequent events behave as expected.

```js
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

Because listeners are managed using an internal array, calling this will
change the position indices of any listener registered _after_ the listener
being removed. This will not impact the order in which listeners are called,
but it means that any copies of the listener array as returned by
the `emitter.listeners()` method will need to be recreated.

When a single function has been added as a handler multiple times for a single
event (as in the example below), `removeListener()` will remove the most
recently added instance. In the example the `once('ping')`listener is removed:

```js
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`since`** v0.1.26

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Inherited from

[CommonSession](../classes/CommonSession.md).[removeListener](../classes/CommonSession.md#removelistener)

#### Defined in

[src/session.ts:148](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L148)

___

### replyWithMessage

• `Optional` **replyWithMessage**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `replyOptions`: [`ReplyOptions`](ReplyOptions.md)) => `Promise`<`IncomingResponse`\>

RingCentral reply with message implementation

#### Type declaration

▸ (`this`, `replyOptions`): `Promise`<`IncomingResponse`\>

RingCentral reply with message implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `replyOptions` | [`ReplyOptions`](ReplyOptions.md) |

##### Returns

`Promise`<`IncomingResponse`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[replyWithMessage](../classes/CommonSession.md#replywithmessage)

#### Defined in

[src/session.ts:150](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L150)

___

### sendInfoAndRecieveResponse

• `Optional` **sendInfoAndRecieveResponse**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `command`: `Command`, `options?`: `any`) => `Promise`<`any`\>

#### Type declaration

▸ (`this`, `command`, `options?`): `Promise`<`any`\>

**`internal`**
Helper method that sends an INFO request to other user agent and then waits for an INFO request from the other user agent

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `command` | `Command` |
| `options?` | `any` |

##### Returns

`Promise`<`any`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[sendInfoAndRecieveResponse](../classes/CommonSession.md#sendinfoandrecieveresponse)

#### Defined in

[src/session.ts:155](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L155)

___

### sendMoveResponse

• `Optional` **sendMoveResponse**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `reqId`: `number`, `code`: `number`, `description`: `string`, `options`: { `extraHeaders?`: `string`[]  }) => `void`

#### Type declaration

▸ (`this`, `reqId`, `code`, `description`, `options?`): `void`

**`internal`**
Helper function to send INFO request with `move` instruction to RingCentral backend

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `reqId` | `number` |
| `code` | `number` |
| `description` | `string` |
| `options` | `Object` |
| `options.extraHeaders?` | `string`[] |

##### Returns

`void`

#### Inherited from

[CommonSession](../classes/CommonSession.md).[sendMoveResponse](../classes/CommonSession.md#sendmoveresponse)

#### Defined in

[src/session.ts:160](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L160)

___

### sendReceiveConfirm

• `Optional` **sendReceiveConfirm**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`void`\>

Send `receiveConfirm` command to backend

#### Type declaration

▸ (`this`): `Promise`<`void`\>

Send `receiveConfirm` command to backend

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`void`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[sendReceiveConfirm](../classes/CommonSession.md#sendreceiveconfirm)

#### Defined in

[src/session.ts:162](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L162)

___

### sendSessionMessage

• `Optional` **sendSessionMessage**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `options`: `any`) => `Promise`<`IncomingResponse`\>

Helper function to send session message to backend using UserAgent

#### Type declaration

▸ (`this`, `options`): `Promise`<`IncomingResponse`\>

Helper function to send session message to backend using UserAgent

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `options` | `any` |

##### Returns

`Promise`<`IncomingResponse`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[sendSessionMessage](../classes/CommonSession.md#sendsessionmessage)

#### Defined in

[src/session.ts:164](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L164)

___

### startRecord

• `Optional` **startRecord**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`any`\>

Start recording the call

#### Type declaration

▸ (`this`): `Promise`<`any`\>

Start recording the call

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`any`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[startRecord](../classes/CommonSession.md#startrecord)

#### Defined in

[src/session.ts:166](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L166)

___

### stopMediaStats

• `Optional` **stopMediaStats**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `void`

Function to stop collecting media stats

#### Type declaration

▸ (`this`): `void`

Function to stop collecting media stats

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`void`

#### Inherited from

[CommonSession](../classes/CommonSession.md).[stopMediaStats](../classes/CommonSession.md#stopmediastats)

#### Defined in

[src/session.ts:168](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L168)

___

### stopRecord

• `Optional` **stopRecord**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`any`\>

Stop recording the call

#### Type declaration

▸ (`this`): `Promise`<`any`\>

Stop recording the call

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`any`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[stopRecord](../classes/CommonSession.md#stoprecord)

#### Defined in

[src/session.ts:170](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L170)

___

### toVoicemail

• `Optional` **toVoicemail**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`IncomingResponse`\>

Send incoming call to voicemail

#### Type declaration

▸ (`this`): `Promise`<`IncomingResponse`\>

Send incoming call to voicemail

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`IncomingResponse`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[toVoicemail](../classes/CommonSession.md#tovoicemail)

#### Defined in

[src/session.ts:172](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L172)

___

### transfer

• `Optional` **transfer**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `target`: `string` \| [`WebPhoneSession`](../modules.md#webphonesession) \| `URI`, `options`: `SessionReferOptions`) => `Promise`<`OutgoingReferRequest`\>

Transfer current call

#### Type declaration

▸ (`this`, `target`, `options?`): `Promise`<`OutgoingReferRequest`\>

Transfer current call

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `target` | `string` \| [`WebPhoneSession`](../modules.md#webphonesession) \| `URI` |
| `options` | `SessionReferOptions` |

##### Returns

`Promise`<`OutgoingReferRequest`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[transfer](../classes/CommonSession.md#transfer)

#### Defined in

[src/session.ts:174](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L174)

___

### unhold

• `Optional` **unhold**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`void`\>

Put the call on unhold

#### Type declaration

▸ (`this`): `Promise`<`void`\>

Put the call on unhold

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`void`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[unhold](../classes/CommonSession.md#unhold)

#### Defined in

[src/session.ts:176](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L176)

___

### unmute

• `Optional` **unmute**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `silent?`: `boolean`) => `void`

Unmute the call

#### Type declaration

▸ (`this`, `silent?`): `void`

Unmute the call

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `silent?` | `boolean` |

##### Returns

`void`

#### Inherited from

[CommonSession](../classes/CommonSession.md).[unmute](../classes/CommonSession.md#unmute)

#### Defined in

[src/session.ts:178](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L178)

___

### warmTransfer

• `Optional` **warmTransfer**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `target`: `string` \| [`WebPhoneSession`](../modules.md#webphonesession) \| `URI`, `options`: `SessionReferOptions`) => `Promise`<`OutgoingReferRequest`\>

RingCentral warm transfer implementation

#### Type declaration

▸ (`this`, `target`, `options?`): `Promise`<`OutgoingReferRequest`\>

RingCentral warm transfer implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `target` | `string` \| [`WebPhoneSession`](../modules.md#webphonesession) \| `URI` |
| `options` | `SessionReferOptions` |

##### Returns

`Promise`<`OutgoingReferRequest`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[warmTransfer](../classes/CommonSession.md#warmtransfer)

#### Defined in

[src/session.ts:180](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L180)

___

### whisper

• `Optional` **whisper**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`any`\>

RingCentral whisper implementation

#### Type declaration

▸ (`this`): `Promise`<`any`\>

RingCentral whisper implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`any`\>

#### Inherited from

[CommonSession](../classes/CommonSession.md).[whisper](../classes/CommonSession.md#whisper)

#### Defined in

[src/session.ts:182](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L182)

___

### accept

• **accept**: (`options?`: `InvitationAcceptOptions`) => `Promise`<`void`\>

#### Type declaration

▸ (`options?`): `Promise`<`void`\>

Accept the invitation.

**`remarks`**
Accept the incoming INVITE request to start a Session.
Replies to the INVITE request with a 200 Ok response.
Resolves once the response sent, otherwise rejects.

This method may reject for a variety of reasons including
the receipt of a CANCEL request before `accept` is able
to construct a response.

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `InvitationAcceptOptions` | Options bucket. |

##### Returns

`Promise`<`void`\>

#### Overrides

Invitation.accept

#### Defined in

[src/session.ts:205](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L205)

___

### userAgent

• **userAgent**: [`WebPhoneUserAgent`](WebPhoneUserAgent.md)

User Agent instance

#### Overrides

Invitation.userAgent

#### Defined in

[src/session.ts:209](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L209)
