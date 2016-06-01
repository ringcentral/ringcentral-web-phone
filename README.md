# RingCentral WebPhone Library

The RingCentral WebPhone Library includes a JavaScript WebRTC library and a WebRTC phone demo app.


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
  1. [Forward](#forward)
  1. [Start Stop Recording](#start-stop-recording)
  1. [Barge Whisper](barge-whisper)

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
Permissions   | `VoIP Calling`  | `Specific application permission required`
Platform type | `Browser-based` | `Client edition is not compatible with current Brand`

You need to have a `DIGITAL LINE` attached to an extension. You can configure this in Online Web Portal for [Production](https://service.ringcentral.com/) and [Sandbox](https://service.devtest.ringcentral.com/) accounts. More information on Digital Lines and their configuraiton is available in the following RingCentral Knowledge Base articles:

1. [Digital Line Overview (KB 5862)](http://success.ringcentral.com/articles/en_US/RC_Knowledge_Article/5862)
2. [Purchasing an IP Phone or RingCentral Digital Line from the online account (KB 3136)](http://success.ringcentral.com/articles/RC_Knowledge_Article/5-10-Adding-Phones-to-other-extensions-via-Web). A limited number of Digital Lines are free with each sandbox account which can be configured with the free RingCentral for Desktop softphone.
3. [Assigning a Digital Line to a Different Extension (KB 3748)](http://success.ringcentral.com/articles/en_US/RC_Knowledge_Article/How-to-Assign-an-Existing-Digital-Line-to-a-different-extension)

These permissions be configured for your app in the [RingCentral Developer Portal](https://developers.ringcentral.com/). Fill this [Registration Form](https://docs.google.com/forms/d/15kK_zJ5FhyXiH8gwOqiaG7_BuTWGCeeVr4MAv4OBpUM/viewform) to get access to WebRTC permissions. Please contact devsupport@ringcentral.com to request these permissions.

### Include Library And HTML Elements

```html
<video id="remoteVideo" hidden="hidden"></video>
<video id="localVideo" hidden="hidden" muted="muted"></video>

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

## Demo

```sh
$ git clone https://github.com/ringcentral/ringcentral-web-phone.git
$ cd ringcentral-web-phone
$ npm install
$ npm start
```

1. Open `http://localhost:8080/demo/` in the browser (port may change if `8080` will be already used by other app)
2. Add your RC credentials and click on `Register`
3. For making outbound calls, enter phone number and click on `Call`
4. For receiving incoming calls, Click on `Accept` button when window pops up (will be visible when there is an incoming call)

If there's any connection problems to Sandbox environment, you may need to switch to the Production environment.

WebRTC works with issues when served from file system directly to browser (e.g. `file://` protocol), so you will
need a local HTTP server (comes with this package).

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
    - `onSession` &mdash; this callback will be fired each time User Agent starts working with session (incoming or outgoing)

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

