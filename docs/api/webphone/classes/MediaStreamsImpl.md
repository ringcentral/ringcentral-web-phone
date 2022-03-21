[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / MediaStreamsImpl

# Class: MediaStreamsImpl

MediaStreams Implementation

## Table of contents

### Constructors

- [constructor](MediaStreamsImpl.md#constructor)

### Properties

- [preRTT](MediaStreamsImpl.md#prertt)
- [onMediaConnectionStateChange](MediaStreamsImpl.md#onmediaconnectionstatechange)
- [onRTPStat](MediaStreamsImpl.md#onrtpstat)

### Methods

- [browser](MediaStreamsImpl.md#browser)
- [getMediaStats](MediaStreamsImpl.md#getmediastats)
- [stopMediaStats](MediaStreamsImpl.md#stopmediastats)
- [reconnectMedia](MediaStreamsImpl.md#reconnectmedia)
- [release](MediaStreamsImpl.md#release)

## Constructors

### constructor

• **new MediaStreamsImpl**(`session`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `session` | `any` |

#### Defined in

[src/mediaStreams.ts:292](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L292)

## Properties

### preRTT

• **preRTT**: `any`

#### Defined in

[src/mediaStreams.ts:99](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L99)

___

### onMediaConnectionStateChange

• **onMediaConnectionStateChange**: (`state`: `string`, `session`: [`WebPhoneSession`](../modules.md#webphonesession)) => `any`

#### Type declaration

▸ (`state`, `session`): `any`

Set a function to be called when `peerConnetion` iceconnectionstatechange changes

##### Parameters

| Name | Type |
| :------ | :------ |
| `state` | `string` |
| `session` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`any`

#### Defined in

[src/mediaStreams.ts:106](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L106)

___

### onRTPStat

• **onRTPStat**: (`stats`: [`RTPReport`](../interfaces/RTPReport.md), `session`: [`WebPhoneSession`](../modules.md#webphonesession)) => `any`

#### Type declaration

▸ (`stats`, `session`): `any`

Set a function to be called when media stats are generated

##### Parameters

| Name | Type |
| :------ | :------ |
| `stats` | [`RTPReport`](../interfaces/RTPReport.md) |
| `session` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`any`

#### Defined in

[src/mediaStreams.ts:111](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L111)

## Methods

### browser

▸ **browser**(): [`MSIE`](../enums/Browsers.md#msie) \| [`Chrome`](../enums/Browsers.md#chrome) \| [`Firefox`](../enums/Browsers.md#firefox) \| [`Safari`](../enums/Browsers.md#safari) \| [`Opera`](../enums/Browsers.md#opera) \| ``"unknown"``

Function to find what browser is being used depending on the `navigator.userAgent` value

#### Returns

[`MSIE`](../enums/Browsers.md#msie) \| [`Chrome`](../enums/Browsers.md#chrome) \| [`Firefox`](../enums/Browsers.md#firefox) \| [`Safari`](../enums/Browsers.md#safari) \| [`Opera`](../enums/Browsers.md#opera) \| ``"unknown"``

Browsers enum value to denote what browser if being used

#### Defined in

[src/mediaStreams.ts:121](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L121)

___

### getMediaStats

▸ **getMediaStats**(`callback?`, `interval?`): `void`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `callback` | `any` | `null` | function which will be called every time media stats are generated. Will override callback passed to `onRTPStat` |
| `interval` | `number` | `1000` | interval for the recurring call to the callback function |

#### Returns

`void`

#### Defined in

[src/mediaStreams.ts:325](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L325)

___

### stopMediaStats

▸ **stopMediaStats**(): `void`

Stop collecting stats. This will stop calling the registered function (either that was registered using `onRTPstat` or using `getMediaStats`)

#### Returns

`void`

#### Defined in

[src/mediaStreams.ts:347](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L347)

___

### reconnectMedia

▸ **reconnectMedia**(): `Promise`<`void`\>

Reconnect media and send reinvite on the existing session.

This will also recreate SDP and send it over with the reinvite message

#### Returns

`Promise`<`void`\>

#### Defined in

[src/mediaStreams.ts:359](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L359)

___

### release

▸ **release**(): `void`

Remove iceconnectionstatechange event listeners and stop collecting stats

#### Returns

`void`

#### Defined in

[src/mediaStreams.ts:371](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/mediaStreams.ts#L371)
