[SIP.js](../README.md) / [Exports](../modules.md) / Parameters

# Class: Parameters

**`internal`**

## Hierarchy

- **`Parameters`**

  ↳ [`NameAddrHeader`](NameAddrHeader.md)

  ↳ [`URI`](URI.md)

## Table of contents

### Constructors

- [constructor](Parameters.md#constructor)

### Properties

- [parameters](Parameters.md#parameters)

### Methods

- [setParam](Parameters.md#setparam)
- [getParam](Parameters.md#getparam)
- [hasParam](Parameters.md#hasparam)
- [deleteParam](Parameters.md#deleteparam)
- [clearParams](Parameters.md#clearparams)

## Constructors

### constructor

• **new Parameters**(`parameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `parameters` | `Object` |

#### Defined in

sip.js/lib/grammar/parameters.d.ts:8

## Properties

### parameters

• **parameters**: `Object`

#### Index signature

▪ [name: `string`]: `string` \| ``null``

#### Defined in

sip.js/lib/grammar/parameters.d.ts:5

## Methods

### setParam

▸ **setParam**(`key`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `string` \| `number` |

#### Returns

`void`

#### Defined in

sip.js/lib/grammar/parameters.d.ts:11

___

### getParam

▸ **getParam**(`key`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`string`

#### Defined in

sip.js/lib/grammar/parameters.d.ts:12

___

### hasParam

▸ **hasParam**(`key`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`boolean`

#### Defined in

sip.js/lib/grammar/parameters.d.ts:13

___

### deleteParam

▸ **deleteParam**(`key`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |

#### Returns

`string`

#### Defined in

sip.js/lib/grammar/parameters.d.ts:14

___

### clearParams

▸ **clearParams**(): `void`

#### Returns

`void`

#### Defined in

sip.js/lib/grammar/parameters.d.ts:15
