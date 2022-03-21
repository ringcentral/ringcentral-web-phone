[SIP.js](../README.md) / [Exports](../modules.md) / InvitationRejectOptions

# Interface: InvitationRejectOptions

Options for [Invitation.reject](../classes/Invitation.md#reject).

## Table of contents

### Properties

- [body](InvitationRejectOptions.md#body)
- [extraHeaders](InvitationRejectOptions.md#extraheaders)
- [statusCode](InvitationRejectOptions.md#statuscode)
- [reasonPhrase](InvitationRejectOptions.md#reasonphrase)

## Properties

### body

• `Optional` **body**: `string` \| { `body`: `string` ; `contentType`: `string`  }

Body

#### Defined in

sip.js/lib/api/invitation-reject-options.d.ts:9

___

### extraHeaders

• `Optional` **extraHeaders**: `string`[]

Array of extra headers added to the response.

#### Defined in

sip.js/lib/api/invitation-reject-options.d.ts:16

___

### statusCode

• `Optional` **statusCode**: `number`

Status code for response.

#### Defined in

sip.js/lib/api/invitation-reject-options.d.ts:20

___

### reasonPhrase

• `Optional` **reasonPhrase**: `string`

Reason phrase for response.

#### Defined in

sip.js/lib/api/invitation-reject-options.d.ts:24
