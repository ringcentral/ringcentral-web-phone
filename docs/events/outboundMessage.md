# callSession.on(`outboundMessage`, callback)

Registers a callback function that will be invoked whenever a SIP message is
sent from the client to the server.

The outboundMessage event allows developers to observe all outbound SIP traffic
generated by the SDK. This includes SIP methods like INVITE, ACK, BYE, CANCEL,
INFO, MESSAGE, and others sent during the lifecycle of a SIP session.

This event is primarily useful for debugging, logging, or implementing custom
behavior based on outbound signaling.

## Callback Parameters

| Parameter         | Description                                      |
| ----------------- | ------------------------------------------------ |
| `message`         | An object representing the outbound SIP message. |
| `message.method`  | The SIP method used (e.g., 'INVITE', 'BYE')      |
| `message.uri`     | The target URI of the message                    |
| `message.headers` | SIP headers                                      |
| `message.body`    | Optional SIP message body (e.g., SDP)            |

## Usage Example

```js
sipClient.on("outboundMessage", (message) => {
  console.log("Outbound SIP message:", message.method, message.uri);
  // Optionally inspect headers or modify logging
});
```

## Notes

- This event provides visibility into low-level SIP operations but does not
  allow modification of the message before it is sent.

- When the SDK is initialized with
  [debugging enabled](../get-started/instances.md#turning-on-debug-mode),
  outbound messages may also be logged to the console automatically.
