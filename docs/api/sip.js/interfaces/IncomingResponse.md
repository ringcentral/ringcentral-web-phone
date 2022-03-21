[SIP.js](../README.md) / [Exports](../modules.md) / IncomingResponse

# Interface: IncomingResponse

A SIP message sent from a remote server to a local client.

**`remarks`**
For indicating the status of a request sent from the client to the server.
https://tools.ietf.org/html/rfc3261#section-7.2

## Hierarchy

- **`IncomingResponse`**

  ↳ [`IncomingByeResponse`](IncomingByeResponse.md)

  ↳ [`IncomingCancelResponse`](IncomingCancelResponse.md)

  ↳ [`IncomingInfoResponse`](IncomingInfoResponse.md)

  ↳ [`AckableIncomingResponseWithSession`](AckableIncomingResponseWithSession.md)

  ↳ [`PrackableIncomingResponseWithSession`](PrackableIncomingResponseWithSession.md)

  ↳ [`IncomingMessageResponse`](IncomingMessageResponse.md)

  ↳ [`IncomingNotifyResponse`](IncomingNotifyResponse.md)

  ↳ [`IncomingPrackResponse`](IncomingPrackResponse.md)

  ↳ [`IncomingPublishResponse`](IncomingPublishResponse.md)

  ↳ [`IncomingReferResponse`](IncomingReferResponse.md)

  ↳ [`IncomingRegisterResponse`](IncomingRegisterResponse.md)

  ↳ [`IncomingSubscribeResponse`](IncomingSubscribeResponse.md)

## Table of contents

### Properties

- [message](IncomingResponse.md#message)

## Properties

### message

• `Readonly` **message**: [`IncomingResponseMessage`](../classes/IncomingResponseMessage.md)

The incoming message.

#### Defined in

sip.js/lib/core/messages/incoming-response.d.ts:11
