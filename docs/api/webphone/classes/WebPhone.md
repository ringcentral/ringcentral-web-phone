[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / WebPhone

# Class: WebPhone

WebPhone class to initiate WebRTC calls

## Table of contents

### Properties

- [uuid](WebPhone.md#uuid)
- [delay](WebPhone.md#delay)
- [extend](WebPhone.md#extend)
- [MediaStreams](WebPhone.md#mediastreams)
- [MediaStreamsImpl](WebPhone.md#mediastreamsimpl)
- [sipInfo](WebPhone.md#sipinfo)
- [uuidKey](WebPhone.md#uuidkey)
- [appName](WebPhone.md#appname)
- [appVersion](WebPhone.md#appversion)
- [userAgent](WebPhone.md#useragent)

### Constructors

- [constructor](WebPhone.md#constructor)

## Properties

### uuid

▪ `Static` **uuid**: () => `string` = `uuid`

#### Type declaration

▸ (): `string`

Utility function to generate uuid

##### Returns

`string`

#### Defined in

[src/index.ts:285](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L285)

___

### delay

▪ `Static` **delay**: (`ms`: `number`) => `Promise`<`any`\> = `delay`

#### Type declaration

▸ (`ms`): `Promise`<`any`\>

Utility function to generate delay

##### Parameters

| Name | Type |
| :------ | :------ |
| `ms` | `number` |

##### Returns

`Promise`<`any`\>

#### Defined in

[src/index.ts:287](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L287)

___

### extend

▪ `Static` **extend**: (`dst`: `any`, `src`: `any`) => `any` = `extend`

#### Type declaration

▸ (`dst?`, `src?`): `any`

Utility function to extend object

##### Parameters

| Name | Type |
| :------ | :------ |
| `dst` | `any` |
| `src` | `any` |

##### Returns

`any`

#### Defined in

[src/index.ts:289](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L289)

___

### MediaStreams

▪ `Static` **MediaStreams**: typeof [`MediaStreams`](MediaStreams.md) = `MediaStreams`

#### Defined in

[src/index.ts:290](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L290)

___

### MediaStreamsImpl

▪ `Static` **MediaStreamsImpl**: typeof [`MediaStreamsImpl`](MediaStreamsImpl.md) = `MediaStreamsImpl`

#### Defined in

[src/index.ts:291](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L291)

___

### sipInfo

• **sipInfo**: [`SipInfo`](../interfaces/SipInfo.md)

Sip Info recieved from the registeration endpoint

#### Defined in

[src/index.ts:294](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L294)

___

### uuidKey

• **uuidKey**: `string`

Key that will be used to save uuid in localStorage

#### Defined in

[src/index.ts:296](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L296)

___

### appName

• **appName**: `string`

Name used in user agent string

#### Defined in

[src/index.ts:298](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L298)

___

### appVersion

• **appVersion**: `string`

Version used in user agent string

#### Defined in

[src/index.ts:300](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L300)

___

### userAgent

• **userAgent**: [`WebPhoneUserAgent`](../interfaces/WebPhoneUserAgent.md)

WebPhoneUserAgent instance

#### Defined in

[src/index.ts:302](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L302)

## Constructors

### constructor

• **new WebPhone**(`registrationData?`, `options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `registrationData` | [`WebPhoneRegistrationData`](../interfaces/WebPhoneRegistrationData.md) |  |
| `options` | [`WebPhoneOptions`](../interfaces/WebPhoneOptions.md) | Creates a new instance of WebPhoneSession that can be used to make and recieve WebRTC calls |

#### Defined in

[src/index.ts:313](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L313)
