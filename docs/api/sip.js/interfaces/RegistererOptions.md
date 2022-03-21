[SIP.js](../README.md) / [Exports](../modules.md) / RegistererOptions

# Interface: RegistererOptions

Options for [Registerer](../classes/Registerer.md) constructor.

## Table of contents

### Properties

- [expires](RegistererOptions.md#expires)
- [extraContactHeaderParams](RegistererOptions.md#extracontactheaderparams)
- [extraHeaders](RegistererOptions.md#extraheaders)
- [instanceId](RegistererOptions.md#instanceid)
- [logConfiguration](RegistererOptions.md#logconfiguration)
- [params](RegistererOptions.md#params)
- [regId](RegistererOptions.md#regid)
- [registrar](RegistererOptions.md#registrar)
- [refreshFrequency](RegistererOptions.md#refreshfrequency)

## Properties

### expires

• `Optional` **expires**: `number`

Registration expiration time in seconds.

#### Defined in

sip.js/lib/api/registerer-options.d.ts:8

___

### extraContactHeaderParams

• `Optional` **extraContactHeaderParams**: `string`[]

Array of extra Contact header parameters.

#### Defined in

sip.js/lib/api/registerer-options.d.ts:10

___

### extraHeaders

• `Optional` **extraHeaders**: `string`[]

Array of extra headers added to the REGISTER.

#### Defined in

sip.js/lib/api/registerer-options.d.ts:12

___

### instanceId

• `Optional` **instanceId**: `string`

UUID to provide with "+sip.instance" Contact parameter.

**`defaultvalue`** a randomly generated uuid

#### Defined in

sip.js/lib/api/registerer-options.d.ts:17

___

### logConfiguration

• `Optional` **logConfiguration**: `boolean`

If true, constructor logs the registerer configuration.

**`defaultvalue`** `true`

#### Defined in

sip.js/lib/api/registerer-options.d.ts:22

___

### params

• `Optional` **params**: `Object`

**`deprecated`** TODO: provide alternative.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fromDisplayName?` | `string` |
| `fromTag?` | `string` |
| `fromUri?` | [`URI`](../classes/URI.md) |
| `toDisplayName?` | `string` |
| `toUri?` | [`URI`](../classes/URI.md) |

#### Defined in

sip.js/lib/api/registerer-options.d.ts:24

___

### regId

• `Optional` **regId**: `number`

Value to provide with "reg-id" Contact parameter.

**`defaultvalue`** 1

#### Defined in

sip.js/lib/api/registerer-options.d.ts:35

___

### registrar

• `Optional` **registrar**: [`URI`](../classes/URI.md)

The URI of the registrar to send the REGISTER requests.

**`defaultvalue`** domain portion of the user agent's uri

#### Defined in

sip.js/lib/api/registerer-options.d.ts:40

___

### refreshFrequency

• `Optional` **refreshFrequency**: `number`

Determines when a re-REGISTER request is sent. The value should be specified as a percentage of the expiration time (between 50 and 99).

**`defaultvalue`** 99

#### Defined in

sip.js/lib/api/registerer-options.d.ts:45
