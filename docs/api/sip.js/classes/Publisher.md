[SIP.js](../README.md) / [Exports](../modules.md) / Publisher

# Class: Publisher

A publisher publishes a publication (outgoing PUBLISH).

## Table of contents

### Constructors

- [constructor](Publisher.md#constructor)

### Methods

- [dispose](Publisher.md#dispose)
- [publish](Publisher.md#publish)
- [unpublish](Publisher.md#unpublish)

### Accessors

- [state](Publisher.md#state)
- [stateChange](Publisher.md#statechange)

## Constructors

### constructor

• **new Publisher**(`userAgent`, `targetURI`, `eventType`, `options?`)

Constructs a new instance of the `Publisher` class.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userAgent` | [`UserAgent`](UserAgent.md) | User agent. See [UserAgent](UserAgent.md) for details. |
| `targetURI` | [`URI`](URI.md) | Request URI identifying the target of the message. |
| `eventType` | `string` | The event type identifying the published document. |
| `options?` | [`PublisherOptions`](../interfaces/PublisherOptions.md) | Options bucket. See [PublisherOptions](../interfaces/PublisherOptions.md) for details. |

#### Defined in

sip.js/lib/api/publisher.d.ts:37

## Methods

### dispose

▸ **dispose**(): `Promise`<`void`\>

Destructor.

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/publisher.d.ts:41

___

### publish

▸ **publish**(`content`, `options?`): `Promise`<`void`\>

Publish.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `content` | `string` | Body to publish |
| `options?` | [`PublisherPublishOptions`](../interfaces/PublisherPublishOptions.md) | - |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/publisher.d.ts:50

___

### unpublish

▸ **unpublish**(`options?`): `Promise`<`void`\>

Unpublish.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`PublisherUnpublishOptions`](../interfaces/PublisherUnpublishOptions.md) |

#### Returns

`Promise`<`void`\>

#### Defined in

sip.js/lib/api/publisher.d.ts:54

## Accessors

### state

• `get` **state**(): [`PublisherState`](../enums/PublisherState.md)

The publication state.

#### Returns

[`PublisherState`](../enums/PublisherState.md)

#### Defined in

sip.js/lib/api/publisher.d.ts:43

___

### stateChange

• `get` **stateChange**(): [`Emitter`](../interfaces/Emitter.md)<[`PublisherState`](../enums/PublisherState.md)\>

Emits when the publisher state changes.

#### Returns

[`Emitter`](../interfaces/Emitter.md)<[`PublisherState`](../enums/PublisherState.md)\>

#### Defined in

sip.js/lib/api/publisher.d.ts:45
