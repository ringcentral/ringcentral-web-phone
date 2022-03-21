[SIP.js](../README.md) / [Exports](../modules.md) / ReInviteUserAgentServer

# Class: ReInviteUserAgentServer

Re-INVITE UAS.

**`remarks`**
14 Modifying an Existing Session
https://tools.ietf.org/html/rfc3261#section-14
14.2 UAS Behavior
https://tools.ietf.org/html/rfc3261#section-14.2

## Hierarchy

- [`UserAgentServer`](UserAgentServer.md)

  ↳ **`ReInviteUserAgentServer`**

## Implements

- [`IncomingInviteRequest`](../interfaces/IncomingInviteRequest.md)

## Table of contents

### Constructors

- [constructor](ReInviteUserAgentServer.md#constructor)

### Methods

- [accept](ReInviteUserAgentServer.md#accept)
- [progress](ReInviteUserAgentServer.md#progress)
- [redirect](ReInviteUserAgentServer.md#redirect)
- [reject](ReInviteUserAgentServer.md#reject)
- [dispose](ReInviteUserAgentServer.md#dispose)
- [trying](ReInviteUserAgentServer.md#trying)
- [receiveCancel](ReInviteUserAgentServer.md#receivecancel)

### Properties

- [message](ReInviteUserAgentServer.md#message)
- [delegate](ReInviteUserAgentServer.md#delegate)

### Accessors

- [loggerFactory](ReInviteUserAgentServer.md#loggerfactory)
- [transaction](ReInviteUserAgentServer.md#transaction)

## Constructors

### constructor

• **new ReInviteUserAgentServer**(`dialog`, `message`, `delegate?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dialog` | [`SessionDialog`](SessionDialog.md) |
| `message` | [`IncomingRequestMessage`](IncomingRequestMessage.md) |
| `delegate?` | [`IncomingRequestDelegate`](../interfaces/IncomingRequestDelegate.md) |

#### Overrides

[UserAgentServer](UserAgentServer.md).[constructor](UserAgentServer.md#constructor)

#### Defined in

sip.js/lib/core/user-agents/re-invite-user-agent-server.d.ts:15

## Methods

### accept

▸ **accept**(`options?`): [`OutgoingResponseWithSession`](../interfaces/OutgoingResponseWithSession.md)

Update the dialog signaling state on a 2xx response.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options?` | [`ResponseOptions`](../interfaces/ResponseOptions.md) | Options bucket. |

#### Returns

[`OutgoingResponseWithSession`](../interfaces/OutgoingResponseWithSession.md)

#### Implementation of

[IncomingInviteRequest](../interfaces/IncomingInviteRequest.md).[accept](../interfaces/IncomingInviteRequest.md#accept)

#### Overrides

[UserAgentServer](UserAgentServer.md).[accept](UserAgentServer.md#accept)

#### Defined in

sip.js/lib/core/user-agents/re-invite-user-agent-server.d.ts:20

___

### progress

▸ **progress**(`options?`): [`OutgoingResponseWithSession`](../interfaces/OutgoingResponseWithSession.md)

Update the dialog signaling state on a 1xx response.

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

sip.js/lib/core/user-agents/re-invite-user-agent-server.d.ts:25

___

### redirect

▸ **redirect**(`contacts`, `options?`): [`OutgoingResponse`](../interfaces/OutgoingResponse.md)

TODO: Not Yet Supported

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

sip.js/lib/core/user-agents/re-invite-user-agent-server.d.ts:31

___

### reject

▸ **reject**(`options?`): [`OutgoingResponse`](../interfaces/OutgoingResponse.md)

3.1 Background on Re-INVITE Handling by UASs
An error response to a re-INVITE has the following semantics.  As
specified in Section 12.2.2 of RFC 3261 [RFC3261], if a re-INVITE is
rejected, no state changes are performed.
https://tools.ietf.org/html/rfc6141#section-3.1

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

sip.js/lib/core/user-agents/re-invite-user-agent-server.d.ts:40

___

### dispose

▸ **dispose**(): `void`

#### Returns

`void`

#### Inherited from

[UserAgentServer](UserAgentServer.md).[dispose](UserAgentServer.md#dispose)

#### Defined in

sip.js/lib/core/user-agents/user-agent-server.d.ts:30

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
