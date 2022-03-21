[SIP.js](../README.md) / [Exports](../modules.md) / SessionInviteOptions

# Interface: SessionInviteOptions

Options for [Session.invite](../classes/Session.md#invite).

## Table of contents

### Properties

- [requestDelegate](SessionInviteOptions.md#requestdelegate)
- [requestOptions](SessionInviteOptions.md#requestoptions)
- [sessionDescriptionHandlerModifiers](SessionInviteOptions.md#sessiondescriptionhandlermodifiers)
- [sessionDescriptionHandlerOptions](SessionInviteOptions.md#sessiondescriptionhandleroptions)
- [withoutSdp](SessionInviteOptions.md#withoutsdp)

## Properties

### requestDelegate

• `Optional` **requestDelegate**: [`OutgoingRequestDelegate`](OutgoingRequestDelegate.md)

See `core` API.

#### Defined in

sip.js/lib/api/session-invite-options.d.ts:11

___

### requestOptions

• `Optional` **requestOptions**: [`RequestOptions`](RequestOptions.md)

See `core` API.

#### Defined in

sip.js/lib/api/session-invite-options.d.ts:15

___

### sessionDescriptionHandlerModifiers

• `Optional` **sessionDescriptionHandlerModifiers**: [`SessionDescriptionHandlerModifier`](SessionDescriptionHandlerModifier.md)[]

Modifiers to pass to SessionDescriptionHandler during re-INVITE transaction.

#### Defined in

sip.js/lib/api/session-invite-options.d.ts:19

___

### sessionDescriptionHandlerOptions

• `Optional` **sessionDescriptionHandlerOptions**: [`SessionDescriptionHandlerOptions`](SessionDescriptionHandlerOptions.md)

Options to pass to SessionDescriptionHandler during re-INVITE transaction.

#### Defined in

sip.js/lib/api/session-invite-options.d.ts:23

___

### withoutSdp

• `Optional` **withoutSdp**: `boolean`

If true, send INVITE without SDP. Default is false.

#### Defined in

sip.js/lib/api/session-invite-options.d.ts:27
