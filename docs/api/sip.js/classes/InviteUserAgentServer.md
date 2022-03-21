[SIP.js](../README.md) / [Exports](../modules.md) / InviteUserAgentServer

# Class: InviteUserAgentServer

INVITE UAS.

**`remarks`**
13 Initiating a Session
https://tools.ietf.org/html/rfc3261#section-13
13.1 Overview
https://tools.ietf.org/html/rfc3261#section-13.1
13.3 UAS Processing
https://tools.ietf.org/html/rfc3261#section-13.3

## Hierarchy

- [`UserAgentServer`](UserAgentServer.md)

  ↳ **`InviteUserAgentServer`**

## Implements

- [`IncomingInviteRequest`](../interfaces/IncomingInviteRequest.md)

## Table of contents

### Constructors

- [constructor](InviteUserAgentServer.md#constructor)

### Methods

- [dispose](InviteUserAgentServer.md#dispose)
- [accept](InviteUserAgentServer.md#accept)
- [progress](InviteUserAgentServer.md#progress)
- [redirect](InviteUserAgentServer.md#redirect)
- [reject](InviteUserAgentServer.md#reject)
- [trying](InviteUserAgentServer.md#trying)
- [receiveCancel](InviteUserAgentServer.md#receivecancel)

### Properties

- [message](InviteUserAgentServer.md#message)
- [delegate](InviteUserAgentServer.md#delegate)

### Accessors

- [loggerFactory](InviteUserAgentServer.md#loggerfactory)
- [transaction](InviteUserAgentServer.md#transaction)

## Constructors

### constructor

• **new InviteUserAgentServer**(`core`, `message`, `delegate?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `core` | [`UserAgentCore`](UserAgentCore.md) |
| `message` | [`IncomingRequestMessage`](IncomingRequestMessage.md) |
| `delegate?` | [`IncomingRequestDelegate`](../interfaces/IncomingRequestDelegate.md) |

#### Overrides

[UserAgentServer](UserAgentServer.md).[constructor](UserAgentServer.md#constructor)

#### Defined in

sip.js/lib/core/user-agents/invite-user-agent-server.d.ts:21

## Methods

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Overrides

[UserAgentServer](UserAgentServer.md).[dispose](UserAgentServer.md#dispose)

#### Defined in

sip.js/lib/core/user-agents/invite-user-agent-server.d.ts:22

___

### accept

▸ **accept**(`options?`): [`OutgoingResponseWithSession`](../interfaces/OutgoingResponseWithSession.md)

13.3.1.4 The INVITE is Accepted
The UAS core generates a 2xx response.  This response establishes a
dialog, and therefore follows the procedures of Section 12.1.1 in
addition to those of Section 8.2.6.
https://tools.ietf.org/html/rfc3261#section-13.3.1.4

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ResponseOptions`](../interfaces/ResponseOptions.md) | Accept options bucket. |

#### Returns

[`OutgoingResponseWithSession`](../interfaces/OutgoingResponseWithSession.md)

#### Implementation of

[IncomingInviteRequest](../interfaces/IncomingInviteRequest.md).[accept](../interfaces/IncomingInviteRequest.md#accept)

#### Overrides

[UserAgentServer](UserAgentServer.md).[accept](UserAgentServer.md#accept)

#### Defined in

sip.js/lib/core/user-agents/invite-user-agent-server.d.ts:31

___

### progress

▸ **progress**(`options?`): [`OutgoingResponseWithSession`](../interfaces/OutgoingResponseWithSession.md)

13.3.1.1 Progress
If the UAS is not able to answer the invitation immediately, it can
choose to indicate some kind of progress to the UAC (for example, an
indication that a phone is ringing).  This is accomplished with a
provisional response between 101 and 199.  These provisional
responses establish early dialogs and therefore follow the procedures
of Section 12.1.1 in addition to those of Section 8.2.6.  A UAS MAY
send as many provisional responses as it likes.  Each of these MUST
indicate the same dialog ID.  However, these will not be delivered
reliably.

If the UAS desires an extended period of time to answer the INVITE,
it will need to ask for an "extension" in order to prevent proxies
from canceling the transaction.  A proxy has the option of canceling
a transaction when there is a gap of 3 minutes between responses in a
transaction.  To prevent cancellation, the UAS MUST send a non-100
provisional response at every minute, to handle the possibility of
lost provisional responses.
https://tools.ietf.org/html/rfc3261#section-13.3.1.1

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ResponseOptions`](../interfaces/ResponseOptions.md) | Progress options bucket. |

#### Returns

[`OutgoingResponseWithSession`](../interfaces/OutgoingResponseWithSession.md)

#### Implementation of

[IncomingInviteRequest](../interfaces/IncomingInviteRequest.md).[progress](../interfaces/IncomingInviteRequest.md#progress)

#### Overrides

[UserAgentServer](UserAgentServer.md).[progress](UserAgentServer.md#progress)

#### Defined in

sip.js/lib/core/user-agents/invite-user-agent-server.d.ts:54

___

### redirect

▸ **redirect**(`contacts`, `options?`): [`OutgoingResponse`](../interfaces/OutgoingResponse.md)

13.3.1.2 The INVITE is Redirected
If the UAS decides to redirect the call, a 3xx response is sent.  A
300 (Multiple Choices), 301 (Moved Permanently) or 302 (Moved
Temporarily) response SHOULD contain a Contact header field
containing one or more URIs of new addresses to be tried.  The
response is passed to the INVITE server transaction, which will deal
with its retransmissions.
https://tools.ietf.org/html/rfc3261#section-13.3.1.2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `contacts` | [`URI`](URI.md)[] | Contacts to redirect to. |
| `options?` | [`ResponseOptions`](../interfaces/ResponseOptions.md) | Redirect options bucket. |

#### Returns

[`OutgoingResponse`](../interfaces/OutgoingResponse.md)

#### Implementation of

[IncomingInviteRequest](../interfaces/IncomingInviteRequest.md).[redirect](../interfaces/IncomingInviteRequest.md#redirect)

#### Overrides

[UserAgentServer](UserAgentServer.md).[redirect](UserAgentServer.md#redirect)

#### Defined in

sip.js/lib/core/user-agents/invite-user-agent-server.d.ts:67

___

### reject

▸ **reject**(`options?`): [`OutgoingResponse`](../interfaces/OutgoingResponse.md)

13.3.1.3 The INVITE is Rejected
A common scenario occurs when the callee is currently not willing or
able to take additional calls at this end system.  A 486 (Busy Here)
SHOULD be returned in such a scenario.
https://tools.ietf.org/html/rfc3261#section-13.3.1.3

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ResponseOptions`](../interfaces/ResponseOptions.md) | Reject options bucket. |

#### Returns

[`OutgoingResponse`](../interfaces/OutgoingResponse.md)

#### Implementation of

[IncomingInviteRequest](../interfaces/IncomingInviteRequest.md).[reject](../interfaces/IncomingInviteRequest.md#reject)

#### Overrides

[UserAgentServer](UserAgentServer.md).[reject](UserAgentServer.md#reject)

#### Defined in

sip.js/lib/core/user-agents/invite-user-agent-server.d.ts:76

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

[IncomingInviteRequest](../interfaces/IncomingInviteRequest.md).[trying](../interfaces/IncomingInviteRequest.md#trying)

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

## Properties

### message

• **message**: [`IncomingRequestMessage`](IncomingRequestMessage.md)

The incoming message.

#### Implementation of

[IncomingInviteRequest](../interfaces/IncomingInviteRequest.md).[message](../interfaces/IncomingInviteRequest.md#message)

#### Inherited from

[UserAgentServer](UserAgentServer.md).[message](UserAgentServer.md#message)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:24

___

### delegate

• `Optional` **delegate**: [`IncomingRequestDelegate`](../interfaces/IncomingRequestDelegate.md)

Delegate providing custom handling of this incoming request.

#### Implementation of

[IncomingInviteRequest](../interfaces/IncomingInviteRequest.md).[delegate](../interfaces/IncomingInviteRequest.md#delegate)

#### Inherited from

[UserAgentServer](UserAgentServer.md).[delegate](UserAgentServer.md#delegate)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:25

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
