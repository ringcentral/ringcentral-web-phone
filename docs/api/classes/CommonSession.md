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

[src/session.ts:88](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L88)

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

[src/session.ts:90](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L90)

___

### mediaStatsStarted

• `Optional` **mediaStatsStarted**: `boolean`

Flag to indicate if media stats are being collected

#### Defined in

[src/session.ts:92](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L92)

___

### mediaStreams

• `Optional` **mediaStreams**: [`MediaStreams`](MediaStreams.md)

MediaStreams class instance which has the logic to collect media stream stats

#### Defined in

[src/session.ts:94](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L94)

___

### muted

• `Optional` **muted**: `boolean`

Flag to check if the call is muted or not

#### Defined in

[src/session.ts:96](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L96)

___

### noAudioReportCount

• `Optional` **noAudioReportCount**: `number`

Counter to represent how many media stats report were missed becuase of no audio

#### Defined in

[src/session.ts:98](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L98)

___

### rcHeaders

• `Optional` **rcHeaders**: [`RCHeaders`](../interfaces/RCHeaders.md)

JOSN representation of RC headers received for an incoming call

#### Defined in

[src/session.ts:100](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L100)

___

### reinviteForNoAudioSent

• `Optional` **reinviteForNoAudioSent**: `boolean`

Flag to represent if reinvite request was sent because there was no audio reported

#### Defined in

[src/session.ts:102](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L102)

___

### addListener

• `Optional` **addListener**: (`eventName`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`eventName`, `listener`): `EventEmitter`

Alias for `emitter.on(eventName, listener)`.

**`since`** v0.1.26

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/session.ts:108](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L108)

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

[src/session.ts:110](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L110)

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

[src/session.ts:112](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L112)

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

[src/session.ts:114](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L114)

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

[src/session.ts:119](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L119)

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

[src/session.ts:124](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L124)

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

[src/session.ts:126](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L126)

___

### emit

• `Optional` **emit**: (`eventName`: `string` \| `symbol`, ...`args`: `any`[]) => `boolean`

#### Type declaration

▸ (`eventName`, ...`args`): `boolean`

Synchronously calls each of the listeners registered for the event named`eventName`, in the order they were registered, passing the supplied arguments
to each.

Returns `true` if the event had listeners, `false` otherwise.

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});
// Second listener
myEmitter.on('event', function secondListener(arg1, arg2) {
  console.log(`event with parameters ${arg1}, ${arg2} in second listener`);
});
// Third listener
myEmitter.on('event', function thirdListener(...args) {
  const parameters = args.join(', ');
  console.log(`event with parameters ${parameters} in third listener`);
});

console.log(myEmitter.listeners('event'));

myEmitter.emit('event', 1, 2, 3, 4, 5);

// Prints:
// [
//   [Function: firstListener],
//   [Function: secondListener],
//   [Function: thirdListener]
// ]
// Helloooo! first listener
// event with parameters 1, 2 in second listener
// event with parameters 1, 2, 3, 4, 5 in third listener
```

**`since`** v0.1.26

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `...args` | `any`[] |

##### Returns

`boolean`

#### Defined in

[src/session.ts:128](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L128)

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

[src/session.ts:130](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L130)

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

[src/session.ts:132](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L132)

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

[src/session.ts:134](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L134)

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

[src/session.ts:136](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L136)

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

[src/session.ts:138](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L138)

___

### off

• `Optional` **off**: (`eventName`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`eventName`, `listener`): `EventEmitter`

Alias for `emitter.removeListener()`.

**`since`** v10.0.0

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/session.ts:140](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L140)

___

### on

• `Optional` **on**: (`eventName`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`eventName`, `listener`): `EventEmitter`

Adds the `listener` function to the end of the listeners array for the
event named `eventName`. No checks are made to see if the `listener` has
already been added. Multiple calls passing the same combination of `eventName`and `listener` will result in the `listener` being added, and called, multiple
times.

```js
server.on('connection', (stream) => {
  console.log('someone connected!');
});
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

By default, event listeners are invoked in the order they are added. The`emitter.prependListener()` method can be used as an alternative to add the
event listener to the beginning of the listeners array.

```js
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// Prints:
//   b
//   a
```

**`since`** v0.1.101

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` \| `symbol` | The name of the event. |
| `listener` | (...`args`: `any`[]) => `void` | The callback function |

##### Returns

`EventEmitter`

#### Defined in

[src/session.ts:142](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L142)

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

[src/session.ts:144](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L144)

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

[src/session.ts:146](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L146)

___

### removeListener

• `Optional` **removeListener**: (`eventName`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`eventName`, `listener`): `EventEmitter`

Removes the specified `listener` from the listener array for the event named`eventName`.

```js
const callback = (stream) => {
  console.log('someone connected!');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

`removeListener()` will remove, at most, one instance of a listener from the
listener array. If any single listener has been added multiple times to the
listener array for the specified `eventName`, then `removeListener()` must be
called multiple times to remove each instance.

Once an event is emitted, all listeners attached to it at the
time of emitting are called in order. This implies that any`removeListener()` or `removeAllListeners()` calls _after_ emitting and_before_ the last listener finishes execution will
not remove them from`emit()` in progress. Subsequent events behave as expected.

```js
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA removes listener callbackB but it will still be called.
// Internal listener array at time of emit [callbackA, callbackB]
myEmitter.emit('event');
// Prints:
//   A
//   B

// callbackB is now removed.
// Internal listener array [callbackA]
myEmitter.emit('event');
// Prints:
//   A
```

Because listeners are managed using an internal array, calling this will
change the position indices of any listener registered _after_ the listener
being removed. This will not impact the order in which listeners are called,
but it means that any copies of the listener array as returned by
the `emitter.listeners()` method will need to be recreated.

When a single function has been added as a handler multiple times for a single
event (as in the example below), `removeListener()` will remove the most
recently added instance. In the example the `once('ping')`listener is removed:

```js
const ee = new EventEmitter();

function pong() {
  console.log('pong');
}

ee.on('ping', pong);
ee.once('ping', pong);
ee.removeListener('ping', pong);

ee.emit('ping');
ee.emit('ping');
```

Returns a reference to the `EventEmitter`, so that calls can be chained.

**`since`** v0.1.26

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/session.ts:148](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L148)

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

[src/session.ts:150](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L150)

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

[src/session.ts:155](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L155)

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

[src/session.ts:160](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L160)

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

[src/session.ts:162](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L162)

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

[src/session.ts:164](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L164)

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

[src/session.ts:166](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L166)

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

[src/session.ts:168](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L168)

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

[src/session.ts:170](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L170)

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

[src/session.ts:172](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L172)

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

[src/session.ts:174](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L174)

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

[src/session.ts:176](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L176)

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

[src/session.ts:178](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L178)

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

[src/session.ts:180](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L180)

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

[src/session.ts:182](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L182)
