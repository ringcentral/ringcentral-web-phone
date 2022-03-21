[SIP.js](../README.md) / [Exports](../modules.md) / TransportOptions

# Interface: TransportOptions

Transport options.

## Table of contents

### Properties

- [server](TransportOptions.md#server)
- [connectionTimeout](TransportOptions.md#connectiontimeout)
- [keepAliveInterval](TransportOptions.md#keepaliveinterval)
- [keepAliveDebounce](TransportOptions.md#keepalivedebounce)
- [traceSip](TransportOptions.md#tracesip)

## Properties

### server

• **server**: `string`

URL of WebSocket server to connect with. For example, "wss://localhost:8080".

#### Defined in

sip.js/lib/platform/web/transport/transport-options.d.ts:9

___

### connectionTimeout

• `Optional` **connectionTimeout**: `number`

Seconds to wait for WebSocket to connect before giving up.

**`defaultvalue`** `5`

#### Defined in

sip.js/lib/platform/web/transport/transport-options.d.ts:14

___

### keepAliveInterval

• `Optional` **keepAliveInterval**: `number`

Keep alive - needs review.

**`internal`**

#### Defined in

sip.js/lib/platform/web/transport/transport-options.d.ts:19

___

### keepAliveDebounce

• `Optional` **keepAliveDebounce**: `number`

Keep alive - needs review.

**`internal`**

#### Defined in

sip.js/lib/platform/web/transport/transport-options.d.ts:24

___

### traceSip

• `Optional` **traceSip**: `boolean`

If true, messages sent and received by the transport are logged.

**`defaultvalue`** `true`

#### Defined in

sip.js/lib/platform/web/transport/transport-options.d.ts:29
