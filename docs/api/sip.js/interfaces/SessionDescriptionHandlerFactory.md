[SIP.js](../README.md) / [Exports](../modules.md) / SessionDescriptionHandlerFactory

# Interface: SessionDescriptionHandlerFactory

## Hierarchy

- [`SessionDescriptionHandlerFactory`](SessionDescriptionHandlerFactory.md)

  ↳ **`SessionDescriptionHandlerFactory`**

## Callable

### SessionDescriptionHandlerFactory

▸ **SessionDescriptionHandlerFactory**(`session`, `options?`): [`SessionDescriptionHandler`](../classes/SessionDescriptionHandler.md)

SessionDescriptionHandler factory function.

**`remarks`**
The `options` are provided as part of the UserAgent configuration
and passed through on every call to SessionDescriptionHandlerFactory's constructor.

#### Parameters

| Name | Type |
| :------ | :------ |
| `session` | [`Session`](../classes/Session.md) |
| `options?` | [`SessionDescriptionHandlerConfiguration`](SessionDescriptionHandlerConfiguration.md) |

#### Returns

[`SessionDescriptionHandler`](../classes/SessionDescriptionHandler.md)

#### Defined in

sip.js/lib/platform/web/session-description-handler/session-description-handler-factory.d.ts:15

### SessionDescriptionHandlerFactory

▸ **SessionDescriptionHandlerFactory**(`session`, `options?`): [`SessionDescriptionHandler`](SessionDescriptionHandler.md)

SessionDescriptionHandler factory function.

**`remarks`**
The `options` are provided as part of the UserAgent configuration
and passed through on every call to SessionDescriptionHandlerFactory's constructor.

#### Parameters

| Name | Type |
| :------ | :------ |
| `session` | [`Session`](../classes/Session.md) |
| `options?` | `object` |

#### Returns

[`SessionDescriptionHandler`](SessionDescriptionHandler.md)

#### Defined in

sip.js/lib/api/session-description-handler-factory.d.ts:14
