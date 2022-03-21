[SIP.js](../README.md) / [Exports](../modules.md) / IncomingRequestDelegate

# Interface: IncomingRequestDelegate

Delegate providing custom handling of incoming requests.

## Table of contents

### Methods

- [onCancel](IncomingRequestDelegate.md#oncancel)
- [onTransportError](IncomingRequestDelegate.md#ontransporterror)

## Methods

### onCancel

▸ `Optional` **onCancel**(`message`): `void`

Receive CANCEL request.
https://tools.ietf.org/html/rfc3261#section-9.2
Note: Currently CANCEL is being handled as a special case.
No UAS is created to handle the CANCEL and the response to
it CANCEL is being handled statelessly by the user agent core.
As such, there is currently no way to externally impact the
response to the a CANCEL request and thus the method here is
receiving a "message" (as apposed to a "uas").

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | [`IncomingRequestMessage`](../classes/IncomingRequestMessage.md) | Incoming CANCEL request message. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/messages/incoming-request.d.ts:61

___

### onTransportError

▸ `Optional` **onTransportError**(`error`): `void`

A transport error occurred attempted to send a response.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error` | [`TransportError`](../classes/TransportError.md) | Transport error. |

#### Returns

`void`

#### Defined in

sip.js/lib/core/messages/incoming-request.d.ts:66
