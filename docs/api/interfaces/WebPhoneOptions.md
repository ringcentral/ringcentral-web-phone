[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / WebPhoneOptions

# Interface: WebPhoneOptions

## Table of contents

### Properties

- [appKey](WebPhoneOptions.md#appkey)
- [appName](WebPhoneOptions.md#appname)
- [appVersion](WebPhoneOptions.md#appversion)
- [audioHelper](WebPhoneOptions.md#audiohelper)
- [autoStop](WebPhoneOptions.md#autostop)
- [builtinEnabled](WebPhoneOptions.md#builtinenabled)
- [connector](WebPhoneOptions.md#connector)
- [earlyMedia](WebPhoneOptions.md#earlymedia)
- [enableDefaultModifiers](WebPhoneOptions.md#enabledefaultmodifiers)
- [enableDscp](WebPhoneOptions.md#enabledscp)
- [enableMediaReportLogging](WebPhoneOptions.md#enablemediareportlogging)
- [enableMidLinesInSDP](WebPhoneOptions.md#enablemidlinesinsdp)
- [enablePlanB](WebPhoneOptions.md#enableplanb)
- [enableQos](WebPhoneOptions.md#enableqos)
- [enableTurnServers](WebPhoneOptions.md#enableturnservers)
- [iceCheckingTimeout](WebPhoneOptions.md#icecheckingtimeout)
- [iceTransportPolicy](WebPhoneOptions.md#icetransportpolicy)
- [instanceId](WebPhoneOptions.md#instanceid)
- [keepAliveDebounce](WebPhoneOptions.md#keepalivedebounce)
- [keepAliveInterval](WebPhoneOptions.md#keepaliveinterval)
- [logLevel](WebPhoneOptions.md#loglevel)
- [maxReconnectionAttempts](WebPhoneOptions.md#maxreconnectionattempts)
- [maxReconnectionAttemptsNoBackup](WebPhoneOptions.md#maxreconnectionattemptsnobackup)
- [maxReconnectionAttemptsWithBackup](WebPhoneOptions.md#maxreconnectionattemptswithbackup)
- [media](WebPhoneOptions.md#media)
- [mediaConstraints](WebPhoneOptions.md#mediaconstraints)
- [modifiers](WebPhoneOptions.md#modifiers)
- [qosCollectInterval](WebPhoneOptions.md#qoscollectinterval)
- [reconnectionTimeout](WebPhoneOptions.md#reconnectiontimeout)
- [reconnectionTimeoutNoBackup](WebPhoneOptions.md#reconnectiontimeoutnobackup)
- [reconnectionTimeoutWithBackup](WebPhoneOptions.md#reconnectiontimeoutwithbackup)
- [regId](WebPhoneOptions.md#regid)
- [sessionDescriptionHandlerFactory](WebPhoneOptions.md#sessiondescriptionhandlerfactory)
- [sessionDescriptionHandlerFactoryOptions](WebPhoneOptions.md#sessiondescriptionhandlerfactoryoptions)
- [sipErrorCodes](WebPhoneOptions.md#siperrorcodes)
- [stunServers](WebPhoneOptions.md#stunservers)
- [switchBackInterval](WebPhoneOptions.md#switchbackinterval)
- [transportServers](WebPhoneOptions.md#transportservers)
- [turnServers](WebPhoneOptions.md#turnservers)
- [uuid](WebPhoneOptions.md#uuid)
- [uuidKey](WebPhoneOptions.md#uuidkey)

### Methods

- [onSession](WebPhoneOptions.md#onsession)

## Properties

### appKey

• `Optional` **appKey**: `string`

App key of the RingCentral Developer app

#### Defined in

[src/index.ts:68](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L68)

___

### appName

• `Optional` **appName**: `string`

Name used in user agent string

#### Defined in

[src/index.ts:70](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L70)

___

### appVersion

• `Optional` **appVersion**: `string`

Version used in user agent string

#### Defined in

[src/index.ts:72](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L72)

___

### audioHelper

• `Optional` **audioHelper**: `any`

**`internal`**
Helper class to load incoming and outgoing audio. The library already comes with an implementation of this class

Can be overridden but the custom class should have `loadAudio`, `setVolume`, `playIncoming` and `playOutgoing` methods

#### Defined in

[src/index.ts:79](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L79)

___

### autoStop

• `Optional` **autoStop**: `boolean`

If `true`, user agent calls the stop() method on unload (if running in browser window).

[Reference](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.useragentoptions.autostop.md)

default value `true`

#### Defined in

[src/index.ts:86](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L86)

___

### builtinEnabled

• `Optional` **builtinEnabled**: `boolean`

If `true` log messages should be written to the browser console.

default value `true`

#### Defined in

[src/index.ts:91](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L91)

___

### connector

• `Optional` **connector**: `LogConnector`

A function which will be called every time a log is generated. [Reference](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.logconnector.md)

#### Defined in

[src/index.ts:93](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L93)

___

### earlyMedia

• `Optional` **earlyMedia**: `boolean`

If `true` media will be sent prior to call being answered

Set to `true` by default for firefox browser

default value `false`

#### Defined in

[src/index.ts:100](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L100)

___

### enableDefaultModifiers

• `Optional` **enableDefaultModifiers**: `boolean`

If `true`, `stripG722` and `stripTcpCandidates` modifiers will be enabled in SessionDescriptionHandler

default value `true`

#### Defined in

[src/index.ts:105](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L105)

___

### enableDscp

• `Optional` **enableDscp**: `boolean`

If `true`, dscp is enabled for senders track in peer connection

default value `false`

#### Defined in

[src/index.ts:110](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L110)

___

### enableMediaReportLogging

• `Optional` **enableMediaReportLogging**: `boolean`

If `true`, media report is logged using logger

#### Defined in

[src/index.ts:112](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L112)

___

### enableMidLinesInSDP

• `Optional` **enableMidLinesInSDP**: `boolean`

is `true`, `addMidLines` modifiers will be enabled in SessionDescriptionHandler

#### Defined in

[src/index.ts:114](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L114)

___

### enablePlanB

• `Optional` **enablePlanB**: `boolean`

Use SDP format instead of standards conformant format

https://chromestatus.com/feature/5723303167655936

#### Defined in

[src/index.ts:119](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L119)

___

### enableQos

• `Optional` **enableQos**: `boolean`

If `true`, QOS data will be collected when session starts

#### Defined in

[src/index.ts:121](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L121)

___

### enableTurnServers

• `Optional` **enableTurnServers**: `boolean`

If `true`, turn servers passed with configuration will be used when generating ice candidates

#### Defined in

[src/index.ts:123](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L123)

___

### iceCheckingTimeout

• `Optional` **iceCheckingTimeout**: `number`

Max time in milliseconds to be considered when generating ice candidates

default value `2000` when `enableTurnServers` is `true`, otherwise `500`

#### Defined in

[src/index.ts:128](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L128)

___

### iceTransportPolicy

• `Optional` **iceTransportPolicy**: `RTCIceTransportPolicy`

Policy used when generating ice candidates

default value `all`

#### Defined in

[src/index.ts:133](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L133)

___

### instanceId

• `Optional` **instanceId**: `string`

UUID to provide with "+sip.instance" Contact parameter.

#### Defined in

[src/index.ts:135](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L135)

___

### keepAliveDebounce

• `Optional` **keepAliveDebounce**: `number`

Time in seconds to debounce sending CLRF keepAlive sequences by

default value `10`

#### Defined in

[src/index.ts:140](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L140)

___

### keepAliveInterval

• `Optional` **keepAliveInterval**: `number`

Time in seconds to wait in between CLRF keepAlive sequences are sent

default value `0`

#### Defined in

[src/index.ts:145](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L145)

___

### logLevel

• `Optional` **logLevel**: ``0`` \| ``1`` \| ``2`` \| ``3``

Indicates the verbosity level of the log messages.

0 = Error
1 = Warn
2 = Log
3 = Debug

default value `0`

#### Defined in

[src/index.ts:155](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L155)

___

### maxReconnectionAttempts

• `Optional` **maxReconnectionAttempts**: `number`

Max retry attempts used for retrying to connect to outbound proxy when transport is disconnected

If value is passed, `maxReconnectionAttempts` and `maxReconnectionAttemptsNoBackup` will be ignored

If value is not passed, retry attempts will be decided using `maxReconnectionAttempts` and `maxReconnectionAttemptsNoBackup` depending on what proxy the transport connects to

#### Defined in

[src/index.ts:162](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L162)

___

### maxReconnectionAttemptsNoBackup

• `Optional` **maxReconnectionAttemptsNoBackup**: `number`

Max retry attempts used for retrying to connect to outbound proxy when transport is disconnected

default value `15`

#### Defined in

[src/index.ts:167](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L167)

___

### maxReconnectionAttemptsWithBackup

• `Optional` **maxReconnectionAttemptsWithBackup**: `number`

Max retry attempts used for retrying to connect to outbound backup proxy when transport is disconnected

default value `10`

#### Defined in

[src/index.ts:172](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L172)

___

### media

• `Optional` **media**: `Object`

local and remote reference to HTML media elements

#### Type declaration

| Name | Type |
| :------ | :------ |
| `local?` | `HTMLMediaElement` |
| `remote?` | `HTMLMediaElement` |

#### Defined in

[src/index.ts:174](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L174)

___

### mediaConstraints

• `Optional` **mediaConstraints**: `any`

Constraints used when creating peerConnection

default value `{ audio: true, video: false }`

#### Defined in

[src/index.ts:179](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L179)

___

### modifiers

• `Optional` **modifiers**: `SessionDescriptionHandlerModifier`[]

Default modifiers used for SessionDescriptionHandler

[Reference](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.sessiondescriptionhandlermodifier.md)

#### Defined in

[src/index.ts:184](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L184)

___

### qosCollectInterval

• `Optional` **qosCollectInterval**: `number`

Recurring time interval in seconds after which QOS stats are collected

default value `5000`

#### Defined in

[src/index.ts:191](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L191)

___

### reconnectionTimeout

• `Optional` **reconnectionTimeout**: `number`

Timeout before which reconenction is attempted when transport disconnects

If value is passed, `reconnectionTimeoutNoBackup` and `reconnectionTimeoutNoBackup` will be ignored

If value is not passed, reconnection timeout will be decided using `reconnectionTimeoutNoBackup` and `reconnectionTimeoutNoBackup` depending on what proxy the transport connects to

#### Defined in

[src/index.ts:198](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L198)

___

### reconnectionTimeoutNoBackup

• `Optional` **reconnectionTimeoutNoBackup**: `number`

Timeout before which reconenction is attempted when transport disconnects when connected to outbound proxy

default value `5`

#### Defined in

[src/index.ts:203](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L203)

___

### reconnectionTimeoutWithBackup

• `Optional` **reconnectionTimeoutWithBackup**: `number`

Timeout before which reconenction is attempted when transport disconnects when connected to outbound backup proxy

default value `4`

#### Defined in

[src/index.ts:208](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L208)

___

### regId

• `Optional` **regId**: `number`

Value to provide with "reg-id" Contact parameter. when registering

#### Defined in

[src/index.ts:210](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L210)

___

### sessionDescriptionHandlerFactory

• `Optional` **sessionDescriptionHandlerFactory**: `SessionDescriptionHandlerFactory`

Factory for SessionDescriptionHandler.

The library already uses a default implementation

#### Defined in

[src/index.ts:215](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L215)

___

### sessionDescriptionHandlerFactoryOptions

• `Optional` **sessionDescriptionHandlerFactoryOptions**: [`WebPhoneSessionDescriptionHandlerFactoryOptions`](WebPhoneSessionDescriptionHandlerFactoryOptions.md)

Options for SessionDescriptionHandler

If a value is passed, options like enableDscp, iceCheckingTimeout, turnServers, stunServers, iceTransportPolicynd enablePlanBre ignored

[Reference](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.sessiondescriptionhandleroptions.md)

#### Defined in

[src/index.ts:222](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L222)

___

### sipErrorCodes

• `Optional` **sipErrorCodes**: `string`[]

Sip error codes. This value is picked from registrationData

default value `['408', '502', '503', '504']` if registrationData does not have `sipErrorCodes`

**`internal`**

#### Defined in

[src/index.ts:228](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L228)

___

### stunServers

• `Optional` **stunServers**: `string`[]

Stun servers used when generating ice candidates

default value `['stun.l.google.com:19302']`

#### Defined in

[src/index.ts:233](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L233)

___

### switchBackInterval

• `Optional` **switchBackInterval**: `number`

Time in seconds to try connecting back to outbound proxy when transport has connected to backup outbound proxy

#### Defined in

[src/index.ts:235](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L235)

___

### transportServers

• `Optional` **transportServers**: `TransportServer`[]

**`internal`**
Used to store transport server details

#### Defined in

[src/index.ts:240](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L240)

___

### turnServers

• `Optional` **turnServers**: `string`[]

Turn servers used when generating ice candidates

#### Defined in

[src/index.ts:242](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L242)

___

### uuid

• `Optional` **uuid**: `string`

Unique ID used to make calls to SIP server

Is generated by the library if not passed

#### Defined in

[src/index.ts:247](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L247)

___

### uuidKey

• `Optional` **uuidKey**: `string`

Key that will be used to save uuid in localStorage

default value is used by the library if not passed

default value `rc-webPhone-uuid`

#### Defined in

[src/index.ts:254](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L254)

## Methods

### onSession

▸ `Optional` **onSession**(`session`): `any`

Callback function called when session is created

#### Parameters

| Name | Type |
| :------ | :------ |
| `session` | [`WebPhoneSession`](../modules.md#webphonesession) |

#### Returns

`any`

#### Defined in

[src/index.ts:186](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/index.ts#L186)
