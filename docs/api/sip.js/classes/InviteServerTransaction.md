[SIP.js](../README.md) / [Exports](../modules.md) / InviteServerTransaction

# Class: InviteServerTransaction

INVITE Server Transaction.

**`remarks`**
https://tools.ietf.org/html/rfc3261#section-17.2.1

## Hierarchy

- [`ServerTransaction`](ServerTransaction.md)

  ↳ **`InviteServerTransaction`**

## Table of contents

### Constructors

- [constructor](InviteServerTransaction.md#constructor)

### Methods

- [dispose](InviteServerTransaction.md#dispose)
- [receiveRequest](InviteServerTransaction.md#receiverequest)
- [receiveResponse](InviteServerTransaction.md#receiveresponse)
- [retransmitAcceptedResponse](InviteServerTransaction.md#retransmitacceptedresponse)
- [addStateChangeListener](InviteServerTransaction.md#addstatechangelistener)
- [notifyStateChangeListeners](InviteServerTransaction.md#notifystatechangelisteners)
- [removeStateChangeListener](InviteServerTransaction.md#removestatechangelistener)

### Accessors

- [kind](InviteServerTransaction.md#kind)
- [request](InviteServerTransaction.md#request)
- [id](InviteServerTransaction.md#id)
- [state](InviteServerTransaction.md#state)
- [transport](InviteServerTransaction.md#transport)

## Constructors

### constructor

• **new InviteServerTransaction**(`request`, `transport`, `user`)

Constructor.
Upon construction, a "100 Trying" reply will be immediately sent.
After construction the transaction will be in the "proceeding" state and the transaction
`id` will equal the branch parameter set in the Via header of the incoming request.
https://tools.ietf.org/html/rfc3261#section-17.2.1

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingRequestMessage`](IncomingRequestMessage.md) | Incoming INVITE request from the transport. |
| `transport` | [`Transport`](../interfaces/Transport.md) | The transport. |
| `user` | [`ServerTransactionUser`](../interfaces/ServerTransactionUser.md) | The transaction user. |

#### Overrides

ServerTransaction.constructor

#### Defined in

sip.js/lib/core/transactions/invite-server-transaction.d.ts:46

## Methods

### dispose

▸ **dispose**(): `void`

Destructor.

#### Returns

`void`

#### Overrides

[ServerTransaction](ServerTransaction.md).[dispose](ServerTransaction.md#dispose)

#### Defined in

sip.js/lib/core/transactions/invite-server-transaction.d.ts:50

___

### receiveRequest

▸ **receiveRequest**(`request`): `void`

Receive requests from transport matching this transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`IncomingRequestMessage`](IncomingRequestMessage.md) | Request matching this transaction. |

#### Returns

`void`

#### Overrides

[ServerTransaction](ServerTransaction.md).[receiveRequest](ServerTransaction.md#receiverequest)

#### Defined in

sip.js/lib/core/transactions/invite-server-transaction.d.ts:57

___

### receiveResponse

▸ **receiveResponse**(`statusCode`, `response`): `void`

Receive responses from TU for this transaction.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `statusCode` | `number` | Status code of response. |
| `response` | `string` | Response. |

#### Returns

`void`

#### Overrides

[ServerTransaction](ServerTransaction.md).[receiveResponse](ServerTransaction.md#receiveresponse)

#### Defined in

sip.js/lib/core/transactions/invite-server-transaction.d.ts:63

___

### retransmitAcceptedResponse

▸ **retransmitAcceptedResponse**(): `void`

Retransmit the last 2xx response. This is a noop if not in the "accepted" state.

#### Returns

`void`

#### Defined in

sip.js/lib/core/transactions/invite-server-transaction.d.ts:67

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

[ServerTransaction](ServerTransaction.md).[addStateChangeListener](ServerTransaction.md#addstatechangelistener)

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

[ServerTransaction](ServerTransaction.md).[notifyStateChangeListeners](ServerTransaction.md#notifystatechangelisteners)

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

[ServerTransaction](ServerTransaction.md).[removeStateChangeListener](ServerTransaction.md#removestatechangelistener)

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:67

## Accessors

### kind

• `get` **kind**(): `string`

Transaction kind. Deprecated.

#### Returns

`string`

#### Overrides

ServerTransaction.kind

#### Defined in

sip.js/lib/core/transactions/invite-server-transaction.d.ts:52

___

### request

• `get` **request**(): [`IncomingRequestMessage`](IncomingRequestMessage.md)

The incoming request the transaction handling.

#### Returns

[`IncomingRequestMessage`](IncomingRequestMessage.md)

#### Inherited from

ServerTransaction.request

#### Defined in

sip.js/lib/core/transactions/server-transaction.d.ts:22

___

### id

• `get` **id**(): `string`

Transaction id.

#### Returns

`string`

#### Inherited from

ServerTransaction.id

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:41

___

### state

• `get` **state**(): [`TransactionState`](../enums/TransactionState.md)

Transaction state.

#### Returns

[`TransactionState`](../enums/TransactionState.md)

#### Inherited from

ServerTransaction.state

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:45

___

### transport

• `get` **transport**(): [`Transport`](../interfaces/Transport.md)

Transaction transport.

#### Returns

[`Transport`](../interfaces/Transport.md)

#### Inherited from

ServerTransaction.transport

#### Defined in

sip.js/lib/core/transactions/transaction.d.ts:47
