[SIP.js](../README.md) / [Exports](../modules.md) / SessionDelegate

# Interface: SessionDelegate

Session delegate.

## Table of contents

### Methods

- [onAck](SessionDelegate.md#onack)
- [onAckTimeout](SessionDelegate.md#onacktimeout)
- [onBye](SessionDelegate.md#onbye)
- [onInfo](SessionDelegate.md#oninfo)
- [onInvite](SessionDelegate.md#oninvite)
- [onMessage](SessionDelegate.md#onmessage)
- [onNotify](SessionDelegate.md#onnotify)
- [onPrack](SessionDelegate.md#onprack)
- [onRefer](SessionDelegate.md#onrefer)

## Methods

### onAck

▸ `Optional` **onAck**(`request`): `void` \| `Promise`<`void`\>

Receive ACK request.

**`privateremarks`**
Unlike INVITE handling where we can rely on the generation of a response
to indicate when offer/answer processing has been completed, ACK handling
requires some indication from the handler that answer processing is complete
so that we can avoid some race conditions (see comments in code for more details).
Having the handler return a Promise provides said indication.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingAckRequest`](IncomingAckRequest.md) | Incoming ACK request. |

#### Returns

`void` \| `Promise`<`void`\>

The callback MUST return a promise if it asynchronously handles answers.
For example, an ACK with an answer (offer in the 200 Ok) may require
asynchronous processing in which case the callback MUST return a Promise
which resolves when the answer handling is complete.

#### Defined in

sip.js/lib/core/session/session-delegate.d.ts:22

___

### onAckTimeout

▸ `Optional` **onAckTimeout**(): `void`

Timeout waiting for ACK request.
If no handler is provided the Session will terminated with a BYE.
https://tools.ietf.org/html/rfc3261#section-13.3.1.4

#### Returns

`void`

#### Defined in

sip.js/lib/core/session/session-delegate.d.ts:28

___

### onBye

▸ `Optional` **onBye**(`request`): `void`

Receive BYE request.
https://tools.ietf.org/html/rfc3261#section-15.1.2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingByeRequest`](IncomingByeRequest.md) | Incoming BYE request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/session/session-delegate.d.ts:34

___

### onInfo

▸ `Optional` **onInfo**(`request`): `void`

Receive INFO request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingInfoRequest`](IncomingInfoRequest.md) | Incoming INFO request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/session/session-delegate.d.ts:39

___

### onInvite

▸ `Optional` **onInvite**(`request`): `void`

Receive re-INVITE request.
https://tools.ietf.org/html/rfc3261#section-14.2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingInviteRequest`](IncomingInviteRequest.md) | Incoming INVITE request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/session/session-delegate.d.ts:45

___

### onMessage

▸ `Optional` **onMessage**(`request`): `void`

Receive MESSAGE request.
https://tools.ietf.org/html/rfc3428#section-7

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingMessageRequest`](IncomingMessageRequest.md) | Incoming MESSAGE request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/session/session-delegate.d.ts:51

___

### onNotify

▸ `Optional` **onNotify**(`request`): `void`

Receive NOTIFY request.
https://tools.ietf.org/html/rfc6665#section-4.1.3

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingNotifyRequest`](IncomingNotifyRequest.md) | Incoming NOTIFY request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/session/session-delegate.d.ts:57

___

### onPrack

▸ `Optional` **onPrack**(`request`): `void`

Receive PRACK request.
https://tools.ietf.org/html/rfc3262#section-3

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingPrackRequest`](IncomingPrackRequest.md) | Incoming PRACK request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/session/session-delegate.d.ts:63

___

### onRefer

▸ `Optional` **onRefer**(`request`): `void`

Receive REFER request.
https://tools.ietf.org/html/rfc3515#section-2.4.2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingReferRequest`](IncomingReferRequest.md) | Incoming REFER request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/session/session-delegate.d.ts:69
