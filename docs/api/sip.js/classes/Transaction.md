[SIP.js](../README.md) / [Exports](../modules.md) / Transaction

# Class: Transaction

Transaction.

**`remarks`**
SIP is a transactional protocol: interactions between components take
place in a series of independent message exchanges.  Specifically, a
SIP transaction consists of a single request and any responses to
that request, which include zero or more provisional responses and
one or more final responses.  In the case of a transaction where the
request was an INVITE (known as an INVITE transaction), the
transaction also includes the ACK only if the final response was not
a 2xx response.  If the response was a 2xx, the ACK is not considered
part of the transaction.
https://tools.ietf.org/html/rfc3261#section-17

## Hierarchy

- **`Transaction`**

  ↳ [`ClientTransaction`](ClientTransaction.md)

  ↳ [`ServerTransaction`](ServerTransaction.md)

## Table of contents

### Methods

- [dispose](Transaction.md#dispose)
- [addStateChangeListener](Transaction.md#addstatechangelistener)
- [notifyStateChangeListeners](Transaction.md#notifystatechangelisteners)
- [removeStateChangeListener](Transaction.md#removestatechangelistener)

### Accessors

- [id](Transaction.md#id)
- [kind](Transaction.md#kind)
- [state](Transaction.md#state)
- [transport](Transaction.md#transport)

## Methods

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

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:55

___

### notifyStateChangeListeners

▸ **notifyStateChangeListeners**(): `void`

This is currently public so tests may spy on it.

**`internal`**

#### Returns

`void`

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

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:67

## Accessors

### id

• `get` **id**(): `string`

Transaction id.

#### Returns

`string`

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:41

___

### kind

• `get` **kind**(): `string`

Transaction kind. Deprecated.

#### Returns

`string`

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:43

___

### state

• `get` **state**(): [`TransactionState`](../enums/TransactionState.md)

Transaction state.

#### Returns

[`TransactionState`](../enums/TransactionState.md)

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:45

___

### transport

• `get` **transport**(): [`Transport`](../interfaces/Transport.md)

Transaction transport.

#### Returns

[`Transport`](../interfaces/Transport.md)

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:47
