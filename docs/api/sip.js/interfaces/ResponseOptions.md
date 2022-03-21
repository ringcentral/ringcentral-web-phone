[SIP.js](../README.md) / [Exports](../modules.md) / ResponseOptions

# Interface: ResponseOptions

Response options bucket.

## Table of contents

### Properties

- [statusCode](ResponseOptions.md#statuscode)
- [reasonPhrase](ResponseOptions.md#reasonphrase)
- [toTag](ResponseOptions.md#totag)
- [userAgent](ResponseOptions.md#useragent)
- [supported](ResponseOptions.md#supported)
- [extraHeaders](ResponseOptions.md#extraheaders)
- [body](ResponseOptions.md#body)

## Properties

### statusCode

• **statusCode**: `number`

Status code of the response.

#### Defined in

sip.js/lib/core/messages/outgoing-response.d.ts:20

___

### reasonPhrase

• `Optional` **reasonPhrase**: `string`

Reason phrase of the response.

#### Defined in

sip.js/lib/core/messages/outgoing-response.d.ts:22

___

### toTag

• `Optional` **toTag**: `string`

To tag of the response. If not provided, one is generated.

#### Defined in

sip.js/lib/core/messages/outgoing-response.d.ts:24

___

### userAgent

• `Optional` **userAgent**: `string`

User agent string for User-Agent header.

#### Defined in

sip.js/lib/core/messages/outgoing-response.d.ts:26

___

### supported

• `Optional` **supported**: `string`[]

Support options tags for Supported header.

#### Defined in

sip.js/lib/core/messages/outgoing-response.d.ts:28

___

### extraHeaders

• `Optional` **extraHeaders**: `string`[]

Extra headers to include in the message.

#### Defined in

sip.js/lib/core/messages/outgoing-response.d.ts:30

___

### body

• `Optional` **body**: [`Body`](Body.md)

Body to include in the message.

#### Defined in

sip.js/lib/core/messages/outgoing-response.d.ts:32
