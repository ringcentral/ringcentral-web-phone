[SIP.js](../README.md) / [Exports](../modules.md) / SessionDescriptionHandler

# Interface: SessionDescriptionHandler

Delegate for [Session](../classes/Session.md) offer/answer exchange.

## Implemented by

- [`SessionDescriptionHandler`](../classes/SessionDescriptionHandler.md)

## Table of contents

### Methods

- [close](SessionDescriptionHandler.md#close)
- [getDescription](SessionDescriptionHandler.md#getdescription)
- [hasDescription](SessionDescriptionHandler.md#hasdescription)
- [rollbackDescription](SessionDescriptionHandler.md#rollbackdescription)
- [setDescription](SessionDescriptionHandler.md#setdescription)
- [sendDtmf](SessionDescriptionHandler.md#senddtmf)

## Methods

### close

▸ **close**(): `void`

Destructor.

#### Returns

`void`

#### Defined in

sip.js/lib/api/session-description-handler.d.ts:9

___

### getDescription

▸ **getDescription**(`options?`, `modifiers?`): `Promise`<[`BodyAndContentType`](BodyAndContentType.md)\>

Gets the local description from the underlying media implementation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`SessionDescriptionHandlerOptions`](SessionDescriptionHandlerOptions.md) | Options object to be used by getDescription. |
| `modifiers?` | [`SessionDescriptionHandlerModifier`](SessionDescriptionHandlerModifier.md)[] | Array with one time use description modifiers. |

#### Returns

`Promise`<[`BodyAndContentType`](BodyAndContentType.md)\>

Promise that resolves with the local description to be used for the session.
Rejects with `ClosedSessionDescriptionHandlerError` when this method
is called after close or when close occurs before complete.

#### Defined in

sip.js/lib/api/session-description-handler.d.ts:18

___

### hasDescription

▸ **hasDescription**(`contentType`): `boolean`

Returns true if the Session Description Handler can handle the Content-Type described by a SIP message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contentType` | `string` | The content type that is in the SIP Message. |

#### Returns

`boolean`

True if the content type is  handled by this session description handler. False otherwise.

#### Defined in

sip.js/lib/api/session-description-handler.d.ts:24

___

### rollbackDescription

▸ `Optional` **rollbackDescription**(): `Promise`<`void`\>

Rolls back the current local/remote offer to the prior stable state.

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/session-description-handler.d.ts:28

___

### setDescription

▸ **setDescription**(`sdp`, `options?`, `modifiers?`): `Promise`<`void`\>

Sets the remote description to the underlying media implementation.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sdp` | `string` | - |
| `options?` | [`SessionDescriptionHandlerOptions`](SessionDescriptionHandlerOptions.md) | Options object to be used by setDescription. |
| `modifiers?` | [`SessionDescriptionHandlerModifier`](SessionDescriptionHandlerModifier.md)[] | Array with one time use description modifiers. |

#### Returns

`Promise`<`void`\>

Promise that resolves once the description is set.
Rejects with `ClosedSessionDescriptionHandlerError` when this method
is called after close or when close occurs before complete.

#### Defined in

sip.js/lib/api/session-description-handler.d.ts:38

___

### sendDtmf

▸ **sendDtmf**(`tones`, `options?`): `boolean`

Send DTMF via RTP (RFC 4733).
Returns true if DTMF send is successful, false otherwise.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `tones` | `string` | A string containing DTMF digits. |
| `options?` | `unknown` | Options object to be used by sendDtmf. |

#### Returns

`boolean`

True if DTMF send is successful, false otherwise.

#### Defined in

sip.js/lib/api/session-description-handler.d.ts:46
