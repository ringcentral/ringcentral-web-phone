[SIP.js](../README.md) / [Exports](../modules.md) / UserAgentCore

# Class: UserAgentCore

User Agent Core.

**`remarks`**
Core designates the functions specific to a particular type
of SIP entity, i.e., specific to either a stateful or stateless
proxy, a user agent or registrar.  All cores, except those for
the stateless proxy, are transaction users.
https://tools.ietf.org/html/rfc3261#section-6

UAC Core: The set of processing functions required of a UAC that
reside above the transaction and transport layers.
https://tools.ietf.org/html/rfc3261#section-6

UAS Core: The set of processing functions required at a UAS that
resides above the transaction and transport layers.
https://tools.ietf.org/html/rfc3261#section-6

## Table of contents

### Constructors

- [constructor](UserAgentCore.md#constructor)

### Properties

- [configuration](UserAgentCore.md#configuration)
- [delegate](UserAgentCore.md#delegate)
- [dialogs](UserAgentCore.md#dialogs)
- [subscribers](UserAgentCore.md#subscribers)
- [userAgentClients](UserAgentCore.md#useragentclients)
- [userAgentServers](UserAgentCore.md#useragentservers)

### Methods

- [dispose](UserAgentCore.md#dispose)
- [reset](UserAgentCore.md#reset)
- [invite](UserAgentCore.md#invite)
- [message](UserAgentCore.md#message)
- [publish](UserAgentCore.md#publish)
- [register](UserAgentCore.md#register)
- [subscribe](UserAgentCore.md#subscribe)
- [request](UserAgentCore.md#request)
- [makeOutgoingRequestMessage](UserAgentCore.md#makeoutgoingrequestmessage)
- [receiveIncomingRequestFromTransport](UserAgentCore.md#receiveincomingrequestfromtransport)
- [receiveIncomingResponseFromTransport](UserAgentCore.md#receiveincomingresponsefromtransport)
- [replyStateless](UserAgentCore.md#replystateless)

### Accessors

- [loggerFactory](UserAgentCore.md#loggerfactory)
- [transport](UserAgentCore.md#transport)

## Constructors

### constructor

• **new UserAgentCore**(`configuration`, `delegate?`)

Constructor.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `configuration` | [`UserAgentCoreConfiguration`](../interfaces/UserAgentCoreConfiguration.md) | Configuration. |
| `delegate?` | [`UserAgentCoreDelegate`](../interfaces/UserAgentCoreDelegate.md) | Delegate. |

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:45

## Properties

### configuration

• **configuration**: [`UserAgentCoreConfiguration`](../interfaces/UserAgentCoreConfiguration.md)

Configuration.

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:28

___

### delegate

• **delegate**: [`UserAgentCoreDelegate`](../interfaces/UserAgentCoreDelegate.md)

Delegate.

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:30

___

### dialogs

• **dialogs**: `Map`<`string`, [`Dialog`](Dialog.md)\>

Dialogs.

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:32

___

### subscribers

• **subscribers**: `Map`<`string`, [`SubscribeUserAgentClient`](SubscribeUserAgentClient.md)\>

Subscribers.

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:34

___

### userAgentClients

• **userAgentClients**: `Map`<`string`, [`UserAgentClient`](UserAgentClient.md)\>

UACs.

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:36

___

### userAgentServers

• **userAgentServers**: `Map`<`string`, [`UserAgentServer`](UserAgentServer.md)\>

UASs.

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:38

## Methods

### dispose

▸ **dispose**(): `void`

Destructor.

#### Returns

`void`

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:47

___

### reset

▸ **reset**(): `void`

Reset.

#### Returns

`void`

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:49

___

### invite

▸ **invite**(`request`, `delegate?`): [`OutgoingInviteRequest`](../interfaces/OutgoingInviteRequest.md)

Send INVITE.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) | Outgoing request. |
| `delegate?` | [`OutgoingInviteRequestDelegate`](../interfaces/OutgoingInviteRequestDelegate.md) | Request delegate. |

#### Returns

[`OutgoingInviteRequest`](../interfaces/OutgoingInviteRequest.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:59

___

### message

▸ **message**(`request`, `delegate?`): [`OutgoingMessageRequest`](../interfaces/OutgoingMessageRequest.md)

Send MESSAGE.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) | Outgoing request. |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) | Request delegate. |

#### Returns

[`OutgoingMessageRequest`](../interfaces/OutgoingMessageRequest.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:65

___

### publish

▸ **publish**(`request`, `delegate?`): [`OutgoingPublishRequest`](../interfaces/OutgoingPublishRequest.md)

Send PUBLISH.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) | Outgoing request. |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) | Request delegate. |

#### Returns

[`OutgoingPublishRequest`](../interfaces/OutgoingPublishRequest.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:71

___

### register

▸ **register**(`request`, `delegate?`): [`OutgoingRegisterRequest`](../interfaces/OutgoingRegisterRequest.md)

Send REGISTER.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) | Outgoing request. |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) | Request delegate. |

#### Returns

[`OutgoingRegisterRequest`](../interfaces/OutgoingRegisterRequest.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:77

___

### subscribe

▸ **subscribe**(`request`, `delegate?`): [`OutgoingSubscribeRequest`](../interfaces/OutgoingSubscribeRequest.md)

Send SUBSCRIBE.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) | Outgoing request. |
| `delegate?` | [`OutgoingSubscribeRequestDelegate`](../interfaces/OutgoingSubscribeRequestDelegate.md) | Request delegate. |

#### Returns

[`OutgoingSubscribeRequest`](../interfaces/OutgoingSubscribeRequest.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:83

___

### request

▸ **request**(`request`, `delegate?`): [`OutgoingRequest`](../interfaces/OutgoingRequest.md)

Send a request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) | Outgoing request. |
| `delegate?` | [`OutgoingRequestDelegate`](../interfaces/OutgoingRequestDelegate.md) | Request delegate. |

#### Returns

[`OutgoingRequest`](../interfaces/OutgoingRequest.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:89

___

### makeOutgoingRequestMessage

▸ **makeOutgoingRequestMessage**(`method`, `requestURI`, `fromURI`, `toURI`, `options`, `extraHeaders?`, `body?`): [`OutgoingRequestMessage`](OutgoingRequestMessage.md)

Outgoing request message factory function.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `method` | `string` | Method. |
| `requestURI` | [`URI`](URI.md) | Request-URI. |
| `fromURI` | [`URI`](URI.md) | From URI. |
| `toURI` | [`URI`](URI.md) | To URI. |
| `options` | [`OutgoingRequestMessageOptions`](../interfaces/OutgoingRequestMessageOptions.md) | Request options. |
| `extraHeaders?` | `string`[] | Extra headers to add. |
| `body?` | [`Body`](../interfaces/Body.md) | Message body. |

#### Returns

[`OutgoingRequestMessage`](OutgoingRequestMessage.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:100

___

### receiveIncomingRequestFromTransport

▸ **receiveIncomingRequestFromTransport**(`message`): `void`

Handle an incoming request message from the transport.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`IncomingRequestMessage`](IncomingRequestMessage.md) | Incoming request message from transport layer. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:105

___

### receiveIncomingResponseFromTransport

▸ **receiveIncomingResponseFromTransport**(`message`): `void`

Handle an incoming response message from the transport.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`IncomingResponseMessage`](IncomingResponseMessage.md) | Incoming response message from transport layer. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:110

___

### replyStateless

▸ **replyStateless**(`message`, `options`): [`OutgoingResponse`](../interfaces/OutgoingResponse.md)

A stateless UAS is a UAS that does not maintain transaction state.
It replies to requests normally, but discards any state that would
ordinarily be retained by a UAS after a response has been sent.  If a
stateless UAS receives a retransmission of a request, it regenerates
the response and re-sends it, just as if it were replying to the first
instance of the request. A UAS cannot be stateless unless the request
processing for that method would always result in the same response
if the requests are identical. This rules out stateless registrars,
for example.  Stateless UASs do not use a transaction layer; they
receive requests directly from the transport layer and send responses
directly to the transport layer.
https://tools.ietf.org/html/rfc3261#section-8.2.7

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`IncomingRequestMessage`](IncomingRequestMessage.md) | Incoming request message to reply to. |
| `options` | [`ResponseOptions`](../interfaces/ResponseOptions.md) | - |

#### Returns

[`OutgoingResponse`](../interfaces/OutgoingResponse.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:127

## Accessors

### loggerFactory

• `get` **loggerFactory**(): [`LoggerFactory`](LoggerFactory.md)

Logger factory.

#### Returns

[`LoggerFactory`](LoggerFactory.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:51

___

### transport

• `get` **transport**(): [`Transport`](../interfaces/Transport.md)

Transport.

#### Returns

[`Transport`](../interfaces/Transport.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core.d.ts:53
