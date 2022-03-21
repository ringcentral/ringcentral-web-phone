[SIP.js](../README.md) / [Exports](../modules.md) / Transport

# Class: Transport

Transport for SIP over secure WebSocket (WSS).

## Implements

- [`Transport`](../interfaces/Transport.md)

## Table of contents

### Constructors

- [constructor](Transport.md#constructor)

### Properties

- [onConnect](Transport.md#onconnect)
- [onDisconnect](Transport.md#ondisconnect)
- [onMessage](Transport.md#onmessage)

### Methods

- [dispose](Transport.md#dispose)
- [connect](Transport.md#connect)
- [disconnect](Transport.md#disconnect)
- [isConnected](Transport.md#isconnected)
- [send](Transport.md#send)

### Accessors

- [protocol](Transport.md#protocol)
- [server](Transport.md#server)
- [state](Transport.md#state)
- [stateChange](Transport.md#statechange)
- [ws](Transport.md#ws)

## Constructors

### constructor

• **new Transport**(`logger`, `options?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`Logger`](Logger.md) |
| `options?` | [`TransportOptions`](../interfaces/TransportOptions.md) |

#### Defined in

sip.js/lib/platform/web/transport/transport.d.ts:31

## Properties

### onConnect

• **onConnect**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Implementation of

[Transport](../interfaces/Transport.md).[onConnect](../interfaces/Transport.md#onconnect)

#### Defined in

sip.js/lib/platform/web/transport/transport.d.ts:12

___

### onDisconnect

• **onDisconnect**: (`error?`: `Error`) => `void`

#### Type declaration

▸ (`error?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `error?` | `Error` |

##### Returns

`void`

#### Implementation of

[Transport](../interfaces/Transport.md).[onDisconnect](../interfaces/Transport.md#ondisconnect)

#### Defined in

sip.js/lib/platform/web/transport/transport.d.ts:13

___

### onMessage

• **onMessage**: (`message`: `string`) => `void`

#### Type declaration

▸ (`message`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

##### Returns

`void`

#### Implementation of

[Transport](../interfaces/Transport.md).[onMessage](../interfaces/Transport.md#onmessage)

#### Defined in

sip.js/lib/platform/web/transport/transport.d.ts:14

## Methods

### dispose

▸ **dispose**(): `Promise`<`void`\>

Dispose.

**`remarks`**
When the `UserAgent` is disposed or stopped, this method is called.
The `UserAgent` MUST NOT continue to utilize the instance after calling this method.

#### Returns

`Promise`<`void`\>

#### Implementation of

[Transport](../interfaces/Transport.md).[dispose](../interfaces/Transport.md#dispose)

#### Defined in

sip.js/lib/platform/web/transport/transport.d.ts:32

___

### connect

▸ **connect**(): `Promise`<`void`\>

Connect to network.
Resolves once connected. Otherwise rejects with an Error.

#### Returns

`Promise`<`void`\>

#### Implementation of

[Transport](../interfaces/Transport.md).[connect](../interfaces/Transport.md#connect)

#### Defined in

sip.js/lib/platform/web/transport/transport.d.ts:61

___

### disconnect

▸ **disconnect**(): `Promise`<`void`\>

Disconnect from network.
Resolves once disconnected. Otherwise rejects with an Error.

#### Returns

`Promise`<`void`\>

#### Implementation of

[Transport](../interfaces/Transport.md).[disconnect](../interfaces/Transport.md#disconnect)

#### Defined in

sip.js/lib/platform/web/transport/transport.d.ts:66

___

### isConnected

▸ **isConnected**(): `boolean`

Returns true if the `state` equals "Connected".

**`remarks`**
This is equivalent to `state === TransportState.Connected`.

#### Returns

`boolean`

#### Implementation of

[Transport](../interfaces/Transport.md).[isConnected](../interfaces/Transport.md#isconnected)

#### Defined in

sip.js/lib/platform/web/transport/transport.d.ts:72

___

### send

▸ **send**(`message`): `Promise`<`void`\>

Sends a message.
Resolves once message is sent. Otherwise rejects with an Error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Message to send. |

#### Returns

`Promise`<`void`\>

#### Implementation of

[Transport](../interfaces/Transport.md).[send](../interfaces/Transport.md#send)

#### Defined in

sip.js/lib/platform/web/transport/transport.d.ts:78

## Accessors

### protocol

• `get` **protocol**(): `string`

The protocol.

**`remarks`**
Formatted as defined for the Via header sent-protocol transport.
https://tools.ietf.org/html/rfc3261#section-20.42

#### Returns

`string`

#### Implementation of

[Transport](../interfaces/Transport.md).[protocol](../interfaces/Transport.md#protocol)

#### Defined in

sip.js/lib/platform/web/transport/transport.d.ts:40

___

### server

• `get` **server**(): `string`

The URL of the WebSocket Server.

#### Returns

`string`

#### Defined in

sip.js/lib/platform/web/transport/transport.d.ts:44

___

### state

• `get` **state**(): [`TransportState`](../enums/TransportState.md)

Transport state.

#### Returns

[`TransportState`](../enums/TransportState.md)

#### Implementation of

[Transport](../interfaces/Transport.md).[state](../interfaces/Transport.md#state)

#### Defined in

sip.js/lib/platform/web/transport/transport.d.ts:48

___

### stateChange

• `get` **stateChange**(): [`Emitter`](../interfaces/Emitter.md)<[`TransportState`](../enums/TransportState.md)\>

Transport state change emitter.

#### Returns

[`Emitter`](../interfaces/Emitter.md)<[`TransportState`](../enums/TransportState.md)\>

#### Implementation of

[Transport](../interfaces/Transport.md).[stateChange](../interfaces/Transport.md#statechange)

#### Defined in

sip.js/lib/platform/web/transport/transport.d.ts:52

___

### ws

• `get` **ws**(): `WebSocket`

The WebSocket.

#### Returns

`WebSocket`

#### Defined in

sip.js/lib/platform/web/transport/transport.d.ts:56
