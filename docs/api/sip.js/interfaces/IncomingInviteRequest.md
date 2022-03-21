[SIP.js](../README.md) / [Exports](../modules.md) / IncomingInviteRequest

# Interface: IncomingInviteRequest

Incoming INVITE request.

## Hierarchy

- [`IncomingRequest`](IncomingRequest.md)

  ↳ **`IncomingInviteRequest`**

## Implemented by

- [`InviteUserAgentServer`](../classes/InviteUserAgentServer.md)
- [`ReInviteUserAgentServer`](../classes/ReInviteUserAgentServer.md)

## Table of contents

### Properties

- [delegate](IncomingInviteRequest.md#delegate)
- [message](IncomingInviteRequest.md#message)

### Methods

- [redirect](IncomingInviteRequest.md#redirect)
- [reject](IncomingInviteRequest.md#reject)
- [trying](IncomingInviteRequest.md#trying)
- [accept](IncomingInviteRequest.md#accept)
- [progress](IncomingInviteRequest.md#progress)

## Properties

### delegate

• `Optional` **delegate**: [`IncomingRequestDelegate`](IncomingRequestDelegate.md)

Delegate providing custom handling of this incoming request.

#### Inherited from

[IncomingRequest](IncomingRequest.md).[delegate](IncomingRequest.md#delegate)

#### Defined in

sip.js/lib/core/messages/incoming-request.d.ts:14

___

### message

• `Readonly` **message**: [`IncomingRequestMessage`](../classes/IncomingRequestMessage.md)

The incoming message.

#### Inherited from

[IncomingRequest](IncomingRequest.md).[message](IncomingRequest.md#message)

#### Defined in

sip.js/lib/core/messages/incoming-request.d.ts:16

## Methods

### redirect

▸ **redirect**(`contacts`, `options?`): [`OutgoingResponse`](OutgoingResponse.md)

Send a 3xx negative final response to this request. Defaults to 302.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contacts` | [`URI`](../classes/URI.md)[] | Contacts to redirect the UAC to. |
| `options?` | [`ResponseOptions`](ResponseOptions.md) | Response options bucket. |

#### Returns

[`OutgoingResponse`](OutgoingResponse.md)

#### Inherited from

[IncomingRequest](IncomingRequest.md).[redirect](IncomingRequest.md#redirect)

#### Defined in

sip.js/lib/core/messages/incoming-request.d.ts:33

___

### reject

▸ **reject**(`options?`): [`OutgoingResponse`](OutgoingResponse.md)

Send a 4xx, 5xx, or 6xx negative final response to this request. Defaults to 480.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ResponseOptions`](ResponseOptions.md) | Response options bucket. |

#### Returns

[`OutgoingResponse`](OutgoingResponse.md)

#### Inherited from

[IncomingRequest](IncomingRequest.md).[reject](IncomingRequest.md#reject)

#### Defined in

sip.js/lib/core/messages/incoming-request.d.ts:38

___

### trying

▸ **trying**(`options?`): [`OutgoingResponse`](OutgoingResponse.md)

Send a 100 outgoing response to this request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ResponseOptions`](ResponseOptions.md) | Response options bucket. |

#### Returns

[`OutgoingResponse`](OutgoingResponse.md)

#### Inherited from

[IncomingRequest](IncomingRequest.md).[trying](IncomingRequest.md#trying)

#### Defined in

sip.js/lib/core/messages/incoming-request.d.ts:43

___

### accept

▸ **accept**(`options?`): [`OutgoingResponseWithSession`](OutgoingResponseWithSession.md)

Send a 2xx positive final response to this request. Defaults to 200.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ResponseOptions`](ResponseOptions.md) | Response options bucket. |

#### Returns

[`OutgoingResponseWithSession`](OutgoingResponseWithSession.md)

Outgoing response and a confirmed Session.

#### Overrides

[IncomingRequest](IncomingRequest.md).[accept](IncomingRequest.md#accept)

#### Defined in

sip.js/lib/core/messages/methods/invite.d.ts:18

___

### progress

▸ **progress**(`options?`): [`OutgoingResponseWithSession`](OutgoingResponseWithSession.md)

Send a 1xx provisional response to this request. Defaults to 180. Excludes 100.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ResponseOptions`](ResponseOptions.md) | Response options bucket. |

#### Returns

[`OutgoingResponseWithSession`](OutgoingResponseWithSession.md)

Outgoing response and an early Session.

#### Overrides

[IncomingRequest](IncomingRequest.md).[progress](IncomingRequest.md#progress)

#### Defined in

sip.js/lib/core/messages/methods/invite.d.ts:24
