[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / WebPhoneSessionDescriptionHandlerConfiguration

# Interface: WebPhoneSessionDescriptionHandlerConfiguration

Extension of SessionDescriptionHandlerConfiguration with additional options

## Hierarchy

- `SessionDescriptionHandlerConfiguration`

  ↳ **`WebPhoneSessionDescriptionHandlerConfiguration`**

## Table of contents

### Properties

- [iceGatheringTimeout](WebPhoneSessionDescriptionHandlerConfiguration.md#icegatheringtimeout)
- [peerConnectionConfiguration](WebPhoneSessionDescriptionHandlerConfiguration.md#peerconnectionconfiguration)
- [enableDscp](WebPhoneSessionDescriptionHandlerConfiguration.md#enabledscp)

## Properties

### iceGatheringTimeout

• `Optional` **iceGatheringTimeout**: `number`

The maximum duration to wait in ms for ICE gathering to complete.
If undefined, implementation dependent.
If zero, no timeout.

#### Inherited from

SessionDescriptionHandlerConfiguration.iceGatheringTimeout

#### Defined in

node_modules/sip.js/lib/platform/web/session-description-handler/session-description-handler-configuration.d.ts:11

___

### peerConnectionConfiguration

• `Optional` **peerConnectionConfiguration**: `RTCConfiguration`

Peer connection options.

#### Inherited from

SessionDescriptionHandlerConfiguration.peerConnectionConfiguration

#### Defined in

node_modules/sip.js/lib/platform/web/session-description-handler/session-description-handler-configuration.d.ts:15

___

### enableDscp

• `Optional` **enableDscp**: `boolean`

Enable DSCP by setting packet priority in SDP

#### Defined in

[src/sessionDescriptionHandler.ts:22](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/sessionDescriptionHandler.ts#L22)
