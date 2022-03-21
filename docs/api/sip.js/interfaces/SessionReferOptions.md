[SIP.js](../README.md) / [Exports](../modules.md) / SessionReferOptions

# Interface: SessionReferOptions

Options for [Session.refer](../classes/Session.md#refer).

## Table of contents

### Methods

- [onNotify](SessionReferOptions.md#onnotify)

### Properties

- [requestDelegate](SessionReferOptions.md#requestdelegate)
- [requestOptions](SessionReferOptions.md#requestoptions)

## Methods

### onNotify

▸ `Optional` **onNotify**(`notification`): `void`

Called upon receiving an incoming NOTIFY associated with a REFER.

#### Parameters

| Name | Type |
| :------ | :------ |
| `notification` | [`Notification`](../classes/Notification.md) |

#### Returns

`void`

#### Defined in

sip.js/lib/api/session-refer-options.d.ts:9

## Properties

### requestDelegate

• `Optional` **requestDelegate**: [`OutgoingRequestDelegate`](OutgoingRequestDelegate.md)

See `core` API.

#### Defined in

sip.js/lib/api/session-refer-options.d.ts:11

___

### requestOptions

• `Optional` **requestOptions**: [`RequestOptions`](RequestOptions.md)

See `core` API.

#### Defined in

sip.js/lib/api/session-refer-options.d.ts:13
