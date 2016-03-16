# RingCentral WebPhone Library

The RingCentral WebPhone Library includes a JavaScript WebRTC library and a WebRTC phone demo app.


## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
  1. [Configuring your RingCentral app](#configuring-your-ringcentral-app)
  1. [Include Library And HTML Elements](#include-library-and-html-elements)
  2. [Application](#application)
3. [API](#api)
  1. [Initiating The Call](#initiating-the-call)
  1. [Accepting Incoming Call](#accepting-incoming-call)
  1. [DTMF](#dtmf)
  1. [Hold Unhold](#hold-unhold)
  1. [Mute Unmute](#mute-unmute)
  1. [Park](#park)
  1. [Flip](#flip)
  1. [Transfer](#transfer)
  1. [Forward](#forward)
  1. [Start Stop Recording](#start-stop-recording)
  1. [Barge Whisper](barge-whisper)
4. [Development](#development)
  1. [Demo app](#demo-app)
  1. [Demo app structure](#demo-app-structure)

---

## Installation

```ssh
npm install ringcentral-web-phone
// or
bower install ringcentral-web-phone
```

---

## Usage

### Configuring your RingCentral app

Ensure your app has the following properties set. If these are not set, the error specified will be returned.

App Property  | Value           | Error if not set
--------------|-----------------|-----------------
Permissions   | `VoIP Calling` , `Interoperability` | `Specific application permission required`
Platform type | `Browser-based` | `Client edition is not compatible with current Brand`

You need to have a `DIGITAL LINE` attached to an extension. You can configure this in Online Web Portal [Production](https://service.ringcentral.com/) , [Sandbox](https://service.devtest.ringcentral.com/)

These can be configured for your app in the [RingCentral Developer Portal](https://developers.ringcentral.com/). Fill this [Registration Form](https://docs.google.com/forms/d/15kK_zJ5FhyXiH8gwOqiaG7_BuTWGCeeVr4MAv4OBpUM/viewform) to get access to WebRTC permissions. Please contact devsupport@ringcentral.com to request these permissions.


### Include Library And HTML Elements

```html
<video id="remoteVideo" hidden="hidden"></video>
<video id="localVideo" hidden="hidden" muted="muted"></video>

<script src=".../ringcentral-bundle.js" type="text/javascript"></script>
<script src=".../ringcentral-web-phone.js" type="text/javascript"></script>
```

### Application

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
            .then(function(res) {
            
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
                    }
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


## API

Except for some RingCentral-specific features the API is 100% the same as SIP.JS: http://sipjs.com/api/0.7.0: most of 
the time you will be working with RC-flavored [UserAgent](http://sipjs.com/api/0.7.0/ua) and
[Session](http://sipjs.com/api/0.7.0/session) objects of SIP.JS.

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

### Initiating The Call

```javascript
var session = webPhone.userAgent.invite('PHONE_NUMBER', {
    media: {
        render: {
            remote: document.getElementById('remoteVideo'),
            local: document.getElementById('localVideo')
        }
    },
    fromNumber: 'PHONE_NUMBER', // Optional, Company Number will be used as default
    homeCountryId: '1' // Optional, the value of
}).then(...);
```

### Accepting Incoming Call

```javascript
webPhone.userAgent.on('invite', function(session){
    session.accept({
        media: {
            render: {
                remote: document.getElementById('remoteVideo'),
                local: document.getElementById('localVideo')
            }
        }
    }).then(...);
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


## Development

### Demo app

```sh
$ git clone https://github.com/ringcentral/ringcentral-web-phone.git
$ npm install
$ npm install bower -g // skip this if you've already installed Bower
$ bower install
```

WebRTC works with issues when served from file system directly to browser (e.g. `file://` protocol), you will need a
local HTTP server. If you don't have local HTTP server, please install it as well:

```sh
$ sudo npm install http-server -g
$ http-server
```

1. Open localhost:8080/demo/ in the browser
2. Add your RC credentials and click on `Register Sip Configurations` .
3. For making outbound calls, enter phone number and click on call. To disconnect to call, click on `Disconnect Call`.
4. For receiving incoming calls, Click on Accept button when window pops up (will be visible when there is an incoming call).

The demo app uses the sandbox environment. If there's any connection problems, you may need to switch to the  production environment.

Functionalities included:

1. Sip Register/UnRegister
2. Make Outgoing Calls
3. Accept Incoming calls
4. Hold/UnHold calls
5. Mute/Unmute calls
6. Transfer calls
7. Record/Stop recording calls
8. Flip, park calls
9. Send DTMF
10. Forward incoming calls


### Demo app structure
```
/src
  /demo
    /img
    favicon.ico
    index.html
    index.js
```
