[SIP.js](../README.md) / [Exports](../modules.md) / SimpleUserDelegate

# Interface: SimpleUserDelegate

Delegate for [SimpleUser](../classes/SimpleUser.md).

## Table of contents

### Methods

- [onCallAnswered](SimpleUserDelegate.md#oncallanswered)
- [onCallCreated](SimpleUserDelegate.md#oncallcreated)
- [onCallReceived](SimpleUserDelegate.md#oncallreceived)
- [onCallHangup](SimpleUserDelegate.md#oncallhangup)
- [onCallHold](SimpleUserDelegate.md#oncallhold)
- [onCallDTMFReceived](SimpleUserDelegate.md#oncalldtmfreceived)
- [onMessageReceived](SimpleUserDelegate.md#onmessagereceived)
- [onRegistered](SimpleUserDelegate.md#onregistered)
- [onUnregistered](SimpleUserDelegate.md#onunregistered)
- [onServerConnect](SimpleUserDelegate.md#onserverconnect)
- [onServerDisconnect](SimpleUserDelegate.md#onserverdisconnect)

## Methods

### onCallAnswered

▸ `Optional` **onCallAnswered**(): `void`

Called when a call is answered.

**`remarks`**
Callback for handling establishment of a new Session.

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-delegate.d.ts:11

___

### onCallCreated

▸ `Optional` **onCallCreated**(): `void`

Called when a call is created.

**`remarks`**
Callback for handling the creation of a new Session.

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-delegate.d.ts:17

___

### onCallReceived

▸ `Optional` **onCallReceived**(): `void`

Called when a call is received.

**`remarks`**
Callback for handling incoming INVITE requests.
The callback must either accept or reject the incoming call by calling `answer()` or `decline()` respectively.

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-delegate.d.ts:24

___

### onCallHangup

▸ `Optional` **onCallHangup**(): `void`

Called when a call is hung up.

**`remarks`**
Callback for handling termination of a Session.

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-delegate.d.ts:30

___

### onCallHold

▸ `Optional` **onCallHold**(`held`): `void`

Called when a call is put on hold or taken off hold.

**`remarks`**
Callback for handling re-INVITE responses.

#### Parameters

| Name | Type |
| :------ | :------ |
| `held` | `boolean` |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-delegate.d.ts:36

___

### onCallDTMFReceived

▸ `Optional` **onCallDTMFReceived**(`tone`, `duration`): `void`

Called when a call receives an incoming DTMF tone.

**`remarks`**
Callback for handling an incoming INFO request with content type application/dtmf-relay.

#### Parameters

| Name | Type |
| :------ | :------ |
| `tone` | `string` |
| `duration` | `number` |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-delegate.d.ts:42

___

### onMessageReceived

▸ `Optional` **onMessageReceived**(`message`): `void`

Called upon receiving a message.

**`remarks`**
Callback for handling incoming MESSAGE requests.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` | The message received. |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-delegate.d.ts:49

___

### onRegistered

▸ `Optional` **onRegistered**(): `void`

Called when user is registered to received calls.

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-delegate.d.ts:53

___

### onUnregistered

▸ `Optional` **onUnregistered**(): `void`

Called when user is no longer registered to received calls.

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-delegate.d.ts:57

___

### onServerConnect

▸ `Optional` **onServerConnect**(): `void`

Called when user is connected to server.

**`remarks`**
Callback for handling user becomes connected.

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-delegate.d.ts:63

___

### onServerDisconnect

▸ `Optional` **onServerDisconnect**(`error?`): `void`

Called when user is no longer connected.

**`remarks`**
Callback for handling user becomes disconnected.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `error?` | `Error` | An Error if server caused the disconnect. Otherwise undefined. |

#### Returns

`void`

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-delegate.d.ts:71
