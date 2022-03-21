[SIP.js](../README.md) / [Exports](../modules.md) / SessionDescriptionHandlerOptions

# Interface: SessionDescriptionHandlerOptions

Options for [SessionDescriptionHandler](SessionDescriptionHandler.md).

## Hierarchy

- [`SessionDescriptionHandlerOptions`](SessionDescriptionHandlerOptions.md)

  ↳ **`SessionDescriptionHandlerOptions`**

## Table of contents

### Properties

- [answerOptions](SessionDescriptionHandlerOptions.md#answeroptions)
- [constraints](SessionDescriptionHandlerOptions.md#constraints)
- [dataChannel](SessionDescriptionHandlerOptions.md#datachannel)
- [dataChannelLabel](SessionDescriptionHandlerOptions.md#datachannellabel)
- [dataChannelOptions](SessionDescriptionHandlerOptions.md#datachanneloptions)
- [hold](SessionDescriptionHandlerOptions.md#hold)
- [iceGatheringTimeout](SessionDescriptionHandlerOptions.md#icegatheringtimeout)
- [offerOptions](SessionDescriptionHandlerOptions.md#offeroptions)

### Methods

- [onDataChannel](SessionDescriptionHandlerOptions.md#ondatachannel)

## Properties

### answerOptions

• `Optional` **answerOptions**: `RTCAnswerOptions`

Answer options to use when creating an answer.

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler-options.d.ts:10

___

### constraints

• `Optional` **constraints**: `MediaStreamConstraints`

Constraints to use when creating local media stream.

**`remarks`**
If undefined, defaults to audio true and video false.
If audio and video are false, media stream will have no tracks.

#### Overrides

[SessionDescriptionHandlerOptions](SessionDescriptionHandlerOptions.md).[constraints](SessionDescriptionHandlerOptions.md#constraints)

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler-options.d.ts:17

___

### dataChannel

• `Optional` **dataChannel**: `boolean`

If true, create a data channel when making initial offer.

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler-options.d.ts:21

___

### dataChannelLabel

• `Optional` **dataChannelLabel**: `string`

A human-readable name to use when creating the data channel.

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler-options.d.ts:25

___

### dataChannelOptions

• `Optional` **dataChannelOptions**: `RTCDataChannelInit`

Configuration options for creating the data channel.

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler-options.d.ts:29

___

### hold

• `Optional` **hold**: `boolean`

If true, offer and answer directions will be set to place peer on hold.

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler-options.d.ts:33

___

### iceGatheringTimeout

• `Optional` **iceGatheringTimeout**: `number`

The maximum duration to wait in ms for ICE gathering to complete.
No timeout if undefined or zero.

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler-options.d.ts:38

___

### offerOptions

• `Optional` **offerOptions**: `RTCOfferOptions`

Offer options to use when creating an offer.

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler-options.d.ts:42

## Methods

### onDataChannel

▸ `Optional` **onDataChannel**(`dataChannel`): `void`

Called upon creating a data channel.

#### Parameters

| Name | Type |
| :------ | :------ |
| `dataChannel` | `RTCDataChannel` |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler-options.d.ts:46
