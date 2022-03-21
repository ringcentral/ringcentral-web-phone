[SIP.js](../README.md) / [Exports](../modules.md) / Dialog

# Class: Dialog

Dialog.

**`remarks`**
A key concept for a user agent is that of a dialog.  A dialog
represents a peer-to-peer SIP relationship between two user agents
that persists for some time.  The dialog facilitates sequencing of
messages between the user agents and proper routing of requests
between both of them.  The dialog represents a context in which to
interpret SIP messages.
https://tools.ietf.org/html/rfc3261#section-12

## Hierarchy

- **`Dialog`**

  ↳ [`SessionDialog`](SessionDialog.md)

  ↳ [`SubscriptionDialog`](SubscriptionDialog.md)

## Table of contents

### Methods

- [initialDialogStateForUserAgentClient](Dialog.md#initialdialogstateforuseragentclient)
- [initialDialogStateForUserAgentServer](Dialog.md#initialdialogstateforuseragentserver)
- [dispose](Dialog.md#dispose)
- [confirm](Dialog.md#confirm)
- [receiveRequest](Dialog.md#receiverequest)
- [recomputeRouteSet](Dialog.md#recomputerouteset)
- [createOutgoingRequestMessage](Dialog.md#createoutgoingrequestmessage)
- [incrementLocalSequenceNumber](Dialog.md#incrementlocalsequencenumber)

### Accessors

- [id](Dialog.md#id)
- [early](Dialog.md#early)
- [callId](Dialog.md#callid)
- [localTag](Dialog.md#localtag)
- [remoteTag](Dialog.md#remotetag)
- [localSequenceNumber](Dialog.md#localsequencenumber)
- [remoteSequenceNumber](Dialog.md#remotesequencenumber)
- [localURI](Dialog.md#localuri)
- [remoteURI](Dialog.md#remoteuri)
- [remoteTarget](Dialog.md#remotetarget)
- [routeSet](Dialog.md#routeset)
- [secure](Dialog.md#secure)
- [userAgentCore](Dialog.md#useragentcore)

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

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:41

___

### dispose

▸ **dispose**(): `void`

Destructor.

#### Returns

`void`

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:43

___

### confirm

▸ **confirm**(): `void`

Confirm the dialog. Only matters if dialog is currently early.

#### Returns

`void`

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:98

___

### receiveRequest

▸ **receiveRequest**(`message`): `void`

Requests sent within a dialog, as any other requests, are atomic.  If
a particular request is accepted by the UAS, all the state changes
associated with it are performed.  If the request is rejected, none
of the state changes are performed.

   Note that some requests, such as INVITEs, affect several pieces of
   state.

https://tools.ietf.org/html/rfc3261#section-12.2.2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`IncomingRequestMessage`](IncomingRequestMessage.md) | Incoming request message within this dialog. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:111

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

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:149

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

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:68

___

### callId

• `get` **callId**(): `string`

Call identifier component of the dialog id.

#### Returns

`string`

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:70

___

### localTag

• `get` **localTag**(): `string`

Local tag component of the dialog id.

#### Returns

`string`

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:72

___

### remoteTag

• `get` **remoteTag**(): `string`

Remote tag component of the dialog id.

#### Returns

`string`

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:74

___

### localSequenceNumber

• `get` **localSequenceNumber**(): `number`

Local sequence number (used to order requests from the UA to its peer).

#### Returns

`number`

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:76

___

### remoteSequenceNumber

• `get` **remoteSequenceNumber**(): `number`

Remote sequence number (used to order requests from its peer to the UA).

#### Returns

`number`

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:78

___

### localURI

• `get` **localURI**(): [`URI`](URI.md)

Local URI.

#### Returns

[`URI`](URI.md)

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:80

___

### remoteURI

• `get` **remoteURI**(): [`URI`](URI.md)

Remote URI.

#### Returns

[`URI`](URI.md)

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:82

___

### remoteTarget

• `get` **remoteTarget**(): [`URI`](URI.md)

Remote target.

#### Returns

[`URI`](URI.md)

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:84

___

### routeSet

• `get` **routeSet**(): `string`[]

Route set, which is an ordered list of URIs. The route set is the
list of servers that need to be traversed to send a request to the peer.

#### Returns

`string`[]

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:89

___

### secure

• `get` **secure**(): `boolean`

If the request was sent over TLS, and the Request-URI contained
a SIPS URI, the "secure" flag is set to true. *NOT IMPLEMENTED*

#### Returns

`boolean`

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:94

___

### userAgentCore

• `get` **userAgentCore**(): [`UserAgentCore`](UserAgentCore.md)

The user agent core servicing this dialog.

#### Returns

[`UserAgentCore`](UserAgentCore.md)

#### Defined in

sip.js/lib/core/dialogs/dialog.d.ts:96
