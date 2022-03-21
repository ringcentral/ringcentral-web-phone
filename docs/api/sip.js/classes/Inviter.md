[SIP.js](../README.md) / [Exports](../modules.md) / Inviter

# Class: Inviter

An inviter offers to establish a [Session](Session.md) (outgoing INVITE).

## Hierarchy

- [`Session`](Session.md)

  ↳ **`Inviter`**

## Table of contents

### Constructors

- [constructor](Inviter.md#constructor)

### Properties

- [\_referred](Inviter.md#_referred)
- [data](Inviter.md#data)
- [delegate](Inviter.md#delegate)
- [\_contact](Inviter.md#_contact)
- [\_referral](Inviter.md#_referral)
- [\_replacee](Inviter.md#_replacee)

### Methods

- [dispose](Inviter.md#dispose)
- [cancel](Inviter.md#cancel)
- [invite](Inviter.md#invite)
- [bye](Inviter.md#bye)
- [info](Inviter.md#info)
- [message](Inviter.md#message)
- [refer](Inviter.md#refer)
- [\_bye](Inviter.md#_bye)
- [\_info](Inviter.md#_info)
- [\_message](Inviter.md#_message)
- [\_refer](Inviter.md#_refer)

### Accessors

- [body](Inviter.md#body)
- [localIdentity](Inviter.md#localidentity)
- [remoteIdentity](Inviter.md#remoteidentity)
- [request](Inviter.md#request)
- [assertedIdentity](Inviter.md#assertedidentity)
- [dialog](Inviter.md#dialog)
- [id](Inviter.md#id)
- [replacee](Inviter.md#replacee)
- [sessionDescriptionHandler](Inviter.md#sessiondescriptionhandler)
- [sessionDescriptionHandlerFactory](Inviter.md#sessiondescriptionhandlerfactory)
- [sessionDescriptionHandlerModifiers](Inviter.md#sessiondescriptionhandlermodifiers)
- [sessionDescriptionHandlerOptions](Inviter.md#sessiondescriptionhandleroptions)
- [sessionDescriptionHandlerModifiersReInvite](Inviter.md#sessiondescriptionhandlermodifiersreinvite)
- [sessionDescriptionHandlerOptionsReInvite](Inviter.md#sessiondescriptionhandleroptionsreinvite)
- [state](Inviter.md#state)
- [stateChange](Inviter.md#statechange)
- [userAgent](Inviter.md#useragent)

## Constructors

### constructor

• **new Inviter**(`userAgent`, `targetURI`, `options?`)

Constructs a new instance of the `Inviter` class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userAgent` | [`UserAgent`](UserAgent.md) | User agent. See [UserAgent](UserAgent.md) for details. |
| `targetURI` | [`URI`](URI.md) | Request URI identifying the target of the message. |
| `options?` | [`InviterOptions`](../interfaces/InviterOptions.md) | Options bucket. See [InviterOptions](../interfaces/InviterOptions.md) for details. |

#### Overrides

Session.constructor

#### Defined in

sip.js/lib/api/inviter.d.ts:48

## Properties

### \_referred

• **\_referred**: [`Session`](Session.md)

If this Inviter was created as a result of a REFER, the referred Session. Otherwise undefined.

**`internal`**

#### Defined in

sip.js/lib/api/inviter.d.ts:17

___

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

## Methods

### dispose

▸ **dispose**(): `Promise`<`void`\>

Destructor.

#### Returns

`Promise`<`void`\>

#### Overrides

[Session](Session.md).[dispose](Session.md#dispose)

#### Defined in

sip.js/lib/api/inviter.d.ts:52

___

### cancel

▸ **cancel**(`options?`): `Promise`<`void`\>

Cancels the INVITE request.

**`remarks`**
Sends a CANCEL request.
Resolves once the response sent, otherwise rejects.

After sending a CANCEL request the expectation is that a 487 final response
will be received for the INVITE. However a 200 final response to the INVITE
may nonetheless arrive (it's a race between the CANCEL reaching the UAS before
the UAS sends a 200) in which case an ACK & BYE will be sent. The net effect
is that this method will terminate the session regardless of the race.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`InviterCancelOptions`](../interfaces/InviterCancelOptions.md) | Options bucket. |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/inviter.d.ts:83

___

### invite

▸ **invite**(`options?`): `Promise`<[`OutgoingInviteRequest`](../interfaces/OutgoingInviteRequest.md)\>

Sends the INVITE request.

**`remarks`**
TLDR...
 1) Only one offer/answer exchange permitted during initial INVITE.
 2) No "early media" if the initial offer is in an INVITE (default behavior).
 3) If "early media" and the initial offer is in an INVITE, no INVITE forking.

1) Only one offer/answer exchange permitted during initial INVITE.

Our implementation replaces the following bullet point...

o  After having sent or received an answer to the first offer, the
   UAC MAY generate subsequent offers in requests based on rules
   specified for that method, but only if it has received answers
   to any previous offers, and has not sent any offers to which it
   hasn't gotten an answer.
https://tools.ietf.org/html/rfc3261#section-13.2.1

...with...

o  After having sent or received an answer to the first offer, the
   UAC MUST NOT generate subsequent offers in requests based on rules
   specified for that method.

...which in combination with this bullet point...

o  Once the UAS has sent or received an answer to the initial
   offer, it MUST NOT generate subsequent offers in any responses
   to the initial INVITE.  This means that a UAS based on this
   specification alone can never generate subsequent offers until
   completion of the initial transaction.
https://tools.ietf.org/html/rfc3261#section-13.2.1

...ensures that EXACTLY ONE offer/answer exchange will occur
during an initial out of dialog INVITE request made by our UAC.

2) No "early media" if the initial offer is in an INVITE (default behavior).

While our implementation adheres to the following bullet point...

o  If the initial offer is in an INVITE, the answer MUST be in a
   reliable non-failure message from UAS back to UAC which is
   correlated to that INVITE.  For this specification, that is
   only the final 2xx response to that INVITE.  That same exact
   answer MAY also be placed in any provisional responses sent
   prior to the answer.  The UAC MUST treat the first session
   description it receives as the answer, and MUST ignore any
   session descriptions in subsequent responses to the initial
   INVITE.
https://tools.ietf.org/html/rfc3261#section-13.2.1

We have made the following implementation decision with regard to early media...

o  If the initial offer is in the INVITE, the answer from the
   UAS back to the UAC will establish a media session only
   only after the final 2xx response to that INVITE is received.

The reason for this decision is rooted in a restriction currently
inherent in WebRTC. Specifically, while a SIP INVITE request with an
initial offer may fork resulting in more than one provisional answer,
there is currently no easy/good way to to "fork" an offer generated
by a peer connection. In particular, a WebRTC offer currently may only
be matched with one answer and we have no good way to know which
"provisional answer" is going to be the "final answer". So we have
decided to punt and not create any "early media" sessions in this case.

The upshot is that if you want "early media", you must not put the
initial offer in the INVITE. Instead, force the UAS to provide the
initial offer by sending an INVITE without an offer. In the WebRTC
case this allows us to create a unique peer connection with a unique
answer for every provisional offer with "early media" on all of them.

3) If "early media" and the initial offer is in an INVITE, no INVITE forking.

The default behavior may be altered and "early media" utilized if the
initial offer is in the an INVITE by setting the `earlyMedia` options.
However in that case the INVITE request MUST NOT fork. This allows for
"early media" in environments where the forking behavior of the SIP
servers being utilized is configured to disallow forking.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`InviterInviteOptions`](../interfaces/InviterInviteOptions.md) |

#### Returns

`Promise`<[`OutgoingInviteRequest`](../interfaces/OutgoingInviteRequest.md)\>

#### Overrides

[Session](Session.md).[invite](Session.md#invite)

#### Defined in

sip.js/lib/api/inviter.d.ts:168

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

### body

• `get` **body**(): [`BodyAndContentType`](../interfaces/BodyAndContentType.md)

Initial outgoing INVITE request message body.

#### Returns

[`BodyAndContentType`](../interfaces/BodyAndContentType.md)

#### Defined in

sip.js/lib/api/inviter.d.ts:56

___

### localIdentity

• `get` **localIdentity**(): [`NameAddrHeader`](NameAddrHeader.md)

The identity of the local user.

#### Returns

[`NameAddrHeader`](NameAddrHeader.md)

#### Overrides

Session.localIdentity

#### Defined in

sip.js/lib/api/inviter.d.ts:60

___

### remoteIdentity

• `get` **remoteIdentity**(): [`NameAddrHeader`](NameAddrHeader.md)

The identity of the remote user.

#### Returns

[`NameAddrHeader`](NameAddrHeader.md)

#### Overrides

Session.remoteIdentity

#### Defined in

sip.js/lib/api/inviter.d.ts:64

___

### request

• `get` **request**(): [`OutgoingRequestMessage`](OutgoingRequestMessage.md)

Initial outgoing INVITE request message.

#### Returns

[`OutgoingRequestMessage`](OutgoingRequestMessage.md)

#### Defined in

sip.js/lib/api/inviter.d.ts:68

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
