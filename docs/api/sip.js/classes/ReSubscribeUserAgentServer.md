[SIP.js](../README.md) / [Exports](../modules.md) / ReSubscribeUserAgentServer

# Class: ReSubscribeUserAgentServer

Re-SUBSCRIBE UAS.

## Hierarchy

- [`UserAgentServer`](UserAgentServer.md)

  ↳ **`ReSubscribeUserAgentServer`**

## Implements

- [`IncomingSubscribeRequest`](../interfaces/IncomingSubscribeRequest.md)

## Table of contents

### Constructors

- [constructor](ReSubscribeUserAgentServer.md#constructor)

### Properties

- [message](ReSubscribeUserAgentServer.md#message)
- [delegate](ReSubscribeUserAgentServer.md#delegate)

### Methods

- [dispose](ReSubscribeUserAgentServer.md#dispose)
- [accept](ReSubscribeUserAgentServer.md#accept)
- [progress](ReSubscribeUserAgentServer.md#progress)
- [redirect](ReSubscribeUserAgentServer.md#redirect)
- [reject](ReSubscribeUserAgentServer.md#reject)
- [trying](ReSubscribeUserAgentServer.md#trying)
- [receiveCancel](ReSubscribeUserAgentServer.md#receivecancel)

### Accessors

- [loggerFactory](ReSubscribeUserAgentServer.md#loggerfactory)
- [transaction](ReSubscribeUserAgentServer.md#transaction)

## Constructors

### constructor

• **new ReSubscribeUserAgentServer**(`dialog`, `message`, `delegate?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dialog` | [`Dialog`](Dialog.md) |
| `message` | [`IncomingRequestMessage`](IncomingRequestMessage.md) |
| `delegate?` | [`IncomingRequestDelegate`](../interfaces/IncomingRequestDelegate.md) |

#### Overrides

[UserAgentServer](UserAgentServer.md).[constructor](UserAgentServer.md#constructor)

#### Defined in

sip.js/lib/core/user-agents/re-subscribe-user-agent-server.d.ts:9

## Properties

### message

• **message**: [`IncomingRequestMessage`](IncomingRequestMessage.md)

The incoming message.

#### Implementation of

[IncomingSubscribeRequest](../interfaces/IncomingSubscribeRequest.md).[message](../interfaces/IncomingSubscribeRequest.md#message)

#### Inherited from

[UserAgentServer](UserAgentServer.md).[message](UserAgentServer.md#message)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:24

___

### delegate

• `Optional` **delegate**: [`IncomingRequestDelegate`](../interfaces/IncomingRequestDelegate.md)

Delegate providing custom handling of this incoming request.

#### Implementation of

[IncomingSubscribeRequest](../interfaces/IncomingSubscribeRequest.md).[delegate](../interfaces/IncomingSubscribeRequest.md#delegate)

#### Inherited from

[UserAgentServer](UserAgentServer.md).[delegate](UserAgentServer.md#delegate)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:25

## Methods

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Inherited from

[UserAgentServer](UserAgentServer.md).[dispose](UserAgentServer.md#dispose)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:30

___

### accept

▸ **accept**(`options?`): [`OutgoingResponse`](../interfaces/OutgoingResponse.md)

Send a 2xx positive final response to this request. Defaults to 200.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`ResponseOptions`](../interfaces/ResponseOptions.md) |

#### Returns

[`OutgoingResponse`](../interfaces/OutgoingResponse.md)

#### Implementation of

[IncomingSubscribeRequest](../interfaces/IncomingSubscribeRequest.md).[accept](../interfaces/IncomingSubscribeRequest.md#accept)

#### Inherited from

[UserAgentServer](UserAgentServer.md).[accept](UserAgentServer.md#accept)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:34

___

### progress

▸ **progress**(`options?`): [`OutgoingResponse`](../interfaces/OutgoingResponse.md)

Send a 1xx provisional response to this request. Defaults to 180. Excludes 100.
Note that per RFC 4320, this method may only be used to respond to INVITE requests.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`ResponseOptions`](../interfaces/ResponseOptions.md) |

#### Returns

[`OutgoingResponse`](../interfaces/OutgoingResponse.md)

#### Implementation of

[IncomingSubscribeRequest](../interfaces/IncomingSubscribeRequest.md).[progress](../interfaces/IncomingSubscribeRequest.md#progress)

#### Inherited from

[UserAgentServer](UserAgentServer.md).[progress](UserAgentServer.md#progress)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:35

___

### redirect

▸ **redirect**(`contacts`, `options?`): [`OutgoingResponse`](../interfaces/OutgoingResponse.md)

Send a 3xx negative final response to this request. Defaults to 302.

#### Parameters

| Name | Type |
| :------ | :------ |
| `contacts` | [`URI`](URI.md)[] |
| `options?` | [`ResponseOptions`](../interfaces/ResponseOptions.md) |

#### Returns

[`OutgoingResponse`](../interfaces/OutgoingResponse.md)

#### Implementation of

[IncomingSubscribeRequest](../interfaces/IncomingSubscribeRequest.md).[redirect](../interfaces/IncomingSubscribeRequest.md#redirect)

#### Inherited from

[UserAgentServer](UserAgentServer.md).[redirect](UserAgentServer.md#redirect)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:36

___

### reject

▸ **reject**(`options?`): [`OutgoingResponse`](../interfaces/OutgoingResponse.md)

Send a 4xx, 5xx, or 6xx negative final response to this request. Defaults to 480.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`ResponseOptions`](../interfaces/ResponseOptions.md) |

#### Returns

[`OutgoingResponse`](../interfaces/OutgoingResponse.md)

#### Implementation of

[IncomingSubscribeRequest](../interfaces/IncomingSubscribeRequest.md).[reject](../interfaces/IncomingSubscribeRequest.md#reject)

#### Inherited from

[UserAgentServer](UserAgentServer.md).[reject](UserAgentServer.md#reject)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:37

___

### trying

▸ **trying**(`options?`): [`OutgoingResponse`](../interfaces/OutgoingResponse.md)

Send a 100 outgoing response to this request.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`ResponseOptions`](../interfaces/ResponseOptions.md) |

#### Returns

[`OutgoingResponse`](../interfaces/OutgoingResponse.md)

#### Implementation of

[IncomingSubscribeRequest](../interfaces/IncomingSubscribeRequest.md).[trying](../interfaces/IncomingSubscribeRequest.md#trying)

#### Inherited from

[UserAgentServer](UserAgentServer.md).[trying](UserAgentServer.md#trying)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:38

___

### receiveCancel

▸ **receiveCancel**(`message`): `void`

If the UAS did not find a matching transaction for the CANCEL
according to the procedure above, it SHOULD respond to the CANCEL
with a 481 (Call Leg/Transaction Does Not Exist).  If the transaction
for the original request still exists, the behavior of the UAS on
receiving a CANCEL request depends on whether it has already sent a
final response for the original request.  If it has, the CANCEL
request has no effect on the processing of the original request, no
effect on any session state, and no effect on the responses generated
for the original request.  If the UAS has not issued a final response
for the original request, its behavior depends on the method of the
original request.  If the original request was an INVITE, the UAS
SHOULD immediately respond to the INVITE with a 487 (Request
Terminated).  A CANCEL request has no impact on the processing of
transactions with any other method defined in this specification.
https://tools.ietf.org/html/rfc3261#section-9.2

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`IncomingRequestMessage`](IncomingRequestMessage.md) |

#### Returns

`void`

#### Inherited from

[UserAgentServer](UserAgentServer.md).[receiveCancel](UserAgentServer.md#receivecancel)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:57

## Accessors

### loggerFactory

• `get` **loggerFactory**(): [`LoggerFactory`](LoggerFactory.md)

#### Returns

[`LoggerFactory`](LoggerFactory.md)

#### Inherited from

UserAgentServer.loggerFactory

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:31

___

### transaction

• `get` **transaction**(): [`ServerTransaction`](ServerTransaction.md)

The transaction associated with this request.

#### Returns

[`ServerTransaction`](ServerTransaction.md)

#### Inherited from

UserAgentServer.transaction

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:33
