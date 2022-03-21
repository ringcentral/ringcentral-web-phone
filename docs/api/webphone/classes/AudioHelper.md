[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / AudioHelper

# Class: AudioHelper

## Table of contents

### Constructors

- [constructor](AudioHelper.md#constructor)

### Properties

- [volume](AudioHelper.md#volume)

### Methods

- [loadAudio](AudioHelper.md#loadaudio)
- [setVolume](AudioHelper.md#setvolume)
- [playIncoming](AudioHelper.md#playincoming)
- [playOutgoing](AudioHelper.md#playoutgoing)

## Constructors

### constructor

• **new AudioHelper**(`options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`AudioHelperOptions`](../interfaces/AudioHelperOptions.md) |

#### Defined in

[src/audioHelper.ts:24](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/audioHelper.ts#L24)

## Properties

### volume

• **volume**: `number`

Current volume

#### Defined in

[src/audioHelper.ts:22](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/audioHelper.ts#L22)

## Methods

### loadAudio

▸ **loadAudio**(`options`): `void`

Load incoming and outgoing audio files for feedback

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`AudioHelperOptions`](../interfaces/AudioHelperOptions.md) |

#### Returns

`void`

#### Defined in

[src/audioHelper.ts:60](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/audioHelper.ts#L60)

___

### setVolume

▸ **setVolume**(`volume`): `void`

Set volume for icoming and outgoing feedback

#### Parameters

| Name | Type |
| :------ | :------ |
| `volume` | `any` |

#### Returns

`void`

#### Defined in

[src/audioHelper.ts:67](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/audioHelper.ts#L67)

___

### playIncoming

▸ **playIncoming**(`value`): [`AudioHelper`](AudioHelper.md)

Play or pause incoming feedback

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | `true` to play audio and `false` to pause |

#### Returns

[`AudioHelper`](AudioHelper.md)

#### Defined in

[src/audioHelper.ts:87](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/audioHelper.ts#L87)

___

### playOutgoing

▸ **playOutgoing**(`value`): [`AudioHelper`](AudioHelper.md)

Play or pause outgoing feedback

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `any` | `true` to play audio and `false` to pause |

#### Returns

[`AudioHelper`](AudioHelper.md)

#### Defined in

[src/audioHelper.ts:96](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/audioHelper.ts#L96)
