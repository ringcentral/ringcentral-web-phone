[SIP.js](../README.md) / [Exports](../modules.md) / InvitationProgressOptions

# Interface: InvitationProgressOptions

Options for [Invitation.progress](../classes/Invitation.md#progress).

## Table of contents

### Properties

- [body](InvitationProgressOptions.md#body)
- [extraHeaders](InvitationProgressOptions.md#extraheaders)
- [sessionDescriptionHandlerModifiers](InvitationProgressOptions.md#sessiondescriptionhandlermodifiers)
- [sessionDescriptionHandlerOptions](InvitationProgressOptions.md#sessiondescriptionhandleroptions)
- [statusCode](InvitationProgressOptions.md#statuscode)
- [reasonPhrase](InvitationProgressOptions.md#reasonphrase)
- [rel100](InvitationProgressOptions.md#rel100)

## Properties

### body

• `Optional` **body**: `string` \| { `body`: `string` ; `contentType`: `string`  }

Body

#### Defined in

sip.js/lib/api/invitation-progress-options.d.ts:10

___

### extraHeaders

• `Optional` **extraHeaders**: `string`[]

Array of extra headers added to the response.

#### Defined in

sip.js/lib/api/invitation-progress-options.d.ts:17

___

### sessionDescriptionHandlerModifiers

• `Optional` **sessionDescriptionHandlerModifiers**: [`SessionDescriptionHandlerModifier`](SessionDescriptionHandlerModifier.md)[]

Modifiers to pass to SessionDescriptionHandler during the initial INVITE transaction.

#### Defined in

sip.js/lib/api/invitation-progress-options.d.ts:21

___

### sessionDescriptionHandlerOptions

• `Optional` **sessionDescriptionHandlerOptions**: [`SessionDescriptionHandlerOptions`](SessionDescriptionHandlerOptions.md)

Options to pass to SessionDescriptionHandler during the initial INVITE transaction.

#### Defined in

sip.js/lib/api/invitation-progress-options.d.ts:25

___

### statusCode

• `Optional` **statusCode**: `number`

Status code for response.

#### Defined in

sip.js/lib/api/invitation-progress-options.d.ts:29

___

### reasonPhrase

• `Optional` **reasonPhrase**: `string`

Reason phrase for response.

#### Defined in

sip.js/lib/api/invitation-progress-options.d.ts:33

___

### rel100

• `Optional` **rel100**: `boolean`

Send reliable response.

#### Defined in

sip.js/lib/api/invitation-progress-options.d.ts:37
