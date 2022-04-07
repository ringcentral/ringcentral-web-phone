[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / WebPhoneEvents

# Interface: WebPhoneEvents

## Table of contents

### Properties

- [Transport](WebPhoneEvents.md#transport)
- [UserAgent](WebPhoneEvents.md#useragent)
- [Session](WebPhoneEvents.md#session)

## Properties

### Transport

• **Transport**: `Object`

All WebPhone events related to Transport

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `Connecting` | `string` | Fired when Transport is connecting. |
| `Connected` | `string` | Fired when Transport is connected. |
| `Disconnecting` | `string` | Fired when Transport is disconnecting. |
| `Disconnected` | `string` | Fired when Transport is disconnected. |
| `ConnectionAttemptFailure` | `string` | Fired everytime a transport connection attempt fails. |
| `ConnectionFailure` | `string` | Fired when maxReconnectionAttempts have exhausted trying to connect to one server or sip error is returned from the server. |
| `SwitchBackToMainProxy` | `string` | Fired when client should initiate connection back to main proxy. |
| `Closed` | `string` | Fired when maxReconnectionAttempts have exhausted trying to connect to one server or sip error is returned from the server. |

#### Defined in

[src/events.ts:3](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/events.ts#L3)

___

### UserAgent

• **UserAgent**: `Object`

All WebPhone events related to UserAgen

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `Registrerd` | `string` | Fired when UserAgent is registered with the registerer. |
| `Unregistrerd` | `string` | Fired when UserAgent is unregistered from the registerer. |
| `InviteSent` | `string` | Fired when Invite is sent. |
| `Invite` | `string` | Fired when Invitation is received. |
| `ProvisionUpdate` | `string` | Fired when provisionUpdate notification is received. |
| `Started` | `string` | Fired when UserAgent is started. |
| `Stopped` | `string` | Fired when UserAgent is stopped. |

#### Defined in

[src/events.ts:22](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/events.ts#L22)

___

### Session

• **Session**: `Object`

All WebPhone events related to Session

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `Muted` | `string` | Fired when session is muted. |
| `Unmuted` | `string` | Fired when session is unmuted. |
| `Establishing` | `string` | Fired when session is established |
| `Established` | `string` | Fired when session is established |
| `Terminating` | `string` | Fired when session is terminating |
| `Terminated` | `string` | Fired when session is terminated |
| `UpdateReceived` | `string` | Fired when UPDATE request is recieved over socket |
| `MoveToRcv` | `string` | Fired when INFO request is recieved over socket with move to rcv instruction |
| `QOSPublished` | `string` | Fired when QOS is pulished to the backend server |
| `RTPStat` | `string` | Fired when RTP Stat Report is generted |

#### Defined in

[src/events.ts:39](https://github.com/nerdchacha/ringcentral-web-phone/blob/ee23853/src/events.ts#L39)
