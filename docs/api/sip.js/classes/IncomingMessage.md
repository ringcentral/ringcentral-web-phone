[SIP.js](../README.md) / [Exports](../modules.md) / IncomingMessage

# Class: IncomingMessage

Incoming message.

## Hierarchy

- **`IncomingMessage`**

  ↳ [`IncomingRequestMessage`](IncomingRequestMessage.md)

  ↳ [`IncomingResponseMessage`](IncomingResponseMessage.md)

## Table of contents

### Constructors

- [constructor](IncomingMessage.md#constructor)

### Properties

- [viaBranch](IncomingMessage.md#viabranch)
- [method](IncomingMessage.md#method)
- [body](IncomingMessage.md#body)
- [toTag](IncomingMessage.md#totag)
- [to](IncomingMessage.md#to)
- [fromTag](IncomingMessage.md#fromtag)
- [from](IncomingMessage.md#from)
- [callId](IncomingMessage.md#callid)
- [cseq](IncomingMessage.md#cseq)
- [via](IncomingMessage.md#via)
- [headers](IncomingMessage.md#headers)
- [referTo](IncomingMessage.md#referto)
- [data](IncomingMessage.md#data)

### Methods

- [addHeader](IncomingMessage.md#addheader)
- [getHeader](IncomingMessage.md#getheader)
- [getHeaders](IncomingMessage.md#getheaders)
- [hasHeader](IncomingMessage.md#hasheader)
- [parseHeader](IncomingMessage.md#parseheader)
- [s](IncomingMessage.md#s)
- [setHeader](IncomingMessage.md#setheader)
- [toString](IncomingMessage.md#tostring)

## Constructors

### constructor

• **new IncomingMessage**()

## Properties

### viaBranch

• **viaBranch**: `string`

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:7

___

### method

• **method**: `string`

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:8

___

### body

• **body**: `string`

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:9

___

### toTag

• **toTag**: `string`

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:10

___

### to

• **to**: [`NameAddrHeader`](NameAddrHeader.md)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:11

___

### fromTag

• **fromTag**: `string`

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:12

___

### from

• **from**: [`NameAddrHeader`](NameAddrHeader.md)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:13

___

### callId

• **callId**: `string`

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:14

___

### cseq

• **cseq**: `number`

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:15

___

### via

• **via**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `host` | `string` |
| `port` | `number` |

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:16

___

### headers

• **headers**: `Object`

#### Index signature

▪ [name: `string`]: { `parsed?`: `any` ; `raw`: `string`  }[]

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:20

___

### referTo

• **referTo**: `string`

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:26

___

### data

• **data**: `string`

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:27

## Methods

### addHeader

▸ **addHeader**(`name`, `value`): `void`

Insert a header of the given name and value into the last position of the
header array.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | header name |
| `value` | `string` | header value |

#### Returns

`void`

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:34

___

### getHeader

▸ **getHeader**(`name`): `string`

Get the value of the given header name at the given position.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | header name |

#### Returns

`string`

Returns the specified header, undefined if header doesn't exist.

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:40

___

### getHeaders

▸ **getHeaders**(`name`): `string`[]

Get the header/s of the given name.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | header name |

#### Returns

`string`[]

Array - with all the headers of the specified name.

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:46

___

### hasHeader

▸ **hasHeader**(`name`): `boolean`

Verify the existence of the given header.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | header name |

#### Returns

`boolean`

true if header with given name exists, false otherwise

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:52

___

### parseHeader

▸ **parseHeader**(`name`, `idx?`): `any`

Parse the given header on the given index.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | header name |
| `idx?` | `number` | header index |

#### Returns

`any`

Parsed header object, undefined if the
  header is not present or in case of a parsing error.

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:60

___

### s

▸ **s**(`name`, `idx?`): `any`

Message Header attribute selector. Alias of parseHeader.

**`example`**
message.s('via',3).port

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | header name |
| `idx?` | `number` | header index |

#### Returns

`any`

Parsed header object, undefined if the
  header is not present or in case of a parsing error.

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:71

___

### setHeader

▸ **setHeader**(`name`, `value`): `void`

Replace the value of the given header by the value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | header name |
| `value` | `string` | header value |

#### Returns

`void`

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:77

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:78
