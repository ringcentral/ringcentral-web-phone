# RingCentral Web Phone 2

This is a complete rewrite of the RingCentral Web Phone SDK.


## Breaking changes

This SDK doesn't play ringing audio when there is incoming call or outgoing call. 
It's up to the application to play the audio.



## Notes

- ref: https://www.ietf.org/rfc/rfc3261.txt
- ref: https://git.ringcentral.com/Dmitry.Iskrich/pjac2/-/blob/master/pjac_fw/bl/telco/call_control_sip.py


## Todo:

- release the first version
- create a demo project for conference
  - because it is mainly restful api and websockets, it is not part of the SDK
- receive dtmf?
  - Not possible with WebRTC: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Using_DTMF
- integration tests
  - better to test the SIP message flow
