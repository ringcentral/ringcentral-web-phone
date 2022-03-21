[SIP.js](../README.md) / [Exports](../modules.md) / LoggerFactory

# Class: LoggerFactory

Logger.

## Table of contents

### Constructors

- [constructor](LoggerFactory.md#constructor)

### Properties

- [builtinEnabled](LoggerFactory.md#builtinenabled)

### Accessors

- [level](LoggerFactory.md#level)
- [connector](LoggerFactory.md#connector)

### Methods

- [getLogger](LoggerFactory.md#getlogger)
- [genericLog](LoggerFactory.md#genericlog)

## Constructors

### constructor

• **new LoggerFactory**()

#### Defined in

sip.js/lib/core/log/logger-factory.d.ts:13

## Properties

### builtinEnabled

• **builtinEnabled**: `boolean`

#### Defined in

sip.js/lib/core/log/logger-factory.d.ts:8

## Accessors

### level

• `get` **level**(): [`Levels`](../enums/Levels.md)

#### Returns

[`Levels`](../enums/Levels.md)

#### Defined in

sip.js/lib/core/log/logger-factory.d.ts:14

• `set` **level**(`newLevel`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newLevel` | [`Levels`](../enums/Levels.md) |

#### Returns

`void`

#### Defined in

sip.js/lib/core/log/logger-factory.d.ts:15

___

### connector

• `get` **connector**(): (`level`: `string`, `category`: `string`, `label`: `string`, `content`: `any`) => `void`

#### Returns

`fn`

▸ (`level`, `category`, `label`, `content`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `level` | `string` |
| `category` | `string` |
| `label` | `string` |
| `content` | `any` |

##### Returns

`void`

#### Defined in

sip.js/lib/core/log/logger-factory.d.ts:16

• `set` **connector**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | (`level`: `string`, `category`: `string`, `label`: `string`, `content`: `any`) => `void` |

#### Returns

`void`

#### Defined in

sip.js/lib/core/log/logger-factory.d.ts:17

## Methods

### getLogger

▸ **getLogger**(`category`, `label?`): [`Logger`](Logger.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `category` | `string` |
| `label?` | `string` |

#### Returns

[`Logger`](Logger.md)

#### Defined in

sip.js/lib/core/log/logger-factory.d.ts:18

___

### genericLog

▸ **genericLog**(`levelToLog`, `category`, `label`, `content`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `levelToLog` | [`Levels`](../enums/Levels.md) |
| `category` | `string` |
| `label` | `string` |
| `content` | `any` |

#### Returns

`void`

#### Defined in

sip.js/lib/core/log/logger-factory.d.ts:19
