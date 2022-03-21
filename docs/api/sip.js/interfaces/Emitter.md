[SIP.js](../README.md) / [Exports](../modules.md) / Emitter

# Interface: Emitter<T\>

Generic observable.

## Type parameters

| Name |
| :------ |
| `T` |

## Implemented by

- [`EmitterImpl`](../classes/EmitterImpl.md)

## Table of contents

### Methods

- [addListener](Emitter.md#addlistener)
- [removeListener](Emitter.md#removelistener)
- [on](Emitter.md#on)
- [off](Emitter.md#off)
- [once](Emitter.md#once)

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

#### Defined in

sip.js/lib/api/emitter.d.ts:13

___

### removeListener

▸ **removeListener**(`listener`): `void`

Removes from the listener previously registered with addListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `listener` | (`data`: `T`) => `void` | Callback function. |

#### Returns

`void`

#### Defined in

sip.js/lib/api/emitter.d.ts:20

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

#### Defined in

sip.js/lib/api/emitter.d.ts:26

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

#### Defined in

sip.js/lib/api/emitter.d.ts:32

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

#### Defined in

sip.js/lib/api/emitter.d.ts:38
