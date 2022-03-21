[SIP.js](../README.md) / [Exports](../modules.md) / DigestAuthentication

# Class: DigestAuthentication

Digest Authentication.

**`internal`**

## Table of contents

### Constructors

- [constructor](DigestAuthentication.md#constructor)

### Properties

- [stale](DigestAuthentication.md#stale)

### Methods

- [authenticate](DigestAuthentication.md#authenticate)
- [toString](DigestAuthentication.md#tostring)

## Constructors

### constructor

• **new DigestAuthentication**(`loggerFactory`, `ha1`, `username`, `password`)

Constructor.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `loggerFactory` | [`LoggerFactory`](LoggerFactory.md) | LoggerFactory. |
| `ha1` | `string` | - |
| `username` | `string` | Username. |
| `password` | `string` | Password. |

#### Defined in

sip.js/lib/core/messages/digest-authentication.d.ts:30

## Properties

### stale

• **stale**: `boolean`

#### Defined in

sip.js/lib/core/messages/digest-authentication.d.ts:8

## Methods

### authenticate

▸ **authenticate**(`request`, `challenge`, `body?`): `boolean`

Performs Digest authentication given a SIP request and the challenge
received in a response to that request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `request` | [`OutgoingRequestMessage`](OutgoingRequestMessage.md) | - |
| `challenge` | `any` | - |
| `body?` | `string` | - |

#### Returns

`boolean`

true if credentials were successfully generated, false otherwise.

#### Defined in

sip.js/lib/core/messages/digest-authentication.d.ts:38

___

### toString

▸ **toString**(): `string`

Return the Proxy-Authorization or WWW-Authorization header value.

#### Returns

`string`

#### Defined in

sip.js/lib/core/messages/digest-authentication.d.ts:42
