[SIP.js](../README.md) / [Exports](../modules.md) / InviterOptions

# Interface: InviterOptions

Options for [Inviter](../classes/Inviter.md) constructor.

## Hierarchy

- [`SessionOptions`](SessionOptions.md)

  ↳ **`InviterOptions`**

## Table of contents

### Properties

- [anonymous](InviterOptions.md#anonymous)
- [earlyMedia](InviterOptions.md#earlymedia)
- [extraHeaders](InviterOptions.md#extraheaders)
- [inviteWithoutSdp](InviterOptions.md#invitewithoutsdp)
- [params](InviterOptions.md#params)
- [renderbody](InviterOptions.md#renderbody)
- [rendertype](InviterOptions.md#rendertype)
- [sessionDescriptionHandlerModifiers](InviterOptions.md#sessiondescriptionhandlermodifiers)
- [sessionDescriptionHandlerOptions](InviterOptions.md#sessiondescriptionhandleroptions)
- [sessionDescriptionHandlerModifiersReInvite](InviterOptions.md#sessiondescriptionhandlermodifiersreinvite)
- [sessionDescriptionHandlerOptionsReInvite](InviterOptions.md#sessiondescriptionhandleroptionsreinvite)
- [delegate](InviterOptions.md#delegate)

## Properties

### anonymous

• `Optional` **anonymous**: `boolean`

If true, an anonymous call.

#### Defined in

sip.js/lib/api/inviter-options.d.ts:11

___

### earlyMedia

• `Optional` **earlyMedia**: `boolean`

If true, the first answer to the local offer is immediately utilized for media.
Requires that the INVITE request MUST NOT fork.
Has no effect if `inviteWithoutSdp` is true.
Default is false.

#### Defined in

sip.js/lib/api/inviter-options.d.ts:18

___

### extraHeaders

• `Optional` **extraHeaders**: `string`[]

Array of extra headers added to the INVITE.

#### Defined in

sip.js/lib/api/inviter-options.d.ts:20

___

### inviteWithoutSdp

• `Optional` **inviteWithoutSdp**: `boolean`

If true, send INVITE without SDP. Default is false.

#### Defined in

sip.js/lib/api/inviter-options.d.ts:22

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

sip.js/lib/api/inviter-options.d.ts:24

___

### renderbody

• `Optional` **renderbody**: `string`

**`deprecated`** TODO: provide alternative.

#### Defined in

sip.js/lib/api/inviter-options.d.ts:32

___

### rendertype

• `Optional` **rendertype**: `string`

**`deprecated`** TODO: provide alternative.

#### Defined in

sip.js/lib/api/inviter-options.d.ts:34

___

### sessionDescriptionHandlerModifiers

• `Optional` **sessionDescriptionHandlerModifiers**: [`SessionDescriptionHandlerModifier`](SessionDescriptionHandlerModifier.md)[]

Modifiers to pass to SessionDescriptionHandler during the initial INVITE transaction.

#### Defined in

sip.js/lib/api/inviter-options.d.ts:36

___

### sessionDescriptionHandlerOptions

• `Optional` **sessionDescriptionHandlerOptions**: [`SessionDescriptionHandlerOptions`](SessionDescriptionHandlerOptions.md)

Options to pass to SessionDescriptionHandler during the initial INVITE transaction.

#### Defined in

sip.js/lib/api/inviter-options.d.ts:38

___

### sessionDescriptionHandlerModifiersReInvite

• `Optional` **sessionDescriptionHandlerModifiersReInvite**: [`SessionDescriptionHandlerModifier`](SessionDescriptionHandlerModifier.md)[]

Modifiers to pass to SessionDescriptionHandler during re-INVITE transactions.

#### Defined in

sip.js/lib/api/inviter-options.d.ts:40

___

### sessionDescriptionHandlerOptionsReInvite

• `Optional` **sessionDescriptionHandlerOptionsReInvite**: [`SessionDescriptionHandlerOptions`](SessionDescriptionHandlerOptions.md)

Options to pass to SessionDescriptionHandler during re-INVITE transactions.

#### Defined in

sip.js/lib/api/inviter-options.d.ts:42

___

### delegate

• `Optional` **delegate**: [`SessionDelegate`](SessionDelegate.md)

#### Inherited from

[SessionOptions](SessionOptions.md).[delegate](SessionOptions.md#delegate)

#### Defined in

sip.js/lib/api/session-options.d.ts:7
