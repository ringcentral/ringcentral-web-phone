[SIP.js](../README.md) / [Exports](../modules.md) / UserAgentOptions

# Interface: UserAgentOptions

Options for [UserAgent](../classes/UserAgent.md) constructor.

## Table of contents

### Properties

- [allowLegacyNotifications](UserAgentOptions.md#allowlegacynotifications)
- [authorizationHa1](UserAgentOptions.md#authorizationha1)
- [authorizationPassword](UserAgentOptions.md#authorizationpassword)
- [authorizationUsername](UserAgentOptions.md#authorizationusername)
- [autoStart](UserAgentOptions.md#autostart)
- [autoStop](UserAgentOptions.md#autostop)
- [contactName](UserAgentOptions.md#contactname)
- [contactParams](UserAgentOptions.md#contactparams)
- [delegate](UserAgentOptions.md#delegate)
- [displayName](UserAgentOptions.md#displayname)
- [forceRport](UserAgentOptions.md#forcerport)
- [hackIpInContact](UserAgentOptions.md#hackipincontact)
- [hackAllowUnregisteredOptionTags](UserAgentOptions.md#hackallowunregisteredoptiontags)
- [hackViaTcp](UserAgentOptions.md#hackviatcp)
- [logBuiltinEnabled](UserAgentOptions.md#logbuiltinenabled)
- [logConfiguration](UserAgentOptions.md#logconfiguration)
- [logConnector](UserAgentOptions.md#logconnector)
- [logLevel](UserAgentOptions.md#loglevel)
- [noAnswerTimeout](UserAgentOptions.md#noanswertimeout)
- [preloadedRouteSet](UserAgentOptions.md#preloadedrouteset)
- [reconnectionAttempts](UserAgentOptions.md#reconnectionattempts)
- [reconnectionDelay](UserAgentOptions.md#reconnectiondelay)
- [sendInitialProvisionalResponse](UserAgentOptions.md#sendinitialprovisionalresponse)
- [sessionDescriptionHandlerFactory](UserAgentOptions.md#sessiondescriptionhandlerfactory)
- [sessionDescriptionHandlerFactoryOptions](UserAgentOptions.md#sessiondescriptionhandlerfactoryoptions)
- [sipExtension100rel](UserAgentOptions.md#sipextension100rel)
- [sipExtensionReplaces](UserAgentOptions.md#sipextensionreplaces)
- [sipExtensionExtraSupported](UserAgentOptions.md#sipextensionextrasupported)
- [sipjsId](UserAgentOptions.md#sipjsid)
- [transportConstructor](UserAgentOptions.md#transportconstructor)
- [transportOptions](UserAgentOptions.md#transportoptions)
- [uri](UserAgentOptions.md#uri)
- [userAgentString](UserAgentOptions.md#useragentstring)
- [viaHost](UserAgentOptions.md#viahost)

## Properties

### allowLegacyNotifications

• `Optional` **allowLegacyNotifications**: `boolean`

If `true`, the user agent will accept out of dialog NOTIFY.

**`remarks`**
RFC 6665 obsoletes the use of out of dialog NOTIFY from RFC 3265.

**`defaultvalue`** `false`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:35

___

### authorizationHa1

• `Optional` **authorizationHa1**: `string`

Authorization ha1.

**`defaultvalue`** `""`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:40

___

### authorizationPassword

• `Optional` **authorizationPassword**: `string`

Authorization password.

**`defaultvalue`** `""`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:45

___

### authorizationUsername

• `Optional` **authorizationUsername**: `string`

Authorization username.

**`defaultvalue`** `""`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:50

___

### autoStart

• `Optional` **autoStart**: `boolean`

**`deprecated`**
If `true`, the user agent calls the `start()` method in the constructor.

**`defaultvalue`** `false`

**`remarks`**
The call to start() resolves when the user agent connects, so if this
option is set to `true` an alternative method of connection detection
must be used.

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:60

___

### autoStop

• `Optional` **autoStop**: `boolean`

If `true`, the user agent calls the `stop()` method on unload (if running in browser window).

**`defaultvalue`** `true`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:65

___

### contactName

• `Optional` **contactName**: `string`

The user portion of user agent's contact URI.

**`remarks`**
If not specifed a random string will be generated and utilized as the user portion of the contact URI.

**`defaultvalue`** `""`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:72

___

### contactParams

• `Optional` **contactParams**: `Object`

The URI parameters of the user agent's contact URI.

**`defaultvalue`** `{ transport: "ws" }`

#### Index signature

▪ [name: `string`]: `string`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:77

___

### delegate

• `Optional` **delegate**: [`UserAgentDelegate`](UserAgentDelegate.md)

Delegate for [UserAgent](../classes/UserAgent.md).

**`defaultvalue`** `{}`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:84

___

### displayName

• `Optional` **displayName**: `string`

The display name associated with the user agent.

**`remarks`**
Descriptive name to be shown to the called party when calling or sending IM messages
(the display name portion of the From header).
It must NOT be enclosed between double quotes even if the given name contains multi-byte symbols
(SIPjs will always enclose the `displayName` value between double quotes).

**`defaultvalue`** `""`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:94

___

### forceRport

• `Optional` **forceRport**: `boolean`

Force adding rport to Via header.

**`defaultvalue`** `false`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:99

___

### hackIpInContact

• `Optional` **hackIpInContact**: `string` \| `boolean`

Hack

**`deprecated`** TBD

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:104

___

### hackAllowUnregisteredOptionTags

• `Optional` **hackAllowUnregisteredOptionTags**: `boolean`

Hack

**`deprecated`** TBD

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:109

___

### hackViaTcp

• `Optional` **hackViaTcp**: `boolean`

Hack

**`deprecated`** TBD

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:114

___

### logBuiltinEnabled

• `Optional` **logBuiltinEnabled**: `boolean`

Indicates whether log messages should be written to the browser console.

**`defaultvalue`** `true`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:119

___

### logConfiguration

• `Optional` **logConfiguration**: `boolean`

If true, constructor logs the user agent configuration.

**`defaultvalue`** `true`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:124

___

### logConnector

• `Optional` **logConnector**: [`LogConnector`](../modules.md#logconnector)

A function which will be called every time a log is generated.

**`defaultvalue`** A noop

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:129

___

### logLevel

• `Optional` **logLevel**: [`LogLevel`](../modules.md#loglevel)

Indicates the verbosity level of the log messages.

**`defaultvalue`** `"log"`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:134

___

### noAnswerTimeout

• `Optional` **noAnswerTimeout**: `number`

Number of seconds after which an incoming call is rejected if not answered.

**`defaultvalue`** 60

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:139

___

### preloadedRouteSet

• `Optional` **preloadedRouteSet**: `string`[]

Adds a Route header(s) to outgoing requests.

**`defaultvalue`** `[]`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:144

___

### reconnectionAttempts

• `Optional` **reconnectionAttempts**: `number`

**`deprecated`**
Maximum number of times to attempt to reconnect when the transport connection drops.

**`defaultvalue`** 0

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:150

___

### reconnectionDelay

• `Optional` **reconnectionDelay**: `number`

**`deprecated`**
Seconds to wait between reconnection attempts when the transport connection drops.

**`defaultvalue`** 4

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:156

___

### sendInitialProvisionalResponse

• `Optional` **sendInitialProvisionalResponse**: `boolean`

If true, a first provisional response after the 100 Trying will be sent automatically if UAC does not
require reliable provisional responses.

**`defaultvalue`** `true`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:162

___

### sessionDescriptionHandlerFactory

• `Optional` **sessionDescriptionHandlerFactory**: [`SessionDescriptionHandlerFactory`](SessionDescriptionHandlerFactory.md)

A factory for generating `SessionDescriptionHandler` instances.

**`remarks`**
The factory will be passed a `Session` object for the current session
and the `sessionDescriptionHandlerFactoryOptions` object.

**`defaultvalue`** `Web.SessionDescriptionHandler.defaultFactory`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:170

___

### sessionDescriptionHandlerFactoryOptions

• `Optional` **sessionDescriptionHandlerFactoryOptions**: `object`

Options to passed to `sessionDescriptionHandlerFactory`.

**`remarks`**
See `Web.SessionDescriptionHandlerOptions` for details.

**`defaultvalue`** `{}`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:177

___

### sipExtension100rel

• `Optional` **sipExtension100rel**: [`SIPExtension`](../enums/SIPExtension.md)

Reliable provisional responses.
https://tools.ietf.org/html/rfc3262

**`defaultvalue`** `SIPExtension.Unsupported`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:183

___

### sipExtensionReplaces

• `Optional` **sipExtensionReplaces**: [`SIPExtension`](../enums/SIPExtension.md)

Replaces header.
https://tools.ietf.org/html/rfc3891

**`defaultvalue`** `SIPExtension.Unsupported`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:189

___

### sipExtensionExtraSupported

• `Optional` **sipExtensionExtraSupported**: `string`[]

Extra option tags to claim support for.

**`remarks`**
Setting an extra option tag does not enable support for the associated extension
it simply adds the tag to the list of supported options.
See [UserAgentRegisteredOptionTags](../modules.md#useragentregisteredoptiontags) for valid option tags.

**`defaultvalue`** `[]`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:198

___

### sipjsId

• `Optional` **sipjsId**: `string`

An id uniquely identify this user agent instance.

**`defaultvalue`**
A random id generated by default.

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:204

___

### transportConstructor

• `Optional` **transportConstructor**: (`logger`: [`Logger`](../classes/Logger.md), `options`: `any`) => [`Transport`](Transport.md)

#### Type declaration

• **new UserAgentOptions**(`logger`, `options`)

A constructor function for the user agent's `Transport`.

**`remarks`**
For more information about creating your own transport see `Transport`.

**`defaultvalue`** `WebSocketTransport`

##### Parameters

| Name | Type |
| :------ | :------ |
| `logger` | [`Logger`](../classes/Logger.md) |
| `options` | `any` |

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:211

___

### transportOptions

• `Optional` **transportOptions**: `unknown`

An options bucket object passed to `transportConstructor` when instantiated.

**`remarks`**
See WebSocket Transport Configuration Parameters for the full list of options for the default transport.

**`defaultvalue`** `{}`

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:218

___

### uri

• `Optional` **uri**: [`URI`](../classes/URI.md)

SIP Addresses-of-Record URI associated with the user agent.

**`remarks`**
This is a SIP address given to you by your provider.
If the user agent registers, it is the address-of-record which the user agent registers a contact for.
An address-of-record represents an identity of the user, generally a long-term identity,
and it does not have a dependency on any device; users can move between devices or even
be associated with multiple devices at one time while retaining the same address-of-record.
A simple URI, generally of the form `sip:egdar@example.com`, is used for an address-of-record.

**`defaultvalue`**
By default, URI is set to `sip:anonymous.X@anonymous.invalid`, where X is a random token generated for each UA.

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:231

___

### userAgentString

• `Optional` **userAgentString**: `string`

User agent string used in the UserAgent header.

**`defaultvalue`**
A reasonable value is utilized.

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:237

___

### viaHost

• `Optional` **viaHost**: `string`

Hostname to use in Via header.

**`defaultvalue`**
A random hostname in the .invalid domain.

#### Defined in

sip.js/lib/api/user-agent-options.d.ts:243
