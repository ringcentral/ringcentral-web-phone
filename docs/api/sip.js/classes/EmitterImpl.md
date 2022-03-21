[SIP.js](../README.md) / [Exports](../modules.md) / EmitterImpl

# Class: EmitterImpl<T\>

An [Emitter](../interfaces/Emitter.md) implementation.

**`internal`**

## Type parameters

| Name |
| :------ |
| `T` |

## Implements

- [`Emitter`](../interfaces/Emitter.md)<`T`\>

## Table of contents

### Constructors

- [constructor](EmitterImpl.md#constructor)

### Methods

- [addListener](EmitterImpl.md#addlistener)
- [emit](EmitterImpl.md#emit)
- [removeAllListeners](EmitterImpl.md#removealllisteners)
- [removeListener](EmitterImpl.md#removelistener)
- [on](EmitterImpl.md#on)
- [off](EmitterImpl.md#off)
- [once](EmitterImpl.md#once)

## Constructors

### constructor

• **new EmitterImpl**<`T`\>()

#### Type parameters

| Name |
| :------ |
| `T` |

## Methods

### addListener

▸ **addListener**(`listener`, `options?`): `void`

Sets up a function that will be called whenever the target changes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `listener` | (`data`: `T`) => `void` | Callback function. |
| `options?` | `Object` | An options object that specifies characteristics about the listener.                  If once true, indicates that the listener should be invoked at most once after being added.                  If once true, the listener would be automatically removed when invoked. |
| `options.once?` | `boolean` | - |

#### Returns

`void`

#### Implementation of

[Emitter](../interfaces/Emitter.md).[addListener](../interfaces/Emitter.md#addlistener)

#### Defined in

sip.js/lib/api/emitter.d.ts:53

___

### emit

▸ **emit**(`data`): `void`

Emit change.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `T` | Data to emit. |

#### Returns

`void`

#### Defined in

sip.js/lib/api/emitter.d.ts:60

___

### removeAllListeners

▸ **removeAllListeners**(): `void`

Removes all listeners previously registered with addListener.

#### Returns

`void`

#### Defined in

sip.js/lib/api/emitter.d.ts:64

___

### removeListener

▸ **removeListener**(`listener`): `void`

Removes a listener previously registered with addListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `listener` | (`data`: `T`) => `void` | Callback function. |

#### Returns

`void`

#### Implementation of

[Emitter](../interfaces/Emitter.md).[removeListener](../interfaces/Emitter.md#removelistener)

#### Defined in

sip.js/lib/api/emitter.d.ts:69

___

### on

▸ **on**(`listener`): `void`

Registers a listener.

**`deprecated`** Use addListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `listener` | (`data`: `T`) => `void` | Callback function. |

#### Returns

`void`

#### Implementation of

[Emitter](../interfaces/Emitter.md).[on](../interfaces/Emitter.md#on)

#### Defined in

sip.js/lib/api/emitter.d.ts:75

___

### off

▸ **off**(`listener`): `void`

Unregisters a listener.

**`deprecated`** Use removeListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `listener` | (`data`: `T`) => `void` | Callback function. |

#### Returns

`void`

#### Implementation of

[Emitter](../interfaces/Emitter.md).[off](../interfaces/Emitter.md#off)

#### Defined in

sip.js/lib/api/emitter.d.ts:81

___

### once

▸ **once**(`listener`): `void`

Registers a listener then unregisters the listener after one event emission.

**`deprecated`** Use addListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `listener` | (`data`: `T`) => `void` | Callback function. |

#### Returns

`void`

#### Implementation of

[Emitter](../interfaces/Emitter.md).[once](../interfaces/Emitter.md#once)

#### Defined in

sip.js/lib/api/emitter.d.ts:87
