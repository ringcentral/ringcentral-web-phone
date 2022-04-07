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

[src/transport.ts:15](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L15)

___

### mainProxy

• `Optional` **mainProxy**: `TransportServer`

Address of the RingCentral main proxy
Is calculated automatically as the first item in the `options.transportServers` array

#### Defined in

[src/transport.ts:20](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L20)

___

### maxReconnectionAttempts

• `Optional` **maxReconnectionAttempts**: `number`

Max attempts until which transport reconnection will be attempted before moving to the next available `transportServer`

#### Defined in

[src/transport.ts:22](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L22)

___

### nextReconnectInterval

• `Optional` **nextReconnectInterval**: `number`

Interval after which the next reconnection attempt will be made

#### Defined in

[src/transport.ts:24](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L24)

___

### reconnectionAttempts

• `Optional` **reconnectionAttempts**: `number`

The current reconnection attempt

#### Defined in

[src/transport.ts:26](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L26)

___

### reconnectionTimeout

• `Optional` **reconnectionTimeout**: `number`

Timeout to be used to calculate when should the next reconnection attempt be made

#### Defined in

[src/transport.ts:28](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L28)

___

### server

• `Optional` **server**: `string`

Current server where transport is connected

#### Defined in

[src/transport.ts:32](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L32)

___

### servers

• `Optional` **servers**: `TransportServer`[]

Possible list of servers where transport can connect to

#### Defined in

[src/transport.ts:34](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L34)

___

### sipErrorCodes

• `Optional` **sipErrorCodes**: `string`[]

List of SIP error codes

#### Defined in

[src/transport.ts:36](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L36)

___

### switchBackInterval

• `Optional` **switchBackInterval**: `number`

Interal after which switch back to main proxy should be initiated

#### Defined in

[src/transport.ts:38](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L38)

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

[src/transport.ts:62](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L62)

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

[src/transport.ts:64](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L64)

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

[src/transport.ts:68](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L68)

___

### off

• `Optional` **off**: (`eventName`: `string` \| `symbol`, `listener`: (...`args`: `any`[]) => `void`) => `EventEmitter`

#### Type declaration

▸ (`eventName`, `listener`): `EventEmitter`

Alias for `emitter.removeListener()`.

alias for removeListener

**`since`** v10.0.0

##### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

##### Returns

`EventEmitter`

#### Defined in

[src/transport.ts:76](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L76)

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

[src/transport.ts:81](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L81)

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

[src/transport.ts:85](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L85)

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

[src/transport.ts:89](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L89)

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

[src/transport.ts:66](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L66)

___

### noAvailableServers

▸ `Optional` **noAvailableServers**(): `boolean`

Helper function to check if any valid `transportServers` are available to connect to

#### Returns

`boolean`

#### Defined in

[src/transport.ts:70](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/transport.ts#L70)
