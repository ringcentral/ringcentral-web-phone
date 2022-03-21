[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / WebPhoneTransport

# Interface: WebPhoneTransport

## Hierarchy

- `Transport`

  ↳ **`WebPhoneTransport`**

## Table of contents

### Properties

- [state](WebPhoneTransport.md#state)
- [stateChange](WebPhoneTransport.md#statechange)
- [onConnect](WebPhoneTransport.md#onconnect)
- [onDisconnect](WebPhoneTransport.md#ondisconnect)
- [onMessage](WebPhoneTransport.md#onmessage)
- [protocol](WebPhoneTransport.md#protocol)
- [logger](WebPhoneTransport.md#logger)
- [mainProxy](WebPhoneTransport.md#mainproxy)
- [maxReconnectionAttempts](WebPhoneTransport.md#maxreconnectionattempts)
- [nextReconnectInterval](WebPhoneTransport.md#nextreconnectinterval)
- [reconnectionAttempts](WebPhoneTransport.md#reconnectionattempts)
- [reconnectionTimeout](WebPhoneTransport.md#reconnectiontimeout)
- [server](WebPhoneTransport.md#server)
- [servers](WebPhoneTransport.md#servers)
- [sipErrorCodes](WebPhoneTransport.md#siperrorcodes)
- [switchBackInterval](WebPhoneTransport.md#switchbackinterval)
- [addListener](WebPhoneTransport.md#addlistener)
- [emit](WebPhoneTransport.md#emit)
- [isSipErrorCode](WebPhoneTransport.md#issiperrorcode)
- [off](WebPhoneTransport.md#off)
- [on](WebPhoneTransport.md#on)
- [reconnect](WebPhoneTransport.md#reconnect)
- [removeListener](WebPhoneTransport.md#removelistener)

### Methods

- [connect](WebPhoneTransport.md#connect)
- [disconnect](WebPhoneTransport.md#disconnect)
- [dispose](WebPhoneTransport.md#dispose)
- [isConnected](WebPhoneTransport.md#isconnected)
- [send](WebPhoneTransport.md#send)
- [getNextWsServer](WebPhoneTransport.md#getnextwsserver)
- [noAvailableServers](WebPhoneTransport.md#noavailableservers)

## Properties

### state

• `Readonly` **state**: `TransportState`

Transport state.

**`remarks`**
The initial Transport state MUST be "disconnected" (after calling constructor).

#### Inherited from

Transport.state

#### Defined in

node_modules/sip.js/lib/api/transport.d.ts:44

___

### stateChange

• `Readonly` **stateChange**: `Emitter`<`TransportState`\>

Transport state change emitter.

#### Inherited from

Transport.stateChange

#### Defined in

node_modules/sip.js/lib/api/transport.d.ts:48

___

### onConnect

• **onConnect**: () => `void`

#### Type declaration

▸ (): `void`

Callback on state transition to "Connected".

**`remarks`**
When the `UserAgent` is constructed, this property is set.
```txt
- The `state` MUST be "Connected" when called.
```

##### Returns

`void`

#### Inherited from

Transport.onConnect

#### Defined in

node_modules/sip.js/lib/api/transport.d.ts:58

___

### onDisconnect

• **onDisconnect**: (`error?`: `Error`) => `void`

#### Type declaration

▸ (`error?`): `void`

Callback on state transition from "Connected".

**`remarks`**
When the `UserAgent` is constructed, this property is set.
```txt
- The `state` MUST NOT "Connected" when called.
- If prior `state` is "Connecting" or "Connected", `error` MUST be defined.
- If prior `state` is "Disconnecting", `error` MUST NOT be undefined.
```
If the transition from "Connected" occurs because the transport
user requested it by calling `disconnect`, then `error` will be undefined.
Otherwise `error` will be defined to provide an indication that the
transport initiated the transition from "Connected" - for example,
perhaps network connectivity was lost.

##### Parameters

| Name | Type |
| :------ | :------ |
| `error?` | `Error` |

##### Returns

`void`

#### Inherited from

Transport.onDisconnect

#### Defined in

node_modules/sip.js/lib/api/transport.d.ts:75

___

### onMessage

• **onMessage**: (`message`: `string`) => `void`

#### Type declaration

▸ (`message`): `void`

Callback on receipt of a message.

**`remarks`**
When the `UserAgent` is constructed, this property is set.
The `state` MUST be "Connected" when this is called.

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

##### Returns

`void`

#### Inherited from

Transport.onMessage

#### Defined in

node_modules/sip.js/lib/api/transport.d.ts:83

___

### protocol

• `Readonly` **protocol**: `string`

The transport protocol.

**`remarks`**
Formatted as defined for the Via header sent-protocol transport.
https://tools.ietf.org/html/rfc3261#section-20.42

#### Inherited from

Transport.protocol

#### Defined in

node_modules/sip.js/lib/core/transport.d.ts:21

___

### logger

• `Optional` **logger**: `Logger`

logger class to log transport related messaged

#### Defined in

[src/transport.ts:15](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L15)

___

### mainProxy

• `Optional` **mainProxy**: `TransportServer`

Address of the RingCentral main proxy
Is calculated automatically as the first item in the `options.transportServers` array

#### Defined in

[src/transport.ts:20](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L20)

___

### maxReconnectionAttempts

• `Optional` **maxReconnectionAttempts**: `number`

Max attempts until which transport reconnection will be attempted before moving to the next available `transportServer`

#### Defined in

[src/transport.ts:22](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L22)

___

### nextReconnectInterval

• `Optional` **nextReconnectInterval**: `number`

Interval after which the next reconnection attempt will be made

#### Defined in

[src/transport.ts:24](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L24)

___

### reconnectionAttempts

• `Optional` **reconnectionAttempts**: `number`

The current reconnection attempt

#### Defined in

[src/transport.ts:26](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L26)

___

### reconnectionTimeout

• `Optional` **reconnectionTimeout**: `number`

Timeout to be used to calculate when should the next reconnection attempt be made

#### Defined in

[src/transport.ts:28](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L28)

___

### server

• `Optional` **server**: `string`

Current server where transport is connected

#### Defined in

[src/transport.ts:32](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L32)

___

### servers

• `Optional` **servers**: `TransportServer`[]

Possible list of servers where transport can connect to

#### Defined in

[src/transport.ts:34](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L34)

___

### sipErrorCodes

• `Optional` **sipErrorCodes**: `string`[]

List of SIP error codes

#### Defined in

[src/transport.ts:36](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L36)

___

### switchBackInterval

• `Optional` **switchBackInterval**: `number`

Interal after which switch back to main proxy should be initiated

#### Defined in

[src/transport.ts:38](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L38)

___

### addListener

• `Optional` **addListener**: (`event`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`event`, `listener`): `EventEmitter`

Register functions to be called when events are fired on the transport object

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/transport.ts:62](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L62)

___

### emit

• `Optional` **emit**: (`event`: `string` \| `symbol`, ...`args`: `any`[]) => `boolean`

#### Type declaration

▸ (`event`, ...`args`): `boolean`

Trigger events on transport object

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

##### Returns

`boolean`

#### Defined in

[src/transport.ts:64](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L64)

___

### isSipErrorCode

• `Optional` **isSipErrorCode**: (`this`: [`WebPhoneTransport`](WebPhoneTransport.md), `statusCode`: `number`) => `boolean`

#### Type declaration

▸ (`this`, `statusCode`): `boolean`

Is the current code part of the SIP error codes registered with the transport object

##### Parameters

| Name | Type |
| :------ | :------ |
| `this` | [`WebPhoneTransport`](WebPhoneTransport.md) |
| `statusCode` | `number` |

##### Returns

`boolean`

#### Defined in

[src/transport.ts:68](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L68)

___

### off

• `Optional` **off**: (`event`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`event`, `listener`): `EventEmitter`

Unregister functions to be called when events are fired on the transport object

alias for removeListener

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/transport.ts:76](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L76)

___

### on

• `Optional` **on**: (`event`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`event`, `listener`): `EventEmitter`

Register functions to be called when events are fired on the transport object

alias for addListener

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/transport.ts:81](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L81)

___

### reconnect

• `Optional` **reconnect**: () => `Promise`<`void`\>

#### Type declaration

▸ (): `Promise`<`void`\>

Connect to network.
Resolves once connected. Otherwise rejects with an Error.

##### Returns

`Promise`<`void`\>

#### Defined in

[src/transport.ts:85](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L85)

___

### removeListener

• `Optional` **removeListener**: (`event`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`event`, `listener`): `EventEmitter`

Unregister functions to be called when events are fired on the transport object

##### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/transport.ts:89](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L89)

## Methods

### connect

▸ **connect**(): `Promise`<`void`\>

Connect to network.

**`remarks`**
```txt
- If `state` is "Connecting", `state` MUST NOT transition before returning.
- If `state` is "Connected", `state` MUST NOT transition before returning.
- If `state` is "Disconnecting", `state` MUST transition to "Connecting" before returning.
- If `state` is "Disconnected" `state` MUST transition to "Connecting" before returning.
- The `state` MUST transition to "Connected" before resolving (assuming `state` is not already "Connected").
- The `state` MUST transition to "Disconnecting" or "Disconnected" before rejecting and MUST reject with an Error.
```
Resolves when the transport connects. Rejects if transport fails to connect.
Rejects with {@link StateTransitionError} if a loop is detected.
In particular, callbacks and emitters MUST NOT call this method synchronously.

#### Returns

`Promise`<`void`\>

#### Inherited from

Transport.connect

#### Defined in

node_modules/sip.js/lib/api/transport.d.ts:100

___

### disconnect

▸ **disconnect**(): `Promise`<`void`\>

Disconnect from network.

**`remarks`**
```txt
- If `state` is "Connecting", `state` MUST transition to "Disconnecting" before returning.
- If `state` is "Connected", `state` MUST transition to "Disconnecting" before returning.
- If `state` is "Disconnecting", `state` MUST NOT transition before returning.
- If `state` is "Disconnected", `state` MUST NOT transition before returning.
- The `state` MUST transition to "Disconnected" before resolving (assuming `state` is not already "Disconnected").
- The `state` MUST transition to "Connecting" or "Connected" before rejecting and MUST reject with an Error.
```
Resolves when the transport disconnects. Rejects if transport fails to disconnect.
Rejects with {@link StateTransitionError} if a loop is detected.
In particular, callbacks and emitters MUST NOT call this method synchronously.

#### Returns

`Promise`<`void`\>

#### Inherited from

Transport.disconnect

#### Defined in

node_modules/sip.js/lib/api/transport.d.ts:117

___

### dispose

▸ **dispose**(): `Promise`<`void`\>

Dispose.

**`remarks`**
When the `UserAgent` is disposed or stopped, this method is called.
The `UserAgent` MUST NOT continue to utilize the instance after calling this method.

#### Returns

`Promise`<`void`\>

#### Inherited from

Transport.dispose

#### Defined in

node_modules/sip.js/lib/api/transport.d.ts:125

___

### isConnected

▸ **isConnected**(): `boolean`

Returns true if the `state` equals "Connected".

**`remarks`**
This is equivalent to `state === TransportState.Connected`.
It is convenient. A common paradigm is, for example...

**`example`**
```ts
// Monitor transport connectivity
userAgent.transport.stateChange.addListener(() => {
  if (userAgent.transport.isConnected()) {
    // handle transport connect
  } else {
    // handle transport disconnect
  }
});
```

#### Returns

`boolean`

#### Inherited from

Transport.isConnected

#### Defined in

node_modules/sip.js/lib/api/transport.d.ts:145

___

### send

▸ **send**(`message`): `Promise`<`void`\>

Send a message.

**`remarks`**
```txt
- If `state` is "Connecting", rejects with an Error.
- If `state` is "Connected", resolves when the message is sent otherwise rejects with an Error.
- If `state` is "Disconnecting", rejects with an Error.
- If `state` is "Disconnected", rejects with an Error.
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Message to send. |

#### Returns

`Promise`<`void`\>

#### Inherited from

Transport.send

#### Defined in

node_modules/sip.js/lib/api/transport.d.ts:158

___

### getNextWsServer

▸ `Optional` **getNextWsServer**(`force?`): `TransportServer`

Get next available server from the list of `transportServers`

#### Parameters

| Name | Type |
| :------ | :------ |
| `force?` | `boolean` |

#### Returns

`TransportServer`

#### Defined in

[src/transport.ts:66](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L66)

___

### noAvailableServers

▸ `Optional` **noAvailableServers**(): `boolean`

Helper function to check if any valid `transportServers` are available to connect to

#### Returns

`boolean`

#### Defined in

[src/transport.ts:70](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/transport.ts#L70)
