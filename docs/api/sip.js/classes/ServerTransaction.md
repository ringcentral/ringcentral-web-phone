[SIP.js](../README.md) / [Exports](../modules.md) / ServerTransaction

# Class: ServerTransaction

Server Transaction.

**`remarks`**
The server transaction is responsible for the delivery of requests to
the TU and the reliable transmission of responses.  It accomplishes
this through a state machine.  Server transactions are created by the
core when a request is received, and transaction handling is desired
for that request (this is not always the case).
https://tools.ietf.org/html/rfc3261#section-17.2

## Hierarchy

- [`Transaction`](Transaction.md)

  ↳ **`ServerTransaction`**

  ↳↳ [`InviteServerTransaction`](InviteServerTransaction.md)

  ↳↳ [`NonInviteServerTransaction`](NonInviteServerTransaction.md)

## Table of contents

### Accessors

- [request](ServerTransaction.md#request)
- [id](ServerTransaction.md#id)
- [kind](ServerTransaction.md#kind)
- [state](ServerTransaction.md#state)
- [transport](ServerTransaction.md#transport)

### Methods

- [receiveRequest](ServerTransaction.md#receiverequest)
- [receiveResponse](ServerTransaction.md#receiveresponse)
- [dispose](ServerTransaction.md#dispose)
- [addStateChangeListener](ServerTransaction.md#addstatechangelistener)
- [notifyStateChangeListeners](ServerTransaction.md#notifystatechangelisteners)
- [removeStateChangeListener](ServerTransaction.md#removestatechangelistener)

## Accessors

### request

• `get` **request**(): [`IncomingRequestMessage`](IncomingRequestMessage.md)

The incoming request the transaction handling.

#### Returns

[`IncomingRequestMessage`](IncomingRequestMessage.md)

#### Defined in

sip.js/lib/core/transactions/server-transaction.d.ts:22

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

### receiveRequest

▸ `Abstract` **receiveRequest**(`request`): `void`

Receive incoming requests from the transport which match this transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingRequestMessage`](IncomingRequestMessage.md) | The incoming request. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/transactions/server-transaction.d.ts:27

___

### receiveResponse

▸ `Abstract` **receiveResponse**(`statusCode`, `response`): `void`

Receive outgoing responses to this request from the transaction user.
Responses will be delivered to the transport as necessary.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `statusCode` | `number` | Response status code. |
| `response` | `string` | Response. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/transactions/server-transaction.d.ts:34

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
