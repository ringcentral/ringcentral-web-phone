[SIP.js](../README.md) / [Exports](../modules.md) / SimpleUserOptions

# Interface: SimpleUserOptions

Options for [SimpleUser](../classes/SimpleUser.md).

## Table of contents

### Properties

- [aor](SimpleUserOptions.md#aor)
- [delegate](SimpleUserOptions.md#delegate)
- [media](SimpleUserOptions.md#media)
- [reconnectionAttempts](SimpleUserOptions.md#reconnectionattempts)
- [reconnectionDelay](SimpleUserOptions.md#reconnectiondelay)
- [userAgentOptions](SimpleUserOptions.md#useragentoptions)

## Properties

### aor

• `Optional` **aor**: `string`

User's SIP Address of Record (AOR).

**`remarks`**
The AOR is registered to receive incoming calls.
If not specified, a random anonymous address is created for the user.

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-options.d.ts:61

___

### delegate

• `Optional` **delegate**: [`SimpleUserDelegate`](SimpleUserDelegate.md)

Delegate for SimpleUser.

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-options.d.ts:65

___

### media

• `Optional` **media**: [`SimpleUserMedia`](SimpleUserMedia.md)

Media options.

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-options.d.ts:69

___

### reconnectionAttempts

• `Optional` **reconnectionAttempts**: `number`

Maximum number of times to attempt to reconnection.

**`remarks`**
When the transport connection is lost (WebSocket disconnects),
reconnection will be attempted immediately. If that fails,
reconnection will be attempted again when the browser indicates
the application has come online. See:
https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine

**`defaultvalue`** 3

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-options.d.ts:80

___

### reconnectionDelay

• `Optional` **reconnectionDelay**: `number`

Seconds to wait between reconnection attempts.

**`defaultvalue`** 4

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-options.d.ts:85

___

### userAgentOptions

• `Optional` **userAgentOptions**: [`UserAgentOptions`](UserAgentOptions.md)

Options for UserAgent.

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-options.d.ts:89
