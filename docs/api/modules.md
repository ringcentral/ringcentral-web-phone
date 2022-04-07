[RingCentral Webphone SDK - v0.9.0](README.md) / Exports

# RingCentral Webphone SDK - v0.9.0

## Table of contents

### Interfaces

- [DomAudio](interfaces/DomAudio.md)
- [AudioHelperOptions](interfaces/AudioHelperOptions.md)
- [WebPhoneEvents](interfaces/WebPhoneEvents.md)
- [WebPhoneRegistrationData](interfaces/WebPhoneRegistrationData.md)
- [SipInfo](interfaces/SipInfo.md)
- [WebPhoneOptions](interfaces/WebPhoneOptions.md)
- [RTPReport](interfaces/RTPReport.md)
- [RCHeaders](interfaces/RCHeaders.md)
- [ReplyOptions](interfaces/ReplyOptions.md)
- [RTCPeerConnectionLegacy](interfaces/RTCPeerConnectionLegacy.md)
- [WebPhoneInvitation](interfaces/WebPhoneInvitation.md)
- [WebPhoneInviter](interfaces/WebPhoneInviter.md)
- [WebPhoneSessionDescriptionHandlerConfiguration](interfaces/WebPhoneSessionDescriptionHandlerConfiguration.md)
- [WebPhoneSessionDescriptionHandlerFactoryOptions](interfaces/WebPhoneSessionDescriptionHandlerFactoryOptions.md)
- [WebPhoneTransport](interfaces/WebPhoneTransport.md)
- [ActiveCallInfo](interfaces/ActiveCallInfo.md)
- [WebPhoneUserAgent](interfaces/WebPhoneUserAgent.md)

### Classes

- [AudioHelper](classes/AudioHelper.md)
- [WebPhone](classes/WebPhone.md)
- [MediaStreams](classes/MediaStreams.md)
- [MediaStreamsImpl](classes/MediaStreamsImpl.md)
- [CommonSession](classes/CommonSession.md)
- [SessionDescriptionHandler](classes/SessionDescriptionHandler.md)

### Enumerations

- [Browsers](enums/Browsers.md)

### Type aliases

- [InboundRtpReport](modules.md#inboundrtpreport)
- [OutboundRtpReport](modules.md#outboundrtpreport)
- [RttReport](modules.md#rttreport)
- [WebPhoneSession](modules.md#webphonesession)

## Type aliases

### InboundRtpReport

Ƭ **InboundRtpReport**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `mediaType?` | `string` |
| `packetsReceived?` | `number` |
| `bytesReceived?` | `number` |
| `packetsLost?` | `number` |
| `jitter?` | `number` |
| `fractionLost?` | `number` |
| `roundTripTime?` | `number` |
| `rtpRemoteAudioLevel?` | `number` |

#### Defined in

[src/rtpReport.ts:10](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/rtpReport.ts#L10)

___

### OutboundRtpReport

Ƭ **OutboundRtpReport**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `mediaType?` | `string` |
| `packetsSent?` | `number` |
| `bytesSent?` | `number` |
| `rtpLocalAudioLevel?` | `number` |

#### Defined in

[src/rtpReport.ts:21](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/rtpReport.ts#L21)

___

### RttReport

Ƭ **RttReport**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `currentRoundTripTime?` | `number` |
| `roundTripTime?` | `number` |

#### Defined in

[src/rtpReport.ts:28](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/rtpReport.ts#L28)

___

### WebPhoneSession

Ƭ **WebPhoneSession**: [`WebPhoneInvitation`](interfaces/WebPhoneInvitation.md) \| [`WebPhoneInviter`](interfaces/WebPhoneInviter.md)

#### Defined in

[src/session.ts:185](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/session.ts#L185)
