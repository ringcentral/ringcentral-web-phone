[SIP.js](../README.md) / [Exports](../modules.md) / IncomingRequest

# Interface: IncomingRequest

A SIP message sent from a remote client to a local server.

**`remarks`**
For the purpose of invoking a particular operation.
https://tools.ietf.org/html/rfc3261#section-7.1

## Hierarchy

- **`IncomingRequest`**

  ↳ [`IncomingByeRequest`](IncomingByeRequest.md)

  ↳ [`IncomingCancelRequest`](IncomingCancelRequest.md)

  ↳ [`IncomingInfoRequest`](IncomingInfoRequest.md)

  ↳ [`IncomingInviteRequest`](IncomingInviteRequest.md)

  ↳ [`IncomingMessageRequest`](IncomingMessageRequest.md)

  ↳ [`IncomingNotifyRequest`](IncomingNotifyRequest.md)

  ↳ [`IncomingPrackRequest`](IncomingPrackRequest.md)

  ↳ [`IncomingPublishRequest`](IncomingPublishRequest.md)

  ↳ [`IncomingReferRequest`](IncomingReferRequest.md)

  ↳ [`IncomingRegisterRequest`](IncomingRegisterRequest.md)

  ↳ [`IncomingSubscribeRequest`](IncomingSubscribeRequest.md)

## Implemented by

- [`UserAgentServer`](../classes/UserAgentServer.md)

## Table of contents

### Properties

- [delegate](IncomingRequest.md#delegate)
- [message](IncomingRequest.md#message)

### Methods

- [accept](IncomingRequest.md#accept)
- [progress](IncomingRequest.md#progress)
- [redirect](IncomingRequest.md#redirect)
- [reject](IncomingRequest.md#reject)
- [trying](IncomingRequest.md#trying)

## Properties

### delegate

• `Optional` **delegate**: [`IncomingRequestDelegate`](IncomingRequestDelegate.md)

Delegate providing custom handling of this incoming request.

#### Defined in

sip.js/lib/core/messages/incoming-request.d.ts:14

___

### message

• `Readonly` **message**: [`IncomingRequestMessage`](../classes/IncomingRequestMessage.md)

The incoming message.

#### Defined in

sip.js/lib/core/messages/incoming-request.d.ts:16

## Methods

### accept

▸ **accept**(`options?`): [`OutgoingResponse`](OutgoingResponse.md)

Send a 2xx positive final response to this request. Defaults to 200.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ResponseOptions`](ResponseOptions.md) | Response options bucket. |

#### Returns

[`OutgoingResponse`](OutgoingResponse.md)

#### Defined in

sip.js/lib/core/messages/incoming-request.d.ts:21

___

### progress

▸ **progress**(`options?`): [`OutgoingResponse`](OutgoingResponse.md)

Send a 1xx provisional response to this request. Defaults to 180. Excludes 100.
Note that per RFC 4320, this method may only be used to respond to INVITE requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ResponseOptions`](ResponseOptions.md) | Response options bucket. |

#### Returns

[`OutgoingResponse`](OutgoingResponse.md)

#### Defined in

sip.js/lib/core/messages/incoming-request.d.ts:27

___

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

#### Defined in

sip.js/lib/core/messages/incoming-request.d.ts:43
