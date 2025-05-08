# WebPhone SDK events

The WebPhoneSDK makes a number of events available to subscribe to. There are two categories of events:

* webPhone events
* callSession events

## Subscribing to events

Subscribing to events is done using the `on` method as shown below.

```ts
webPhone.on("inboundCall", (inboundCall: InboundCallSession) => {
  // do something with the inbound call
});
```

```ts
callSession.on("disposed", () => {
  // do something when the call session is disposed
});
```

## WebPhone events

| Event                             | Description                        |
|-----------------------------------|------------------------------------|
| [`inboundCall`](inboundCall.md)   | Triggered when a call is received. |
| [`outboundCall`](outboundCall.md) | Triggered when a call is placed.   |

## CallSession events

| Event                     | Description                          |
|---------------------------|--------------------------------------|
| [`answered`](answered.md) | Triggered when the call is answered. |
| [`disposed`](disposed.md) | For answered calls, this event is triggered when someone hangs up. For inbound calls, it is triggered if the caller hangs up or if the call is answered on another device. |
| [`inboundMessage`](inboundMessage.md) | Triggered when you receive a SIP message. |
| [`outboundMessage`](outboundMessage.md) | Triggered when a SIP message is sent. |
| [`ringing`](ringing.md) | This event does exist, but it is effectively implied by the existence of other events. |

