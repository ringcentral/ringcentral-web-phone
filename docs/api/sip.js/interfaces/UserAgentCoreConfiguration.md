[SIP.js](../README.md) / [Exports](../modules.md) / UserAgentCoreConfiguration

# Interface: UserAgentCoreConfiguration

User Agent Core configuration.

## Table of contents

### Properties

- [aor](UserAgentCoreConfiguration.md#aor)
- [contact](UserAgentCoreConfiguration.md#contact)
- [displayName](UserAgentCoreConfiguration.md#displayname)
- [loggerFactory](UserAgentCoreConfiguration.md#loggerfactory)
- [hackViaTcp](UserAgentCoreConfiguration.md#hackviatcp)
- [routeSet](UserAgentCoreConfiguration.md#routeset)
- [sipjsId](UserAgentCoreConfiguration.md#sipjsid)
- [supportedOptionTags](UserAgentCoreConfiguration.md#supportedoptiontags)
- [supportedOptionTagsResponse](UserAgentCoreConfiguration.md#supportedoptiontagsresponse)
- [userAgentHeaderFieldValue](UserAgentCoreConfiguration.md#useragentheaderfieldvalue)
- [viaForceRport](UserAgentCoreConfiguration.md#viaforcerport)
- [viaHost](UserAgentCoreConfiguration.md#viahost)

### Methods

- [authenticationFactory](UserAgentCoreConfiguration.md#authenticationfactory)
- [transportAccessor](UserAgentCoreConfiguration.md#transportaccessor)

## Properties

### aor

• **aor**: [`URI`](../classes/URI.md)

Address-of-Record (AOR).

**`remarks`**
https://tools.ietf.org/html/rfc3261#section-6

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:32

___

### contact

• **contact**: [`Contact`](Contact.md)

Contact.

**`remarks`**
https://tools.ietf.org/html/rfc3261#section-8.1.1.8

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:38

___

### displayName

• **displayName**: `string`

From header display name.

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:42

___

### loggerFactory

• **loggerFactory**: [`LoggerFactory`](../classes/LoggerFactory.md)

Logger factory.

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:46

___

### hackViaTcp

• **hackViaTcp**: `boolean`

Force Via header field transport to TCP.

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:50

___

### routeSet

• **routeSet**: `string`[]

Preloaded route set.

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:54

___

### sipjsId

• **sipjsId**: `string`

Unique instance id.

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:58

___

### supportedOptionTags

• **supportedOptionTags**: `string`[]

Option tags of supported SIP extensions.

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:62

___

### supportedOptionTagsResponse

• **supportedOptionTagsResponse**: `string`[]

Option tags of supported SIP extensions.
Used in responses.

**`remarks`**
FIXME: Make this go away.

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:69

___

### userAgentHeaderFieldValue

• **userAgentHeaderFieldValue**: `string`

User-Agent header field value.

**`remarks`**
https://tools.ietf.org/html/rfc3261#section-20.41

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:75

___

### viaForceRport

• **viaForceRport**: `boolean`

Force use of "rport" Via header field parameter.

**`remarks`**
https://www.ietf.org/rfc/rfc3581.txt

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:81

___

### viaHost

• **viaHost**: `string`

Via header field host name or network address.

**`remarks`**
The Via header field indicates the path taken by the request so far
and indicates the path that should be followed in routing responses.

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:88

## Methods

### authenticationFactory

▸ **authenticationFactory**(): [`DigestAuthentication`](../classes/DigestAuthentication.md)

DEPRECATED
Authentication factory function.

#### Returns

[`DigestAuthentication`](../classes/DigestAuthentication.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:93

___

### transportAccessor

▸ **transportAccessor**(): [`Transport`](Transport.md)

DEPRECATED: This is a hack to get around `Transport`
requiring the `UA` to start for construction.

#### Returns

[`Transport`](Transport.md)

#### Defined in

sip.js/lib/core/user-agent-core/user-agent-core-configuration.d.ts:98
