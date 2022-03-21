[SIP.js](../README.md) / [Exports](../modules.md) / Registerer

# Class: Registerer

A registerer registers a contact for an address of record (outgoing REGISTER).

## Table of contents

### Constructors

- [constructor](Registerer.md#constructor)

### Accessors

- [contacts](Registerer.md#contacts)
- [retryAfter](Registerer.md#retryafter)
- [state](Registerer.md#state)
- [stateChange](Registerer.md#statechange)

### Methods

- [dispose](Registerer.md#dispose)
- [register](Registerer.md#register)
- [unregister](Registerer.md#unregister)

## Constructors

### constructor

• **new Registerer**(`userAgent`, `options?`)

Constructs a new instance of the `Registerer` class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userAgent` | [`UserAgent`](UserAgent.md) | User agent. See [UserAgent](UserAgent.md) for details. |
| `options?` | [`RegistererOptions`](../interfaces/RegistererOptions.md) | Options bucket. See [RegistererOptions](../interfaces/RegistererOptions.md) for details. |

#### Defined in

sip.js/lib/api/registerer.d.ts:42

## Accessors

### contacts

• `get` **contacts**(): `string`[]

The registered contacts.

#### Returns

`string`[]

#### Defined in

sip.js/lib/api/registerer.d.ts:54

___

### retryAfter

• `get` **retryAfter**(): `number`

The number of seconds to wait before retrying to register.

**`defaultvalue`** `undefined`

**`remarks`**
When the server rejects a registration request, if it provides a suggested
duration to wait before retrying, that value is available here when and if
the state transitions to `Unsubscribed`. It is also available during the
callback to `onReject` after a call to `register`. (Note that if the state
if already `Unsubscribed`, a rejected request created by `register` will
not cause the state to transition to `Unsubscribed`. One way to avoid this
case is to dispose of `Registerer` when unregistered and create a new
`Registerer` for any attempts to retry registering.)

**`example`**
```ts
// Checking for retry after on state change
registerer.stateChange.addListener((newState) => {
  switch (newState) {
    case RegistererState.Unregistered:
      const retryAfter = registerer.retryAfter;
      break;
  }
});

// Checking for retry after on request rejection
registerer.register({
  requestDelegate: {
    onReject: () => {
      const retryAfter = registerer.retryAfter;
    }
  }
});
```

#### Returns

`number`

#### Defined in

sip.js/lib/api/registerer.d.ts:88

___

### state

• `get` **state**(): [`RegistererState`](../enums/RegistererState.md)

The registration state.

#### Returns

[`RegistererState`](../enums/RegistererState.md)

#### Defined in

sip.js/lib/api/registerer.d.ts:90

___

### stateChange

• `get` **stateChange**(): [`Emitter`](../interfaces/Emitter.md)<[`RegistererState`](../enums/RegistererState.md)\>

Emits when the registerer state changes.

#### Returns

[`Emitter`](../interfaces/Emitter.md)<[`RegistererState`](../enums/RegistererState.md)\>

#### Defined in

sip.js/lib/api/registerer.d.ts:92

## Methods

### dispose

▸ **dispose**(): `Promise`<`void`\>

Destructor.

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/registerer.d.ts:94

___

### register

▸ **register**(`options?`): `Promise`<[`OutgoingRegisterRequest`](../interfaces/OutgoingRegisterRequest.md)\>

Sends the REGISTER request.

**`remarks`**
If successful, sends re-REGISTER requests prior to registration expiration until `unsubscribe()` is called.
Rejects with `RequestPendingError` if a REGISTER request is already in progress.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`RegistererRegisterOptions`](../interfaces/RegistererRegisterOptions.md) |

#### Returns

`Promise`<[`OutgoingRegisterRequest`](../interfaces/OutgoingRegisterRequest.md)\>

#### Defined in

sip.js/lib/api/registerer.d.ts:101

___

### unregister

▸ **unregister**(`options?`): `Promise`<[`OutgoingRegisterRequest`](../interfaces/OutgoingRegisterRequest.md)\>

Sends the REGISTER request with expires equal to zero.

**`remarks`**
Rejects with `RequestPendingError` if a REGISTER request is already in progress.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`RegistererUnregisterOptions`](../interfaces/RegistererUnregisterOptions.md) |

#### Returns

`Promise`<[`OutgoingRegisterRequest`](../interfaces/OutgoingRegisterRequest.md)\>

#### Defined in

sip.js/lib/api/registerer.d.ts:107
