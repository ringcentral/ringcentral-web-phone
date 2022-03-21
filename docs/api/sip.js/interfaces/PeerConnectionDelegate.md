[SIP.js](../README.md) / [Exports](../modules.md) / PeerConnectionDelegate

# Interface: PeerConnectionDelegate

Delegate to handle PeerConnection state changes.

## Table of contents

### Methods

- [onconnectionstatechange](PeerConnectionDelegate.md#onconnectionstatechange)
- [ondatachannel](PeerConnectionDelegate.md#ondatachannel)
- [onicecandidate](PeerConnectionDelegate.md#onicecandidate)
- [onicecandidateerror](PeerConnectionDelegate.md#onicecandidateerror)
- [oniceconnectionstatechange](PeerConnectionDelegate.md#oniceconnectionstatechange)
- [onicegatheringstatechange](PeerConnectionDelegate.md#onicegatheringstatechange)
- [onnegotiationneeded](PeerConnectionDelegate.md#onnegotiationneeded)
- [onsignalingstatechange](PeerConnectionDelegate.md#onsignalingstatechange)
- [onstatsended](PeerConnectionDelegate.md#onstatsended)
- [ontrack](PeerConnectionDelegate.md#ontrack)

## Methods

### onconnectionstatechange

▸ `Optional` **onconnectionstatechange**(`event`): `void`

This happens whenever the aggregate state of the connection changes.
The aggregate state is a combination of the states of all of the
individual network transports being used by the connection.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `Event` | Event. |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/session-description-handler/peer-connection-delegate.d.ts:12

___

### ondatachannel

▸ `Optional` **ondatachannel**(`event`): `void`

Triggered when an RTCDataChannel is added to the connection by the
remote peer calling createDataChannel().

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `RTCDataChannelEvent` | RTCDataChannelEvent. |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/session-description-handler/peer-connection-delegate.d.ts:18

___

### onicecandidate

▸ `Optional` **onicecandidate**(`event`): `void`

Triggered when a new ICE candidate has been found.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `RTCPeerConnectionIceEvent` | RTCPeerConnectionIceEvent. |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/session-description-handler/peer-connection-delegate.d.ts:23

___

### onicecandidateerror

▸ `Optional` **onicecandidateerror**(`event`): `void`

Triggered when an error occurred during ICE candidate gathering.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `RTCPeerConnectionIceErrorEvent` | RTCPeerConnectionIceErrorEvent. |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/session-description-handler/peer-connection-delegate.d.ts:28

___

### oniceconnectionstatechange

▸ `Optional` **oniceconnectionstatechange**(`event`): `void`

This happens whenever the local ICE agent needs to deliver a message to
the other peer through the signaling server. This lets the ICE agent
perform negotiation with the remote peer without the browser itself
needing to know any specifics about the technology being used for
signalingTriggered when the IceConnectionState changes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `Event` | Event. |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/session-description-handler/peer-connection-delegate.d.ts:37

___

### onicegatheringstatechange

▸ `Optional` **onicegatheringstatechange**(`event`): `void`

Triggered when the ICE gathering state changes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `Event` | Event. |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/session-description-handler/peer-connection-delegate.d.ts:42

___

### onnegotiationneeded

▸ `Optional` **onnegotiationneeded**(`event`): `void`

Triggered when renegotiation is necessary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `Event` | Event. |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/session-description-handler/peer-connection-delegate.d.ts:47

___

### onsignalingstatechange

▸ `Optional` **onsignalingstatechange**(`event`): `void`

Triggered when the SignalingState changes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `Event` | Event. |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/session-description-handler/peer-connection-delegate.d.ts:52

___

### onstatsended

▸ `Optional` **onstatsended**(`event`): `void`

Triggered when when a statistics object being monitored is deleted.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `Event` | Event. |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/session-description-handler/peer-connection-delegate.d.ts:57

___

### ontrack

▸ `Optional` **ontrack**(`event`): `void`

Triggered when a new track is signaled by the remote peer, as a result of setRemoteDescription.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | `Event` | Event. |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/session-description-handler/peer-connection-delegate.d.ts:62
