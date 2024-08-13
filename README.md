# RingCentral Web Phone 2

This is a complete rewrite of the RingCentral Web Phone SDK.

## Demo

- [Online Demo](https://chuntaoliu.com/rc-web-phone-demo-2/)
- [Source Code](https://github.com/tylerlong/rc-web-phone-demo-2)


## Breaking changes

### API changes

2.0 version is a complete rewrite of the RingCentral Web Phone SDK. The API is completely different from the previous version.

### Behavior changes

This SDK doesn't play ringing audio when there is incoming call or outgoing call.
It's up to the app to play the audio. It's a by design change.


## Maintainers Notes

Content below is for the maintainers of this project.

- ref: https://www.ietf.org/rfc/rfc3261.txt

### Two kinds of special messages

Before an incoming call is answered, client may send special messages with **XML** body to confirmReceive/toVoicemail/decline/forward/reply the call.

In an ongoing call (either inbound or outbound), client may send special messages with **JSON** body to startCallRecord/stopCallRecord/flip/park the call.

### Todo:

- create some slides to talk about the reasoning for getting rid of SIP.js
- integration tests
  - better to test the SIP message flow
- documentation
