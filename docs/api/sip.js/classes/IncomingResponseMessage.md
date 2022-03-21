[SIP.js](../README.md) / [Exports](../modules.md) / IncomingResponseMessage

# Class: IncomingResponseMessage

Incoming response message.

## Hierarchy

- [`IncomingMessage`](IncomingMessage.md)

  ↳ **`IncomingResponseMessage`**

## Table of contents

### Constructors

- [constructor](IncomingResponseMessage.md#constructor)

### Properties

- [viaBranch](IncomingResponseMessage.md#viabranch)
- [method](IncomingResponseMessage.md#method)
- [body](IncomingResponseMessage.md#body)
- [toTag](IncomingResponseMessage.md#totag)
- [to](IncomingResponseMessage.md#to)
- [fromTag](IncomingResponseMessage.md#fromtag)
- [from](IncomingResponseMessage.md#from)
- [callId](IncomingResponseMessage.md#callid)
- [cseq](IncomingResponseMessage.md#cseq)
- [via](IncomingResponseMessage.md#via)
- [headers](IncomingResponseMessage.md#headers)
- [referTo](IncomingResponseMessage.md#referto)
- [data](IncomingResponseMessage.md#data)
- [statusCode](IncomingResponseMessage.md#statuscode)
- [reasonPhrase](IncomingResponseMessage.md#reasonphrase)

### Methods

- [addHeader](IncomingResponseMessage.md#addheader)
- [getHeader](IncomingResponseMessage.md#getheader)
- [getHeaders](IncomingResponseMessage.md#getheaders)
- [hasHeader](IncomingResponseMessage.md#hasheader)
- [parseHeader](IncomingResponseMessage.md#parseheader)
- [s](IncomingResponseMessage.md#s)
- [setHeader](IncomingResponseMessage.md#setheader)
- [toString](IncomingResponseMessage.md#tostring)

## Constructors

### constructor

• **new IncomingResponseMessage**()

#### Overrides

[IncomingMessage](IncomingMessage.md).[constructor](IncomingMessage.md#constructor)

#### Defined in

sip.js/lib/core/messages/incoming-response-message.d.ts:9

## Properties

### viaBranch

• **viaBranch**: `string`

#### Inherited from

[IncomingMessage](IncomingMessage.md).[viaBranch](IncomingMessage.md#viabranch)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:7

___

### method

• **method**: `string`

#### Inherited from

[IncomingMessage](IncomingMessage.md).[method](IncomingMessage.md#method)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:8

___

### body

• **body**: `string`

#### Inherited from

[IncomingMessage](IncomingMessage.md).[body](IncomingMessage.md#body)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:9

___

### toTag

• **toTag**: `string`

#### Inherited from

[IncomingMessage](IncomingMessage.md).[toTag](IncomingMessage.md#totag)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:10

___

### to

• **to**: [`NameAddrHeader`](NameAddrHeader.md)

#### Inherited from

[IncomingMessage](IncomingMessage.md).[to](IncomingMessage.md#to)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:11

___

### fromTag

• **fromTag**: `string`

#### Inherited from

[IncomingMessage](IncomingMessage.md).[fromTag](IncomingMessage.md#fromtag)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:12

___

### from

• **from**: [`NameAddrHeader`](NameAddrHeader.md)

#### Inherited from

[IncomingMessage](IncomingMessage.md).[from](IncomingMessage.md#from)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:13

___

### callId

• **callId**: `string`

#### Inherited from

[IncomingMessage](IncomingMessage.md).[callId](IncomingMessage.md#callid)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:14

___

### cseq

• **cseq**: `number`

#### Inherited from

[IncomingMessage](IncomingMessage.md).[cseq](IncomingMessage.md#cseq)

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

#### Inherited from

[IncomingMessage](IncomingMessage.md).[via](IncomingMessage.md#via)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:16

___

### headers

• **headers**: `Object`

#### Index signature

▪ [name: `string`]: { `parsed?`: `any` ; `raw`: `string`  }[]

#### Inherited from

[IncomingMessage](IncomingMessage.md).[headers](IncomingMessage.md#headers)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:20

___

### referTo

• **referTo**: `string`

#### Inherited from

[IncomingMessage](IncomingMessage.md).[referTo](IncomingMessage.md#referto)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:26

___

### data

• **data**: `string`

#### Inherited from

[IncomingMessage](IncomingMessage.md).[data](IncomingMessage.md#data)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:27

___

### statusCode

• **statusCode**: `number`

#### Defined in

sip.js/lib/core/messages/incoming-response-message.d.ts:7

___

### reasonPhrase

• **reasonPhrase**: `string`

#### Defined in

sip.js/lib/core/messages/incoming-response-message.d.ts:8

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

#### Inherited from

[IncomingMessage](IncomingMessage.md).[addHeader](IncomingMessage.md#addheader)

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

#### Inherited from

[IncomingMessage](IncomingMessage.md).[getHeader](IncomingMessage.md#getheader)

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

#### Inherited from

[IncomingMessage](IncomingMessage.md).[getHeaders](IncomingMessage.md#getheaders)

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

#### Inherited from

[IncomingMessage](IncomingMessage.md).[hasHeader](IncomingMessage.md#hasheader)

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

#### Inherited from

[IncomingMessage](IncomingMessage.md).[parseHeader](IncomingMessage.md#parseheader)

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

#### Inherited from

[IncomingMessage](IncomingMessage.md).[s](IncomingMessage.md#s)

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

#### Inherited from

[IncomingMessage](IncomingMessage.md).[setHeader](IncomingMessage.md#setheader)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:77

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Inherited from

[IncomingMessage](IncomingMessage.md).[toString](IncomingMessage.md#tostring)

#### Defined in

sip.js/lib/core/messages/incoming-message.d.ts:78
