[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / WebPhoneUserAgent

# Interface: WebPhoneUserAgent

WebPhoneUserAgent that makes SIP calls on behalf of the user

## Hierarchy

- `UserAgent`

  ↳ **`WebPhoneUserAgent`**

## Table of contents

### Properties

- [data](WebPhoneUserAgent.md#data)
- [delegate](WebPhoneUserAgent.md#delegate)
- [\_publishers](WebPhoneUserAgent.md#_publishers)
- [\_registerers](WebPhoneUserAgent.md#_registerers)
- [\_sessions](WebPhoneUserAgent.md#_sessions)
- [\_subscriptions](WebPhoneUserAgent.md#_subscriptions)
- [audioHelper](WebPhoneUserAgent.md#audiohelper)
- [constraints](WebPhoneUserAgent.md#constraints)
- [defaultHeaders](WebPhoneUserAgent.md#defaultheaders)
- [earlyMedia](WebPhoneUserAgent.md#earlymedia)
- [enableMediaReportLogging](WebPhoneUserAgent.md#enablemediareportlogging)
- [enableQos](WebPhoneUserAgent.md#enableqos)
- [instanceId](WebPhoneUserAgent.md#instanceid)
- [media](WebPhoneUserAgent.md#media)
- [modifiers](WebPhoneUserAgent.md#modifiers)
- [qosCollectInterval](WebPhoneUserAgent.md#qoscollectinterval)
- [regId](WebPhoneUserAgent.md#regid)
- [registerer](WebPhoneUserAgent.md#registerer)
- [sipInfo](WebPhoneUserAgent.md#sipinfo)
- [transport](WebPhoneUserAgent.md#transport)
- [addListener](WebPhoneUserAgent.md#addlistener)
- [emit](WebPhoneUserAgent.md#emit)
- [off](WebPhoneUserAgent.md#off)
- [on](WebPhoneUserAgent.md#on)
- [removeListener](WebPhoneUserAgent.md#removelistener)

### Accessors

- [configuration](WebPhoneUserAgent.md#configuration)
- [contact](WebPhoneUserAgent.md#contact)
- [state](WebPhoneUserAgent.md#state)
- [stateChange](WebPhoneUserAgent.md#statechange)
- [userAgentCore](WebPhoneUserAgent.md#useragentcore)

### Methods

- [getLogger](WebPhoneUserAgent.md#getlogger)
- [getLoggerFactory](WebPhoneUserAgent.md#getloggerfactory)
- [isConnected](WebPhoneUserAgent.md#isconnected)
- [reconnect](WebPhoneUserAgent.md#reconnect)
- [start](WebPhoneUserAgent.md#start)
- [stop](WebPhoneUserAgent.md#stop)
- [\_makeInviter](WebPhoneUserAgent.md#_makeinviter)
- [createRcMessage](WebPhoneUserAgent.md#creatercmessage)
- [invite](WebPhoneUserAgent.md#invite)
- [onSession](WebPhoneUserAgent.md#onsession)
- [register](WebPhoneUserAgent.md#register)
- [sendMessage](WebPhoneUserAgent.md#sendmessage)
- [switchFrom](WebPhoneUserAgent.md#switchfrom)
- [unregister](WebPhoneUserAgent.md#unregister)

## Properties

### data

• **data**: `unknown`

Property reserved for use by instance owner.

**`defaultvalue`** `undefined`

#### Inherited from

UserAgent.data

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:29

___

### delegate

• **delegate**: `UserAgentDelegate`

Delegate.

#### Inherited from

UserAgent.delegate

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:33

___

### \_publishers

• **\_publishers**: `Object`

**`internal`**

#### Index signature

▪ [id: `string`]: `Publisher`

#### Inherited from

UserAgent.\_publishers

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:35

___

### \_registerers

• **\_registerers**: `Object`

**`internal`**

#### Index signature

▪ [id: `string`]: `Registerer`

#### Inherited from

UserAgent.\_registerers

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:39

___

### \_sessions

• **\_sessions**: `Object`

**`internal`**

#### Index signature

▪ [id: `string`]: `Session`

#### Inherited from

UserAgent.\_sessions

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:43

___

### \_subscriptions

• **\_subscriptions**: `Object`

**`internal`**

#### Index signature

▪ [id: `string`]: `Subscription`

#### Inherited from

UserAgent.\_subscriptions

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:47

___

### audioHelper

• `Optional` **audioHelper**: [`AudioHelper`](../classes/AudioHelper.md)

Utility class to help play incoming and outgoing cues for calls

#### Defined in

[src/userAgent.ts:44](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L44)

___

### constraints

• `Optional` **constraints**: `object`

RTC constraints to be passed to browser when requesting for media stream

#### Defined in

[src/userAgent.ts:46](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L46)

___

### defaultHeaders

• `Optional` **defaultHeaders**: `string`[]

**`internal`**
Contains list of default headers needed to be sent to RingCentral SIP server

#### Defined in

[src/userAgent.ts:51](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L51)

___

### earlyMedia

• `Optional` **earlyMedia**: `boolean`

If `true`, the first answer to the local offer is immediately utilized for media.
Requires that the INVITE request MUST NOT fork.
Has no effect if `inviteWithoutSdp` is true.

#### Defined in

[src/userAgent.ts:57](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L57)

___

### enableMediaReportLogging

• `Optional` **enableMediaReportLogging**: `boolean`

If `true`, logs media stats when an connection is established

#### Defined in

[src/userAgent.ts:59](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L59)

___

### enableQos

• `Optional` **enableQos**: `boolean`

If `true`, Qality of service of the call is generated and published to RingCentral server once the call ends

#### Defined in

[src/userAgent.ts:61](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L61)

___

### instanceId

• `Optional` **instanceId**: `string`

instanceId used while registering to the backend SIP server

#### Defined in

[src/userAgent.ts:63](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L63)

___

### media

• `Optional` **media**: `Object`

HTML media elements where local and remote audio and video streams should be sent

#### Type declaration

| Name | Type |
| :------ | :------ |
| `local?` | `HTMLMediaElement` |
| `remote?` | `HTMLMediaElement` |

#### Defined in

[src/userAgent.ts:65](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L65)

___

### modifiers

• `Optional` **modifiers**: `SessionDescriptionHandlerModifier`[]

SDP modifieres to be used when generating local offer or creating answer

#### Defined in

[src/userAgent.ts:67](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L67)

___

### qosCollectInterval

• `Optional` **qosCollectInterval**: `number`

Time interval in ms on how often should the quality of service data be collected

#### Defined in

[src/userAgent.ts:69](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L69)

___

### regId

• `Optional` **regId**: `number`

regId used while registering to the backend SIP server

#### Defined in

[src/userAgent.ts:71](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L71)

___

### registerer

• `Optional` **registerer**: `Registerer`

**`internal`**
Instance of Registerer which will be used to register the device

#### Defined in

[src/userAgent.ts:76](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L76)

___

### sipInfo

• `Optional` **sipInfo**: [`SipInfo`](SipInfo.md)

sip info recieved by RingCentral backend server when provisioning a device

#### Defined in

[src/userAgent.ts:78](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L78)

___

### transport

• **transport**: [`WebPhoneTransport`](WebPhoneTransport.md)

Transport class over which communication would take place

#### Overrides

UserAgent.transport

#### Defined in

[src/userAgent.ts:80](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L80)

___

### addListener

• `Optional` **addListener**: (`event`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`event`, `listener`): `EventEmitter`

To add event listeneres to be triggered whenever an event on UserAgent is emitted

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/userAgent.ts:82](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L82)

___

### emit

• `Optional` **emit**: (`event`: `string` \| `symbol`, ...`args`: `any`[]) => `boolean`

#### Type declaration

▸ (`event`, ...`args`): `boolean`

Emit event along with data which will trigger all listerenes attached to that event

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

##### Returns

`boolean`

#### Defined in

[src/userAgent.ts:89](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L89)

___

### off

• `Optional` **off**: (`event`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`event`, `listener`): `EventEmitter`

Remove event listener from list of listeners for that event

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/userAgent.ts:93](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L93)

___

### on

• `Optional` **on**: (`event`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`event`, `listener`): `EventEmitter`

To add event listeneres to be triggered whenever an event on UserAgent is emitted

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/userAgent.ts:95](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L95)

___

### removeListener

• `Optional` **removeListener**: (`event`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`event`, `listener`): `EventEmitter`

Remove event listener from list of listeners for that event

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/userAgent.ts:104](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L104)

## Accessors

### configuration

• `get` **configuration**(): `Required`<`UserAgentOptions`\>

User agent configuration.

#### Returns

`Required`<`UserAgentOptions`\>

#### Inherited from

UserAgent.configuration

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:88

___

### contact

• `get` **contact**(): `Contact`

User agent contact.

#### Returns

`Contact`

#### Inherited from

UserAgent.contact

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:92

___

### state

• `get` **state**(): `UserAgentState`

User agent state.

#### Returns

`UserAgentState`

#### Inherited from

UserAgent.state

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:96

___

### stateChange

• `get` **stateChange**(): `Emitter`<`UserAgentState`\>

User agent state change emitter.

#### Returns

`Emitter`<`UserAgentState`\>

#### Inherited from

UserAgent.stateChange

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:100

___

### userAgentCore

• `get` **userAgentCore**(): `UserAgentCore`

User agent core.

#### Returns

`UserAgentCore`

#### Inherited from

UserAgent.userAgentCore

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:108

## Methods

### getLogger

▸ **getLogger**(`category`, `label?`): `Logger`

The logger.

#### Parameters

| Name | Type |
| :------ | :------ |
| `category` | `string` |
| `label?` | `string` |

#### Returns

`Logger`

#### Inherited from

UserAgent.getLogger

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:112

___

### getLoggerFactory

▸ **getLoggerFactory**(): `LoggerFactory`

The logger factory.

#### Returns

`LoggerFactory`

#### Inherited from

UserAgent.getLoggerFactory

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:116

___

### isConnected

▸ **isConnected**(): `boolean`

True if transport is connected.

#### Returns

`boolean`

#### Inherited from

UserAgent.isConnected

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:120

___

### reconnect

▸ **reconnect**(): `Promise`<`void`\>

Reconnect the transport.

#### Returns

`Promise`<`void`\>

#### Inherited from

UserAgent.reconnect

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:124

___

### start

▸ **start**(): `Promise`<`void`\>

Start the user agent.

**`remarks`**
Resolves if transport connects, otherwise rejects.

**`example`**
```ts
userAgent.start()
  .then(() => {
    // userAgent.isConnected() === true
  })
  .catch((error: Error) => {
    // userAgent.isConnected() === false
  });
```

#### Returns

`Promise`<`void`\>

#### Inherited from

UserAgent.start

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:142

___

### stop

▸ **stop**(): `Promise`<`void`\>

Stop the user agent.

**`remarks`**
Resolves when the user agent has completed a graceful shutdown.
```txt
1) Sessions terminate.
2) Registerers unregister.
3) Subscribers unsubscribe.
4) Publishers unpublish.
5) Transport disconnects.
6) User Agent Core resets.
```
NOTE: While this is a "graceful shutdown", it can also be very slow one if you
are waiting for the returned Promise to resolve. The disposal of the clients and
dialogs is done serially - waiting on one to finish before moving on to the next.
This can be slow if there are lot of subscriptions to unsubscribe for example.

THE SLOW PACE IS INTENTIONAL!
While one could spin them all down in parallel, this could slam the remote server.
It is bad practice to denial of service attack (DoS attack) servers!!!
Moreover, production servers will automatically blacklist clients which send too
many requests in too short a period of time - dropping any additional requests.

If a different approach to disposing is needed, one can implement whatever is
needed and execute that prior to calling `stop()`. Alternatively one may simply
not wait for the Promise returned by `stop()` to complete.

#### Returns

`Promise`<`void`\>

#### Inherited from

UserAgent.stop

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:171

___

### \_makeInviter

▸ **_makeInviter**(`targetURI`, `options?`): `Inviter`

Used to avoid circular references.

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetURI` | `URI` |
| `options?` | `InviterOptions` |

#### Returns

`Inviter`

#### Inherited from

UserAgent.\_makeInviter

#### Defined in

node_modules/sip.js/lib/api/user-agent.d.ts:176

___

### createRcMessage

▸ `Optional` **createRcMessage**(`options`): `string`

**`internal`**
Helper function to create RingCentral message

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`RCHeaders`](RCHeaders.md) |

#### Returns

`string`

#### Defined in

[src/userAgent.ts:87](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L87)

___

### invite

▸ `Optional` **invite**(`number`, `options`): [`WebPhoneSession`](../modules.md#webphonesession)

Send call invitation

#### Parameters

| Name | Type |
| :------ | :------ |
| `number` | `string` |
| `options` | `InviteOptions` |

#### Returns

[`WebPhoneSession`](../modules.md#webphonesession)

#### Defined in

[src/userAgent.ts:91](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L91)

___

### onSession

▸ `Optional` **onSession**(`session`): `void`

**`internal`**
Function which will be called when session is created. It's value is picked using options.onSession when instantiating userAgent object

#### Parameters

| Name | Type |
| :------ | :------ |
| `session` | [`WebPhoneSession`](../modules.md#webphonesession) |

#### Returns

`void`

#### Defined in

[src/userAgent.ts:100](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L100)

___

### register

▸ `Optional` **register**(): `Promise`<`void`\>

Register devide with the registrar

#### Returns

`Promise`<`void`\>

#### Defined in

[src/userAgent.ts:102](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L102)

___

### sendMessage

▸ `Optional` **sendMessage**(`to`, `messageData`): `Promise`<`IncomingResponse`\>

**`internal`**
Utility function used to send message to backend server

#### Parameters

| Name | Type |
| :------ | :------ |
| `to` | `string` |
| `messageData` | `string` |

#### Returns

`Promise`<`IncomingResponse`\>

#### Defined in

[src/userAgent.ts:109](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L109)

___

### switchFrom

▸ `Optional` **switchFrom**(`activeCall`, `options`): [`WebPhoneSession`](../modules.md#webphonesession)

To switch from another device to this device

#### Parameters

| Name | Type |
| :------ | :------ |
| `activeCall` | [`ActiveCallInfo`](ActiveCallInfo.md) |
| `options` | `InviteOptions` |

#### Returns

[`WebPhoneSession`](../modules.md#webphonesession)

#### Defined in

[src/userAgent.ts:111](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L111)

___

### unregister

▸ `Optional` **unregister**(): `Promise`<`void`\>

Unregister device from the registrar

#### Returns

`Promise`<`void`\>

#### Defined in

[src/userAgent.ts:113](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/userAgent.ts#L113)
