[SIP.js](../README.md) / [Exports](../modules.md) / IncomingPublishRequest

# Interface: IncomingPublishRequest

Incoming PUBLISH request.

## Hierarchy

- [`IncomingRequest`](IncomingRequest.md)

  ↳ **`IncomingPublishRequest`**

## Table of contents

### Properties

- [delegate](IncomingPublishRequest.md#delegate)
- [message](IncomingPublishRequest.md#message)

### Methods

- [accept](IncomingPublishRequest.md#accept)
- [progress](IncomingPublishRequest.md#progress)
- [redirect](IncomingPublishRequest.md#redirect)
- [reject](IncomingPublishRequest.md#reject)
- [trying](IncomingPublishRequest.md#trying)

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

### accept

▸ **accept**(`options?`): [`OutgoingResponse`](OutgoingResponse.md)

Send a 2xx positive final response to this request. Defaults to 200.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ResponseOptions`](ResponseOptions.md) | Response options bucket. |

#### Returns

[`OutgoingResponse`](OutgoingResponse.md)

#### Inherited from

[IncomingRequest](IncomingRequest.md).[accept](IncomingRequest.md#accept)

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

#### Inherited from

[IncomingRequest](IncomingRequest.md).[progress](IncomingRequest.md#progress)

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
