[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / CommonSession

# Class: CommonSession

## Hierarchy

- **`CommonSession`**

  ↳ [`WebPhoneInvitation`](../interfaces/WebPhoneInvitation.md)

  ↳ [`WebPhoneInviter`](../interfaces/WebPhoneInviter.md)

## Table of contents

### Constructors

- [constructor](CommonSession.md#constructor)

### Properties

- [held](CommonSession.md#held)
- [media](CommonSession.md#media)
- [mediaStatsStarted](CommonSession.md#mediastatsstarted)
- [mediaStreams](CommonSession.md#mediastreams)
- [muted](CommonSession.md#muted)
- [noAudioReportCount](CommonSession.md#noaudioreportcount)
- [rcHeaders](CommonSession.md#rcheaders)
- [reinviteForNoAudioSent](CommonSession.md#reinvitefornoaudiosent)
- [addListener](CommonSession.md#addlistener)
- [addTrack](CommonSession.md#addtrack)
- [barge](CommonSession.md#barge)
- [blindTransfer](CommonSession.md#blindtransfer)
- [canUseRCMCallControl](CommonSession.md#canusercmcallcontrol)
- [createSessionMessage](CommonSession.md#createsessionmessage)
- [dtmf](CommonSession.md#dtmf)
- [emit](CommonSession.md#emit)
- [flip](CommonSession.md#flip)
- [forward](CommonSession.md#forward)
- [hold](CommonSession.md#hold)
- [ignore](CommonSession.md#ignore)
- [mute](CommonSession.md#mute)
- [off](CommonSession.md#off)
- [on](CommonSession.md#on)
- [park](CommonSession.md#park)
- [reinvite](CommonSession.md#reinvite)
- [removeListener](CommonSession.md#removelistener)
- [replyWithMessage](CommonSession.md#replywithmessage)
- [sendInfoAndRecieveResponse](CommonSession.md#sendinfoandrecieveresponse)
- [sendMoveResponse](CommonSession.md#sendmoveresponse)
- [sendReceiveConfirm](CommonSession.md#sendreceiveconfirm)
- [sendSessionMessage](CommonSession.md#sendsessionmessage)
- [startRecord](CommonSession.md#startrecord)
- [stopMediaStats](CommonSession.md#stopmediastats)
- [stopRecord](CommonSession.md#stoprecord)
- [toVoicemail](CommonSession.md#tovoicemail)
- [transfer](CommonSession.md#transfer)
- [unhold](CommonSession.md#unhold)
- [unmute](CommonSession.md#unmute)
- [warmTransfer](CommonSession.md#warmtransfer)
- [whisper](CommonSession.md#whisper)

## Constructors

### constructor

• **new CommonSession**()

## Properties

### held

• `Optional` **held**: `boolean`

Flag to check if the call is on hold or not

#### Defined in

[src/session.ts:88](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L88)

___

### media

• `Optional` **media**: `Object`

Options to represent dom elements where media stream should be loaded

#### Type declaration

| Name | Type |
| :------ | :------ |
| `local?` | `HTMLMediaElement` |
| `remote?` | `HTMLMediaElement` |

#### Defined in

[src/session.ts:90](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L90)

___

### mediaStatsStarted

• `Optional` **mediaStatsStarted**: `boolean`

Flag to indicate if media stats are being collected

#### Defined in

[src/session.ts:92](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L92)

___

### mediaStreams

• `Optional` **mediaStreams**: [`MediaStreams`](MediaStreams.md)

MediaStreams class instance which has the logic to collect media stream stats

#### Defined in

[src/session.ts:94](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L94)

___

### muted

• `Optional` **muted**: `boolean`

Flag to check if the call is muted or not

#### Defined in

[src/session.ts:96](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L96)

___

### noAudioReportCount

• `Optional` **noAudioReportCount**: `number`

Counter to represent how many media stats report were missed becuase of no audio

#### Defined in

[src/session.ts:98](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L98)

___

### rcHeaders

• `Optional` **rcHeaders**: [`RCHeaders`](../interfaces/RCHeaders.md)

JOSN representation of RC headers received for an incoming call

#### Defined in

[src/session.ts:100](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L100)

___

### reinviteForNoAudioSent

• `Optional` **reinviteForNoAudioSent**: `boolean`

Flag to represent if reinvite request was sent because there was no audio reported

#### Defined in

[src/session.ts:102](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L102)

___

### addListener

• `Optional` **addListener**: (`event`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`event`, `listener`): `EventEmitter`

Method to attach event listener for session specific events

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/session.ts:108](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L108)

___

### addTrack

• `Optional` **addTrack**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `remoteAudioEle?`: `any`, `localAudioEle?`: `any`) => `void`

#### Type declaration

▸ (`this`, `remoteAudioEle?`, `localAudioEle?`): `void`

Add track to media source

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `remoteAudioEle?` | `any` |
| `localAudioEle?` | `any` |

##### Returns

`void`

#### Defined in

[src/session.ts:110](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L110)

___

### barge

• `Optional` **barge**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`any`\>

#### Type declaration

▸ (`this`): `Promise`<`any`\>

RingCentral barge implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`any`\>

#### Defined in

[src/session.ts:112](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L112)

___

### blindTransfer

• `Optional` **blindTransfer**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `target`: `string` \| [`WebPhoneSession`](../modules.md#webphonesession) \| `URI`, `options`: `SessionReferOptions`) => `Promise`<`OutgoingReferRequest`\>

#### Type declaration

▸ (`this`, `target`, `options?`): `Promise`<`OutgoingReferRequest`\>

RingCentral blind transfer implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `target` | `string` \| [`WebPhoneSession`](../modules.md#webphonesession) \| `URI` |
| `options` | `SessionReferOptions` |

##### Returns

`Promise`<`OutgoingReferRequest`\>

#### Defined in

[src/session.ts:114](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L114)

___

### canUseRCMCallControl

• `Optional` **canUseRCMCallControl**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `boolean`

#### Type declaration

▸ (`this`): `boolean`

**`internal`**
Helper function which represents if call control features can be used or not

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`boolean`

#### Defined in

[src/session.ts:119](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L119)

___

### createSessionMessage

• `Optional` **createSessionMessage**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `options`: [`RCHeaders`](../interfaces/RCHeaders.md)) => `string`

#### Type declaration

▸ (`this`, `options`): `string`

**`internal`**
Create session message which would be sent to the RingCentral backend

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `options` | [`RCHeaders`](../interfaces/RCHeaders.md) |

##### Returns

`string`

#### Defined in

[src/session.ts:124](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L124)

___

### dtmf

• `Optional` **dtmf**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `dtmf`: `string`, `duration`: `number`, `interToneGap`: `number`) => `void`

#### Type declaration

▸ (`this`, `dtmf`, `duration?`, `interToneGap?`): `void`

Sends a DTMF over the call

##### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) | `undefined` |
| `dtmf` | `string` | `undefined` |
| `duration` | `number` | `100` |
| `interToneGap` | `number` | `50` |

##### Returns

`void`

#### Defined in

[src/session.ts:126](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L126)

___

### emit

• `Optional` **emit**: (`event`: `string` \| `symbol`, ...`args`: `any`[]) => `boolean`

#### Type declaration

▸ (`event`, ...`args`): `boolean`

Emit session specific events which will trigger all the event listeners attached

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

##### Returns

`boolean`

#### Defined in

[src/session.ts:128](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L128)

___

### flip

• `Optional` **flip**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `target`: `any`) => `Promise`<`any`\>

#### Type declaration

▸ (`this`, `target`): `Promise`<`any`\>

RingCentral flip implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `target` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[src/session.ts:130](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L130)

___

### forward

• `Optional` **forward**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `target`: [`WebPhoneSession`](../modules.md#webphonesession), `acceptOptions`: `InvitationAcceptOptions`, `transferOptions`: `SessionReferOptions`) => `Promise`<`OutgoingReferRequest`\>

#### Type declaration

▸ (`this`, `target`, `acceptOptions`, `transferOptions`): `Promise`<`OutgoingReferRequest`\>

RingCentral flip implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `target` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `acceptOptions` | `InvitationAcceptOptions` |
| `transferOptions` | `SessionReferOptions` |

##### Returns

`Promise`<`OutgoingReferRequest`\>

#### Defined in

[src/session.ts:132](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L132)

___

### hold

• `Optional` **hold**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`void`\>

#### Type declaration

▸ (`this`): `Promise`<`void`\>

Put the call on hold

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`void`\>

#### Defined in

[src/session.ts:134](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L134)

___

### ignore

• `Optional` **ignore**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`IncomingResponse`\>

#### Type declaration

▸ (`this`): `Promise`<`IncomingResponse`\>

Ignore incoming call

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`IncomingResponse`\>

#### Defined in

[src/session.ts:136](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L136)

___

### mute

• `Optional` **mute**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `silent?`: `boolean`) => `void`

#### Type declaration

▸ (`this`, `silent?`): `void`

Mute the call

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `silent?` | `boolean` |

##### Returns

`void`

#### Defined in

[src/session.ts:138](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L138)

___

### off

• `Optional` **off**: (`event`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`event`, `listener`): `EventEmitter`

Remove event listener

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/session.ts:140](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L140)

___

### on

• `Optional` **on**: (`event`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`event`, `listener`): `EventEmitter`

Add event listener. Same as addListener

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/session.ts:142](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L142)

___

### park

• `Optional` **park**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`any`\>

#### Type declaration

▸ (`this`): `Promise`<`any`\>

RingCentral park implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`any`\>

#### Defined in

[src/session.ts:144](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L144)

___

### reinvite

• `Optional` **reinvite**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `options`: `SessionInviteOptions`) => `Promise`<`OutgoingInviteRequest`\>

#### Type declaration

▸ (`this`, `options?`): `Promise`<`OutgoingInviteRequest`\>

Send a session reinvite

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) | WebPhoneSessionSessionInviteOptions |
| `options` | `SessionInviteOptions` |  |

##### Returns

`Promise`<`OutgoingInviteRequest`\>

Promise<OutgoingInviteRequest>

Sends a reinvite. Also makes sure to regenrate a new SDP by passing offerToReceiveAudio: true, offerToReceiveVideo: false  and iceRestart: true
Once the SDP is ready, the local description is set and the SDP is sent to the remote peer along with an INVITE request

#### Defined in

[src/session.ts:146](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L146)

___

### removeListener

• `Optional` **removeListener**: (`event`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`event`, `listener`): `EventEmitter`

Remove event listener

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/session.ts:148](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L148)

___

### replyWithMessage

• `Optional` **replyWithMessage**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `replyOptions`: [`ReplyOptions`](../interfaces/ReplyOptions.md)) => `Promise`<`IncomingResponse`\>

#### Type declaration

▸ (`this`, `replyOptions`): `Promise`<`IncomingResponse`\>

RingCentral reply with message implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `replyOptions` | [`ReplyOptions`](../interfaces/ReplyOptions.md) |

##### Returns

`Promise`<`IncomingResponse`\>

#### Defined in

[src/session.ts:150](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L150)

___

### sendInfoAndRecieveResponse

• `Optional` **sendInfoAndRecieveResponse**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `command`: `Command`, `options?`: `any`) => `Promise`<`any`\>

#### Type declaration

▸ (`this`, `command`, `options?`): `Promise`<`any`\>

**`internal`**
Helper method that sends an INFO request to other user agent and then waits for an INFO request from the other user agent

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `command` | `Command` |
| `options?` | `any` |

##### Returns

`Promise`<`any`\>

#### Defined in

[src/session.ts:155](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L155)

___

### sendMoveResponse

• `Optional` **sendMoveResponse**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `reqId`: `number`, `code`: `number`, `description`: `string`, `options`: { `extraHeaders?`: `string`[]  }) => `void`

#### Type declaration

▸ (`this`, `reqId`, `code`, `description`, `options?`): `void`

**`internal`**
Helper function to send INFO request with `move` instruction to RingCentral backend

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `reqId` | `number` |
| `code` | `number` |
| `description` | `string` |
| `options` | `Object` |
| `options.extraHeaders?` | `string`[] |

##### Returns

`void`

#### Defined in

[src/session.ts:160](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L160)

___

### sendReceiveConfirm

• `Optional` **sendReceiveConfirm**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`void`\>

#### Type declaration

▸ (`this`): `Promise`<`void`\>

Send `receiveConfirm` command to backend

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`void`\>

#### Defined in

[src/session.ts:162](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L162)

___

### sendSessionMessage

• `Optional` **sendSessionMessage**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `options`: `any`) => `Promise`<`IncomingResponse`\>

#### Type declaration

▸ (`this`, `options`): `Promise`<`IncomingResponse`\>

Helper function to send session message to backend using UserAgent

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `options` | `any` |

##### Returns

`Promise`<`IncomingResponse`\>

#### Defined in

[src/session.ts:164](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L164)

___

### startRecord

• `Optional` **startRecord**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`any`\>

#### Type declaration

▸ (`this`): `Promise`<`any`\>

Start recording the call

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`any`\>

#### Defined in

[src/session.ts:166](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L166)

___

### stopMediaStats

• `Optional` **stopMediaStats**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `void`

#### Type declaration

▸ (`this`): `void`

Function to stop collecting media stats

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`void`

#### Defined in

[src/session.ts:168](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L168)

___

### stopRecord

• `Optional` **stopRecord**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`any`\>

#### Type declaration

▸ (`this`): `Promise`<`any`\>

Stop recording the call

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`any`\>

#### Defined in

[src/session.ts:170](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L170)

___

### toVoicemail

• `Optional` **toVoicemail**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`IncomingResponse`\>

#### Type declaration

▸ (`this`): `Promise`<`IncomingResponse`\>

Send incoming call to voicemail

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`IncomingResponse`\>

#### Defined in

[src/session.ts:172](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L172)

___

### transfer

• `Optional` **transfer**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `target`: `string` \| [`WebPhoneSession`](../modules.md#webphonesession) \| `URI`, `options`: `SessionReferOptions`) => `Promise`<`OutgoingReferRequest`\>

#### Type declaration

▸ (`this`, `target`, `options?`): `Promise`<`OutgoingReferRequest`\>

Transfer current call

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `target` | `string` \| [`WebPhoneSession`](../modules.md#webphonesession) \| `URI` |
| `options` | `SessionReferOptions` |

##### Returns

`Promise`<`OutgoingReferRequest`\>

#### Defined in

[src/session.ts:174](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L174)

___

### unhold

• `Optional` **unhold**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`void`\>

#### Type declaration

▸ (`this`): `Promise`<`void`\>

Put the call on unhold

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`void`\>

#### Defined in

[src/session.ts:176](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L176)

___

### unmute

• `Optional` **unmute**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `silent?`: `boolean`) => `void`

#### Type declaration

▸ (`this`, `silent?`): `void`

Unmute the call

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `silent?` | `boolean` |

##### Returns

`void`

#### Defined in

[src/session.ts:178](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L178)

___

### warmTransfer

• `Optional` **warmTransfer**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession), `target`: `string` \| [`WebPhoneSession`](../modules.md#webphonesession) \| `URI`, `options`: `SessionReferOptions`) => `Promise`<`OutgoingReferRequest`\>

#### Type declaration

▸ (`this`, `target`, `options?`): `Promise`<`OutgoingReferRequest`\>

RingCentral warm transfer implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |
| `target` | `string` \| [`WebPhoneSession`](../modules.md#webphonesession) \| `URI` |
| `options` | `SessionReferOptions` |

##### Returns

`Promise`<`OutgoingReferRequest`\>

#### Defined in

[src/session.ts:180](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L180)

___

### whisper

• `Optional` **whisper**: (`this`: [`WebPhoneSession`](../modules.md#webphonesession)) => `Promise`<`any`\>

#### Type declaration

▸ (`this`): `Promise`<`any`\>

RingCentral whisper implementation

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneSession`](../modules.md#webphonesession) |

##### Returns

`Promise`<`any`\>

#### Defined in

[src/session.ts:182](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/session.ts#L182)
