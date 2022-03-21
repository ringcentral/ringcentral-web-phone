[SIP.js](../README.md) / [Exports](../modules.md) / PublisherOptions

# Interface: PublisherOptions

Options for [Publisher](../classes/Publisher.md) constructor.

## Table of contents

### Properties

- [body](PublisherOptions.md#body)
- [contentType](PublisherOptions.md#contenttype)
- [expires](PublisherOptions.md#expires)
- [extraHeaders](PublisherOptions.md#extraheaders)
- [params](PublisherOptions.md#params)
- [unpublishOnClose](PublisherOptions.md#unpublishonclose)

## Properties

### body

• `Optional` **body**: `string`

**`deprecated`** TODO: provide alternative.

#### Defined in

sip.js/lib/api/publisher-options.d.ts:8

___

### contentType

• `Optional` **contentType**: `string`

**`deprecated`** TODO: provide alternative.

#### Defined in

sip.js/lib/api/publisher-options.d.ts:10

___

### expires

• `Optional` **expires**: `number`

Expire value for the published event.

**`defaultvalue`** 3600

#### Defined in

sip.js/lib/api/publisher-options.d.ts:15

___

### extraHeaders

• `Optional` **extraHeaders**: `string`[]

Array of extra headers added to the PUBLISH request message.

#### Defined in

sip.js/lib/api/publisher-options.d.ts:19

___

### params

• `Optional` **params**: `Object`

**`deprecated`** TODO: provide alternative.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromDisplayName?` | `string` |
| `fromTag?` | `string` |
| `fromUri?` | [`URI`](../classes/URI.md) |
| `toDisplayName?` | `string` |
| `toUri?` | [`URI`](../classes/URI.md) |

#### Defined in

sip.js/lib/api/publisher-options.d.ts:21

___

### unpublishOnClose

• `Optional` **unpublishOnClose**: `boolean`

If set true, UA will gracefully unpublish for the event on UA close.

**`defaultvalue`** true

#### Defined in

sip.js/lib/api/publisher-options.d.ts:32
