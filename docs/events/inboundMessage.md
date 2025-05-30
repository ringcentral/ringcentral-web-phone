# callSession.on(`inboundMessage`, callback)

Registers a callback function to be invoked when a new inbound SIP message is
received over the WebSocket connection.

The inboundMessage event is emitted whenever the SIP client receives an inbound
SIP message from the server. This includes various SIP methods such as INVITE,
BYE, CANCEL, INFO, NOTIFY, and MESSAGE.

This event provides access to the raw SIP message, allowing developers to handle
custom SIP interactions or monitor SIP traffic for debugging and analytics
purposes.

## Callback Parameters

The callback function receives a single parameter:

| Parameter | Type             | Description                                                                                               |
| --------- | ---------------- | --------------------------------------------------------------------------------------------------------- |
| `message` | `InboundMessage` | An object representing the inbound SIP message, containing properties such as subject, headers, and body. |

## Usage Example

```js
sipClient.on("inboundMessage", (message) => {
  console.log("Received SIP message:", message.subject);
  // Custom handling based on message type
  if (message.subject.startsWith("MESSAGE sip:")) {
    // Handle SIP MESSAGE
  }
});
```

## Notes

- **Automatic 200 OK Responses**: For certain SIP methods (MESSAGE, BYE, CANCEL,
  INFO, and NOTIFY), the SIP client automatically sends a 200 OK response upon
  receiving the message. This behavior ensures compliance with SIP protocol
  expectations and reduces the need for manual acknowledgment.

- **Message Filtering**: The SIP client includes logic to filter out messages
  not intended for the current instance, based on the `Cln` (Client ID) field in
  the message body. If the `Cln` does not match the client's authorization ID,
  the message is ignored.

- **Debugging**: If the SIP client is initialized with
  [debugging enabled](../get-started/instances.md#turning-on-debug-mode) (debug:
  true), incoming messages are logged to the console, providing visibility into
  SIP traffic for troubleshooting purposes.
