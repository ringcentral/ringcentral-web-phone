[SIP.js](../README.md) / [Exports](../modules.md) / SubscriptionDialog

# Class: SubscriptionDialog

Subscription Dialog.

**`remarks`**
SIP-Specific Event Notification

Abstract

   This document describes an extension to the Session Initiation
   Protocol (SIP) defined by RFC 3261.  The purpose of this extension is
   to provide an extensible framework by which SIP nodes can request
   notification from remote nodes indicating that certain events have
   occurred.

   Note that the event notification mechanisms defined herein are NOT
   intended to be a general-purpose infrastructure for all classes of
   event subscription and notification.

   This document represents a backwards-compatible improvement on the
   original mechanism described by RFC 3265, taking into account several
   years of implementation experience.  Accordingly, this document
   obsoletes RFC 3265.  This document also updates RFC 4660 slightly to
   accommodate some small changes to the mechanism that were discussed
   in that document.

 https://tools.ietf.org/html/rfc6665

## Hierarchy

- [`Dialog`](Dialog.md)

  ↳ **`SubscriptionDialog`**

## Implements

- [`Subscription`](../interfaces/Subscription.md)

## Table of contents

### Methods

- [initialDialogStateForUserAgentClient](SubscriptionDialog.md#initialdialogstateforuseragentclient)
- [initialDialogStateForUserAgentServer](SubscriptionDialog.md#initialdialogstateforuseragentserver)
- [initialDialogStateForSubscription](SubscriptionDialog.md#initialdialogstateforsubscription)
- [confirm](SubscriptionDialog.md#confirm)
- [recomputeRouteSet](SubscriptionDialog.md#recomputerouteset)
- [createOutgoingRequestMessage](SubscriptionDialog.md#createoutgoingrequestmessage)
- [incrementLocalSequenceNumber](SubscriptionDialog.md#incrementlocalsequencenumber)
- [dispose](SubscriptionDialog.md#dispose)
- [receiveRequest](SubscriptionDialog.md#receiverequest)
- [refresh](SubscriptionDialog.md#refresh)
- [subscribe](SubscriptionDialog.md#subscribe)
- [terminate](SubscriptionDialog.md#terminate)
- [unsubscribe](SubscriptionDialog.md#unsubscribe)

### Properties

- [delegate](SubscriptionDialog.md#delegate)

### Constructors

- [constructor](SubscriptionDialog.md#constructor)

### Accessors

- [id](SubscriptionDialog.md#id)
- [early](SubscriptionDialog.md#early)
- [callId](SubscriptionDialog.md#callid)
- [localTag](SubscriptionDialog.md#localtag)
- [remoteTag](SubscriptionDialog.md#remotetag)
- [localSequenceNumber](SubscriptionDialog.md#localsequencenumber)
- [remoteSequenceNumber](SubscriptionDialog.md#remotesequencenumber)
- [localURI](SubscriptionDialog.md#localuri)
- [remoteURI](SubscriptionDialog.md#remoteuri)
- [remoteTarget](SubscriptionDialog.md#remotetarget)
- [routeSet](SubscriptionDialog.md#routeset)
- [secure](SubscriptionDialog.md#secure)
- [userAgentCore](SubscriptionDialog.md#useragentcore)
- [autoRefresh](SubscriptionDialog.md#autorefresh)
- [subscriptionEvent](SubscriptionDialog.md#subscriptionevent)
- [subscriptionExpires](SubscriptionDialog.md#subscriptionexpires)
- [subscriptionExpiresInitial](SubscriptionDialog.md#subscriptionexpiresinitial)
- [subscriptionRefresh](SubscriptionDialog.md#subscriptionrefresh)
- [subscriptionState](SubscriptionDialog.md#subscriptionstate)

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

### initialDialogStateForSubscription

▸ `Static` **initialDialogStateForSubscription**(`outgoingSubscribeRequestMessage`, `incomingNotifyRequestMessage`): [`DialogState`](../interfaces/DialogState.md)

When a UAC receives a response that establishes a dialog, it
constructs the state of the dialog.  This state MUST be maintained
for the duration of the dialog.
https://tools.ietf.org/html/rfc3261#section-12.1.2

#### Parameters

| Name | Type |
| :------ | :------ |
| `outgoingSubscribeRequestMessage` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) |
| `incomingNotifyRequestMessage` | [`IncomingRequestMessage`](IncomingRequestMessage.md) |

#### Returns

[`DialogState`](../interfaces/DialogState.md)

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:55

___

### confirm

▸ **confirm**(): `void`

Confirm the dialog. Only matters if dialog is currently early.

#### Returns

`void`

#### Inherited from

[Dialog](Dialog.md).[confirm](Dialog.md#confirm)

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:98

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

Destroy subscription.

#### Returns

`void`

#### Implementation of

[Subscription](../interfaces/Subscription.md).[dispose](../interfaces/Subscription.md#dispose)

#### Overrides

[Dialog](Dialog.md).[dispose](Dialog.md#dispose)

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:56

___

### receiveRequest

▸ **receiveRequest**(`message`): `void`

Receive in dialog request message from transport.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`IncomingRequestMessage`](IncomingRequestMessage.md) | The incoming request message. |

#### Returns

`void`

#### Overrides

[Dialog](Dialog.md).[receiveRequest](Dialog.md#receiverequest)

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:71

___

### refresh

▸ **refresh**(): [`OutgoingSubscribeRequest`](../interfaces/OutgoingSubscribeRequest.md)

4.1.2.2.  Refreshing of Subscriptions
https://tools.ietf.org/html/rfc6665#section-4.1.2.2

#### Returns

[`OutgoingSubscribeRequest`](../interfaces/OutgoingSubscribeRequest.md)

#### Implementation of

[Subscription](../interfaces/Subscription.md).[refresh](../interfaces/Subscription.md#refresh)

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:76

___

### subscribe

▸ **subscribe**(`delegate?`, `options?`): [`OutgoingSubscribeRequest`](../interfaces/OutgoingSubscribeRequest.md)

4.1.2.2.  Refreshing of Subscriptions
https://tools.ietf.org/html/rfc6665#section-4.1.2.2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingSubscribeRequestDelegate`](../interfaces/OutgoingSubscribeRequestDelegate.md) | Delegate to handle responses. |
| `options?` | [`RequestOptions`](../interfaces/RequestOptions.md) | Options bucket. |

#### Returns

[`OutgoingSubscribeRequest`](../interfaces/OutgoingSubscribeRequest.md)

#### Implementation of

[Subscription](../interfaces/Subscription.md).[subscribe](../interfaces/Subscription.md#subscribe)

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:83

___

### terminate

▸ **terminate**(): `void`

4.4.1.  Dialog Creation and Termination
A subscription is destroyed after a notifier sends a NOTIFY request
with a "Subscription-State" of "terminated", or in certain error
situations described elsewhere in this document.
https://tools.ietf.org/html/rfc6665#section-4.4.1

#### Returns

`void`

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:91

___

### unsubscribe

▸ **unsubscribe**(): [`OutgoingSubscribeRequest`](../interfaces/OutgoingSubscribeRequest.md)

4.1.2.3.  Unsubscribing
https://tools.ietf.org/html/rfc6665#section-4.1.2.3

#### Returns

[`OutgoingSubscribeRequest`](../interfaces/OutgoingSubscribeRequest.md)

#### Implementation of

[Subscription](../interfaces/Subscription.md).[unsubscribe](../interfaces/Subscription.md#unsubscribe)

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:96

## Properties

### delegate

• **delegate**: [`SubscriptionDelegate`](../interfaces/SubscriptionDelegate.md)

Subscription delegate.

#### Implementation of

[Subscription](../interfaces/Subscription.md).[delegate](../interfaces/Subscription.md#delegate)

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:34

## Constructors

### constructor

• **new SubscriptionDialog**(`subscriptionEvent`, `subscriptionExpires`, `subscriptionState`, `core`, `state`, `delegate?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `subscriptionEvent` | `string` |
| `subscriptionExpires` | `number` |
| `subscriptionState` | [`SubscriptionState`](../enums/SubscriptionState.md) |
| `core` | [`UserAgentCore`](UserAgentCore.md) |
| `state` | [`DialogState`](../interfaces/DialogState.md) |
| `delegate?` | [`SubscriptionDelegate`](../interfaces/SubscriptionDelegate.md) |

#### Overrides

Dialog.constructor

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:46

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

[Subscription](../interfaces/Subscription.md).[id](../interfaces/Subscription.md#id)

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

### autoRefresh

• `get` **autoRefresh**(): `boolean`

If true, refresh subscription prior to expiration. Default is false.

#### Returns

`boolean`

#### Implementation of

[Subscription](../interfaces/Subscription.md).[autoRefresh](../interfaces/Subscription.md#autorefresh)

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:57

• `set` **autoRefresh**(`autoRefresh`): `void`

If true, refresh subscription prior to expiration. Default is false.

#### Parameters

| Name | Type |
| :------ | :------ |
| `autoRefresh` | `boolean` |

#### Returns

`void`

#### Implementation of

[Subscription](../interfaces/Subscription.md).[autoRefresh](../interfaces/Subscription.md#autorefresh)

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:58

___

### subscriptionEvent

• `get` **subscriptionEvent**(): `string`

#### Returns

`string`

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:59

___

### subscriptionExpires

• `get` **subscriptionExpires**(): `number`

Number of seconds until subscription expires.

#### Returns

`number`

#### Implementation of

[Subscription](../interfaces/Subscription.md).[subscriptionExpires](../interfaces/Subscription.md#subscriptionexpires)

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:61

• `set` **subscriptionExpires**(`expires`): `void`

Number of seconds until subscription expires.

#### Parameters

| Name | Type |
| :------ | :------ |
| `expires` | `number` |

#### Returns

`void`

#### Implementation of

[Subscription](../interfaces/Subscription.md).[subscriptionExpires](../interfaces/Subscription.md#subscriptionexpires)

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:62

___

### subscriptionExpiresInitial

• `get` **subscriptionExpiresInitial**(): `number`

#### Returns

`number`

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:63

___

### subscriptionRefresh

• `get` **subscriptionRefresh**(): `number`

Number of seconds until subscription auto refresh.

#### Returns

`number`

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:65

___

### subscriptionState

• `get` **subscriptionState**(): [`SubscriptionState`](../enums/SubscriptionState.md)

Subscription state.

#### Returns

[`SubscriptionState`](../enums/SubscriptionState.md)

#### Implementation of

[Subscription](../interfaces/Subscription.md).[subscriptionState](../interfaces/Subscription.md#subscriptionstate)

#### Defined in

sip.js/lib/core/dialogs/subscription-dialog.d.ts:66
