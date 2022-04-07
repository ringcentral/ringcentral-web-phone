[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / SessionDescriptionHandler

# Class: SessionDescriptionHandler

A base class implementing a WebRTC session description handler for sip.js.

**`remarks`**
It is expected/intended to be extended by specific WebRTC based applications.

**`privateremarks`**
So do not put application specific implementation in here.

## Implements

- `SessionDescriptionHandler`

## Table of contents

### Constructors

- [constructor](SessionDescriptionHandler.md#constructor)

### Accessors

- [localMediaStream](SessionDescriptionHandler.md#localmediastream)
- [remoteMediaStream](SessionDescriptionHandler.md#remotemediastream)
- [dataChannel](SessionDescriptionHandler.md#datachannel)
- [peerConnection](SessionDescriptionHandler.md#peerconnection)
- [peerConnectionDelegate](SessionDescriptionHandler.md#peerconnectiondelegate)

### Methods

- [close](SessionDescriptionHandler.md#close)
- [getDescription](SessionDescriptionHandler.md#getdescription)
- [hasDescription](SessionDescriptionHandler.md#hasdescription)
- [sendDtmf](SessionDescriptionHandler.md#senddtmf)
- [setDescription](SessionDescriptionHandler.md#setdescription)

## Constructors

### constructor

• **new SessionDescriptionHandler**(`logger`, `mediaStreamFactory`, `sessionDescriptionHandlerConfiguration?`)

Constructor

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `logger` | `Logger` | A logger |
| `mediaStreamFactory` | `MediaStreamFactory` | A factory to provide a MediaStream |
| `sessionDescriptionHandlerConfiguration?` | [`WebPhoneSessionDescriptionHandlerConfiguration`](../interfaces/WebPhoneSessionDescriptionHandlerConfiguration.md) | - |

#### Defined in

[src/sessionDescriptionHandler.ts:73](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/sessionDescriptionHandler.ts#L73)

## Accessors

### localMediaStream

• `get` **localMediaStream**(): `MediaStream`

The local media stream currently being sent.

**`remarks`**
The local media stream initially has no tracks, so the presence of tracks
should not be assumed. Furthermore, tracks may be added or removed if the
local media changes - for example, on upgrade from audio only to a video session.
At any given time there will be at most one audio track and one video track
(it's possible that this restriction may not apply to sub-classes).
Use `MediaStream.onaddtrack` or add a listener for the `addtrack` event
to detect when a new track becomes available:
https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/onaddtrack

#### Returns

`MediaStream`

#### Defined in

[src/sessionDescriptionHandler.ts:103](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/sessionDescriptionHandler.ts#L103)

___

### remoteMediaStream

• `get` **remoteMediaStream**(): `MediaStream`

The remote media stream currently being received.

**`remarks`**
The remote media stream initially has no tracks, so the presence of tracks
should not be assumed. Furthermore, tracks may be added or removed if the
remote media changes - for example, on upgrade from audio only to a video session.
At any given time there will be at most one audio track and one video track
(it's possible that this restriction may not apply to sub-classes).
Use `MediaStream.onaddtrack` or add a listener for the `addtrack` event
to detect when a new track becomes available:
https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/onaddtrack

#### Returns

`MediaStream`

#### Defined in

[src/sessionDescriptionHandler.ts:120](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/sessionDescriptionHandler.ts#L120)

___

### dataChannel

• `get` **dataChannel**(): `RTCDataChannel`

The data channel. Undefined before it is created.

#### Returns

`RTCDataChannel`

#### Defined in

[src/sessionDescriptionHandler.ts:127](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/sessionDescriptionHandler.ts#L127)

___

### peerConnection

• `get` **peerConnection**(): `RTCPeerConnection`

The peer connection. Undefined if peer connection has closed.

**`remarks`**
While access to the underlying `RTCPeerConnection` is provided, note that
using methods with modify it may break the operation of this class.
In particular, this class depends on exclusive access to the
event handler properties. If you need access to the peer connection
events, either register for events using `addEventListener()` on
the `RTCPeerConnection` or set the `peerConnectionDelegate` on
this `SessionDescriptionHandler`.

#### Returns

`RTCPeerConnection`

#### Defined in

[src/sessionDescriptionHandler.ts:143](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/sessionDescriptionHandler.ts#L143)

___

### peerConnectionDelegate

• `get` **peerConnectionDelegate**(): `PeerConnectionDelegate`

A delegate which provides access to the peer connection event handlers.

**`remarks`**
Setting the peer connection event handlers directly is not supported
and may break this class. As this class depends on exclusive access
to them, a delegate may be set which provides alternative access to
the event handlers in a fashion which is supported.

#### Returns

`PeerConnectionDelegate`

#### Defined in

[src/sessionDescriptionHandler.ts:156](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/sessionDescriptionHandler.ts#L156)

• `set` **peerConnectionDelegate**(`delegate`): `void`

A delegate which provides access to the peer connection event handlers.

**`remarks`**
Setting the peer connection event handlers directly is not supported
and may break this class. As this class depends on exclusive access
to them, a delegate may be set which provides alternative access to
the event handlers in a fashion which is supported.

#### Parameters

| Name | Type |
| :------ | :------ |
| `delegate` | `PeerConnectionDelegate` |

#### Returns

`void`

#### Defined in

[src/sessionDescriptionHandler.ts:160](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/sessionDescriptionHandler.ts#L160)

## Methods

### close

▸ **close**(): `void`

Stop tracks and close peer connection.

#### Returns

`void`

#### Implementation of

SessionDescriptionHandlerDefinition.close

#### Defined in

[src/sessionDescriptionHandler.ts:178](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/sessionDescriptionHandler.ts#L178)

___

### getDescription

▸ **getDescription**(`options?`, `modifiers?`): `Promise`<`BodyAndContentType`\>

Creates an offer or answer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `SessionDescriptionHandlerOptions` | Options bucket. |
| `modifiers?` | `SessionDescriptionHandlerModifier`[] | Modifiers. |

#### Returns

`Promise`<`BodyAndContentType`\>

#### Implementation of

SessionDescriptionHandlerDefinition.getDescription

#### Defined in

[src/sessionDescriptionHandler.ts:201](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/sessionDescriptionHandler.ts#L201)

___

### hasDescription

▸ **hasDescription**(`contentType`): `boolean`

Returns true if the SessionDescriptionHandler can handle the Content-Type described by a SIP message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contentType` | `string` | The content type that is in the SIP Message. |

#### Returns

`boolean`

#### Implementation of

SessionDescriptionHandlerDefinition.hasDescription

#### Defined in

[src/sessionDescriptionHandler.ts:246](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/sessionDescriptionHandler.ts#L246)

___

### sendDtmf

▸ **sendDtmf**(`tones`, `options?`): `boolean`

Send DTMF via RTP (RFC 4733).
Returns true if DTMF send is successful, false otherwise.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tones` | `string` | A string containing DTMF digits. |
| `options?` | `Object` | Options object to be used by sendDtmf. |
| `options.duration` | `number` | - |
| `options.interToneGap` | `number` | - |

#### Returns

`boolean`

#### Implementation of

SessionDescriptionHandlerDefinition.sendDtmf

#### Defined in

[src/sessionDescriptionHandler.ts:257](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/sessionDescriptionHandler.ts#L257)

___

### setDescription

▸ **setDescription**(`sdp`, `options?`, `modifiers?`): `Promise`<`void`\>

Sets an offer or answer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sdp` | `string` | The session description. |
| `options?` | `SessionDescriptionHandlerOptions` | Options bucket. |
| `modifiers?` | `SessionDescriptionHandlerModifier`[] | Modifiers. |

#### Returns

`Promise`<`void`\>

#### Implementation of

SessionDescriptionHandlerDefinition.setDescription

#### Defined in

[src/sessionDescriptionHandler.ts:291](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/sessionDescriptionHandler.ts#L291)
