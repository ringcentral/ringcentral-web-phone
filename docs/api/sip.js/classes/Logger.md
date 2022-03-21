[SIP.js](../README.md) / [Exports](../modules.md) / Logger

# Class: Logger

Logger.

## Table of contents

### Constructors

- [constructor](Logger.md#constructor)

### Methods

- [error](Logger.md#error)
- [warn](Logger.md#warn)
- [log](Logger.md#log)
- [debug](Logger.md#debug)

### Accessors

- [level](Logger.md#level)

## Constructors

### constructor

• **new Logger**(`logger`, `category`, `label?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`LoggerFactory`](LoggerFactory.md) |
| `category` | `string` |
| `label?` | `string` |

#### Defined in

sip.js/lib/core/log/logger.d.ts:11

## Methods

### error

▸ **error**(`content`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `string` |

#### Returns

`void`

#### Defined in

sip.js/lib/core/log/logger.d.ts:12

___

### warn

▸ **warn**(`content`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `string` |

#### Returns

`void`

#### Defined in

sip.js/lib/core/log/logger.d.ts:13

___

### log

▸ **log**(`content`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `string` |

#### Returns

`void`

#### Defined in

sip.js/lib/core/log/logger.d.ts:14

___

### debug

▸ **debug**(`content`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `content` | `string` |

#### Returns

`void`

#### Defined in

sip.js/lib/core/log/logger.d.ts:15

## Accessors

### level

• `get` **level**(): [`Levels`](../enums/Levels.md)

#### Returns

[`Levels`](../enums/Levels.md)

#### Defined in

sip.js/lib/core/log/logger.d.ts:17

• `set` **level**(`newLevel`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newLevel` | [`Levels`](../enums/Levels.md) |

#### Returns

`void`

#### Defined in

sip.js/lib/core/log/logger.d.ts:18
