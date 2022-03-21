[SIP.js](../README.md) / [Exports](../modules.md) / ClientTransactionUser

# Interface: ClientTransactionUser

UAC Core Transaction User.

## Hierarchy

- [`TransactionUser`](TransactionUser.md)

  ↳ **`ClientTransactionUser`**

## Table of contents

### Properties

- [loggerFactory](ClientTransactionUser.md#loggerfactory)

### Methods

- [onStateChange](ClientTransactionUser.md#onstatechange)
- [onTransportError](ClientTransactionUser.md#ontransporterror)
- [onRequestTimeout](ClientTransactionUser.md#onrequesttimeout)
- [receiveResponse](ClientTransactionUser.md#receiveresponse)

## Properties

### loggerFactory

• **loggerFactory**: [`LoggerFactory`](../classes/LoggerFactory.md)

Logger factory.

#### Inherited from

[TransactionUser](TransactionUser.md).[loggerFactory](TransactionUser.md#loggerfactory)

#### Defined in

sip.js/lib/core/transactions/transaction-user.d.ts:18

## Methods

### onStateChange

▸ `Optional` **onStateChange**(`newState`): `void`

Callback for notification of transaction state changes.

Not called when transaction is constructed, so there is
no notification of entering the initial transaction state.
Otherwise, called once for each transaction state change.
State changes adhere to the following RFCs.
https://tools.ietf.org/html/rfc3261#section-17
https://tools.ietf.org/html/rfc6026

#### Parameters

| Name | Type |
| :------ | :------ |
| `newState` | [`TransactionState`](../enums/TransactionState.md) |

#### Returns

`void`

#### Inherited from

[TransactionUser](TransactionUser.md).[onStateChange](TransactionUser.md#onstatechange)

#### Defined in

sip.js/lib/core/transactions/transaction-user.d.ts:29

___

### onTransportError

▸ `Optional` **onTransportError**(`error`): `void`

Callback for notification of a transport error.

If a fatal transport error is reported by the transport layer
(generally, due to fatal ICMP errors in UDP or connection failures in
TCP), the condition MUST be treated as a 503 (Service Unavailable)
status code.
https://tools.ietf.org/html/rfc3261#section-8.1.3.1
https://tools.ietf.org/html/rfc3261#section-17.1.4
https://tools.ietf.org/html/rfc3261#section-17.2.4
https://tools.ietf.org/html/rfc6026

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | [`TransportError`](../classes/TransportError.md) |

#### Returns

`void`

#### Inherited from

[TransactionUser](TransactionUser.md).[onTransportError](TransactionUser.md#ontransporterror)

#### Defined in

sip.js/lib/core/transactions/transaction-user.d.ts:42

___

### onRequestTimeout

▸ `Optional` **onRequestTimeout**(): `void`

Callback for request timeout error.

When a timeout error is received from the transaction layer, it MUST be
treated as if a 408 (Request Timeout) status code has been received.
https://tools.ietf.org/html/rfc3261#section-8.1.3.1
TU MUST be informed of a timeout.
https://tools.ietf.org/html/rfc3261#section-17.1.2.2

#### Returns

`void`

#### Defined in

sip.js/lib/core/transactions/transaction-user.d.ts:58

___

### receiveResponse

▸ `Optional` **receiveResponse**(`response`): `void`

Callback for delegation of valid response handling.

Valid responses are passed up to the TU from the client transaction.
https://tools.ietf.org/html/rfc3261#section-17.1

#### Parameters

| Name | Type |
| :------ | :------ |
| `response` | [`IncomingResponseMessage`](../classes/IncomingResponseMessage.md) |

#### Returns

`void`

#### Defined in

sip.js/lib/core/transactions/transaction-user.d.ts:65
