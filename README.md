[![Build Status](https://travis-ci.org/ringcentral/ringcentral-web-phone.svg?branch=master)](https://travis-ci.org/ringcentral/ringcentral-web-phone)
[![Coverage Status](https://coveralls.io/repos/github/ringcentral/ringcentral-web-phone/badge.svg?branch=master)](https://coveralls.io/github/ringcentral/ringcentral-web-phone?branch=master)

# RingCentral WebPhone Library

The RingCentral WebPhone Library includes a JavaScript WebRTC library and a WebRTC phone demo app.

## Prerequisites

- You will need an active RingCentral account. Don't have an account? [Get your Free RingCentral Developer Account Now!](https://developers.ringcentral.com)
- App type should be either :
    - Browser-Based
    - Server/Web

## Browser Compatibility

Currently, we officially support Google Chrome browser. Official support for Firefox and Safari browsers are coming soon.

## Network Requirements

Please visit Network Requirement links below
1. Condensed Requirements: [https://netstorage.ringcentral.com/guides/network_condensed.pdf](https://netstorage.ringcentral.com/guides/network_condensed.pdf)
2. Extended Requirements: [https://netstorage.ringcentral.com/guides/network_extended.pdf](https://netstorage.ringcentral.com/guides/network_extended.pdf)

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
  1. [Configuring your RingCentral app](#configuring-your-ringcentral-app)
  1. [Include Library And HTML Elements](#include-library-and-html-elements)
  2. [Application](#application)
3. [Demo](#demo)
4. [API](#api)
  1. [Initiating The Call](#initiating-the-call)
  1. [Accepting Incoming Call](#accepting-incoming-call)
  1. [DTMF](#dtmf)
  1. [Hold Unhold](#hold-unhold)
  1. [Mute Unmute](#mute-unmute)
  1. [Park](#park)
  1. [Flip](#flip)
  1. [Transfer](#transfer)
  1. [Warm Transfer](#warm-transfer)
  1. [Forward](#forward)
  1. [Start/Stop Recording](#startstop-recording)
  1. [Barge/Whisper](#bargewhisper)

---

## Installation

```ssh
npm install ringcentral-web-phone
// or
bower install ringcentral-web-phone
```

### If you are not using Bower or NPM:

1. Download SIP.JS: [https://sipjs.com/download/sip-0.13.5.js](https://sipjs.com/download/sip-0.13.5.js)
2. Download WebPhone SDK: [https://github.com/ringcentral/ringcentral-web-phone/releases/latest](https://github.com/ringcentral/ringcentral-web-phone/releases/latest)
3. Download audio files:
    1. [https://cdn.rawgit.com/ringcentral/ringcentral-web-phone/master/audio/incoming.ogg](https://cdn.rawgit.com/ringcentral/ringcentral-web-phone/master/audio/incoming.ogg)
    2. [https://cdn.rawgit.com/ringcentral/ringcentral-web-phone/master/audio/outgoing.ogg](https://cdn.rawgit.com/ringcentral/ringcentral-web-phone/master/audio/outgoing.ogg)

---

## Usage

### Configuring your RingCentral app

Ensure your app has the following properties set. If these are not set, the error specified will be returned.

App Property  | Value           | Error if not set
--------------|-----------------|-----------------
Permissions   | `VoIP Calling`  | `Specific application permission required`
Platform type | `Browser-based` | `Client edition is not compatible with current Brand`

Since WebRTC enables dialing out, you need to have a `DIGITAL LINE` attached to an extension to use this capability. You can configure this in Online Web Portal for [Production](https://service.ringcentral.com/) and [Sandbox](https://service.devtest.ringcentral.com/) accounts. More information on Digital Lines and their configuration is available in the following RingCentral Knowledge Base article topics:

1. [Digital Line Overview (KB 5862)](http://success.ringcentral.com/articles/en_US/RC_Knowledge_Article/5862)
2. [Adding a Digital Line (KB 3136)](http://success.ringcentral.com/articles/RC_Knowledge_Article/5-10-Adding-Phones-to-other-extensions-via-Web). A limited number of Digital Lines are free with each sandbox account which can be configured with the free RingCentral for Desktop softphone.
3. [Reassigning an Existing Digital Line (KB 3748)](http://success.ringcentral.com/articles/en_US/RC_Knowledge_Article/How-to-Assign-an-Existing-Digital-Line-to-a-different-extension)

These permissions be configured for your app in the [RingCentral Developer Portal](https://developers.ringcentral.com/). Fill this [Registration Form](https://docs.google.com/forms/d/15kK_zJ5FhyXiH8gwOqiaG7_BuTWGCeeVr4MAv4OBpUM/viewform) to get access to WebRTC permissions. Please contact devsupport@ringcentral.com to request these permissions.

### Include Library And HTML Elements

```html
<video id="remoteVideo" hidden="hidden"></video>
<video id="localVideo" hidden="hidden" muted="muted"></video>

<script src=".../sip.js" type="text/javascript"></script>
<script src=".../ringcentral-web-phone.js" type="text/javascript"></script>
```

### Application

For this example you will also need to have [RingCentral JS SDK installed](https://github.com/ringcentral/ringcentral-js#installation).

Configure the web-phone

```js
var appKey = '...';
var appSecret = '...';
var appName = '...';
var appVersion = '...';

var sdk = new RingCentral.SDK({
    appKey: appKey,
    appSecret: appSecret,
    appName: appName,
    appVersion: appVersion,
    server: RingCentral.SDK.server.production // or .sandbox
});

var remoteVideoElement =  document.getElementById('remoteVideo');
var localVideoElement  = document.getElementById('localVideo');

var platform = sdk.platform();

platform
    .login({
        username: '...',
        password: '...'
    })
    .then(function(loginResponse) {

        return platform
            .post('/client-info/sip-provision', {
                sipInfo: [{transport: 'WSS'}]
            })
            .then(function(res) { // Doing nested then because we need loginResponse in a simple way

                return new RingCentral.WebPhone(res.json(), { // optional
                    appKey: appKey,
                    appName: appName,
                    appVersion: appVersion,
                    uuid: loginResponse.json().endpoint_id,
                    logLevel: 1, // error 0, warn 1, log: 2, debug: 3
                    audioHelper: {
                        enabled: true, // enables audio feedback when web phone is ringing or making a call
                        incoming: 'path-to-audio/incoming.ogg', // path to audio file for incoming call
                        outgoing: 'path-to-audio/outgoing.ogg' // path to aduotfile for outgoing call
                    },
                    media:{
                        remote: remoteVideoElement,
                        local: localVideoElement
                    },
                    //to enable QoS Analytics Feature
                    enableQos:true
                });

            });

    })
    .then(function(webPhone){

        // YOUR CODE HERE

    })
    .catch(function(e){
        console.error(e.stack);
    });
```

---

## Demo

```sh
$ git clone https://github.com/ringcentral/ringcentral-web-phone.git
$ cd ringcentral-web-phone
$ npm start
```

1. Open `http://localhost:8080/demo/` in the browser (port may change if `8080` will be already used by other app)
2. If your Application is of the Scope
   `Server/Web`
   `Browser-Based`
    Then you would need to add `http://localhost:8080/demo/callback.html` as the OAuth Redirect URI for the application in [Developer Portal](https://developer.ringcentral.com)
3. Add your RC credentials and click on `Register`
4. For making outbound calls, enter phone number and click on `Call`
5. For receiving incoming calls, Click on `Accept` button when window pops up (will be visible when there is an incoming call)

If there's any connection problems to Sandbox environment, you may need to switch to the Production environment.

WebRTC works with issues when served from file system directly to browser (e.g. `file://` protocol), so you will need a local HTTP server (comes with this package).

Online demo is hosted at [http://ringcentral.github.io/ringcentral-web-phone](http://ringcentral.github.io/ringcentral-web-phone)

** NOTE : If you are using the online demo, please add `http://ringcentral.github.io/ringcentral-web-phone/callback.html` to the app's OAuth Redirect URI

---

## API

Except for some RingCentral-specific features the API is 100% the same as SIP.JS: http://sipjs.com/api/0.13.0: most of the time you will be working with RC-flavored [UserAgent](http://sipjs.com/api/0.13.0/ua) and [Session](http://sipjs.com/api/0.13.0/session) objects of SIP.JS.

We encourage you to take a look at [Guides](http://sipjs.com/guides) section, especially
[Make A Call](http://sipjs.com/guides/make-call) and [Receive A Call](http://sipjs.com/guides/receive-call/) articles.

### Constructor

```js
var webPhone = new RingCentral.WebPhone(provisionData, options);
```

- Provision Data &mdash; the JSON returned from `/client-info/sip-provision` API endpoint
- Options &mdash; object with various configuration options that adjust WebPhone behavior
    - `appKey` &mdash; your application key
    - `appName` &mdash; your application short code name
    - `appVersion` &mdash; your application version
    - `uuid` &mdash; manually provide the unique identifier of WebPhone instance (should persist between page reloads)
    - `logLevel` &mdash; controls verboseness in browser console
        - `0` &mdash; Errors only (good for production)
        - `1` &mdash; Errors & warnings
        - `2` &mdash; Errors, warnings, logs
        - `3` &mdash; Everything including debug information (good for development)
    - `audioHelper` &mdash; audio feedback when web phone is ringing or making a call
        - `enabled` &mdash; turns feedback on and off
        - `incoming` &mdash; path to `incoming.ogg`, audio file for incoming call
        - `outgoing` &mdash; path to `outgoing.ogg`, audio file for outgoing call
    - `onSession` &mdash; this callback will be fired each time User Agent starts working with session (incoming or outgoing)
    - `enableQos:true` &mdash; will enable quality of service for webRTC calls , you can view the voice quality of calls in analytics portal

### Attaching Media Streams

For futher information, refer SIP.js guide to [attach media](https://sipjs.com/guides/attach-media/)

### Initiating The Call

```javascript
var session = webPhone.userAgent.invite('PHONE_NUMBER', {
    fromNumber: 'PHONE_NUMBER', // Optional, Company Number will be used as default
    homeCountryId: '1' // Optional, the value of
});
```

### Accepting Incoming Call

```javascript
webPhone.userAgent.on('invite', function(session){
    session.accept().then(...);
});
```

### DTMF

Callee will be put on hold and the another person can join into the call by dialing the extension number announced within the call.

```js
session.dtmf('DTMF_DIGITS').then(...);
```

### Hold Unhold

Callee will be put on hold and the another person can join into the call by dialing the extension number announced within the call.

```js
session.hold().then(...);
session.unhold().then(...);
```

### Mute Unmute

Callee will be put on mute or unmute

```js
session.mute();
session.unmute();
```

### Park

Callee will be put on hold and the another person can join into the call by dialing the extension number announced within the call.

```js
session.park().then(...);
```

### Flip

Caller can filp calls to different devices logged in through the same credentials.

```js
session.flip('TARGET_NUMBER').then(...);
```

### Transfer

```js
session.transfer('TARGET_NUMBER').then(...);
```

### Warm Transfer

If an agent has an active call with a customer and needs to transfer this call to a supervisor, then agent puts existing
call on hold, makes a call to a supervisor and when ready performs a warm transfer. Customer will be connected to
supervisor and the call between customer and agent will be disconnected.

Warm transfer puts current line on hold (if not done yet) then takes an existing line from arguments and makes transfer.

####Handle Warm Transfer senario (Attended Transfer usecase) :
Steps:
1. Put the current session on ``Hold`` as shown in the demo code
2. Initiate a new session (Start new call)
3. a. Once new call is answered , ``Complete`` the transfer , or terminate new session.
   b. If you want to switch to original call, switch the session context and ``Unhold`` the session

```javascript
$modal.find('.transfer-form button.warm').on('click', function(e) {
   session.hold().then(function() {
                console.log('Placing the call on hold, initiating attended transfer');
                var newSession = session.ua.invite($transfer.val().trim());
                newSession.once('accepted', function() {
                    console.log('New call initated. Click Complete to complete the transfer');
                    $modal.find('.transfer-form button.complete').on('click', function(e) {
                        session
                            .warmTransfer(newSession)
                            .then(function() {
                                console.log('Warm transfer completed');
                            })
                            .catch(function(e) {
                                console.error('Transfer failed', e.stack || e);
                            });
                    });
                });
            });
});
```

### Forward

```js
session.forward('TARGET_NUMBER').then(...);
```

### Start/Stop Recording

```js
session.startRecord().then(...);
session.stopRecord().then(...);
```

### Barge/Whisper

Not yet implemented. Could be done by dialing \*83. The account should be enabled for barge/whisper access through system admin.

## Upgrade Procedure from v0.4.X to 0.8.0

- SDK now only supports only Unified SDP plan. You can find more information about this here:  [https://chromestatus.com/feature/5723303167655936](https://chromestatus.com/feature/5723303167655936)

- SDK now only supports "require" as rtcp-mux policy. We no more support "negotiate". You can find more information about this here: [https://www.juandebravo.com/2017/02/15/rtcp-mux-in-webrtc/](https://www.juandebravo.com/2017/02/15/rtcp-mux-in-webrtc/)

- SDK now handles SIP Re-Invites, which helps in handling one-way audio issues / reconnecting media due to network reconnections.

- SDK constructor now allows to add custom UA Configuration parameters like `sessionDescriptionHandlerFactory` , `sessionDescriptionHandlerFactoryOptions`

- SDK now handles rendering HTML Media Elements. Pass remoteVideo and localVideo elements via SDK constructor

- SDK also offers to addTrack() to handle remoteVideo and localVideo elements outside the constructor too


-  For FireFox browser support
    - Client application needs to detect if the browser is firefox.
    - Client application needs to set custom UA configuration option 'options.enableMidLinesInSDP' to `true` for browser >= FF v63 for hold functionality to work
    - QoS feature is not supported on FireFox due to browser related bugs. Please set the custom UA configuration option `options.enableQos` to `false`

- SDK can now detect AudioInputLevel if the microphone device is not present or the input volume is set to 0. Added event listner `no-input-volume` for the same

- SDK can now detect AudioOutputLevel if the headset/speaker device is not configured correctly or the output volume is set to 0. Added event listner `no-output-volume` for the same

- You can now enable logging for AudioInputLevel, AudioOutputLevel and Media Reports by setting the custom UA configuration option `options.enableMediaReportLogging` to true. This will help in providing more information on one-way audio issues if there are any


### Initialization

Before:
```javascript
webPhone = new RingCentral.WebPhone(data, {
            appKey: localStorage.getItem('webPhoneAppKey'),
            audioHelper: {
                enabled: true
            },
            logLevel: parseInt(logLevel, 10),
            appName: 'WebPhoneDemo',
            appVersion: '1.0.0',
        });
```


After:
```javascript

var remoteVideoElement =  document.getElementById('remoteVideo');
var localVideoElement  = document.getElementById('localVideo');
webPhone = new RingCentral.WebPhone(data, {
    appKey: localStorage.getItem('webPhoneAppKey'),
    audioHelper: {
        enabled: true
    },
    logLevel: parseInt(logLevel, 10),
    appName: 'WebPhoneDemo',
    appVersion: '1.0.0',
    media: {
        remote: remoteVideoElement,
        local: localVideoElement
    },
    //to enable QoS Analytics Feature
    enableQos:true,
    enableMediaReportLogging : true
});
```

### Accept Invites:

Before:
```javascript
var acceptOptions = {
            media: {
                render: {
                    remote: document.getElementById('remoteVideo'),
                    local: document.getElementById('localVideo')
                }
            }
      };
...
...
session.accept(acceptOptions).then(function() {
...
});;
```

After:
```javascript
session.accept().then(function() {
...
})
```

### Send Invite:

Before:
```javascript
var session = webPhone.userAgent.invite(number, {
    media: {
        render: {
            remote: document.getElementById('remoteVideo'),
            local: document.getElementById('localVideo')
        }
    },
    fromNumber: username,
    homeCountryId: homeCountryId
});
```

After:
```javascript
var session = webPhone.userAgent.invite(number, {
    fromNumber: username,
    homeCountryId: homeCountryId
});
```


### Auto Answer incoming calls if Invites containing ``Alert-Info: Auto Answer`` header field:

```javascript

For incoming calls
function onInvite(session) {
    if (session.request.headers['Alert-Info'][0].raw === 'Auto Answer') {
            session
                .accept()
                .then(function() {
                    onAccepted(session);
                })
                .catch(function(e) {
                    console.error('Accept failed', e.stack || e);
                });
    }
...
...
}
```


## Compatibility Matrix

| Date | SDK | SIPJS | Chrome | Firefox |
|---|---|---|---|---|
| Feb 2016 | 0.2.0 | 0.6.4 | not known may be v50-70 | :warning: NA |
| Apr 2016 | 0.3.0 | 0.7.3 | not known may be v50-70 | :warning: NA |
| Jun 2016 | 0.3.1 | 0.7.4 | not known may be v50-70 | :warning: NA |
| Aug 2016 | 0.3.2 | 0.7.5 | 54 to 56 | :warning: NA |
| Sep 2016 | 0.4.0-RC1 | 0.7.5 | 54 to 56 | :warning: NA |
| Jan 2017 | 0.4.0 | 0.7.5 | 54 to 56 | :warning: NA |
| Mar 2017 | **0.4.1** | 0.7.7 | 54 to 70, rtcp mux support, media API changes | :warning: Issues with Audio, SBC |
| Aug 2017 | 0.4.2 | 0.7.7 | 61 to 70 | :warning: Issues with Audio, SBC |
| Aug 2017 | 0.4.3 | 0.7.8 | 61 to 70 | :warning: Not Tested |
| Sep 2017 | 0.4.4 | 0.7.8 | 62 to 70 | :warning: Issues with DTMF |
| Nov 2017 | 0.4.5 | 0.7.8 | 64 to 70 | :warning: Issues with DTMF |
| Jul 2018 | 0.5.0 | 0.10.0 | 68 to 70 | :warning: Issues with DTMF |
| Nov 2018 | 0.6.0 | 0.11.3 | 68 to 70 | Regression tested for 62, 63 supported with custom modifiers |
| Nov 2018 | **0.6.1** | 0.11.6 | 71+, explicit `plan b` SDP support | 62 to 64 |
| Dec 2018 | 0.6.2 | 0.11.6 | 71+ | 62 to 65 |
| Feb 2019 | 0.6.3 | 0.11.6 | 71+ | 62 to 65 , :warning: QoS feature not supported |
| Apr 2019 | 0.7.0 | 0.13.5 | 71+ | 62 to 65 , :warning: QoS feature not supported |
| May 2019 | 0.7.1 | 0.13.5 | 71+ | 62 to 65 , :warning: QoS feature not supported |
| Jun 2019 | 0.7.2 | 0.13.5 | 71+ | 62 to 65 , :warning: QoS feature not supported |
| Nov 2019 | 0.7.3 | 0.13.5 | 71+ | 62 to 65 , :warning: QoS feature not supported |
| Nov 2019 | 0.7.5 | 0.13.5 | 71+ | 62 to 65 , :warning: QoS feature not supported |
| Jan 2020 | 0.7.6 | 0.13.5 | 71+ | 62 to 65 , :warning: QoS feature not supported |
| Jan 2020 | 0.7.7 | 0.13.5 | 71+ | 62 to 65 , :warning: QoS feature not supported |
| Feb 2020 | 0.7.8 | 0.13.5 | 71+ | 62 to 65 , :warning: QoS feature not supported |
| Mar 2020 | 0.8.0 | 0.13.5 | 71+ | 62 to 65 , :warning: QoS feature not supported |