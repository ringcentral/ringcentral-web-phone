## Development

### Demo App

#### Getting started

Use the following steps to get started using the web phone demo:

```sh
$ git clone https://github.com/vyshakhbabji/web-phone-1.git
$ cd web-phone
$ npm install
$ sudo npm install http-server -g //skip this if you have http-server installed
$ cd demo
$ http-server
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





