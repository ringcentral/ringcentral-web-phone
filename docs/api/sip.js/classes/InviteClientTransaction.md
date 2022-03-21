[SIP.js](../README.md) / [Exports](../modules.md) / InviteClientTransaction

# Class: InviteClientTransaction

INVITE Client Transaction.

**`remarks`**
The INVITE transaction consists of a three-way handshake.  The client
transaction sends an INVITE, the server transaction sends responses,
and the client transaction sends an ACK.
https://tools.ietf.org/html/rfc3261#section-17.1.1

## Hierarchy

- [`ClientTransaction`](ClientTransaction.md)

  ↳ **`InviteClientTransaction`**

## Table of contents

### Constructors

- [constructor](InviteClientTransaction.md#constructor)

### Accessors

- [request](InviteClientTransaction.md#request)
- [kind](InviteClientTransaction.md#kind)
- [id](InviteClientTransaction.md#id)
- [state](InviteClientTransaction.md#state)
- [transport](InviteClientTransaction.md#transport)

### Methods

- [dispose](InviteClientTransaction.md#dispose)
- [ackResponse](InviteClientTransaction.md#ackresponse)
- [receiveResponse](InviteClientTransaction.md#receiveresponse)
- [addStateChangeListener](InviteClientTransaction.md#addstatechangelistener)
- [notifyStateChangeListeners](InviteClientTransaction.md#notifystatechangelisteners)
- [removeStateChangeListener](InviteClientTransaction.md#removestatechangelistener)

## Constructors

### constructor

• **new InviteClientTransaction**(`request`, `transport`, `user`)

Constructor.
Upon construction, the outgoing request's Via header is updated by calling `setViaHeader`.
Then `toString` is called on the outgoing request and the message is sent via the transport.
After construction the transaction will be in the "calling" state and the transaction id
will equal the branch parameter set in the Via header of the outgoing request.
https://tools.ietf.org/html/rfc3261#section-17.1.1

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) | The outgoing INVITE request. |
| `transport` | [`Transport`](../interfaces/Transport.md) | The transport. |
| `user` | [`ClientTransactionUser`](../interfaces/ClientTransactionUser.md) | The transaction user. |

#### Overrides

ClientTransaction.constructor

#### Defined in

sip.js/lib/core/transactions/invite-client-transaction.d.ts:37

## Accessors

### request

• `get` **request**(): [`OutgoingRequestMessage`](OutgoingRequestMessage.md)

The outgoing request the transaction handling.

#### Returns

[`OutgoingRequestMessage`](OutgoingRequestMessage.md)

#### Inherited from

ClientTransaction.request

#### Defined in

sip.js/lib/core/transactions/client-transaction.d.ts:27

___

### kind

• `get` **kind**(): `string`

Transaction kind. Deprecated.

#### Returns

`string`

#### Overrides

ClientTransaction.kind

#### Defined in

sip.js/lib/core/transactions/invite-client-transaction.d.ts:43

___

### id

• `get` **id**(): `string`

Transaction id.

#### Returns

`string`

#### Inherited from

ClientTransaction.id

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:41

___

### state

• `get` **state**(): [`TransactionState`](../enums/TransactionState.md)

Transaction state.

#### Returns

[`TransactionState`](../enums/TransactionState.md)

#### Inherited from

ClientTransaction.state

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:45

___

### transport

• `get` **transport**(): [`Transport`](../interfaces/Transport.md)

Transaction transport.

#### Returns

[`Transport`](../interfaces/Transport.md)

#### Inherited from

ClientTransaction.transport

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:47

## Methods

### dispose

▸ **dispose**(): `void`

Destructor.

#### Returns

`void`

#### Overrides

[ClientTransaction](ClientTransaction.md).[dispose](ClientTransaction.md#dispose)

#### Defined in

sip.js/lib/core/transactions/invite-client-transaction.d.ts:41

___

### ackResponse

▸ **ackResponse**(`ack`): `void`

ACK a 2xx final response.

The transaction includes the ACK only if the final response was not a 2xx response (the
transaction will generate and send the ACK to the transport automagically). If the
final response was a 2xx, the ACK is not considered part of the transaction (the
transaction user needs to generate and send the ACK).

This library is not strictly RFC compliant with regard to ACK handling for 2xx final
responses. Specifically, retransmissions of ACKs to a 2xx final responses is handled
by the transaction layer (instead of the UAC core). The "standard" approach is for
the UAC core to receive all 2xx responses and manage sending ACK retransmissions to
the transport directly. Herein the transaction layer manages sending ACKs to 2xx responses
and any retransmissions of those ACKs as needed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ack` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) | The outgoing ACK request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/transactions/invite-client-transaction.d.ts:61

___

### receiveResponse

▸ **receiveResponse**(`response`): `void`

Handler for incoming responses from the transport which match this transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | [`IncomingResponseMessage`](IncomingResponseMessage.md) | The incoming response. |

#### Returns

`void`

#### Overrides

[ClientTransaction](ClientTransaction.md).[receiveResponse](ClientTransaction.md#receiveresponse)

#### Defined in

sip.js/lib/core/transactions/invite-client-transaction.d.ts:66

___

### addStateChangeListener

▸ **addStateChangeListener**(`listener`, `options?`): `void`

Sets up a function that will be called whenever the transaction state changes.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `listener` | () => `void` | Callback function. |
| `options?` | `Object` | An options object that specifies characteristics about the listener.                  If once true, indicates that the listener should be invoked at most once after being added.                  If once true, the listener would be automatically removed when invoked. |
| `options.once?` | `boolean` | - |

#### Returns

`void`

#### Inherited from

[ClientTransaction](ClientTransaction.md).[addStateChangeListener](ClientTransaction.md#addstatechangelistener)

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:55

___

### notifyStateChangeListeners

▸ **notifyStateChangeListeners**(): `void`

This is currently public so tests may spy on it.

**`internal`**

#### Returns

`void`

#### Inherited from

[ClientTransaction](ClientTransaction.md).[notifyStateChangeListeners](ClientTransaction.md#notifystatechangelisteners)

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:62

___

### removeStateChangeListener

▸ **removeStateChangeListener**(`listener`): `void`

Removes a listener previously registered with addStateListener.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `listener` | () => `void` | Callback function. |

#### Returns

`void`

#### Inherited from

[ClientTransaction](ClientTransaction.md).[removeStateChangeListener](ClientTransaction.md#removestatechangelistener)

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:67
