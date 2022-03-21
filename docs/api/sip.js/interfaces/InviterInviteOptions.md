[SIP.js](../README.md) / [Exports](../modules.md) / InviterInviteOptions

# Interface: InviterInviteOptions

Options for [Inviter.invite](../classes/Inviter.md#invite).

## Table of contents

### Properties

- [requestDelegate](InviterInviteOptions.md#requestdelegate)
- [requestOptions](InviterInviteOptions.md#requestoptions)
- [sessionDescriptionHandlerModifiers](InviterInviteOptions.md#sessiondescriptionhandlermodifiers)
- [sessionDescriptionHandlerOptions](InviterInviteOptions.md#sessiondescriptionhandleroptions)
- [withoutSdp](InviterInviteOptions.md#withoutsdp)

## Properties

### requestDelegate

• `Optional` **requestDelegate**: [`OutgoingRequestDelegate`](OutgoingRequestDelegate.md)

See `core` API.

#### Defined in

sip.js/lib/api/inviter-invite-options.d.ts:11

___

### requestOptions

• `Optional` **requestOptions**: [`RequestOptions`](RequestOptions.md)

See `core` API.

#### Defined in

sip.js/lib/api/inviter-invite-options.d.ts:15

___

### sessionDescriptionHandlerModifiers

• `Optional` **sessionDescriptionHandlerModifiers**: [`SessionDescriptionHandlerModifier`](SessionDescriptionHandlerModifier.md)[]

Modifiers to pass to SessionDescriptionHandler during the initial INVITE transaction.

#### Defined in

sip.js/lib/api/inviter-invite-options.d.ts:19

___

### sessionDescriptionHandlerOptions

• `Optional` **sessionDescriptionHandlerOptions**: [`SessionDescriptionHandlerOptions`](SessionDescriptionHandlerOptions.md)

Options to pass to SessionDescriptionHandler during the initial INVITE transaction.

#### Defined in

sip.js/lib/api/inviter-invite-options.d.ts:23

___

### withoutSdp

• `Optional` **withoutSdp**: `boolean`

If true, send INVITE without SDP. Default is false.

#### Defined in

sip.js/lib/api/inviter-invite-options.d.ts:27
