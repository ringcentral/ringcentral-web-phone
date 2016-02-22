# RingCentral WebPhone Library

## Installing

```sh
git clone https://github.com/ringcentral/ringcentral-web-phone.git
npm install
npm run build
```

## Usage
### Include Library

```html
<script src=".../ringcentral-bundle.js" type="text/javascript"></script>
<script src=".../ringcentral-web-phone.js" type="text/javascript"></script>
```

### Application

Configure the web-phone:

```js
var webPhone = new RingCentral.WebPhone({
    audioHelper: true
});

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
                    transport: 'WSS'
                }]
            })
            .then(function(res) {
                return webPhone.register(res.json());
            });
        
    })
    .then(function(){
    
        // YOUR CODE
    
    });
```

## API

### WebPhone Events

Handling Phone Events and SIP events is as below 
```javascript
 webPhone.ua.on('<EVENT>', function(e) {
        //do something
    });
```

#### Event supported are as below:
```javascript
      'message': 'message',
     'sipConnecting': 'sipConnecting',
     'sipConnected': 'sipConnected',
     'sipDisconnected': 'sipDisconnected',
     'sipRegistered': 'sipRegistered',
     'sipUnRegistered': 'sipUnregistered',
     'sipRegistrationFailed': 'sipRegistrationFailed',
     'incomingCall': 'incomingCall',                     //when incoming call is received
     'sipIncomingCall': 'sipIncomingCall',               //same as incomingCall
     'outgoingCall': 'outgoingCall',                     //when the outbound call is initiated
     'callConnecting': 'callConnecting',                 //when ICE gathering is started
     'callProgress': 'callProgress',                     //when 1xx provisional message is received (outbound only) or call is accepted, but ACK is still not sent (inbound only)
     'callStarted': 'callStarted',                       //when ACK is sent
     'callRejected': 'callRejected',                     //when the call is rejected by its party
     'callEnded': 'callEnded',                           //when the call had ended without errors (BYE)
     'callTerminated': 'callTerminated',                 //when the media is terminated, UNSTABLE in SIP.js 0.6.x
     'callFailed': 'callFailed',                         //when the call is failed because of many different reasons (connection issues, 4xx errors, etc.)
     'callHold': 'callHold',                             //when the call is put on hold
     'callUnhold': 'callUnhold',                         //when the call is unholded
     'callMute': 'callMute',                             //when the call is muted
     'callUnmute': 'callUnmute',                         //when the call is unmuted
     'callReplaced': 'callReplaced',                     //when the call has been replaced by an incoming invite
     'sipRTCSession': 'sipRTCSession',
     'sipConnectionFailed': 'sipConnectionFailed',
     'ICEConnected': 'ICEConnected',
     'ICECompleted': 'ICECompleted',
     'ICEFailed': 'ICEFailed',
     'ICEChecking': 'ICEChecking',
     'ICEClosed': 'ICEClosed',
     'ICEDisconnected': 'ICEDisconnected',
     'callReinviteSucceeded': 'callReinviteSucceeded',
     'callReinviteFailed': 'callReinviteFailed'
```


### WebPhone Interface

#### Sip Register/ Reregister / Unregister / Force Disconnect
```javascript
webPhone.register(info, checkFlags)

webPhone.unregister()

webPhone.forceDisconnect()

webPhone.reregister(<reconnectConfig>)
```
Registers/unregisters sip connection

#### call
```javascript
webPhone.call(toNumber, fromNumber, country)
```
Make outgoing call

#### onCall
```javascript
webPhone.hangup(line)
```
Return if on call

#### hangup 
```javascript
webPhone.hangup(line)
```
Disconnect line

#### answer 
```javascript
webPhone.answer(line)
```
Answer incoming line

#### hold/ unhold
```javascript
webPhone.hold(line)
```
Toggle holding the line

#### mute / unmute
```javascript
webPhone.mute(line)
```
Toggle muting the line

#### transfer
```javascript
webPhone.transfer(line, number, options{})
```
Transfer a call

#### on
```javascript
webPhone.on(eventName, callback)
```
Subscribe to the web-phone event. Allows to add several listeners.


### PhoneLine Interface

#### getId
```javascript
line.getId()
```
Returns call session id 

#### getSession
```javascript
line.getSession()
```
Returns call session 
 
#### cancel
```javascript
line.cancel()
```
Disconnect/Terminate the call
  
#### record
```javascript
line.record( true | false)
```
Start | Stop recording


#### flip
```javascript
line.flip(number)
```
Flip the call to another number and unhold when the call is finished to continue the call

#### park
```javascript
line.park()
```

Park the call and another account user can take the call dailing the extension announced while parked

#### sendDTMF
```javascript
line.sendDTMF(value, duration)
```
Send DTMF tones through the local stream 
 
#### blindTransfer|transfer 
```javascript
line.transfer(number, options{})
```
Transfer calls to another number


#### forward
```javascript
line.forward(number, options{})
```
Forward incoming calls

#### answer
```javascript
line.answer()
```
Answer incoming calls

#### setMute | setMuteBoth
```javascript

line.setMute(true|false)  | line.setMuteBoth(true|false)
```
Mute/ Unmute call for local stream and/or remote stream

#### sendRequest
```javascript
line.sendRequest(method, body, options) 
```
Send custom requests to the current sip session


#### __hold | setHold
```javascript
line.hold( true|false) | line.setHold(true|false) 
```
Hold/Unhold call

#### isOnHold
```javascript
line.isOnHold()
```
Returns is the line is currently on hold

#### isOnRecord
```javascript
line.isOnRecord()
```
Returns is the line is currently on record

#### isOnMute
```javascript
line.isOnMute()
```
Returns is the line is currently muted

#### getContact
```javascript
line.getContact()
```
Returns line contact:

#### getCallDuration
```javascript
line.getCallDuration()
```
Returns call duration in milliseconds

#### getContact
```javascript
line.getContact()
```
Returns contact info

#### getCallDuration
```javascript
line.getCallDuration()
```
Returns call duration in seconds unit

#### isClosed
```javascript
line.isClosed()
```
Returns if the call is ended or terminated

#### hasEarlyMedia
```javascript
line.hasEarlyMedia()
```
Early media occurs from the moment the initial INVITE is sent until the User Agent generates a final response

#### isIncoming
```javascript
line.isIncoming()
```
Returns if call is incoming

## Development

#### Demo app structure

Demo application is Simple HTML5 page

```
/web-phone
  /demo
    /audio
    /img
    index.html
    index.js
    ringcentral-bundle.js
```

#### Getting started

Use the following steps to get started using the web phone demo:

```sh
$ git clone https://github.com/ringcentral/ringcentral-web-phone.git
$ cd ringcentral-web-phone
$ npm install
$ sudo npm install http-server -g //skip this if you have http-server installed
$ http-server
```

Open localhost:8080/demo/ in the browser

Add your RC credentials and click on `Register Sip Configurations` .

For making outbound calls, enter `to phone number` and click on call. To disconnect to call, click on `Disconnect Call`.

For recieve incoming calls, Click on `Accept incoming calls` button which will be visible when there is an incoming call.

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


Explanation for certain `Control Sender` properties
1. `park` - Callee will be put on hold and the another person can join into the call by dialing the extension number announced within the call. 
2. `flip` - Caller can filp calls to different devices logged in through the same credentials
3. `barge`/`whisper` - not yet implemented. Could be done by dialing *83 . The account should be enabled for barge/whisper access through system admin

