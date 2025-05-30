# webPhone.on('outboundCall', callback)

When the `outboundCall` event is triggered, you will receive as input an
outbound call session. You may invoke any number of
[call session methods](../reference/index.md#call-session-methods) as well as a
few others listed below.

Truth be told, there is very little reason to subscribe to this event, as when a
call is [made](../reference/call.md), the outbound call session is returned from
that method.

## Sample

**Explicit event subscription**

```ts
webPhone.on("outboundCall", (outboundCall: OutboundCallSession) => {
  // do something with the inbound call
});
```

**When placing a call**

```ts
const callSession = await webPhone.call(callee, callerId);
```

## Properties

| Property     | Description                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------- |
| `sipMessage` | The message that triggered the event. You do not typically need to access this property directly. |
| `localPeer`  | The user's device and connection.                                                                 |
| `remotePeer` | The remote user's device and connection.                                                          |
| `direction`  | Always equal to "outbound."                                                                       |
| `state`      | The current state of the call. Either: init, ringing, answered, or disposed                       |

## Methods

| Method           | Description                                               |
| ---------------- | --------------------------------------------------------- |
| `callId()`       | The current call ID.                                      |
| `sessionId()`    | The telephony session ID.                                 |
| `partyId()`      | The ID of the remote party.                               |
| `remoteNumber()` | The remote number connected to.                           |
| `localNumber()`  | The local number.                                         |
| `isConference()` | Boolean. `true` if the current call is a conference call. |
