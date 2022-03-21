[SIP.js](../README.md) / [Exports](../modules.md) / Messager

# Class: Messager

A messager sends a [Message](Message.md) (outgoing MESSAGE).

## Table of contents

### Constructors

- [constructor](Messager.md#constructor)

### Methods

- [message](Messager.md#message)

## Constructors

### constructor

• **new Messager**(`userAgent`, `targetURI`, `content`, `contentType?`, `options?`)

Constructs a new instance of the `Messager` class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userAgent` | [`UserAgent`](UserAgent.md) | User agent. See [UserAgent](UserAgent.md) for details. |
| `targetURI` | [`URI`](URI.md) | Request URI identifying the target of the message. |
| `content` | `string` | Content for the body of the message. |
| `contentType?` | `string` | Content type of the body of the message. |
| `options?` | [`MessagerOptions`](../interfaces/MessagerOptions.md) | Options bucket. See [MessagerOptions](../interfaces/MessagerOptions.md) for details. |

#### Defined in

sip.js/lib/api/messager.d.ts:21

## Methods

### message

▸ **message**(`options?`): `Promise`<`void`\>

Send the message.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`MessagerMessageOptions`](../interfaces/MessagerMessageOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/messager.d.ts:25
