[SIP.js](../README.md) / [Exports](../modules.md) / NameAddrHeader

# Class: NameAddrHeader

Name Address SIP header.

## Hierarchy

- [`Parameters`](Parameters.md)

  ↳ **`NameAddrHeader`**

## Table of contents

### Constructors

- [constructor](NameAddrHeader.md#constructor)

### Properties

- [uri](NameAddrHeader.md#uri)
- [parameters](NameAddrHeader.md#parameters)

### Accessors

- [friendlyName](NameAddrHeader.md#friendlyname)
- [displayName](NameAddrHeader.md#displayname)

### Methods

- [clone](NameAddrHeader.md#clone)
- [toString](NameAddrHeader.md#tostring)
- [setParam](NameAddrHeader.md#setparam)
- [getParam](NameAddrHeader.md#getparam)
- [hasParam](NameAddrHeader.md#hasparam)
- [deleteParam](NameAddrHeader.md#deleteparam)
- [clearParams](NameAddrHeader.md#clearparams)

## Constructors

### constructor

• **new NameAddrHeader**(`uri`, `displayName`, `parameters`)

Constructor

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uri` | [`URI`](URI.md) | - |
| `displayName` | `string` | - |
| `parameters` | `Object` | - |

#### Overrides

[Parameters](Parameters.md).[constructor](Parameters.md#constructor)

#### Defined in

sip.js/lib/grammar/name-addr-header.d.ts:16

## Properties

### uri

• **uri**: [`URI`](URI.md)

#### Defined in

sip.js/lib/grammar/name-addr-header.d.ts:8

___

### parameters

• **parameters**: `Object`

#### Index signature

▪ [name: `string`]: `string` \| ``null``

#### Inherited from

[Parameters](Parameters.md).[parameters](Parameters.md#parameters)

#### Defined in

sip.js/lib/grammar/parameters.d.ts:5

## Accessors

### friendlyName

• `get` **friendlyName**(): `string`

#### Returns

`string`

#### Defined in

sip.js/lib/grammar/name-addr-header.d.ts:19

___

### displayName

• `get` **displayName**(): `string`

#### Returns

`string`

#### Defined in

sip.js/lib/grammar/name-addr-header.d.ts:20

• `set` **displayName**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`void`

#### Defined in

sip.js/lib/grammar/name-addr-header.d.ts:21

## Methods

### clone

▸ **clone**(): [`NameAddrHeader`](NameAddrHeader.md)

#### Returns

[`NameAddrHeader`](NameAddrHeader.md)

#### Defined in

sip.js/lib/grammar/name-addr-header.d.ts:22

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

sip.js/lib/grammar/name-addr-header.d.ts:23

___

### setParam

▸ **setParam**(`key`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `string` \| `number` |

#### Returns

`void`

#### Inherited from

[Parameters](Parameters.md).[setParam](Parameters.md#setparam)

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

#### Inherited from

[Parameters](Parameters.md).[getParam](Parameters.md#getparam)

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

#### Inherited from

[Parameters](Parameters.md).[hasParam](Parameters.md#hasparam)

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

#### Inherited from

[Parameters](Parameters.md).[deleteParam](Parameters.md#deleteparam)

#### Defined in

sip.js/lib/grammar/parameters.d.ts:14

___

### clearParams

▸ **clearParams**(): `void`

#### Returns

`void`

#### Inherited from

[Parameters](Parameters.md).[clearParams](Parameters.md#clearparams)

#### Defined in

sip.js/lib/grammar/parameters.d.ts:15
