[SIP.js](../README.md) / [Exports](../modules.md) / SimpleUser

# Class: SimpleUser

A simple SIP user class.

**`remarks`**
While this class is completely functional for simple use cases, it is not intended
to provide an interface which is suitable for most (must less all) applications.
While this class has many limitations (for example, it only handles a single concurrent session),
it is, however, intended to serve as a simple example of using the SIP.js API.

## Table of contents

### Constructors

- [constructor](SimpleUser.md#constructor)

### Properties

- [delegate](SimpleUser.md#delegate)

### Accessors

- [id](SimpleUser.md#id)
- [localMediaStream](SimpleUser.md#localmediastream)
- [remoteMediaStream](SimpleUser.md#remotemediastream)
- [localAudioTrack](SimpleUser.md#localaudiotrack)
- [localVideoTrack](SimpleUser.md#localvideotrack)
- [remoteAudioTrack](SimpleUser.md#remoteaudiotrack)
- [remoteVideoTrack](SimpleUser.md#remotevideotrack)

### Methods

- [connect](SimpleUser.md#connect)
- [disconnect](SimpleUser.md#disconnect)
- [isConnected](SimpleUser.md#isconnected)
- [register](SimpleUser.md#register)
- [unregister](SimpleUser.md#unregister)
- [call](SimpleUser.md#call)
- [hangup](SimpleUser.md#hangup)
- [answer](SimpleUser.md#answer)
- [decline](SimpleUser.md#decline)
- [hold](SimpleUser.md#hold)
- [unhold](SimpleUser.md#unhold)
- [isHeld](SimpleUser.md#isheld)
- [mute](SimpleUser.md#mute)
- [unmute](SimpleUser.md#unmute)
- [isMuted](SimpleUser.md#ismuted)
- [sendDTMF](SimpleUser.md#senddtmf)
- [message](SimpleUser.md#message)

## Constructors

### constructor

• **new SimpleUser**(`server`, `options?`)

Constructs a new instance of the `SimpleUser` class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `server` | `string` | SIP WebSocket Server URL. |
| `options?` | [`SimpleUserOptions`](../interfaces/SimpleUserOptions.md) | Options bucket. See [SimpleUserOptions](../interfaces/SimpleUserOptions.md) for details. |

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:31

## Properties

### delegate

• **delegate**: [`SimpleUserDelegate`](../interfaces/SimpleUserDelegate.md)

Delegate.

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:15

## Accessors

### id

• `get` **id**(): `string`

Instance identifier.

**`internal`**

#### Returns

`string`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:36

___

### localMediaStream

• `get` **localMediaStream**(): `MediaStream`

The local media stream. Undefined if call not answered.

#### Returns

`MediaStream`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:38

___

### remoteMediaStream

• `get` **remoteMediaStream**(): `MediaStream`

The remote media stream. Undefined if call not answered.

#### Returns

`MediaStream`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:40

___

### localAudioTrack

• `get` **localAudioTrack**(): `MediaStreamTrack`

The local audio track, if available.

**`deprecated`** Use localMediaStream and get track from the stream.

#### Returns

`MediaStreamTrack`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:45

___

### localVideoTrack

• `get` **localVideoTrack**(): `MediaStreamTrack`

The local video track, if available.

**`deprecated`** Use localMediaStream and get track from the stream.

#### Returns

`MediaStreamTrack`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:50

___

### remoteAudioTrack

• `get` **remoteAudioTrack**(): `MediaStreamTrack`

The remote audio track, if available.

**`deprecated`** Use remoteMediaStream and get track from the stream.

#### Returns

`MediaStreamTrack`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:55

___

### remoteVideoTrack

• `get` **remoteVideoTrack**(): `MediaStreamTrack`

The remote video track, if available.

**`deprecated`** Use remoteMediaStream and get track from the stream.

#### Returns

`MediaStreamTrack`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:60

## Methods

### connect

▸ **connect**(): `Promise`<`void`\>

Connect.

**`remarks`**
Start the UserAgent's WebSocket Transport.

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:66

___

### disconnect

▸ **disconnect**(): `Promise`<`void`\>

Disconnect.

**`remarks`**
Stop the UserAgent's WebSocket Transport.

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:72

___

### isConnected

▸ **isConnected**(): `boolean`

Return true if connected.

#### Returns

`boolean`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:76

___

### register

▸ **register**(`registererOptions?`, `registererRegisterOptions?`): `Promise`<`void`\>

Start receiving incoming calls.

**`remarks`**
Send a REGISTER request for the UserAgent's AOR.
Resolves when the REGISTER request is sent, otherwise rejects.

#### Parameters

| Name | Type |
| :------ | :------ |
| `registererOptions?` | [`RegistererOptions`](../interfaces/RegistererOptions.md) |
| `registererRegisterOptions?` | [`RegistererRegisterOptions`](../interfaces/RegistererRegisterOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:83

___

### unregister

▸ **unregister**(`registererUnregisterOptions?`): `Promise`<`void`\>

Stop receiving incoming calls.

**`remarks`**
Send an un-REGISTER request for the UserAgent's AOR.
Resolves when the un-REGISTER request is sent, otherwise rejects.

#### Parameters

| Name | Type |
| :------ | :------ |
| `registererUnregisterOptions?` | [`RegistererUnregisterOptions`](../interfaces/RegistererUnregisterOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:90

___

### call

▸ **call**(`destination`, `inviterOptions?`, `inviterInviteOptions?`): `Promise`<`void`\>

Make an outgoing call.

**`remarks`**
Send an INVITE request to create a new Session.
Resolves when the INVITE request is sent, otherwise rejects.
Use `onCallAnswered` delegate method to determine if Session is established.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `destination` | `string` | The target destination to call. A SIP address to send the INVITE to. |
| `inviterOptions?` | [`InviterOptions`](../interfaces/InviterOptions.md) | Optional options for Inviter constructor. |
| `inviterInviteOptions?` | [`InviterInviteOptions`](../interfaces/InviterInviteOptions.md) | Optional options for Inviter.invite(). |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:101

___

### hangup

▸ **hangup**(): `Promise`<`void`\>

Hangup a call.

**`remarks`**
Send a BYE request, CANCEL request or reject response to end the current Session.
Resolves when the request/response is sent, otherwise rejects.
Use `onCallTerminated` delegate method to determine if and when call is ended.

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:109

___

### answer

▸ **answer**(`invitationAcceptOptions?`): `Promise`<`void`\>

Answer an incoming call.

**`remarks`**
Accept an incoming INVITE request creating a new Session.
Resolves with the response is sent, otherwise rejects.
Use `onCallAnswered` delegate method to determine if and when call is established.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `invitationAcceptOptions?` | [`InvitationAcceptOptions`](../interfaces/InvitationAcceptOptions.md) | Optional options for Inviter.accept(). |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:118

___

### decline

▸ **decline**(): `Promise`<`void`\>

Decline an incoming call.

**`remarks`**
Reject an incoming INVITE request.
Resolves with the response is sent, otherwise rejects.
Use `onCallTerminated` delegate method to determine if and when call is ended.

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:126

___

### hold

▸ **hold**(): `Promise`<`void`\>

Hold call

**`remarks`**
Send a re-INVITE with new offer indicating "hold".
Resolves when the re-INVITE request is sent, otherwise rejects.
Use `onCallHold` delegate method to determine if request is accepted or rejected.
See: https://tools.ietf.org/html/rfc6337

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:135

___

### unhold

▸ **unhold**(): `Promise`<`void`\>

Unhold call.

**`remarks`**
Send a re-INVITE with new offer indicating "unhold".
Resolves when the re-INVITE request is sent, otherwise rejects.
Use `onCallHold` delegate method to determine if request is accepted or rejected.
See: https://tools.ietf.org/html/rfc6337

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:144

___

### isHeld

▸ **isHeld**(): `boolean`

Hold state.

**`remarks`**
True if session media is on hold.

#### Returns

`boolean`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:150

___

### mute

▸ **mute**(): `void`

Mute call.

**`remarks`**
Disable sender's media tracks.

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:156

___

### unmute

▸ **unmute**(): `void`

Unmute call.

**`remarks`**
Enable sender's media tracks.

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:162

___

### isMuted

▸ **isMuted**(): `boolean`

Mute state.

**`remarks`**
True if sender's media track is disabled.

#### Returns

`boolean`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:168

___

### sendDTMF

▸ **sendDTMF**(`tone`): `Promise`<`void`\>

Send DTMF.

**`remarks`**
Send an INFO request with content type application/dtmf-relay.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tone` | `string` | Tone to send. |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:175

___

### message

▸ **message**(`destination`, `message`): `Promise`<`void`\>

Send a message.

**`remarks`**
Send a MESSAGE request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `destination` | `string` | The target destination for the message. A SIP address to send the MESSAGE to. |
| `message` | `string` | - |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user.d.ts:182
