[SIP.js](../README.md) / [Exports](../modules.md) / MessagerOptions

# Interface: MessagerOptions

Options for [Messager](../classes/Messager.md) constructor.

## Table of contents

### Properties

- [extraHeaders](MessagerOptions.md#extraheaders)
- [params](MessagerOptions.md#params)

## Properties

### extraHeaders

• `Optional` **extraHeaders**: `string`[]

Array of extra headers added to the MESSAGE.

#### Defined in

sip.js/lib/api/messager-options.d.ts:8

___

### params

• `Optional` **params**: `Object`

**`deprecated`** TODO: provide alternative.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromDisplayName?` | `string` |
| `fromTag?` | `string` |
| `fromUri?` | `string` \| [`URI`](../classes/URI.md) |
| `toDisplayName?` | `string` |
| `toUri?` | `string` \| [`URI`](../classes/URI.md) |

#### Defined in

sip.js/lib/api/messager-options.d.ts:10
