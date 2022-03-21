[SIP.js](../README.md) / [Exports](../modules.md) / UserAgent

# Class: UserAgent

A user agent sends and receives requests using a `Transport`.

**`remarks`**
A user agent (UA) is associated with a user via the user's SIP address of record (AOR)
and acts on behalf of that user to send and receive SIP requests. The user agent can
register to receive incoming requests, as well as create and send outbound messages.
The user agent also maintains the Transport over which its signaling travels.

## Table of contents

### Methods

- [makeURI](UserAgent.md#makeuri)
- [getLogger](UserAgent.md#getlogger)
- [getLoggerFactory](UserAgent.md#getloggerfactory)
- [isConnected](UserAgent.md#isconnected)
- [reconnect](UserAgent.md#reconnect)
- [start](UserAgent.md#start)
- [stop](UserAgent.md#stop)
- [\_makeInviter](UserAgent.md#_makeinviter)

### Constructors

- [constructor](UserAgent.md#constructor)

### Properties

- [data](UserAgent.md#data)
- [delegate](UserAgent.md#delegate)
- [\_publishers](UserAgent.md#_publishers)
- [\_registerers](UserAgent.md#_registerers)
- [\_sessions](UserAgent.md#_sessions)
- [\_subscriptions](UserAgent.md#_subscriptions)

### Accessors

- [configuration](UserAgent.md#configuration)
- [contact](UserAgent.md#contact)
- [state](UserAgent.md#state)
- [stateChange](UserAgent.md#statechange)
- [transport](UserAgent.md#transport)
- [userAgentCore](UserAgent.md#useragentcore)

## Methods

### makeURI

▸ `Static` **makeURI**(`uri`): [`URI`](URI.md)

Create a URI instance from a string.

**`example`**
```ts
const uri = UserAgent.makeURI("sip:edgar@example.com");
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uri` | `string` | The string to parse. |

#### Returns

[`URI`](URI.md)

#### Defined in

sip.js/lib/api/user-agent.d.ts:75

___

### getLogger

▸ **getLogger**(`category`, `label?`): [`Logger`](Logger.md)

The logger.

#### Parameters

| Name | Type |
| :------ | :------ |
| `category` | `string` |
| `label?` | `string` |

#### Returns

[`Logger`](Logger.md)

#### Defined in

sip.js/lib/api/user-agent.d.ts:112

___

### getLoggerFactory

▸ **getLoggerFactory**(): [`LoggerFactory`](LoggerFactory.md)

The logger factory.

#### Returns

[`LoggerFactory`](LoggerFactory.md)

#### Defined in

sip.js/lib/api/user-agent.d.ts:116

___

### isConnected

▸ **isConnected**(): `boolean`

True if transport is connected.

#### Returns

`boolean`

#### Defined in

sip.js/lib/api/user-agent.d.ts:120

___

### reconnect

▸ **reconnect**(): `Promise`<`void`\>

Reconnect the transport.

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/user-agent.d.ts:124

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

#### Defined in

sip.js/lib/api/user-agent.d.ts:142

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

#### Defined in

sip.js/lib/api/user-agent.d.ts:171

___

### \_makeInviter

▸ **_makeInviter**(`targetURI`, `options?`): [`Inviter`](Inviter.md)

Used to avoid circular references.

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetURI` | [`URI`](URI.md) |
| `options?` | [`InviterOptions`](../interfaces/InviterOptions.md) |

#### Returns

[`Inviter`](Inviter.md)

#### Defined in

sip.js/lib/api/user-agent.d.ts:176

## Constructors

### constructor

• **new UserAgent**(`options?`)

Constructs a new instance of the `UserAgent` class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | `Partial`<[`UserAgentOptions`](../interfaces/UserAgentOptions.md)\> | Options bucket. See [UserAgentOptions](../interfaces/UserAgentOptions.md) for details. |

#### Defined in

sip.js/lib/api/user-agent.d.ts:65

## Properties

### data

• **data**: `unknown`

Property reserved for use by instance owner.

**`defaultvalue`** `undefined`

#### Defined in

sip.js/lib/api/user-agent.d.ts:29

___

### delegate

• **delegate**: [`UserAgentDelegate`](../interfaces/UserAgentDelegate.md)

Delegate.

#### Defined in

sip.js/lib/api/user-agent.d.ts:33

___

### \_publishers

• **\_publishers**: `Object`

**`internal`**

#### Index signature

▪ [id: `string`]: [`Publisher`](Publisher.md)

#### Defined in

sip.js/lib/api/user-agent.d.ts:35

___

### \_registerers

• **\_registerers**: `Object`

**`internal`**

#### Index signature

▪ [id: `string`]: [`Registerer`](Registerer.md)

#### Defined in

sip.js/lib/api/user-agent.d.ts:39

___

### \_sessions

• **\_sessions**: `Object`

**`internal`**

#### Index signature

▪ [id: `string`]: [`Session`](Session.md)

#### Defined in

sip.js/lib/api/user-agent.d.ts:43

___

### \_subscriptions

• **\_subscriptions**: `Object`

**`internal`**

#### Index signature

▪ [id: `string`]: [`Subscription`](Subscription.md)

#### Defined in

sip.js/lib/api/user-agent.d.ts:47

## Accessors

### configuration

• `get` **configuration**(): `Required`<[`UserAgentOptions`](../interfaces/UserAgentOptions.md)\>

User agent configuration.

#### Returns

`Required`<[`UserAgentOptions`](../interfaces/UserAgentOptions.md)\>

#### Defined in

sip.js/lib/api/user-agent.d.ts:88

___

### contact

• `get` **contact**(): [`Contact`](../interfaces/Contact.md)

User agent contact.

#### Returns

[`Contact`](../interfaces/Contact.md)

#### Defined in

sip.js/lib/api/user-agent.d.ts:92

___

### state

• `get` **state**(): [`UserAgentState`](../enums/UserAgentState.md)

User agent state.

#### Returns

[`UserAgentState`](../enums/UserAgentState.md)

#### Defined in

sip.js/lib/api/user-agent.d.ts:96

___

### stateChange

• `get` **stateChange**(): [`Emitter`](../interfaces/Emitter.md)<[`UserAgentState`](../enums/UserAgentState.md)\>

User agent state change emitter.

#### Returns

[`Emitter`](../interfaces/Emitter.md)<[`UserAgentState`](../enums/UserAgentState.md)\>

#### Defined in

sip.js/lib/api/user-agent.d.ts:100

___

### transport

• `get` **transport**(): [`Transport`](../interfaces/Transport.md)

User agent transport.

#### Returns

[`Transport`](../interfaces/Transport.md)

#### Defined in

sip.js/lib/api/user-agent.d.ts:104

___

### userAgentCore

• `get` **userAgentCore**(): [`UserAgentCore`](UserAgentCore.md)

User agent core.

#### Returns

[`UserAgentCore`](UserAgentCore.md)

#### Defined in

sip.js/lib/api/user-agent.d.ts:108
