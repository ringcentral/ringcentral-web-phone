[SIP.js](../README.md) / [Exports](../modules.md) / Exception

# Class: Exception

An Exception is considered a condition that a reasonable application may wish to catch.
An Error indicates serious problems that a reasonable application should not try to catch.

## Hierarchy

- `Error`

  ↳ **`Exception`**

  ↳↳ [`ContentTypeUnsupportedError`](ContentTypeUnsupportedError.md)

  ↳↳ [`RequestPendingError`](RequestPendingError.md)

  ↳↳ [`SessionDescriptionHandlerError`](SessionDescriptionHandlerError.md)

  ↳↳ [`SessionTerminatedError`](SessionTerminatedError.md)

  ↳↳ [`StateTransitionError`](StateTransitionError.md)

  ↳↳ [`TransactionStateError`](TransactionStateError.md)

  ↳↳ [`TransportError`](TransportError.md)

## Table of contents

### Methods

- [captureStackTrace](Exception.md#capturestacktrace)
- [prepareStackTrace](Exception.md#preparestacktrace)

### Properties

- [stackTraceLimit](Exception.md#stacktracelimit)
- [name](Exception.md#name)
- [message](Exception.md#message)
- [stack](Exception.md#stack)

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `Object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

@types/node/globals.d.ts:133

___

### prepareStackTrace

▸ `Static` `Optional` **prepareStackTrace**(`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** https://github.com/v8/v8/wiki/Stack%20Trace%20API#customizing-stack-traces

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

@types/node/globals.d.ts:140

## Properties

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

@types/node/globals.d.ts:142

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

typescript/lib/lib.es5.d.ts:1022

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

typescript/lib/lib.es5.d.ts:1023

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

typescript/lib/lib.es5.d.ts:1024
