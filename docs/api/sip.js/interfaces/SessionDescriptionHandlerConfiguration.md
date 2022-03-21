[SIP.js](../README.md) / [Exports](../modules.md) / SessionDescriptionHandlerConfiguration

# Interface: SessionDescriptionHandlerConfiguration

Configuration for SessionDescriptionHandler.

## Table of contents

### Properties

- [iceGatheringTimeout](SessionDescriptionHandlerConfiguration.md#icegatheringtimeout)
- [peerConnectionConfiguration](SessionDescriptionHandlerConfiguration.md#peerconnectionconfiguration)

## Properties

### iceGatheringTimeout

• `Optional` **iceGatheringTimeout**: `number`

The maximum duration to wait in ms for ICE gathering to complete.
If undefined, implementation dependent.
If zero, no timeout.

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler-configuration.d.ts:11

___

### peerConnectionConfiguration

• `Optional` **peerConnectionConfiguration**: `RTCConfiguration`

Peer connection options.

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler-configuration.d.ts:15
