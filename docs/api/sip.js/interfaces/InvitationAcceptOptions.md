[SIP.js](../README.md) / [Exports](../modules.md) / InvitationAcceptOptions

# Interface: InvitationAcceptOptions

Options for [Invitation.accept](../classes/Invitation.md#accept).

## Table of contents

### Properties

- [extraHeaders](InvitationAcceptOptions.md#extraheaders)
- [sessionDescriptionHandlerModifiers](InvitationAcceptOptions.md#sessiondescriptionhandlermodifiers)
- [sessionDescriptionHandlerOptions](InvitationAcceptOptions.md#sessiondescriptionhandleroptions)

## Properties

### extraHeaders

• `Optional` **extraHeaders**: `string`[]

Array of extra headers added to the response.

#### Defined in

sip.js/lib/api/invitation-accept-options.d.ts:10

___

### sessionDescriptionHandlerModifiers

• `Optional` **sessionDescriptionHandlerModifiers**: [`SessionDescriptionHandlerModifier`](SessionDescriptionHandlerModifier.md)[]

Modifiers to pass to SessionDescriptionHandler during the initial INVITE transaction.

#### Defined in

sip.js/lib/api/invitation-accept-options.d.ts:14

___

### sessionDescriptionHandlerOptions

• `Optional` **sessionDescriptionHandlerOptions**: [`SessionDescriptionHandlerOptions`](SessionDescriptionHandlerOptions.md)

Options to pass to SessionDescriptionHandler during the initial INVITE transaction.

#### Defined in

sip.js/lib/api/invitation-accept-options.d.ts:18
