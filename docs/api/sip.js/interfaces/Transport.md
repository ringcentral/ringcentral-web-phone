[SIP.js](../README.md) / [Exports](../modules.md) / Transport

# Interface: Transport

Transport layer interface expected by the user agent core.

**`remarks`**
The transport layer is responsible for the actual transmission of
requests and responses over network transports.  This includes
determination of the connection to use for a request or response in
the case of connection-oriented transports.
https://tools.ietf.org/html/rfc3261#section-18

## Hierarchy

- **`Transport`**

  ↳ [`Transport`](Transport.md)

## Table of contents

### Properties

- [protocol](Transport.md#protocol)

### Methods

- [send](Transport.md#send)

## Properties

### protocol

• `Readonly` **protocol**: `string`

The transport protocol.

**`remarks`**
Formatted as defined for the Via header sent-protocol transport.
https://tools.ietf.org/html/rfc3261#section-20.42

#### Defined in

sip.js/lib/core/transport.d.ts:21

## Methods

### send

▸ **send**(`message`): `Promise`<`void`\>

Send a message.

**`remarks`**
Resolves once message is sent. Otherwise rejects with an Error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | Message to send. |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/core/transport.d.ts:30
