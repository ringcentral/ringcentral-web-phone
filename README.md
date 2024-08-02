# RingCentral Web Phone 2

This is a complete rewrite of the RingCentral Web Phone SDK.


## Breaking changes

This SDK doesn't play ringing audio when there is incoming call or outgoing call. 
It's up to the app to play the audio. It's a by design change.


## Notes

- ref: https://www.ietf.org/rfc/rfc3261.txt
- ref: https://git.ringcentral.com/Dmitry.Iskrich/pjac2/-/blob/master/pjac_fw/bl/telco/call_control_sip.py


## Todo:

- create some slides to talk about the reasoning for getting rid of SIP.js
- release the first version
- create a demo project for conference
  - because it is mainly restful api, it is not part of the SDK
- receive dtmf?
  - Not possible with WebRTC: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_DTMF
- integration tests
  - better to test the SIP message flow
