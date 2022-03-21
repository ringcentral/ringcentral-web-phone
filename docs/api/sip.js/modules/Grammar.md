[SIP.js](../README.md) / [Exports](../modules.md) / Grammar

# Namespace: Grammar

Grammar.

**`internal`**

## Table of contents

### Functions

- [parse](Grammar.md#parse)
- [nameAddrHeaderParse](Grammar.md#nameaddrheaderparse)
- [URIParse](Grammar.md#uriparse)

## Functions

### parse

▸ **parse**(`input`, `startRule`): `any`

Parse.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `string` | - |
| `startRule` | `string` | - |

#### Returns

`any`

#### Defined in

sip.js/lib/grammar/grammar.d.ts:13

___

### nameAddrHeaderParse

▸ **nameAddrHeaderParse**(`nameAddrHeader`): [`NameAddrHeader`](../classes/NameAddrHeader.md) \| `undefined`

Parse the given string and returns a SIP.NameAddrHeader instance or undefined if
it is an invalid NameAddrHeader.

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameAddrHeader` | `string` |

#### Returns

[`NameAddrHeader`](../classes/NameAddrHeader.md) \| `undefined`

#### Defined in

sip.js/lib/grammar/grammar.d.ts:19

___

### URIParse

▸ **URIParse**(`uri`): [`URI`](../classes/URI.md) \| `undefined`

Parse the given string and returns a SIP.URI instance or undefined if
it is an invalid URI.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `uri` | `string` | - |

#### Returns

[`URI`](../classes/URI.md) \| `undefined`

#### Defined in

sip.js/lib/grammar/grammar.d.ts:25
