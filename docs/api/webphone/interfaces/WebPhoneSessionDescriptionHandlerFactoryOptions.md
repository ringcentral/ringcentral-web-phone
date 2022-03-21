[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / WebPhoneSessionDescriptionHandlerFactoryOptions

# Interface: WebPhoneSessionDescriptionHandlerFactoryOptions

Extension of SessionDescriptionHandlerFactoryOptions with additional options

## Hierarchy

- `SessionDescriptionHandlerFactoryOptions`

  ↳ **`WebPhoneSessionDescriptionHandlerFactoryOptions`**

## Table of contents

### Properties

- [iceGatheringTimeout](WebPhoneSessionDescriptionHandlerFactoryOptions.md#icegatheringtimeout)
- [peerConnectionConfiguration](WebPhoneSessionDescriptionHandlerFactoryOptions.md#peerconnectionconfiguration)
- [enableDscp](WebPhoneSessionDescriptionHandlerFactoryOptions.md#enabledscp)

## Properties

### iceGatheringTimeout

• `Optional` **iceGatheringTimeout**: `number`

The maximum duration to wait in ms for ICE gathering to complete.
If undefined, implementation dependent.
If zero, no timeout.

#### Inherited from

SessionDescriptionHandlerFactoryOptions.iceGatheringTimeout

#### Defined in

node_modules/sip.js/lib/platform/web/session-description-handler/session-description-handler-configuration.d.ts:11

___

### peerConnectionConfiguration

• `Optional` **peerConnectionConfiguration**: `RTCConfiguration`

Peer connection options.

#### Inherited from

SessionDescriptionHandlerFactoryOptions.peerConnectionConfiguration

#### Defined in

node_modules/sip.js/lib/platform/web/session-description-handler/session-description-handler-configuration.d.ts:15

___

### enableDscp

• `Optional` **enableDscp**: `boolean`

Enable DSCP by setting packet priority in SDP

#### Defined in

[src/sessionDescriptionHandler.ts:30](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/sessionDescriptionHandler.ts#L30)
