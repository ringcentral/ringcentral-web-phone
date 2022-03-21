[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / MediaStreams

# Class: MediaStreams

Media Streams class to monitor media stats

## Table of contents

### Constructors

- [constructor](MediaStreams.md#constructor)

### Properties

- [mediaStreamsImpl](MediaStreams.md#mediastreamsimpl)
- [release](MediaStreams.md#release)
- [reconnectMedia](MediaStreams.md#reconnectmedia)
- [getMediaStats](MediaStreams.md#getmediastats)
- [stopMediaStats](MediaStreams.md#stopmediastats)

### Accessors

- [onRTPStat](MediaStreams.md#onrtpstat)
- [onMediaConnectionStateChange](MediaStreams.md#onmediaconnectionstatechange)

## Constructors

### constructor

• **new MediaStreams**(`session`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `session` | [`WebPhoneSession`](../modules.md#webphonesession) |

#### Defined in

[src/mediaStreams.ts:64](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L64)

## Properties

### mediaStreamsImpl

• **mediaStreamsImpl**: [`MediaStreamsImpl`](MediaStreamsImpl.md)

Reference to MediaStreamsImpl object. This Object has all the functions to handle media streams

MediaStreams class is a wrapper around MediaStreamsImpl

#### Defined in

[src/mediaStreams.ts:46](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L46)

___

### release

• **release**: `any`

Remove iceconnectionstatechange event listeners and stop collecting stats

#### Defined in

[src/mediaStreams.ts:48](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L48)

___

### reconnectMedia

• **reconnectMedia**: `any`

Reconnect media and send reinvite on the existing session.

This will also recreate SDP and send it over with the reinvite message

#### Defined in

[src/mediaStreams.ts:54](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L54)

___

### getMediaStats

• **getMediaStats**: (`callback`: (`report`: [`RTPReport`](../interfaces/RTPReport.md)) => `any`, `interval`: `number`) => `void`

#### Type declaration

▸ (`callback`, `interval`): `void`

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | (`report`: [`RTPReport`](../interfaces/RTPReport.md)) => `any` | function which will be called every time media stats are generated. Will override callback passed to `onRTPStat` |
| `interval` | `number` | interval for the recurring call to the callback function |

##### Returns

`void`

#### Defined in

[src/mediaStreams.ts:60](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L60)

___

### stopMediaStats

• **stopMediaStats**: () => `void`

#### Type declaration

▸ (): `void`

Stop collecting stats

##### Returns

`void`

#### Defined in

[src/mediaStreams.ts:62](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L62)

## Accessors

### onRTPStat

• `set` **onRTPStat**(`callback`): `void`

Set a function to be called when media stats are generated

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | (`stats`: [`RTPReport`](../interfaces/RTPReport.md), `session`: [`WebPhoneSession`](../modules.md#webphonesession)) => `any` | optionally, you can set a function on MediaStreams object. This will be treated as a default callback when media stats are generated if a callback function is not passed with `getMediaStats` function |

#### Returns

`void`

#### Defined in

[src/mediaStreams.ts:76](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L76)

___

### onMediaConnectionStateChange

• `set` **onMediaConnectionStateChange**(`callback`): `void`

Set a function to be called when `peerConnetion` iceconnectionstatechange changes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | (`state`: `string`, `session`: [`WebPhoneSession`](../modules.md#webphonesession)) => `any` | function to be called when `peerConnetion` iceconnectionstatechange changes |

#### Returns

`void`

#### Defined in

[src/mediaStreams.ts:84](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L84)
