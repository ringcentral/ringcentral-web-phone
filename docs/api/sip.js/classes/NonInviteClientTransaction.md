[SIP.js](../README.md) / [Exports](../modules.md) / NonInviteClientTransaction

# Class: NonInviteClientTransaction

Non-INVITE Client Transaction.

**`remarks`**
Non-INVITE transactions do not make use of ACK.
They are simple request-response interactions.
https://tools.ietf.org/html/rfc3261#section-17.1.2

## Hierarchy

- [`ClientTransaction`](ClientTransaction.md)

  ↳ **`NonInviteClientTransaction`**

## Table of contents

### Constructors

- [constructor](NonInviteClientTransaction.md#constructor)

### Accessors

- [request](NonInviteClientTransaction.md#request)
- [kind](NonInviteClientTransaction.md#kind)
- [id](NonInviteClientTransaction.md#id)
- [state](NonInviteClientTransaction.md#state)
- [transport](NonInviteClientTransaction.md#transport)

### Methods

- [dispose](NonInviteClientTransaction.md#dispose)
- [receiveResponse](NonInviteClientTransaction.md#receiveresponse)
- [addStateChangeListener](NonInviteClientTransaction.md#addstatechangelistener)
- [notifyStateChangeListeners](NonInviteClientTransaction.md#notifystatechangelisteners)
- [removeStateChangeListener](NonInviteClientTransaction.md#removestatechangelistener)

## Constructors

### constructor

• **new NonInviteClientTransaction**(`request`, `transport`, `user`)

Constructor
Upon construction, the outgoing request's Via header is updated by calling `setViaHeader`.
Then `toString` is called on the outgoing request and the message is sent via the transport.
After construction the transaction will be in the "calling" state and the transaction id
will equal the branch parameter set in the Via header of the outgoing request.
https://tools.ietf.org/html/rfc3261#section-17.1.2

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) | The outgoing Non-INVITE request. |
| `transport` | [`Transport`](../interfaces/Transport.md) | The transport. |
| `user` | [`ClientTransactionUser`](../interfaces/ClientTransactionUser.md) | The transaction user. |

#### Overrides

ClientTransaction.constructor

#### Defined in

sip.js/lib/core/transactions/non-invite-client-transaction.d.ts:27

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

sip.js/lib/core/transactions/non-invite-client-transaction.d.ts:33

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

sip.js/lib/core/transactions/non-invite-client-transaction.d.ts:31

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

sip.js/lib/core/transactions/non-invite-client-transaction.d.ts:38

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
