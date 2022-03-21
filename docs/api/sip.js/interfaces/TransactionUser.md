[SIP.js](../README.md) / [Exports](../modules.md) / TransactionUser

# Interface: TransactionUser

Transaction User (TU).

**`remarks`**
The layer of protocol processing that resides above the transaction layer.
Transaction users include the UAC core, UAS core, and proxy core.
https://tools.ietf.org/html/rfc3261#section-5
https://tools.ietf.org/html/rfc3261#section-6

## Hierarchy

- **`TransactionUser`**

  ↳ [`ClientTransactionUser`](ClientTransactionUser.md)

  ↳ [`ServerTransactionUser`](ServerTransactionUser.md)

## Table of contents

### Properties

- [loggerFactory](TransactionUser.md#loggerfactory)

### Methods

- [onStateChange](TransactionUser.md#onstatechange)
- [onTransportError](TransactionUser.md#ontransporterror)

## Properties

### loggerFactory

• **loggerFactory**: [`LoggerFactory`](../classes/LoggerFactory.md)

Logger factory.

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

#### Defined in

sip.js/lib/core/transactions/transaction-user.d.ts:42
