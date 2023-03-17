# Migration from 0.8.x to 0.9.0

v0.9.0 is not fully backward compatible with v0.8.x. This is because sip.js has gone through a major release and sip.js 0.15.x to 0.16.x has been with no backward compatibility

## 1. [WebPhoneUserAgent](docs/api/interfaces/WebPhoneUserAgent.md)

- The return type of `sendMessage` method has changed from `ClientContext` to `IncomingResponse`.
  More details on `IncomingResponse` can be found on sip.js documentation at [`IncomingResponse`](https://github.com/onsip/SIP.js/blob/master/docs/core/sip.js.incomingresponse.md)
- `__invite` internal method has been removed. `userAgent` still has the `invite` method which will work the same way
- `__register` internal method has been removed. `userAgent` still has the `register` method which will work the same way
- `__unregister` internal method has been removed. `userAgent` still has the `unregister` method which will work the same way
- `__transportConstructor` internal method has been removed. Transport creation is now handeled by the `WebPhoneTransport.ts` class
- `__onTransportConnected` internal method has been removed
- `onTransportConnected` has been removed. Transport creation is now handeled by the `WebPhoneTransport.ts` class

### [Events](docs/api/interfaces/WebPhoneEvents.md#useragent)

sip.js has removed all `userAgent` events
WebPhone SDK will still supports some basic events on `WebPhoneUserAgent`

- `registered` : Fired when UserAgent is registered with the registerer
- `unregistered` : Fired when UserAgent is unregistered from the registerer
- `registrationFailed`: Fired when UserAgent is registered with failure state
- `inviteSent` : Fired when Invite is sent
- `invite` : Fired when Invitation is received
- `provisionUpdate` : Fired when provisionUpdate notification is received from RingCentral backend
- `started` : Fired when UserAgent is started
- `stopped` : Fired when UserAgent is stopped

## 2. [WebPhoneTransport](docs/api/interfaces/WebPhoneTransport.md)

`sipTransportConstructor.ts` has been changed to `transport.ts`
`WebPhoneSIPTransport` has been renamed to `WebPhoneTransport.ts`

- `computeRandomTimeout` method has been renamed to `__computeRandomTimeout`
- `scheduleSwitchBackMainProxy` method has been renamed to `__scheduleSwitchBackToMainProxy`
- `status` has been removed by `sip.js`. Use [`state`](https://github.com/onsip/SIP.js/blob/master/docs/transport/sip.js.transport.state.md) as an alternative
- `resetServerErrorStatus` has been removed by `sip.js`
- `__clearSwitchBackTimer` internal method has been renamed to `__clearSwitchBackToMainProxyTimer`
- `disposeWs` method has been removed by `sip.js`
- `onError` method has been removed by `sip.js`

### [Events](docs/api/interfaces/WebPhoneEvents.md#transport)

sip.js has removed all `transport` events
WebPhone SDK will still supports some basic events on `WebPhoneTransport`

- `connecting` : Fired when Transport is connecting
- `connected` : Fired when Transport is connected
- `disconnecting` : Fired when Transport is disconnecting
- `disconnected` : Fired when Transport is disconnected
- `wsConnectionError` : Fired everytime a transport connection attempt fails
- `transportError` : Fired when maxReconnectionAttempts have exhausted trying to connect to one server or sip error is returned from the server
- `switchBackProxy` : Fired when client should initiate connection back to main proxy
- `closed` : Fired when maxReconnectionAttempts have exhausted trying to connect to one server or sip error is returned from the server

## 3. [WebPhoneSession](docs/api/modules.md#webphonesession)

`WebphoneSession` is now a union of `WebPhoneInvitation | WebPhoneInviter`

- `__sendRequest` internal method has been removed
- `__receiveRequest` internal method has been removed
- `receiveRequest` method has been removed from `session`. Renamed to `receiveIncomingRequestFromTransport` and is moved to `userAgentCore` by `sip.js`
- `__hold` internal method has been removed
- `__unhold` internal method has been removed
- `__dtmf` internal method has been removed
- `__reinvite` internal method has been removed
- `_sendReceiveConfirmPromise` has been removed since `sendReceiveConfirm` now handles success and error logging. Use `sendReceiveConfirm` directly from this version
- `ua` has been renamed to `userAgent` by `sip.js`
- `local_hold` has been removed since it was unused
- `failed` has been removed since by `sip.js`
- `__onRecord` has been renamed to `__isRecording`
- `hasAnswer` has been removed
- `receiveReinviteResponse` has been removed since reinvite is handeled by `sip.js` now
- `pendingReinvite` has been removed since reinvite is handeled by `sip.js` now
- `sendReinvite` has been removed since reinvite is handeled by `sip.js` now
- `_sendReinvite` has been removed
- `getIncomingInfoContent` has been moved to `userAgentCore.ts`
- `sendReceive` method has been renamed to `sendInfoAndReceiveResponse`
- `sendRequest` has been removed by `sip.js`. Use methods like `session.info`, `session.message`, `session.invite` etc instead

<br/>

- `sendReceiveConfirm` The return type has changed from `ClientContext` to [`IncomingResponse`](https://github.com/onsip/SIP.js/blob/master/docs/core/sip.js.incomingresponse.md)
- `sendSessionMessage` The return type has changed from `ClientContext` to [`IncomingResponse`](https://github.com/onsip/SIP.js/blob/master/docs/core/sip.js.incomingresponse.md)
- `ignore` The return type has changed from `ClientContext` to [`IncomingResponse`](https://github.com/onsip/SIP.js/blob/master/docs/core/sip.js.incomingresponse.md)
- `toVoicemail` The return type has changed from `ClientContext` to [`IncomingResponse`](https://github.com/onsip/SIP.js/blob/master/docs/core/sip.js.incomingresponse.md)
- `replyWithMessage` The return type has changed from `ClientContext` to [`IncomingResponse`](https://github.com/onsip/SIP.js/blob/master/docs/core/sip.js.incomingresponse.md)
- `blindTransfer` The return type has changed from `ReferClientContext` to [`OutgoingReferRequest`](https://github.com/onsip/SIP.js/blob/master/docs/core/sip.js.outgoingreferrequest.md)
- `blindTransfer` now takes in `options` of type [`SessionReferOptions`](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.sessionreferoptions.md)
- `warmTransfer` now takes in `options` of type [`SessionReferOptions`](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.sessionreferoptions.md)
- `transfer` now takes in `options` of type [`SessionReferOptions`](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.sessionreferoptions.md)
- `reinvite` The return type has changed from `void` to [`OutgoingInviteRequest`](https://github.com/onsip/SIP.js/blob/master/docs/core/sip.js.outgoinginviterequest.md)
- `reinvite` now takes in `options` of type [`SessionInviteOptions`](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.sessioninviteoptions.md)
- The type of the payload for `updateReceived` event has changed from `IncomingRequest` to [`IncomingRequestMessage`](https://github.com/onsip/SIP.js/blob/master/docs/core/sip.js.incomingrequestmessage.md)

### [Events](docs/api/interfaces/WebPhoneEvents.md#session)

sip.js has removed all `session` events
WebPhone SDK will still supports some basic events on `WebPhoneSession`

- `muted`: Fired when session is muted
- `unmuted`: Fired when session is unmuted
- `establishing`: Fired when session is established
- `established`: Fired when session is established
- `accepted`: Fired when session is accepted
- `progress`: Fired when session is progress state
- `terminating`: Fired when session is terminating
- `terminated`: Fired when session is terminated
- `updateReceived`: Fired when UPDATE request is received over socket
- `moveToRcv`: Fired when INFO request is received over socket with move to rcv instruction
- `qos-published`: Fired when QOS is punished to the backend server
- `rtpStat`: Fired when RTP Stat Report is generated
- `userMediaFailed`: Fired when getting user media is failed

## 4. [MediaStreamsImpl](docs/api/classes/MediaStreamsImpl.md)

- `onMediaConnectionStateChange` order of params has changed. The method now takes `state: string` as the first parameter and `session: WebPhoneSession` as the second parameter
- `on` method has been removed
- `localStream` has been removed
- `remoteStream` has been removed
- `validateSDP` has been removed
- `onStateChange` method has been removed
