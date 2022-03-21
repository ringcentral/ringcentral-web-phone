[SIP.js](../README.md) / [Exports](../modules.md) / ContentTypeUnsupportedError

# Class: ContentTypeUnsupportedError

An exception indicating an unsupported content type prevented execution.

## Hierarchy

- [`Exception`](Exception.md)

  ↳ **`ContentTypeUnsupportedError`**

## Table of contents

### Methods

- [captureStackTrace](ContentTypeUnsupportedError.md#capturestacktrace)
- [prepareStackTrace](ContentTypeUnsupportedError.md#preparestacktrace)

### Properties

- [stackTraceLimit](ContentTypeUnsupportedError.md#stacktracelimit)
- [name](ContentTypeUnsupportedError.md#name)
- [message](ContentTypeUnsupportedError.md#message)
- [stack](ContentTypeUnsupportedError.md#stack)

### Constructors

- [constructor](ContentTypeUnsupportedError.md#constructor)

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

• **new ContentTypeUnsupportedError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Overrides

Exception.constructor

#### Defined in

sip.js/lib/api/exceptions/content-type-unsupported.d.ts:7
