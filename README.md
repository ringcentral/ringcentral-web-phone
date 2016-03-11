# RingCentral WebPhone Library

## Installation

```ssh
npm install ringcentral-web-phone
// or
bower install ringcentral-web-phone
```

## Demo

```sh
git clone https://github.com/ringcentral/ringcentral-web-phone.git
npm install
bower install
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
4. For recieve incoming calls, Click on Accept button when window pops up (will be visible when there is an incoming call).

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

## Usage

### Include Library And HTML Elements

```html
<video id="remoteVideo" hidden="hidden"></video>
<video id="localVideo" hidden="hidden" muted="muted"></video>

<script src=".../ringcentral-bundle.js" type="text/javascript"></script>
<script src=".../ringcentral-web-phone.js" type="text/javascript"></script>
```

### Application

Configure the web-phone:

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
                    uuid: loginResponse.json().endpoint_id, // or you can store any UUID in localStorage
                    logLevel: 1 // error 0, warn 1, log: 2, debug: 3
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

### API

Except for some RingCentral-specific features the API is 100% the same as SIP.JS: http://sipjs.com/api/0.7.0: most of 
the time you will be working with RC-flavored [UserAgent](http://sipjs.com/api/0.7.0/ua) and
[Session](http://sipjs.com/api/0.7.0/session) objects of SIP.JS.

We encourage you to take a look at [Guides](http://sipjs.com/guides) section, especially
[Make A Call](http://sipjs.com/guides/make-call) and [Receive A Call](http://sipjs.com/guides/receive-call/) articles.

#### Initiating The Call

```javascript
var session = webPhone.userAgent.invite('PHONE_NUMBER', {
    media: {
        render: {
            remote: document.getElementById('remoteVideo'),
            local: document.getElementById('localVideo')
        }
    },
    homeCountryId: '1' // Optional, the value of
}).then(...);
```

#### Accepting Incoming Call

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

#### DTMF

Callee will be put on hold and the another person can join into the call by dialing the extension number announced within the call.

```js
session.dtmf('DTMF_DIGITS').then(...);
```

#### Hold/Unhold

Callee will be put on hold and the another person can join into the call by dialing the extension number announced within the call.

```js
session.hold().then(...);
session.unhold().then(...);
```

#### Park

Callee will be put on hold and the another person can join into the call by dialing the extension number announced within the call.

```js
session.park().then(...);
```

#### Flip

Caller can filp calls to different devices logged in through the same credentials.

```js
session.flip('TARGET_NUMBER').then(...);
```

#### Transfer

```js
session.transfer('TARGET_NUMBER').then(...);
```

#### Forward

```js
session.forward('TARGET_NUMBER').then(...);
```

#### Start / Stop Recording

```js
session.startRecord().then(...);
session.stopRecord().then(...);
```

#### Barge/Whisper

Not yet implemented. Could be done by dialing \*83. The account should be enabled for barge/whisper access through system admin.