# Usage

```html
<script src=".../ringcentral-bundle.js" type="text/javascript"></script>
<script src=".../ringcentral-web-phone.js" type="text/javascript"></script>
```

```js
var webphone = RingCentral.WebPhone;

var sdk = new RingCentral.SDK({
    appKey: '...',
    appSecret: '...',
    server: RingCentral.SDK.server.production // or .sandbox
});

var platform = sdk.platform();

platform
    .login({
        username: '...',
        password: '...'
    })
    .then(function() {
    
        return platform
            .post('/client-info/sip-provision', {
                sipInfo: [{
                    transport: transport
                }]
            })
            .then(function(res) {
                return webPhone.registerSIP(res.json());
            });
        
    })
    .then(function(){
    
        // YOUR CODE
    
    });
```

## Development

### Demo App

#### Getting started

Use the following steps to get started using the web phone demo:

```sh
$ git clone https://github.com/vyshakhbabji/web-phone-1.git
$ cd web-phone
$ npm install
$ sudo npm install http-server -g //skip this if you have http-server installed
$ http-server
Click on  (drwxr-xr-x)		demo/ 
```

Open /web-phone/demo/index.html in the browser.
Add your RC credentials and click on `Register Sip Configurations` .

For making outbound calls, enter `to phone number` and click on call. To disconnect to call, click on `Disconnect Call`.

For recieve incoming calls, Click on `Accept incoming calls` when you hear incoming call ringing


Functionalities included:

1. Sip Register/UnRegister
2. Make Outgoing Calls
3. Accept Incoming calls
4. Hold/UnHold calls
5. Mute/Unmute calls
6. Transfer calls
7. Record/Stop recording calls
8. Flip, park calls
9. Send DTMF, Info DTMF 


Explanation for certain `Control Sender` properties
1. `park` - Callee will be put on hold and the another person can join into the call by dialing the extension number announced within the call. 
2. `flip` - Caller can filp calls to different devices logged in through the same credentials
3. `barge`/`whisper` - not yet implemented. Could be done by dialing *83 . The account should be enabled for barge/whisper access through system admin





