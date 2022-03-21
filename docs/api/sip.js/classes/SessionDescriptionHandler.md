[SIP.js](../README.md) / [Exports](../modules.md) / SessionDescriptionHandler

# Class: SessionDescriptionHandler

A base class implementing a WebRTC session description handler for sip.js.

**`remarks`**
It is expected/intended to be extended by specific WebRTC based applications.

**`privateremarks`**
So do not put application specific implementation in here.

## Implements

- [`SessionDescriptionHandler`](../interfaces/SessionDescriptionHandler.md)

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
| `logger` | [`Logger`](Logger.md) | A logger |
| `mediaStreamFactory` | [`MediaStreamFactory`](../modules.md#mediastreamfactory) | A factory to provide a MediaStream |
| `sessionDescriptionHandlerConfiguration?` | [`SessionDescriptionHandlerConfiguration`](../interfaces/SessionDescriptionHandlerConfiguration.md) | - |

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler.d.ts:44

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

sip.js/lib/platform/web/session-description-handler/session-description-handler.d.ts:58

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

sip.js/lib/platform/web/session-description-handler/session-description-handler.d.ts:72

___

### dataChannel

• `get` **dataChannel**(): `RTCDataChannel`

The data channel. Undefined before it is created.

#### Returns

`RTCDataChannel`

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler.d.ts:76

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

sip.js/lib/platform/web/session-description-handler/session-description-handler.d.ts:89

___

### peerConnectionDelegate

• `get` **peerConnectionDelegate**(): [`PeerConnectionDelegate`](../interfaces/PeerConnectionDelegate.md)

A delegate which provides access to the peer connection event handlers.

**`remarks`**
Setting the peer connection event handlers directly is not supported
and may break this class. As this class depends on exclusive access
to them, a delegate may be set which provides alternative access to
the event handlers in a fashion which is supported.

#### Returns

[`PeerConnectionDelegate`](../interfaces/PeerConnectionDelegate.md)

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler.d.ts:99

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
| `delegate` | [`PeerConnectionDelegate`](../interfaces/PeerConnectionDelegate.md) |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler.d.ts:100

## Methods

### close

▸ **close**(): `void`

Stop tracks and close peer connection.

#### Returns

`void`

#### Implementation of

[SessionDescriptionHandler](../interfaces/SessionDescriptionHandler.md).[close](../interfaces/SessionDescriptionHandler.md#close)

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler.d.ts:106

___

### getDescription

▸ **getDescription**(`options?`, `modifiers?`): `Promise`<[`BodyAndContentType`](../interfaces/BodyAndContentType.md)\>

Creates an offer or answer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`SessionDescriptionHandlerOptions`](../interfaces/SessionDescriptionHandlerOptions.md) | Options bucket. |
| `modifiers?` | [`SessionDescriptionHandlerModifier`](../interfaces/SessionDescriptionHandlerModifier.md)[] | Modifiers. |

#### Returns

`Promise`<[`BodyAndContentType`](../interfaces/BodyAndContentType.md)\>

#### Implementation of

[SessionDescriptionHandler](../interfaces/SessionDescriptionHandler.md).[getDescription](../interfaces/SessionDescriptionHandler.md#getdescription)

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler.d.ts:112

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

[SessionDescriptionHandler](../interfaces/SessionDescriptionHandler.md).[hasDescription](../interfaces/SessionDescriptionHandler.md#hasdescription)

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler.d.ts:117

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

[SessionDescriptionHandler](../interfaces/SessionDescriptionHandler.md).[sendDtmf](../interfaces/SessionDescriptionHandler.md#senddtmf)

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler.d.ts:124

___

### setDescription

▸ **setDescription**(`sdp`, `options?`, `modifiers?`): `Promise`<`void`\>

Sets an offer or answer.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sdp` | `string` | The session description. |
| `options?` | [`SessionDescriptionHandlerOptions`](../interfaces/SessionDescriptionHandlerOptions.md) | Options bucket. |
| `modifiers?` | [`SessionDescriptionHandlerModifier`](../interfaces/SessionDescriptionHandlerModifier.md)[] | Modifiers. |

#### Returns

`Promise`<`void`\>

#### Implementation of

[SessionDescriptionHandler](../interfaces/SessionDescriptionHandler.md).[setDescription](../interfaces/SessionDescriptionHandler.md#setdescription)

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler.d.ts:134
