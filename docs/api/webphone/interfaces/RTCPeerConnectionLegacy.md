[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / RTCPeerConnectionLegacy

# Interface: RTCPeerConnectionLegacy

## Hierarchy

- `RTCPeerConnection`

  ↳ **`RTCPeerConnectionLegacy`**

## Table of contents

### Methods

- [dispatchEvent](RTCPeerConnectionLegacy.md#dispatchevent)
- [addIceCandidate](RTCPeerConnectionLegacy.md#addicecandidate)
- [addTrack](RTCPeerConnectionLegacy.md#addtrack)
- [addTransceiver](RTCPeerConnectionLegacy.md#addtransceiver)
- [close](RTCPeerConnectionLegacy.md#close)
- [createAnswer](RTCPeerConnectionLegacy.md#createanswer)
- [createDataChannel](RTCPeerConnectionLegacy.md#createdatachannel)
- [createOffer](RTCPeerConnectionLegacy.md#createoffer)
- [getConfiguration](RTCPeerConnectionLegacy.md#getconfiguration)
- [getReceivers](RTCPeerConnectionLegacy.md#getreceivers)
- [getSenders](RTCPeerConnectionLegacy.md#getsenders)
- [getStats](RTCPeerConnectionLegacy.md#getstats)
- [getTransceivers](RTCPeerConnectionLegacy.md#gettransceivers)
- [removeTrack](RTCPeerConnectionLegacy.md#removetrack)
- [restartIce](RTCPeerConnectionLegacy.md#restartice)
- [setConfiguration](RTCPeerConnectionLegacy.md#setconfiguration)
- [setLocalDescription](RTCPeerConnectionLegacy.md#setlocaldescription)
- [setRemoteDescription](RTCPeerConnectionLegacy.md#setremotedescription)
- [addEventListener](RTCPeerConnectionLegacy.md#addeventlistener)
- [removeEventListener](RTCPeerConnectionLegacy.md#removeeventlistener)
- [getRemoteStreams](RTCPeerConnectionLegacy.md#getremotestreams)
- [getLocalStreams](RTCPeerConnectionLegacy.md#getlocalstreams)

### Properties

- [canTrickleIceCandidates](RTCPeerConnectionLegacy.md#cantrickleicecandidates)
- [connectionState](RTCPeerConnectionLegacy.md#connectionstate)
- [currentLocalDescription](RTCPeerConnectionLegacy.md#currentlocaldescription)
- [currentRemoteDescription](RTCPeerConnectionLegacy.md#currentremotedescription)
- [iceConnectionState](RTCPeerConnectionLegacy.md#iceconnectionstate)
- [iceGatheringState](RTCPeerConnectionLegacy.md#icegatheringstate)
- [localDescription](RTCPeerConnectionLegacy.md#localdescription)
- [onconnectionstatechange](RTCPeerConnectionLegacy.md#onconnectionstatechange)
- [ondatachannel](RTCPeerConnectionLegacy.md#ondatachannel)
- [onicecandidate](RTCPeerConnectionLegacy.md#onicecandidate)
- [onicecandidateerror](RTCPeerConnectionLegacy.md#onicecandidateerror)
- [oniceconnectionstatechange](RTCPeerConnectionLegacy.md#oniceconnectionstatechange)
- [onicegatheringstatechange](RTCPeerConnectionLegacy.md#onicegatheringstatechange)
- [onnegotiationneeded](RTCPeerConnectionLegacy.md#onnegotiationneeded)
- [onsignalingstatechange](RTCPeerConnectionLegacy.md#onsignalingstatechange)
- [ontrack](RTCPeerConnectionLegacy.md#ontrack)
- [pendingLocalDescription](RTCPeerConnectionLegacy.md#pendinglocaldescription)
- [pendingRemoteDescription](RTCPeerConnectionLegacy.md#pendingremotedescription)
- [remoteDescription](RTCPeerConnectionLegacy.md#remotedescription)
- [signalingState](RTCPeerConnectionLegacy.md#signalingstate)

## Methods

### dispatchEvent

▸ **dispatchEvent**(`event`): `boolean`

Dispatches a synthetic event event to target and returns true if either event's cancelable attribute value is false or its preventDefault() method was not invoked, and false otherwise.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `Event` |

#### Returns

`boolean`

#### Inherited from

RTCPeerConnection.dispatchEvent

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:5033

___

### addIceCandidate

▸ **addIceCandidate**(`candidate?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `candidate?` | `RTCIceCandidateInit` |

#### Returns

`Promise`<`void`\>

#### Inherited from

RTCPeerConnection.addIceCandidate

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10927

▸ **addIceCandidate**(`candidate`, `successCallback`, `failureCallback`): `Promise`<`void`\>

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `candidate` | `RTCIceCandidateInit` |
| `successCallback` | `VoidFunction` |
| `failureCallback` | `RTCPeerConnectionErrorCallback` |

#### Returns

`Promise`<`void`\>

#### Inherited from

RTCPeerConnection.addIceCandidate

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10929

___

### addTrack

▸ **addTrack**(`track`, ...`streams`): `RTCRtpSender`

#### Parameters

| Name | Type |
| :------ | :------ |
| `track` | `MediaStreamTrack` |
| `...streams` | `MediaStream`[] |

#### Returns

`RTCRtpSender`

#### Inherited from

RTCPeerConnection.addTrack

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10930

___

### addTransceiver

▸ **addTransceiver**(`trackOrKind`, `init?`): `RTCRtpTransceiver`

#### Parameters

| Name | Type |
| :------ | :------ |
| `trackOrKind` | `string` \| `MediaStreamTrack` |
| `init?` | `RTCRtpTransceiverInit` |

#### Returns

`RTCRtpTransceiver`

#### Inherited from

RTCPeerConnection.addTransceiver

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10931

___

### close

▸ **close**(): `void`

#### Returns

`void`

#### Inherited from

RTCPeerConnection.close

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10932

___

### createAnswer

▸ **createAnswer**(`options?`): `Promise`<`RTCSessionDescriptionInit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `RTCAnswerOptions` |

#### Returns

`Promise`<`RTCSessionDescriptionInit`\>

#### Inherited from

RTCPeerConnection.createAnswer

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10933

▸ **createAnswer**(`successCallback`, `failureCallback`): `Promise`<`void`\>

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `successCallback` | `RTCSessionDescriptionCallback` |
| `failureCallback` | `RTCPeerConnectionErrorCallback` |

#### Returns

`Promise`<`void`\>

#### Inherited from

RTCPeerConnection.createAnswer

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10935

___

### createDataChannel

▸ **createDataChannel**(`label`, `dataChannelDict?`): `RTCDataChannel`

#### Parameters

| Name | Type |
| :------ | :------ |
| `label` | `string` |
| `dataChannelDict?` | `RTCDataChannelInit` |

#### Returns

`RTCDataChannel`

#### Inherited from

RTCPeerConnection.createDataChannel

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10936

___

### createOffer

▸ **createOffer**(`options?`): `Promise`<`RTCSessionDescriptionInit`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `RTCOfferOptions` |

#### Returns

`Promise`<`RTCSessionDescriptionInit`\>

#### Inherited from

RTCPeerConnection.createOffer

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10937

▸ **createOffer**(`successCallback`, `failureCallback`, `options?`): `Promise`<`void`\>

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `successCallback` | `RTCSessionDescriptionCallback` |
| `failureCallback` | `RTCPeerConnectionErrorCallback` |
| `options?` | `RTCOfferOptions` |

#### Returns

`Promise`<`void`\>

#### Inherited from

RTCPeerConnection.createOffer

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10939

___

### getConfiguration

▸ **getConfiguration**(): `RTCConfiguration`

#### Returns

`RTCConfiguration`

#### Inherited from

RTCPeerConnection.getConfiguration

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10940

___

### getReceivers

▸ **getReceivers**(): `RTCRtpReceiver`[]

#### Returns

`RTCRtpReceiver`[]

#### Inherited from

RTCPeerConnection.getReceivers

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10941

___

### getSenders

▸ **getSenders**(): `RTCRtpSender`[]

#### Returns

`RTCRtpSender`[]

#### Inherited from

RTCPeerConnection.getSenders

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10942

___

### getStats

▸ **getStats**(`selector?`): `Promise`<`RTCStatsReport`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `selector?` | `MediaStreamTrack` |

#### Returns

`Promise`<`RTCStatsReport`\>

#### Inherited from

RTCPeerConnection.getStats

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10943

___

### getTransceivers

▸ **getTransceivers**(): `RTCRtpTransceiver`[]

#### Returns

`RTCRtpTransceiver`[]

#### Inherited from

RTCPeerConnection.getTransceivers

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10944

___

### removeTrack

▸ **removeTrack**(`sender`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sender` | `RTCRtpSender` |

#### Returns

`void`

#### Inherited from

RTCPeerConnection.removeTrack

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10945

___

### restartIce

▸ **restartIce**(): `void`

#### Returns

`void`

#### Inherited from

RTCPeerConnection.restartIce

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10946

___

### setConfiguration

▸ **setConfiguration**(`configuration?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `configuration?` | `RTCConfiguration` |

#### Returns

`void`

#### Inherited from

RTCPeerConnection.setConfiguration

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10947

___

### setLocalDescription

▸ **setLocalDescription**(`description?`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `description?` | `RTCLocalSessionDescriptionInit` |

#### Returns

`Promise`<`void`\>

#### Inherited from

RTCPeerConnection.setLocalDescription

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10948

▸ **setLocalDescription**(`description`, `successCallback`, `failureCallback`): `Promise`<`void`\>

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `description` | `RTCLocalSessionDescriptionInit` |
| `successCallback` | `VoidFunction` |
| `failureCallback` | `RTCPeerConnectionErrorCallback` |

#### Returns

`Promise`<`void`\>

#### Inherited from

RTCPeerConnection.setLocalDescription

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10950

___

### setRemoteDescription

▸ **setRemoteDescription**(`description`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `description` | `RTCSessionDescriptionInit` |

#### Returns

`Promise`<`void`\>

#### Inherited from

RTCPeerConnection.setRemoteDescription

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10951

▸ **setRemoteDescription**(`description`, `successCallback`, `failureCallback`): `Promise`<`void`\>

**`deprecated`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `description` | `RTCSessionDescriptionInit` |
| `successCallback` | `VoidFunction` |
| `failureCallback` | `RTCPeerConnectionErrorCallback` |

#### Returns

`Promise`<`void`\>

#### Inherited from

RTCPeerConnection.setRemoteDescription

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10953

___

### addEventListener

▸ **addEventListener**<`K`\>(`type`, `listener`, `options?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `RTCPeerConnectionEventMap` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `K` |
| `listener` | (`this`: `RTCPeerConnection`, `ev`: `RTCPeerConnectionEventMap`[`K`]) => `any` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

#### Returns

`void`

#### Inherited from

RTCPeerConnection.addEventListener

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10954

▸ **addEventListener**(`type`, `listener`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `boolean` \| `AddEventListenerOptions` |

#### Returns

`void`

#### Inherited from

RTCPeerConnection.addEventListener

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10955

___

### removeEventListener

▸ **removeEventListener**<`K`\>(`type`, `listener`, `options?`): `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `RTCPeerConnectionEventMap` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `K` |
| `listener` | (`this`: `RTCPeerConnection`, `ev`: `RTCPeerConnectionEventMap`[`K`]) => `any` |
| `options?` | `boolean` \| `EventListenerOptions` |

#### Returns

`void`

#### Inherited from

RTCPeerConnection.removeEventListener

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10956

▸ **removeEventListener**(`type`, `listener`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `type` | `string` |
| `listener` | `EventListenerOrEventListenerObject` |
| `options?` | `boolean` \| `EventListenerOptions` |

#### Returns

`void`

#### Inherited from

RTCPeerConnection.removeEventListener

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10957

___

### getRemoteStreams

▸ **getRemoteStreams**(): `MediaStream`[]

#### Returns

`MediaStream`[]

#### Defined in

[src/session.ts:72](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L72)

___

### getLocalStreams

▸ **getLocalStreams**(): `MediaStream`[]

#### Returns

`MediaStream`[]

#### Defined in

[src/session.ts:73](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L73)

## Properties

### canTrickleIceCandidates

• `Readonly` **canTrickleIceCandidates**: `boolean`

#### Inherited from

RTCPeerConnection.canTrickleIceCandidates

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10907

___

### connectionState

• `Readonly` **connectionState**: `RTCPeerConnectionState`

#### Inherited from

RTCPeerConnection.connectionState

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10908

___

### currentLocalDescription

• `Readonly` **currentLocalDescription**: `RTCSessionDescription`

#### Inherited from

RTCPeerConnection.currentLocalDescription

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10909

___

### currentRemoteDescription

• `Readonly` **currentRemoteDescription**: `RTCSessionDescription`

#### Inherited from

RTCPeerConnection.currentRemoteDescription

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10910

___

### iceConnectionState

• `Readonly` **iceConnectionState**: `RTCIceConnectionState`

#### Inherited from

RTCPeerConnection.iceConnectionState

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10911

___

### iceGatheringState

• `Readonly` **iceGatheringState**: `RTCIceGatheringState`

#### Inherited from

RTCPeerConnection.iceGatheringState

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10912

___

### localDescription

• `Readonly` **localDescription**: `RTCSessionDescription`

#### Inherited from

RTCPeerConnection.localDescription

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10913

___

### onconnectionstatechange

• **onconnectionstatechange**: (`this`: `RTCPeerConnection`, `ev`: `Event`) => `any`

#### Type declaration

▸ (`this`, `ev`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `RTCPeerConnection` |
| `ev` | `Event` |

##### Returns

`any`

#### Inherited from

RTCPeerConnection.onconnectionstatechange

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10914

___

### ondatachannel

• **ondatachannel**: (`this`: `RTCPeerConnection`, `ev`: `RTCDataChannelEvent`) => `any`

#### Type declaration

▸ (`this`, `ev`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `RTCPeerConnection` |
| `ev` | `RTCDataChannelEvent` |

##### Returns

`any`

#### Inherited from

RTCPeerConnection.ondatachannel

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10915

___

### onicecandidate

• **onicecandidate**: (`this`: `RTCPeerConnection`, `ev`: `RTCPeerConnectionIceEvent`) => `any`

#### Type declaration

▸ (`this`, `ev`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `RTCPeerConnection` |
| `ev` | `RTCPeerConnectionIceEvent` |

##### Returns

`any`

#### Inherited from

RTCPeerConnection.onicecandidate

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10916

___

### onicecandidateerror

• **onicecandidateerror**: (`this`: `RTCPeerConnection`, `ev`: `Event`) => `any`

#### Type declaration

▸ (`this`, `ev`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `RTCPeerConnection` |
| `ev` | `Event` |

##### Returns

`any`

#### Inherited from

RTCPeerConnection.onicecandidateerror

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10917

___

### oniceconnectionstatechange

• **oniceconnectionstatechange**: (`this`: `RTCPeerConnection`, `ev`: `Event`) => `any`

#### Type declaration

▸ (`this`, `ev`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `RTCPeerConnection` |
| `ev` | `Event` |

##### Returns

`any`

#### Inherited from

RTCPeerConnection.oniceconnectionstatechange

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10918

___

### onicegatheringstatechange

• **onicegatheringstatechange**: (`this`: `RTCPeerConnection`, `ev`: `Event`) => `any`

#### Type declaration

▸ (`this`, `ev`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `RTCPeerConnection` |
| `ev` | `Event` |

##### Returns

`any`

#### Inherited from

RTCPeerConnection.onicegatheringstatechange

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10919

___

### onnegotiationneeded

• **onnegotiationneeded**: (`this`: `RTCPeerConnection`, `ev`: `Event`) => `any`

#### Type declaration

▸ (`this`, `ev`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `RTCPeerConnection` |
| `ev` | `Event` |

##### Returns

`any`

#### Inherited from

RTCPeerConnection.onnegotiationneeded

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10920

___

### onsignalingstatechange

• **onsignalingstatechange**: (`this`: `RTCPeerConnection`, `ev`: `Event`) => `any`

#### Type declaration

▸ (`this`, `ev`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `RTCPeerConnection` |
| `ev` | `Event` |

##### Returns

`any`

#### Inherited from

RTCPeerConnection.onsignalingstatechange

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10921

___

### ontrack

• **ontrack**: (`this`: `RTCPeerConnection`, `ev`: `RTCTrackEvent`) => `any`

#### Type declaration

▸ (`this`, `ev`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | `RTCPeerConnection` |
| `ev` | `RTCTrackEvent` |

##### Returns

`any`

#### Inherited from

RTCPeerConnection.ontrack

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10922

___

### pendingLocalDescription

• `Readonly` **pendingLocalDescription**: `RTCSessionDescription`

#### Inherited from

RTCPeerConnection.pendingLocalDescription

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10923

___

### pendingRemoteDescription

• `Readonly` **pendingRemoteDescription**: `RTCSessionDescription`

#### Inherited from

RTCPeerConnection.pendingRemoteDescription

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10924

___

### remoteDescription

• `Readonly` **remoteDescription**: `RTCSessionDescription`

#### Inherited from

RTCPeerConnection.remoteDescription

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10925

___

### signalingState

• `Readonly` **signalingState**: `RTCSignalingState`

#### Inherited from

RTCPeerConnection.signalingState

#### Defined in

node_modules/typescript/lib/lib.dom.d.ts:10926
