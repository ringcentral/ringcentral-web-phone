[SIP.js](../README.md) / [Exports](../modules.md) / ClientTransaction

# Class: ClientTransaction

Client Transaction.

**`remarks`**
The client transaction provides its functionality through the
maintenance of a state machine.

The TU communicates with the client transaction through a simple
interface.  When the TU wishes to initiate a new transaction, it
creates a client transaction and passes it the SIP request to send
and an IP address, port, and transport to which to send it.  The
client transaction begins execution of its state machine.  Valid
responses are passed up to the TU from the client transaction.
https://tools.ietf.org/html/rfc3261#section-17.1

## Hierarchy

- [`Transaction`](Transaction.md)

  ↳ **`ClientTransaction`**

  ↳↳ [`InviteClientTransaction`](InviteClientTransaction.md)

  ↳↳ [`NonInviteClientTransaction`](NonInviteClientTransaction.md)

## Table of contents

### Accessors

- [request](ClientTransaction.md#request)
- [id](ClientTransaction.md#id)
- [kind](ClientTransaction.md#kind)
- [state](ClientTransaction.md#state)
- [transport](ClientTransaction.md#transport)

### Methods

- [receiveResponse](ClientTransaction.md#receiveresponse)
- [dispose](ClientTransaction.md#dispose)
- [addStateChangeListener](ClientTransaction.md#addstatechangelistener)
- [notifyStateChangeListeners](ClientTransaction.md#notifystatechangelisteners)
- [removeStateChangeListener](ClientTransaction.md#removestatechangelistener)

## Accessors

### request

• `get` **request**(): [`OutgoingRequestMessage`](OutgoingRequestMessage.md)

The outgoing request the transaction handling.

#### Returns

[`OutgoingRequestMessage`](OutgoingRequestMessage.md)

#### Defined in

sip.js/lib/core/transactions/client-transaction.d.ts:27

___

### id

• `get` **id**(): `string`

Transaction id.

#### Returns

`string`

#### Inherited from

Transaction.id

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:41

___

### kind

• `get` **kind**(): `string`

Transaction kind. Deprecated.

#### Returns

`string`

#### Inherited from

Transaction.kind

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:43

___

### state

• `get` **state**(): [`TransactionState`](../enums/TransactionState.md)

Transaction state.

#### Returns

[`TransactionState`](../enums/TransactionState.md)

#### Inherited from

Transaction.state

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:45

___

### transport

• `get` **transport**(): [`Transport`](../interfaces/Transport.md)

Transaction transport.

#### Returns

[`Transport`](../interfaces/Transport.md)

#### Inherited from

Transaction.transport

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:47

## Methods

### receiveResponse

▸ `Abstract` **receiveResponse**(`response`): `void`

Receive incoming responses from the transport which match this transaction.
Responses will be delivered to the transaction user as necessary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `response` | [`IncomingResponseMessage`](IncomingResponseMessage.md) | The incoming response. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/transactions/client-transaction.d.ts:44

___

### dispose

▸ **dispose**(): `void`

Destructor.
Once the transaction is in the "terminated" state, it is destroyed
immediately and there is no need to call `dispose`. However, if a
transaction needs to be ended prematurely, the transaction user may
do so by calling this method (for example, perhaps the UA is shutting down).
No state transition will occur upon calling this method, all outstanding
transmission timers will be cancelled, and use of the transaction after
calling `dispose` is undefined.

#### Returns

`void`

#### Inherited from

[Transaction](Transaction.md).[dispose](Transaction.md#dispose)

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:39

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

[Transaction](Transaction.md).[addStateChangeListener](Transaction.md#addstatechangelistener)

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

[Transaction](Transaction.md).[notifyStateChangeListeners](Transaction.md#notifystatechangelisteners)

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

[Transaction](Transaction.md).[removeStateChangeListener](Transaction.md#removestatechangelistener)

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:67
