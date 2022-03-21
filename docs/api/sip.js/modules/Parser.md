[SIP.js](../README.md) / [Exports](../modules.md) / Parser

# Namespace: Parser

Extract and parse every header of a SIP message.

**`internal`**

## Table of contents

### Functions

- [getHeader](Parser.md#getheader)
- [parseHeader](Parser.md#parseheader)
- [parseMessage](Parser.md#parsemessage)

## Functions

### getHeader

▸ **getHeader**(`data`, `headerStart`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `headerStart` | `number` |

#### Returns

`number`

#### Defined in

sip.js/lib/core/messages/parser.d.ts:9

___

### parseHeader

▸ **parseHeader**(`message`, `data`, `headerStart`, `headerEnd`): `boolean` \| { `error`: `string`  }

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`IncomingRequestMessage`](../classes/IncomingRequestMessage.md) \| [`IncomingResponseMessage`](../classes/IncomingResponseMessage.md) |
| `data` | `any` |
| `headerStart` | `number` |
| `headerEnd` | `number` |

#### Returns

`boolean` \| { `error`: `string`  }

#### Defined in

sip.js/lib/core/messages/parser.d.ts:10

___

### parseMessage

▸ **parseMessage**(`data`, `logger`): [`IncomingRequestMessage`](../classes/IncomingRequestMessage.md) \| [`IncomingResponseMessage`](../classes/IncomingResponseMessage.md) \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `string` |
| `logger` | [`Logger`](../classes/Logger.md) |

#### Returns

[`IncomingRequestMessage`](../classes/IncomingRequestMessage.md) \| [`IncomingResponseMessage`](../classes/IncomingResponseMessage.md) \| `undefined`

#### Defined in

sip.js/lib/core/messages/parser.d.ts:13
