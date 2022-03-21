[SIP.js](../README.md) / [Exports](../modules.md) / SessionDialog

# Class: SessionDialog

Session Dialog.

## Hierarchy

- [`Dialog`](Dialog.md)

  ↳ **`SessionDialog`**

## Implements

- [`Session`](../interfaces/Session.md)

## Table of contents

### Methods

- [initialDialogStateForUserAgentClient](SessionDialog.md#initialdialogstateforuseragentclient)
- [initialDialogStateForUserAgentServer](SessionDialog.md#initialdialogstateforuseragentserver)
- [recomputeRouteSet](SessionDialog.md#recomputerouteset)
- [createOutgoingRequestMessage](SessionDialog.md#createoutgoingrequestmessage)
- [incrementLocalSequenceNumber](SessionDialog.md#incrementlocalsequencenumber)
- [dispose](SessionDialog.md#dispose)
- [confirm](SessionDialog.md#confirm)
- [reConfirm](SessionDialog.md#reconfirm)
- [ack](SessionDialog.md#ack)
- [bye](SessionDialog.md#bye)
- [info](SessionDialog.md#info)
- [invite](SessionDialog.md#invite)
- [message](SessionDialog.md#message)
- [notify](SessionDialog.md#notify)
- [prack](SessionDialog.md#prack)
- [refer](SessionDialog.md#refer)
- [receiveRequest](SessionDialog.md#receiverequest)
- [reliableSequenceGuard](SessionDialog.md#reliablesequenceguard)
- [signalingStateRollback](SessionDialog.md#signalingstaterollback)
- [signalingStateTransition](SessionDialog.md#signalingstatetransition)

### Constructors

- [constructor](SessionDialog.md#constructor)

### Accessors

- [id](SessionDialog.md#id)
- [early](SessionDialog.md#early)
- [callId](SessionDialog.md#callid)
- [localTag](SessionDialog.md#localtag)
- [remoteTag](SessionDialog.md#remotetag)
- [localSequenceNumber](SessionDialog.md#localsequencenumber)
- [remoteSequenceNumber](SessionDialog.md#remotesequencenumber)
- [localURI](SessionDialog.md#localuri)
- [remoteURI](SessionDialog.md#remoteuri)
- [remoteTarget](SessionDialog.md#remotetarget)
- [routeSet](SessionDialog.md#routeset)
- [secure](SessionDialog.md#secure)
- [userAgentCore](SessionDialog.md#useragentcore)
- [sessionState](SessionDialog.md#sessionstate)
- [signalingState](SessionDialog.md#signalingstate)
- [offer](SessionDialog.md#offer)
- [answer](SessionDialog.md#answer)

### Properties

- [delegate](SessionDialog.md#delegate)
- [reinviteUserAgentClient](SessionDialog.md#reinviteuseragentclient)
- [reinviteUserAgentServer](SessionDialog.md#reinviteuseragentserver)

## Methods

### initialDialogStateForUserAgentClient

▸ `Static` **initialDialogStateForUserAgentClient**(`outgoingRequestMessage`, `incomingResponseMessage`): [`DialogState`](../interfaces/DialogState.md)

When a UAC receives a response that establishes a dialog, it
constructs the state of the dialog.  This state MUST be maintained
for the duration of the dialog.
https://tools.ietf.org/html/rfc3261#section-12.1.2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `outgoingRequestMessage` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) | Outgoing request message for dialog. |
| `incomingResponseMessage` | [`IncomingResponseMessage`](IncomingResponseMessage.md) | Incoming response message creating dialog. |

#### Returns

[`DialogState`](../interfaces/DialogState.md)

#### Inherited from

[Dialog](Dialog.md).[initialDialogStateForUserAgentClient](Dialog.md#initialdialogstateforuseragentclient)

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:33

___

### initialDialogStateForUserAgentServer

▸ `Static` **initialDialogStateForUserAgentServer**(`incomingRequestMessage`, `toTag`, `early?`): [`DialogState`](../interfaces/DialogState.md)

The UAS then constructs the state of the dialog.  This state MUST be
maintained for the duration of the dialog.
https://tools.ietf.org/html/rfc3261#section-12.1.1

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `incomingRequestMessage` | [`IncomingRequestMessage`](IncomingRequestMessage.md) | Incoming request message creating dialog. |
| `toTag` | `string` | Tag in the To field in the response to the incoming request. |
| `early?` | `boolean` | - |

#### Returns

[`DialogState`](../interfaces/DialogState.md)

#### Inherited from

[Dialog](Dialog.md).[initialDialogStateForUserAgentServer](Dialog.md#initialdialogstateforuseragentserver)

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:41

___

### recomputeRouteSet

▸ **recomputeRouteSet**(`message`): `void`

If the dialog identifier in the 2xx response matches the dialog
identifier of an existing dialog, the dialog MUST be transitioned to
the "confirmed" state, and the route set for the dialog MUST be
recomputed based on the 2xx response using the procedures of Section
12.2.1.2.  Otherwise, a new dialog in the "confirmed" state MUST be
constructed using the procedures of Section 12.1.2.

Note that the only piece of state that is recomputed is the route
set.  Other pieces of state such as the highest sequence numbers
(remote and local) sent within the dialog are not recomputed.  The
route set only is recomputed for backwards compatibility.  RFC
2543 did not mandate mirroring of the Record-Route header field in
a 1xx, only 2xx.  However, we cannot update the entire state of
the dialog, since mid-dialog requests may have been sent within
the early dialog, modifying the sequence numbers, for example.

 https://tools.ietf.org/html/rfc3261#section-13.2.2.4

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`IncomingResponseMessage`](IncomingResponseMessage.md) |

#### Returns

`void`

#### Inherited from

[Dialog](Dialog.md).[recomputeRouteSet](Dialog.md#recomputerouteset)

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:131

___

### createOutgoingRequestMessage

▸ **createOutgoingRequestMessage**(`method`, `options?`): [`OutgoingRequestMessage`](OutgoingRequestMessage.md)

A request within a dialog is constructed by using many of the
components of the state stored as part of the dialog.
https://tools.ietf.org/html/rfc3261#section-12.2.1.1

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | Outgoing request method. |
| `options?` | `Object` | - |
| `options.cseq?` | `number` | - |
| `options.extraHeaders?` | `string`[] | - |
| `options.body?` | [`Body`](../interfaces/Body.md) | - |

#### Returns

[`OutgoingRequestMessage`](OutgoingRequestMessage.md)

#### Inherited from

[Dialog](Dialog.md).[createOutgoingRequestMessage](Dialog.md#createoutgoingrequestmessage)

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:138

___

### incrementLocalSequenceNumber

▸ **incrementLocalSequenceNumber**(): `void`

Increment the local sequence number by one.
It feels like this should be protected, but the current authentication handling currently
needs this to keep the dialog in sync when "auto re-sends" request messages.

**`internal`**

#### Returns

`void`

#### Inherited from

[Dialog](Dialog.md).[incrementLocalSequenceNumber](Dialog.md#incrementlocalsequencenumber)

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:149

___

### dispose

▸ **dispose**(): `void`

Destroy session.

#### Returns

`void`

#### Implementation of

[Session](../interfaces/Session.md).[dispose](../interfaces/Session.md#dispose)

#### Overrides

[Dialog](Dialog.md).[dispose](Dialog.md#dispose)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:38

___

### confirm

▸ **confirm**(): `void`

Confirm the dialog. Only matters if dialog is currently early.

#### Returns

`void`

#### Overrides

[Dialog](Dialog.md).[confirm](Dialog.md#confirm)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:47

___

### reConfirm

▸ **reConfirm**(): `void`

Re-confirm the dialog. Only matters if handling re-INVITE request.

#### Returns

`void`

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:49

___

### ack

▸ **ack**(`options?`): [`OutgoingAckRequest`](../interfaces/OutgoingAckRequest.md)

The UAC core MUST generate an ACK request for each 2xx received from
the transaction layer.  The header fields of the ACK are constructed
in the same way as for any request sent within a dialog (see Section
12) with the exception of the CSeq and the header fields related to
authentication.  The sequence number of the CSeq header field MUST be
the same as the INVITE being acknowledged, but the CSeq method MUST
be ACK.  The ACK MUST contain the same credentials as the INVITE.  If
the 2xx contains an offer (based on the rules above), the ACK MUST
carry an answer in its body.  If the offer in the 2xx response is not
acceptable, the UAC core MUST generate a valid answer in the ACK and
then send a BYE immediately.
https://tools.ietf.org/html/rfc3261#section-13.2.2.4

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | ACK options bucket. |

#### Returns

[`OutgoingAckRequest`](../interfaces/OutgoingAckRequest.md)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:65

___

### bye

▸ **bye**(`delegate?`, `options?`): [`OutgoingByeRequest`](../interfaces/OutgoingByeRequest.md)

Terminating a Session

This section describes the procedures for terminating a session
established by SIP.  The state of the session and the state of the
dialog are very closely related.  When a session is initiated with an
INVITE, each 1xx or 2xx response from a distinct UAS creates a
dialog, and if that response completes the offer/answer exchange, it
also creates a session.  As a result, each session is "associated"
with a single dialog - the one which resulted in its creation.  If an
initial INVITE generates a non-2xx final response, that terminates
all sessions (if any) and all dialogs (if any) that were created
through responses to the request.  By virtue of completing the
transaction, a non-2xx final response also prevents further sessions
from being created as a result of the INVITE.  The BYE request is
used to terminate a specific session or attempted session.  In this
case, the specific session is the one with the peer UA on the other
side of the dialog.  When a BYE is received on a dialog, any session
associated with that dialog SHOULD terminate.  A UA MUST NOT send a
BYE outside of a dialog.  The caller's UA MAY send a BYE for either
confirmed or early dialogs, and the callee's UA MAY send a BYE on
confirmed dialogs, but MUST NOT send a BYE on early dialogs.

However, the callee's UA MUST NOT send a BYE on a confirmed dialog
until it has received an ACK for its 2xx response or until the server
transaction times out.  If no SIP extensions have defined other
application layer states associated with the dialog, the BYE also
terminates the dialog.

https://tools.ietf.org/html/rfc3261#section-15
FIXME: Make these proper Exceptions...

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) | - |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | BYE options bucket. |

#### Returns

[`OutgoingByeRequest`](../interfaces/OutgoingByeRequest.md)

Throws `Error` if callee's UA attempts a BYE on an early dialog.
Throws `Error` if callee's UA attempts a BYE on a confirmed dialog
               while it's waiting on the ACK for its 2xx response.

#### Implementation of

[Session](../interfaces/Session.md).[bye](../interfaces/Session.md#bye)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:103

___

### info

▸ **info**(`delegate?`, `options?`): [`OutgoingInfoRequest`](../interfaces/OutgoingInfoRequest.md)

An INFO request can be associated with an Info Package (see
Section 5), or associated with a legacy INFO usage (see Section 2).

The construction of the INFO request is the same as any other
non-target refresh request within an existing invite dialog usage as
described in Section 12.2 of RFC 3261.
https://tools.ietf.org/html/rfc6086#section-4.2.1

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) | - |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | Options bucket. |

#### Returns

[`OutgoingInfoRequest`](../interfaces/OutgoingInfoRequest.md)

#### Implementation of

[Session](../interfaces/Session.md).[info](../interfaces/Session.md#info)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:114

___

### invite

▸ **invite**(`delegate?`, `options?`): [`OutgoingInviteRequest`](../interfaces/OutgoingInviteRequest.md)

Modifying an Existing Session

A successful INVITE request (see Section 13) establishes both a
dialog between two user agents and a session using the offer-answer
model.  Section 12 explains how to modify an existing dialog using a
target refresh request (for example, changing the remote target URI
of the dialog).  This section describes how to modify the actual
session.  This modification can involve changing addresses or ports,
adding a media stream, deleting a media stream, and so on.  This is
accomplished by sending a new INVITE request within the same dialog
that established the session.  An INVITE request sent within an
existing dialog is known as a re-INVITE.

   Note that a single re-INVITE can modify the dialog and the
   parameters of the session at the same time.

Either the caller or callee can modify an existing session.
https://tools.ietf.org/html/rfc3261#section-14

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingInviteRequestDelegate`](../interfaces/OutgoingInviteRequestDelegate.md) | - |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | Options bucket |

#### Returns

[`OutgoingInviteRequest`](../interfaces/OutgoingInviteRequest.md)

#### Implementation of

[Session](../interfaces/Session.md).[invite](../interfaces/Session.md#invite)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:136

___

### message

▸ **message**(`delegate`, `options?`): [`OutgoingMessageRequest`](../interfaces/OutgoingMessageRequest.md)

A UAC MAY associate a MESSAGE request with an existing dialog.  If a
MESSAGE request is sent within a dialog, it is "associated" with any
media session or sessions associated with that dialog.
https://tools.ietf.org/html/rfc3428#section-4

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) | - |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | Options bucket. |

#### Returns

[`OutgoingMessageRequest`](../interfaces/OutgoingMessageRequest.md)

#### Implementation of

[Session](../interfaces/Session.md).[message](../interfaces/Session.md#message)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:144

___

### notify

▸ **notify**(`delegate?`, `options?`): [`OutgoingNotifyRequest`](../interfaces/OutgoingNotifyRequest.md)

The NOTIFY mechanism defined in [2] MUST be used to inform the agent
sending the REFER of the status of the reference.
https://tools.ietf.org/html/rfc3515#section-2.4.4

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) | - |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | Options bucket. |

#### Returns

[`OutgoingNotifyRequest`](../interfaces/OutgoingNotifyRequest.md)

#### Implementation of

[Session](../interfaces/Session.md).[notify](../interfaces/Session.md#notify)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:151

___

### prack

▸ **prack**(`delegate?`, `options?`): [`OutgoingPrackRequest`](../interfaces/OutgoingPrackRequest.md)

Assuming the response is to be transmitted reliably, the UAC MUST
create a new request with method PRACK.  This request is sent within
the dialog associated with the provisional response (indeed, the
provisional response may have created the dialog).  PRACK requests
MAY contain bodies, which are interpreted according to their type and
disposition.
https://tools.ietf.org/html/rfc3262#section-4

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) | - |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | Options bucket. |

#### Returns

[`OutgoingPrackRequest`](../interfaces/OutgoingPrackRequest.md)

#### Implementation of

[Session](../interfaces/Session.md).[prack](../interfaces/Session.md#prack)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:162

___

### refer

▸ **refer**(`delegate?`, `options?`): [`OutgoingReferRequest`](../interfaces/OutgoingReferRequest.md)

REFER is a SIP request and is constructed as defined in [1].  A REFER
request MUST contain exactly one Refer-To header field value.
https://tools.ietf.org/html/rfc3515#section-2.4.1

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) | - |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | Options bucket. |

#### Returns

[`OutgoingReferRequest`](../interfaces/OutgoingReferRequest.md)

#### Implementation of

[Session](../interfaces/Session.md).[refer](../interfaces/Session.md#refer)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:169

___

### receiveRequest

▸ **receiveRequest**(`message`): `void`

Requests sent within a dialog, as any other requests, are atomic.  If
a particular request is accepted by the UAS, all the state changes
associated with it are performed.  If the request is rejected, none
of the state changes are performed.
https://tools.ietf.org/html/rfc3261#section-12.2.2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`IncomingRequestMessage`](IncomingRequestMessage.md) | Incoming request message within this dialog. |

#### Returns

`void`

#### Overrides

[Dialog](Dialog.md).[receiveRequest](Dialog.md#receiverequest)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:178

___

### reliableSequenceGuard

▸ **reliableSequenceGuard**(`message`): `boolean`

Guard against out of order reliable provisional responses and retransmissions.
Returns false if the response should be discarded, otherwise true.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`IncomingResponseMessage`](IncomingResponseMessage.md) | Incoming response message within this dialog. |

#### Returns

`boolean`

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:184

___

### signalingStateRollback

▸ **signalingStateRollback**(): `void`

If not in a stable signaling state, rollback to prior stable signaling state.

#### Returns

`void`

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:188

___

### signalingStateTransition

▸ **signalingStateTransition**(`message`): `void`

Update the signaling state of the dialog.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`IncomingRequestMessage`](IncomingRequestMessage.md) \| [`Body`](../interfaces/Body.md) \| [`OutgoingRequestMessage`](OutgoingRequestMessage.md) \| [`IncomingResponseMessage`](IncomingResponseMessage.md) | The message to base the update off of. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:193

## Constructors

### constructor

• **new SessionDialog**(`initialTransaction`, `core`, `state`, `delegate?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `initialTransaction` | [`InviteClientTransaction`](InviteClientTransaction.md) \| [`InviteServerTransaction`](InviteServerTransaction.md) |
| `core` | [`UserAgentCore`](UserAgentCore.md) |
| `state` | [`DialogState`](../interfaces/DialogState.md) |
| `delegate?` | [`SessionDelegate`](../interfaces/SessionDelegate.md) |

#### Overrides

Dialog.constructor

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:37

## Accessors

### id

• `get` **id**(): `string`

A dialog is identified at each UA with a dialog ID, which consists of
a Call-ID value, a local tag and a remote tag.  The dialog ID at each
UA involved in the dialog is not the same.  Specifically, the local
tag at one UA is identical to the remote tag at the peer UA.  The
tags are opaque tokens that facilitate the generation of unique
dialog IDs.
https://tools.ietf.org/html/rfc3261#section-12

#### Returns

`string`

#### Implementation of

[Session](../interfaces/Session.md).[id](../interfaces/Session.md#id)

#### Inherited from

Dialog.id

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:53

___

### early

• `get` **early**(): `boolean`

A dialog can also be in the "early" state, which occurs when it is
created with a provisional response, and then it transition to the
"confirmed" state when a 2xx final response received or is sent.

Note: RFC 3261 is concise on when a dialog is "confirmed", but it
can be a point of confusion if an INVITE dialog is "confirmed" after
a 2xx is sent or after receiving the ACK for the 2xx response.
With careful reading it can be inferred a dialog is always is
"confirmed" when the 2xx is sent (regardless of type of dialog).
However a INVITE dialog does have additional considerations
when it is confirmed but an ACK has not yet been received (in
particular with regard to a callee sending BYE requests).

#### Returns

`boolean`

#### Inherited from

Dialog.early

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:68

___

### callId

• `get` **callId**(): `string`

Call identifier component of the dialog id.

#### Returns

`string`

#### Implementation of

[Session](../interfaces/Session.md).[callId](../interfaces/Session.md#callid)

#### Inherited from

Dialog.callId

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:70

___

### localTag

• `get` **localTag**(): `string`

Local tag component of the dialog id.

#### Returns

`string`

#### Implementation of

[Session](../interfaces/Session.md).[localTag](../interfaces/Session.md#localtag)

#### Inherited from

Dialog.localTag

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:72

___

### remoteTag

• `get` **remoteTag**(): `string`

Remote tag component of the dialog id.

#### Returns

`string`

#### Implementation of

[Session](../interfaces/Session.md).[remoteTag](../interfaces/Session.md#remotetag)

#### Inherited from

Dialog.remoteTag

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:74

___

### localSequenceNumber

• `get` **localSequenceNumber**(): `number`

Local sequence number (used to order requests from the UA to its peer).

#### Returns

`number`

#### Inherited from

Dialog.localSequenceNumber

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:76

___

### remoteSequenceNumber

• `get` **remoteSequenceNumber**(): `number`

Remote sequence number (used to order requests from its peer to the UA).

#### Returns

`number`

#### Inherited from

Dialog.remoteSequenceNumber

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:78

___

### localURI

• `get` **localURI**(): [`URI`](URI.md)

Local URI.

#### Returns

[`URI`](URI.md)

#### Implementation of

[Session](../interfaces/Session.md).[localURI](../interfaces/Session.md#localuri)

#### Inherited from

Dialog.localURI

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:80

___

### remoteURI

• `get` **remoteURI**(): [`URI`](URI.md)

Remote URI.

#### Returns

[`URI`](URI.md)

#### Implementation of

[Session](../interfaces/Session.md).[remoteURI](../interfaces/Session.md#remoteuri)

#### Inherited from

Dialog.remoteURI

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:82

___

### remoteTarget

• `get` **remoteTarget**(): [`URI`](URI.md)

Remote target.

#### Returns

[`URI`](URI.md)

#### Implementation of

[Session](../interfaces/Session.md).[remoteTarget](../interfaces/Session.md#remotetarget)

#### Inherited from

Dialog.remoteTarget

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:84

___

### routeSet

• `get` **routeSet**(): `string`[]

Route set, which is an ordered list of URIs. The route set is the
list of servers that need to be traversed to send a request to the peer.

#### Returns

`string`[]

#### Inherited from

Dialog.routeSet

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:89

___

### secure

• `get` **secure**(): `boolean`

If the request was sent over TLS, and the Request-URI contained
a SIPS URI, the "secure" flag is set to true. *NOT IMPLEMENTED*

#### Returns

`boolean`

#### Inherited from

Dialog.secure

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:94

___

### userAgentCore

• `get` **userAgentCore**(): [`UserAgentCore`](UserAgentCore.md)

The user agent core servicing this dialog.

#### Returns

[`UserAgentCore`](UserAgentCore.md)

#### Inherited from

Dialog.userAgentCore

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:96

___

### sessionState

• `get` **sessionState**(): [`SessionState`](../enums/SessionState.md)

Session state.

#### Returns

[`SessionState`](../enums/SessionState.md)

#### Implementation of

[Session](../interfaces/Session.md).[sessionState](../interfaces/Session.md#sessionstate)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:39

___

### signalingState

• `get` **signalingState**(): [`SignalingState`](../enums/SignalingState.md)

The state of the offer/answer exchange.

#### Returns

[`SignalingState`](../enums/SignalingState.md)

#### Implementation of

[Session](../interfaces/Session.md).[signalingState](../interfaces/Session.md#signalingstate)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:41

___

### offer

• `get` **offer**(): [`Body`](../interfaces/Body.md)

The current offer. Undefined unless signaling state HaveLocalOffer, HaveRemoteOffer, of Stable.

#### Returns

[`Body`](../interfaces/Body.md)

#### Implementation of

[Session](../interfaces/Session.md).[offer](../interfaces/Session.md#offer)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:43

___

### answer

• `get` **answer**(): [`Body`](../interfaces/Body.md)

The current answer. Undefined unless signaling state Stable.

#### Returns

[`Body`](../interfaces/Body.md)

#### Implementation of

[Session](../interfaces/Session.md).[answer](../interfaces/Session.md#answer)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:45

## Properties

### delegate

• **delegate**: [`SessionDelegate`](../interfaces/SessionDelegate.md)

Session delegate.

#### Implementation of

[Session](../interfaces/Session.md).[delegate](../interfaces/Session.md#delegate)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:15

___

### reinviteUserAgentClient

• **reinviteUserAgentClient**: [`ReInviteUserAgentClient`](ReInviteUserAgentClient.md)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:16

___

### reinviteUserAgentServer

• **reinviteUserAgentServer**: [`ReInviteUserAgentServer`](ReInviteUserAgentServer.md)

#### Defined in

sip.js/lib/core/dialogs/session-dialog.d.ts:17
