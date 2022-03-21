[SIP.js](../README.md) / [Exports](../modules.md) / Session

# Interface: Session

Session.

**`remarks`**
https://tools.ietf.org/html/rfc3261#section-13

## Implemented by

- [`SessionDialog`](../classes/SessionDialog.md)

## Table of contents

### Properties

- [delegate](Session.md#delegate)
- [id](Session.md#id)
- [callId](Session.md#callid)
- [localTag](Session.md#localtag)
- [localURI](Session.md#localuri)
- [remoteTag](Session.md#remotetag)
- [remoteTarget](Session.md#remotetarget)
- [remoteURI](Session.md#remoteuri)
- [sessionState](Session.md#sessionstate)
- [signalingState](Session.md#signalingstate)
- [answer](Session.md#answer)
- [offer](Session.md#offer)

### Methods

- [dispose](Session.md#dispose)
- [bye](Session.md#bye)
- [info](Session.md#info)
- [invite](Session.md#invite)
- [message](Session.md#message)
- [notify](Session.md#notify)
- [prack](Session.md#prack)
- [refer](Session.md#refer)

## Properties

### delegate

• **delegate**: [`SessionDelegate`](SessionDelegate.md)

Session delegate.

#### Defined in

sip.js/lib/core/session/session.d.ts:11

___

### id

• `Readonly` **id**: `string`

The session id. Equal to callId + localTag + remoteTag.

#### Defined in

sip.js/lib/core/session/session.d.ts:13

___

### callId

• `Readonly` **callId**: `string`

Call Id.

#### Defined in

sip.js/lib/core/session/session.d.ts:15

___

### localTag

• `Readonly` **localTag**: `string`

Local Tag.

#### Defined in

sip.js/lib/core/session/session.d.ts:17

___

### localURI

• `Readonly` **localURI**: [`URI`](../classes/URI.md)

Local URI.

#### Defined in

sip.js/lib/core/session/session.d.ts:19

___

### remoteTag

• `Readonly` **remoteTag**: `string`

Remote Tag.

#### Defined in

sip.js/lib/core/session/session.d.ts:21

___

### remoteTarget

• `Readonly` **remoteTarget**: [`URI`](../classes/URI.md)

Remote Target.

#### Defined in

sip.js/lib/core/session/session.d.ts:23

___

### remoteURI

• `Readonly` **remoteURI**: [`URI`](../classes/URI.md)

Remote URI.

#### Defined in

sip.js/lib/core/session/session.d.ts:25

___

### sessionState

• `Readonly` **sessionState**: [`SessionState`](../enums/SessionState.md)

Session state.

#### Defined in

sip.js/lib/core/session/session.d.ts:27

___

### signalingState

• `Readonly` **signalingState**: [`SignalingState`](../enums/SignalingState.md)

Current state of the offer/answer exchange.

#### Defined in

sip.js/lib/core/session/session.d.ts:29

___

### answer

• `Readonly` **answer**: [`Body`](Body.md)

The current answer if signalingState is stable. Otherwise undefined.

#### Defined in

sip.js/lib/core/session/session.d.ts:31

___

### offer

• `Readonly` **offer**: [`Body`](Body.md)

The current offer if signalingState is not initial or closed. Otherwise undefined.

#### Defined in

sip.js/lib/core/session/session.d.ts:33

## Methods

### dispose

▸ **dispose**(): `void`

Destroy session.

#### Returns

`void`

#### Defined in

sip.js/lib/core/session/session.d.ts:37

___

### bye

▸ **bye**(`delegate?`, `options?`): [`OutgoingByeRequest`](OutgoingByeRequest.md)

Send a BYE request.
Terminating a session.
https://tools.ietf.org/html/rfc3261#section-15

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingRequestDelegate`](OutgoingRequestDelegate.md) | Request delegate. |
| `options?` | [`RequestOptions`](RequestOptions.md) | Options bucket. |

#### Returns

[`OutgoingByeRequest`](OutgoingByeRequest.md)

#### Defined in

sip.js/lib/core/session/session.d.ts:45

___

### info

▸ **info**(`delegate?`, `options?`): [`OutgoingInfoRequest`](OutgoingInfoRequest.md)

Send an INFO request.
Exchange information during a session.
https://tools.ietf.org/html/rfc6086#section-4.2.1

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingRequestDelegate`](OutgoingRequestDelegate.md) | Request delegate. |
| `options?` | [`RequestOptions`](RequestOptions.md) | Options bucket. |

#### Returns

[`OutgoingInfoRequest`](OutgoingInfoRequest.md)

#### Defined in

sip.js/lib/core/session/session.d.ts:53

___

### invite

▸ **invite**(`delegate?`, `options?`): [`OutgoingInviteRequest`](OutgoingInviteRequest.md)

Send re-INVITE request.
Modifying a session.
https://tools.ietf.org/html/rfc3261#section-14.1

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingInviteRequestDelegate`](OutgoingInviteRequestDelegate.md) | Request delegate. |
| `options?` | [`RequestOptions`](RequestOptions.md) | Options bucket. |

#### Returns

[`OutgoingInviteRequest`](OutgoingInviteRequest.md)

#### Defined in

sip.js/lib/core/session/session.d.ts:61

___

### message

▸ **message**(`delegate?`, `options?`): [`OutgoingMessageRequest`](OutgoingMessageRequest.md)

Send MESSAGE request.
Deliver a message during a session.
https://tools.ietf.org/html/rfc3428#section-4

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingRequestDelegate`](OutgoingRequestDelegate.md) | Request delegate. |
| `options?` | [`RequestOptions`](RequestOptions.md) | Options bucket. |

#### Returns

[`OutgoingMessageRequest`](OutgoingMessageRequest.md)

#### Defined in

sip.js/lib/core/session/session.d.ts:69

___

### notify

▸ **notify**(`delegate?`, `options?`): [`OutgoingNotifyRequest`](OutgoingNotifyRequest.md)

Send NOTIFY request.
Inform referrer of transfer progress.
The use of this is limited to the implicit creation of subscription by REFER (historical).
Otherwise, notifiers MUST NOT create subscriptions except upon receipt of a SUBSCRIBE request.
https://tools.ietf.org/html/rfc3515#section-3.7

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingRequestDelegate`](OutgoingRequestDelegate.md) | Request delegate. |
| `options?` | [`RequestOptions`](RequestOptions.md) | Options bucket. |

#### Returns

[`OutgoingNotifyRequest`](OutgoingNotifyRequest.md)

#### Defined in

sip.js/lib/core/session/session.d.ts:79

___

### prack

▸ **prack**(`delegate?`, `options?`): [`OutgoingPrackRequest`](OutgoingPrackRequest.md)

Send PRACK request.
Acknowledge a reliable provisional response.
https://tools.ietf.org/html/rfc3262#section-4

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingRequestDelegate`](OutgoingRequestDelegate.md) | Request delegate. |
| `options?` | [`RequestOptions`](RequestOptions.md) | Options bucket. |

#### Returns

[`OutgoingPrackRequest`](OutgoingPrackRequest.md)

#### Defined in

sip.js/lib/core/session/session.d.ts:87

___

### refer

▸ **refer**(`delegate?`, `options?`): [`OutgoingReferRequest`](OutgoingReferRequest.md)

Send REFER request.
Transfer a session.
https://tools.ietf.org/html/rfc3515#section-2.4.1

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `delegate?` | [`OutgoingRequestDelegate`](OutgoingRequestDelegate.md) | Request delegate. |
| `options?` | [`RequestOptions`](RequestOptions.md) | Options bucket. |

#### Returns

[`OutgoingReferRequest`](OutgoingReferRequest.md)

#### Defined in

sip.js/lib/core/session/session.d.ts:95
