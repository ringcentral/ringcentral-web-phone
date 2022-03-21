[SIP.js](../README.md) / [Exports](../modules.md) / DialogState

# Interface: DialogState

Dialog state.

**`remarks`**
A dialog contains certain pieces of state needed for further message
transmissions within the dialog.  This state consists of the dialog
ID, a local sequence number (used to order requests from the UA to
its peer), a remote sequence number (used to order requests from its
peer to the UA), a local URI, a remote URI, remote target, a boolean
flag called "secure", and a route set, which is an ordered list of
URIs.  The route set is the list of servers that need to be traversed
to send a request to the peer.  A dialog can also be in the "early"
state, which occurs when it is created with a provisional response,
and then transition to the "confirmed" state when a 2xx final
response arrives.  For other responses, or if no response arrives at
all on that dialog, the early dialog terminates.

https://tools.ietf.org/html/rfc3261#section-12

## Table of contents

### Properties

- [id](DialogState.md#id)
- [early](DialogState.md#early)
- [callId](DialogState.md#callid)
- [localTag](DialogState.md#localtag)
- [remoteTag](DialogState.md#remotetag)
- [localSequenceNumber](DialogState.md#localsequencenumber)
- [remoteSequenceNumber](DialogState.md#remotesequencenumber)
- [localURI](DialogState.md#localuri)
- [remoteURI](DialogState.md#remoteuri)
- [remoteTarget](DialogState.md#remotetarget)
- [routeSet](DialogState.md#routeset)
- [secure](DialogState.md#secure)

## Properties

### id

• **id**: `string`

#### Defined in

sip.js/lib/core/dialogs/dialog-state.d.ts:22

___

### early

• **early**: `boolean`

#### Defined in

sip.js/lib/core/dialogs/dialog-state.d.ts:23

___

### callId

• **callId**: `string`

#### Defined in

sip.js/lib/core/dialogs/dialog-state.d.ts:24

___

### localTag

• **localTag**: `string`

#### Defined in

sip.js/lib/core/dialogs/dialog-state.d.ts:25

___

### remoteTag

• **remoteTag**: `string`

#### Defined in

sip.js/lib/core/dialogs/dialog-state.d.ts:26

___

### localSequenceNumber

• **localSequenceNumber**: `number`

#### Defined in

sip.js/lib/core/dialogs/dialog-state.d.ts:27

___

### remoteSequenceNumber

• **remoteSequenceNumber**: `number`

#### Defined in

sip.js/lib/core/dialogs/dialog-state.d.ts:28

___

### localURI

• **localURI**: [`URI`](../classes/URI.md)

#### Defined in

sip.js/lib/core/dialogs/dialog-state.d.ts:29

___

### remoteURI

• **remoteURI**: [`URI`](../classes/URI.md)

#### Defined in

sip.js/lib/core/dialogs/dialog-state.d.ts:30

___

### remoteTarget

• **remoteTarget**: [`URI`](../classes/URI.md)

#### Defined in

sip.js/lib/core/dialogs/dialog-state.d.ts:31

___

### routeSet

• **routeSet**: `string`[]

#### Defined in

sip.js/lib/core/dialogs/dialog-state.d.ts:32

___

### secure

• **secure**: `boolean`

#### Defined in

sip.js/lib/core/dialogs/dialog-state.d.ts:33
