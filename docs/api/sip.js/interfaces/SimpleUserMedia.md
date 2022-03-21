[SIP.js](../README.md) / [Exports](../modules.md) / SimpleUserMedia

# Interface: SimpleUserMedia

Media for [SimpleUserOptions](SimpleUserOptions.md).

## Table of contents

### Properties

- [constraints](SimpleUserMedia.md#constraints)
- [local](SimpleUserMedia.md#local)
- [remote](SimpleUserMedia.md#remote)

## Properties

### constraints

• `Optional` **constraints**: [`SimpleUserMediaConstraints`](SimpleUserMediaConstraints.md)

Offer/Answer constraints determine if audio and/or video are utilized.
If not specified, only audio is utilized (audio is true, video is false).

**`remarks`**
Constraints are used when creating local media stream.
If undefined, defaults to audio true and video false.
If audio and video are false, media stream will have no tracks.

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-options.d.ts:16

___

### local

• `Optional` **local**: [`SimpleUserMediaLocal`](SimpleUserMediaLocal.md)

HTML elements for local media streams.

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-options.d.ts:18

___

### remote

• `Optional` **remote**: [`SimpleUserMediaRemote`](SimpleUserMediaRemote.md)

Local HTML media elements.

#### Defined in

sip.js/lib/platform/web/simple-user/simple-user-options.d.ts:20
