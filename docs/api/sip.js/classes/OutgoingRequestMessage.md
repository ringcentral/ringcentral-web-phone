[SIP.js](../README.md) / [Exports](../modules.md) / OutgoingRequestMessage

# Class: OutgoingRequestMessage

Outgoing SIP request message.

## Table of contents

### Constructors

- [constructor](OutgoingRequestMessage.md#constructor)

### Properties

- [headers](OutgoingRequestMessage.md#headers)
- [method](OutgoingRequestMessage.md#method)
- [ruri](OutgoingRequestMessage.md#ruri)
- [from](OutgoingRequestMessage.md#from)
- [fromTag](OutgoingRequestMessage.md#fromtag)
- [fromURI](OutgoingRequestMessage.md#fromuri)
- [to](OutgoingRequestMessage.md#to)
- [toTag](OutgoingRequestMessage.md#totag)
- [toURI](OutgoingRequestMessage.md#touri)
- [branch](OutgoingRequestMessage.md#branch)
- [callId](OutgoingRequestMessage.md#callid)
- [cseq](OutgoingRequestMessage.md#cseq)
- [extraHeaders](OutgoingRequestMessage.md#extraheaders)
- [body](OutgoingRequestMessage.md#body)

### Methods

- [getHeader](OutgoingRequestMessage.md#getheader)
- [getHeaders](OutgoingRequestMessage.md#getheaders)
- [hasHeader](OutgoingRequestMessage.md#hasheader)
- [setHeader](OutgoingRequestMessage.md#setheader)
- [setViaHeader](OutgoingRequestMessage.md#setviaheader)
- [toString](OutgoingRequestMessage.md#tostring)

## Constructors

### constructor

• **new OutgoingRequestMessage**(`method`, `ruri`, `fromURI`, `toURI`, `options?`, `extraHeaders?`, `body?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `method` | `string` |
| `ruri` | [`URI`](URI.md) |
| `fromURI` | [`URI`](URI.md) |
| `toURI` | [`URI`](URI.md) |
| `options?` | [`OutgoingRequestMessageOptions`](../interfaces/OutgoingRequestMessageOptions.md) |
| `extraHeaders?` | `string`[] |
| `body?` | [`Body`](../interfaces/Body.md) |

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:47

## Properties

### headers

• `Readonly` **headers**: `Object`

#### Index signature

▪ [name: `string`]: `string`[]

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:27

___

### method

• `Readonly` **method**: `string`

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:30

___

### ruri

• `Readonly` **ruri**: [`URI`](URI.md)

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:31

___

### from

• `Readonly` **from**: [`NameAddrHeader`](NameAddrHeader.md)

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:32

___

### fromTag

• `Readonly` **fromTag**: `string`

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:33

___

### fromURI

• `Readonly` **fromURI**: [`URI`](URI.md)

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:34

___

### to

• `Readonly` **to**: [`NameAddrHeader`](NameAddrHeader.md)

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:35

___

### toTag

• `Readonly` **toTag**: `string`

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:36

___

### toURI

• `Readonly` **toURI**: [`URI`](URI.md)

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:37

___

### branch

• **branch**: `string`

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:38

___

### callId

• `Readonly` **callId**: `string`

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:39

___

### cseq

• **cseq**: `number`

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:40

___

### extraHeaders

• **extraHeaders**: `string`[]

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:41

___

### body

• **body**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `body` | `string` |
| `contentType` | `string` |

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:42

## Methods

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

sip.js/lib/core/messages/outgoing-request-message.d.ts:56

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

Array with all the headers of the specified name.

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:62

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

sip.js/lib/core/messages/outgoing-request-message.d.ts:68

___

### setHeader

▸ **setHeader**(`name`, `value`): `void`

Replace the the given header by the given value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | header name |
| `value` | `string` \| `string`[] | header value |

#### Returns

`void`

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:74

___

### setViaHeader

▸ **setViaHeader**(`branch`, `transport`): `void`

The Via header field indicates the transport used for the transaction
and identifies the location where the response is to be sent.  A Via
header field value is added only after the transport that will be
used to reach the next hop has been selected (which may involve the
usage of the procedures in [4]).

When the UAC creates a request, it MUST insert a Via into that
request.  The protocol name and protocol version in the header field
MUST be SIP and 2.0, respectively.  The Via header field value MUST
contain a branch parameter.  This parameter is used to identify the
transaction created by that request.  This parameter is used by both
the client and the server.
https://tools.ietf.org/html/rfc3261#section-8.1.1.7

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `branch` | `string` | - |
| `transport` | `string` | The sent protocol transport. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:92

___

### toString

▸ **toString**(): `string`

#### Returns

`string`

#### Defined in

sip.js/lib/core/messages/outgoing-request-message.d.ts:93
