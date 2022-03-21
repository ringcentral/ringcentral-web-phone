[SIP.js](../README.md) / [Exports](../modules.md) / Contact

# Interface: Contact

Contact.

**`remarks`**
https://tools.ietf.org/html/rfc3261#section-8.1.1.8
This is ported from UA.contact.
FIXME: TODO: This is not a great rep for Contact
and is used in a kinda hacky way herein.

## Table of contents

### Properties

- [pubGruu](Contact.md#pubgruu)
- [tempGruu](Contact.md#tempgruu)
- [uri](Contact.md#uri)

### Methods

- [toString](Contact.md#tostring)

## Properties

### pubGruu

• **pubGruu**: [`URI`](../classes/URI.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:14

___

### tempGruu

• **tempGruu**: [`URI`](../classes/URI.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:15

___

### uri

• **uri**: [`URI`](../classes/URI.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:16

## Methods

### toString

▸ **toString**(`options?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | `Object` |
| `options.anonymous?` | `boolean` |
| `options.outbound?` | `boolean` |

#### Returns

`string`

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:17
