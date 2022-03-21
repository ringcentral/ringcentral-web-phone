[SIP.js](../README.md) / [Exports](../modules.md) / URI

# Class: URI

URI.

## Hierarchy

- [`Parameters`](Parameters.md)

  ↳ **`URI`**

## Table of contents

### Constructors

- [constructor](URI.md#constructor)

### Properties

- [parameters](URI.md#parameters)
- [headers](URI.md#headers)

### Methods

- [setParam](URI.md#setparam)
- [getParam](URI.md#getparam)
- [hasParam](URI.md#hasparam)
- [deleteParam](URI.md#deleteparam)
- [clearParams](URI.md#clearparams)
- [setHeader](URI.md#setheader)
- [getHeader](URI.md#getheader)
- [hasHeader](URI.md#hasheader)
- [deleteHeader](URI.md#deleteheader)
- [clearHeaders](URI.md#clearheaders)
- [clone](URI.md#clone)
- [toRaw](URI.md#toraw)
- [toString](URI.md#tostring)

### Accessors

- [scheme](URI.md#scheme)
- [user](URI.md#user)
- [host](URI.md#host)
- [aor](URI.md#aor)
- [port](URI.md#port)

## Constructors

### constructor

• **new URI**(`scheme`, `user`, `host`, `port?`, `parameters?`, `headers?`)

Constructor

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scheme` | `string` | - |
| `user` | `string` | - |
| `host` | `string` | - |
| `port?` | `number` | - |
| `parameters?` | `Object` | - |
| `headers?` | `Object` | - |

#### Overrides

[Parameters](Parameters.md).[constructor](Parameters.md#constructor)

#### Defined in

sip.js/lib/grammar/uri.d.ts:21

## Properties

### parameters

• **parameters**: `Object`

#### Index signature

▪ [name: `string`]: `string` \| ``null``

#### Inherited from

[Parameters](Parameters.md).[parameters](Parameters.md#parameters)

#### Defined in

sip.js/lib/grammar/parameters.d.ts:5

___

### headers

• **headers**: `Object`

#### Index signature

▪ [name: `string`]: `string`[]

#### Defined in

sip.js/lib/grammar/uri.d.ts:7

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

___

### setHeader

▸ **setHeader**(`name`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `value` | `string` \| `string`[] |

#### Returns

`void`

#### Defined in

sip.js/lib/grammar/uri.d.ts:35

___

### getHeader

▸ **getHeader**(`name`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`string`[]

#### Defined in

sip.js/lib/grammar/uri.d.ts:36

___

### hasHeader

▸ **hasHeader**(`name`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`boolean`

#### Defined in

sip.js/lib/grammar/uri.d.ts:37

___

### deleteHeader

▸ **deleteHeader**(`header`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `header` | `string` |

#### Returns

`string`[]

#### Defined in

sip.js/lib/grammar/uri.d.ts:38

___

### clearHeaders

▸ **clearHeaders**(): `void`

#### Returns

`void`

#### Defined in

sip.js/lib/grammar/uri.d.ts:39

___

### clone

▸ **clone**(): [`URI`](URI.md)

#### Returns

[`URI`](URI.md)

#### Defined in

sip.js/lib/grammar/uri.d.ts:40

___

### toRaw

▸ **toRaw**(): `string`

#### Returns

`string`

#### Defined in

sip.js/lib/grammar/uri.d.ts:41

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

sip.js/lib/grammar/uri.d.ts:42

## Accessors

### scheme

• `get` **scheme**(): `string`

#### Returns

`string`

#### Defined in

sip.js/lib/grammar/uri.d.ts:26

• `set` **scheme**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`void`

#### Defined in

sip.js/lib/grammar/uri.d.ts:27

___

### user

• `get` **user**(): `string`

#### Returns

`string`

#### Defined in

sip.js/lib/grammar/uri.d.ts:28

• `set` **user**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`void`

#### Defined in

sip.js/lib/grammar/uri.d.ts:29

___

### host

• `get` **host**(): `string`

#### Returns

`string`

#### Defined in

sip.js/lib/grammar/uri.d.ts:30

• `set` **host**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `string` |

#### Returns

`void`

#### Defined in

sip.js/lib/grammar/uri.d.ts:31

___

### aor

• `get` **aor**(): `string`

#### Returns

`string`

#### Defined in

sip.js/lib/grammar/uri.d.ts:32

___

### port

• `get` **port**(): `number`

#### Returns

`number`

#### Defined in

sip.js/lib/grammar/uri.d.ts:33

• `set` **port**(`value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `number` |

#### Returns

`void`

#### Defined in

sip.js/lib/grammar/uri.d.ts:34
