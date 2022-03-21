[SIP.js](../README.md) / [Exports](../modules.md) / RequestPendingError

# Class: RequestPendingError

An exception indicating an outstanding prior request prevented execution.

## Hierarchy

- [`Exception`](Exception.md)

  ↳ **`RequestPendingError`**

## Table of contents

### Methods

- [captureStackTrace](RequestPendingError.md#capturestacktrace)
- [prepareStackTrace](RequestPendingError.md#preparestacktrace)

### Properties

- [stackTraceLimit](RequestPendingError.md#stacktracelimit)
- [name](RequestPendingError.md#name)
- [message](RequestPendingError.md#message)
- [stack](RequestPendingError.md#stack)

### Constructors

- [constructor](RequestPendingError.md#constructor)

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

[Exception](Exception.md).[captureStackTrace](Exception.md#capturestacktrace)

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

[Exception](Exception.md).[prepareStackTrace](Exception.md#preparestacktrace)

#### Defined in

@types/node/globals.d.ts:140

## Properties

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[Exception](Exception.md).[stackTraceLimit](Exception.md#stacktracelimit)

#### Defined in

@types/node/globals.d.ts:142

___

### name

• **name**: `string`

#### Inherited from

[Exception](Exception.md).[name](Exception.md#name)

#### Defined in

typescript/lib/lib.es5.d.ts:1022

___

### message

• **message**: `string`

#### Inherited from

[Exception](Exception.md).[message](Exception.md#message)

#### Defined in

typescript/lib/lib.es5.d.ts:1023

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[Exception](Exception.md).[stack](Exception.md#stack)

#### Defined in

typescript/lib/lib.es5.d.ts:1024

## Constructors

### constructor

• **new RequestPendingError**(`message?`)

**`internal`**

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Overrides

Exception.constructor

#### Defined in

sip.js/lib/api/exceptions/request-pending.d.ts:8
