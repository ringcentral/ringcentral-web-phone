[RingCentral Webphone SDK - v0.9.0](../README.md) / [Exports](../modules.md) / SipInfo

# Interface: SipInfo

## Table of contents

### Properties

- [username](SipInfo.md#username)
- [password](SipInfo.md#password)
- [authorizationId](SipInfo.md#authorizationid)
- [domain](SipInfo.md#domain)
- [outboundProxy](SipInfo.md#outboundproxy)
- [outboundProxyIPv6](SipInfo.md#outboundproxyipv6)
- [outboundProxyBackup](SipInfo.md#outboundproxybackup)
- [outboundProxyIPv6Backup](SipInfo.md#outboundproxyipv6backup)
- [transport](SipInfo.md#transport)
- [certificate](SipInfo.md#certificate)
- [switchBackInterval](SipInfo.md#switchbackinterval)

## Properties

### username

• **username**: `string`

Username to connect to transport

#### Defined in

[src/index.ts:43](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L43)

___

### password

• **password**: `string`

Password to connect to transport

#### Defined in

[src/index.ts:45](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L45)

___

### authorizationId

• **authorizationId**: `string`

Authorization Id to connect to transport

#### Defined in

[src/index.ts:47](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L47)

___

### domain

• **domain**: `string`

Domain of transport server

#### Defined in

[src/index.ts:49](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L49)

___

### outboundProxy

• **outboundProxy**: `string`

URL for outbound transport proxy

#### Defined in

[src/index.ts:51](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L51)

___

### outboundProxyIPv6

• `Optional` **outboundProxyIPv6**: `string`

V6 IP address for outbound transport proxy

#### Defined in

[src/index.ts:53](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L53)

___

### outboundProxyBackup

• **outboundProxyBackup**: `string`

URL for outbound backup transport proxy

#### Defined in

[src/index.ts:55](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L55)

___

### outboundProxyIPv6Backup

• `Optional` **outboundProxyIPv6Backup**: `string`

V6 IP address for outbound backup transport proxy

#### Defined in

[src/index.ts:57](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L57)

___

### transport

• **transport**: ``"UDP"`` \| ``"TCP"`` \| ``"TLS"`` \| ``"WS"`` \| ``"WSS"``

Transport type

#### Defined in

[src/index.ts:59](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L59)

___

### certificate

• **certificate**: `string`

Certificate to connect to transport

#### Defined in

[src/index.ts:61](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L61)

___

### switchBackInterval

• **switchBackInterval**: `number`

The interval in seconds after which the app must try to switch back to primary proxy if it was previously switched to backup

#### Defined in

[src/index.ts:63](https://github.com/nerdchacha/ringcentral-web-phone/blob/491aafd/src/index.ts#L63)
