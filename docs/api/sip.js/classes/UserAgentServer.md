[SIP.js](../README.md) / [Exports](../modules.md) / UserAgentServer

# Class: UserAgentServer

User Agent Server (UAS).

**`remarks`**
A user agent server is a logical entity
that generates a response to a SIP request.  The response
accepts, rejects, or redirects the request.  This role lasts
only for the duration of that transaction.  In other words, if
a piece of software responds to a request, it acts as a UAS for
the duration of that transaction.  If it generates a request
later, it assumes the role of a user agent client for the
processing of that transaction.
https://tools.ietf.org/html/rfc3261#section-6

## Hierarchy

- **`UserAgentServer`**

  ↳ [`ByeUserAgentServer`](ByeUserAgentServer.md)

  ↳ [`InfoUserAgentServer`](InfoUserAgentServer.md)

  ↳ [`InviteUserAgentServer`](InviteUserAgentServer.md)

  ↳ [`MessageUserAgentServer`](MessageUserAgentServer.md)

  ↳ [`NotifyUserAgentServer`](NotifyUserAgentServer.md)

  ↳ [`PrackUserAgentServer`](PrackUserAgentServer.md)

  ↳ [`ReInviteUserAgentServer`](ReInviteUserAgentServer.md)

  ↳ [`ReSubscribeUserAgentServer`](ReSubscribeUserAgentServer.md)

  ↳ [`ReferUserAgentServer`](ReferUserAgentServer.md)

  ↳ [`RegisterUserAgentServer`](RegisterUserAgentServer.md)

  ↳ [`SubscribeUserAgentServer`](SubscribeUserAgentServer.md)

## Implements

- [`IncomingRequest`](../interfaces/IncomingRequest.md)

## Table of contents

### Constructors

- [constructor](UserAgentServer.md#constructor)

### Properties

- [message](UserAgentServer.md#message)
- [delegate](UserAgentServer.md#delegate)

### Methods

- [dispose](UserAgentServer.md#dispose)
- [accept](UserAgentServer.md#accept)
- [progress](UserAgentServer.md#progress)
- [redirect](UserAgentServer.md#redirect)
- [reject](UserAgentServer.md#reject)
- [trying](UserAgentServer.md#trying)
- [receiveCancel](UserAgentServer.md#receivecancel)

### Accessors

- [loggerFactory](UserAgentServer.md#loggerfactory)
- [transaction](UserAgentServer.md#transaction)

## Constructors

### constructor

• **new UserAgentServer**(`transactionConstructor`, `core`, `message`, `delegate?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `transactionConstructor` | `ServerTransactionConstructor` |
| `core` | [`UserAgentCore`](UserAgentCore.md) |
| `message` | [`IncomingRequestMessage`](IncomingRequestMessage.md) |
| `delegate?` | [`IncomingRequestDelegate`](../interfaces/IncomingRequestDelegate.md) |

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:29

## Properties

### message

• **message**: [`IncomingRequestMessage`](IncomingRequestMessage.md)

The incoming message.

#### Implementation of

[IncomingRequest](../interfaces/IncomingRequest.md).[message](../interfaces/IncomingRequest.md#message)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:24

___

### delegate

• `Optional` **delegate**: [`IncomingRequestDelegate`](../interfaces/IncomingRequestDelegate.md)

Delegate providing custom handling of this incoming request.

#### Implementation of

[IncomingRequest](../interfaces/IncomingRequest.md).[delegate](../interfaces/IncomingRequest.md#delegate)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:25

## Methods

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

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

[IncomingRequest](../interfaces/IncomingRequest.md).[accept](../interfaces/IncomingRequest.md#accept)

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

[IncomingRequest](../interfaces/IncomingRequest.md).[progress](../interfaces/IncomingRequest.md#progress)

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

[IncomingRequest](../interfaces/IncomingRequest.md).[redirect](../interfaces/IncomingRequest.md#redirect)

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

[IncomingRequest](../interfaces/IncomingRequest.md).[reject](../interfaces/IncomingRequest.md#reject)

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

[IncomingRequest](../interfaces/IncomingRequest.md).[trying](../interfaces/IncomingRequest.md#trying)

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

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:57

## Accessors

### loggerFactory

• `get` **loggerFactory**(): [`LoggerFactory`](LoggerFactory.md)

#### Returns

[`LoggerFactory`](LoggerFactory.md)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:31

___

### transaction

• `get` **transaction**(): [`ServerTransaction`](ServerTransaction.md)

The transaction associated with this request.

#### Returns

[`ServerTransaction`](ServerTransaction.md)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:33
