//.factory("ringout", function($rootScope, $q, callMonitor, utils, logging, rcCore, rcPlatform, rcSIPUA, appstorage, settingsService, getLocaleString, $locale) { 'use strict';
var webPhone = RingCentral.WebPhone;

localStorage.webPhoneUUID = localStorage.webPhoneUUID || webPhone.utils.uuid();

var platform ;


var log = document.getElementById('log');


['log','warn','error'].forEach(function (verb) {
    console[verb] = (function (method, verb, log) {
        return function (text) {
            method(text);
            var message = verb + '     :    '+ text + '<br />' ;
            log.innerHTML+=message;
        };
    })(console[verb].bind(console), verb, log);
});


function startCall(toNumber, fromNumber) {
    if (fromNumber == "")
        alert('Fill in the number');
    else {
        fromNumber = fromNumber || localStorage.webPhoneLogin;
        var countryId = null;
        platform
            .get('/restapi/v1.0/account/~/extension/~')
            .then(function (res) {
                var info = res.json();
                if (info && info.regionalSettings && info.regionalSettings.homeCountry) {
                    countryId = info.regionalSettings.homeCountry.id;
                }
            })
            .then(function () {
                console.log('SIP call to', toNumber, 'from', fromNumber+'\n');
                webPhone.sipUA.call(toNumber, fromNumber, countryId);
            });
    }
}

function mute(){
    webPhone.sipUA.mute(line);
    console.log('Call Mute\n');
}

function unmute(){
    webPhone.sipUA.unmute(line);
    console.log('Call Unmute\n');
}

function hold(){
    webPhone.sipUA.hold(line);
    console.log('Call Hold\n');
}

function unhold(){
    webPhone.sipUA.unhold(line);
    console.log('Call UnHold\n');
}

function answerIncomingCall(){
    webPhone.sipUA.answer(line);
    //
    console.log("Incoming call from : "+ line.getContact().number);
    //

    var delay=1000; //1 seconds

    setTimeout(function(){
        if(line.getContact().number=="16197619503"){
            console.log("incoming call - recording")
            line.record(true);
        }
    }, delay);


    console.log('Answering Incoming Call\n');
}

function disconnect(){
    webPhone.sipUA.hangup(line);
    console.log('Hangup Call\n');
}

function isOnCall(){
    return webPhone.sipUA.onCall();
}


function reregister(){
    webPhone.sipUA.reregister();
    console.log('Reregistered SIP\n');
}


function unregisterSip(){
    webPhone.sipUA.unregister();
    console.log('Unregistered SIP\n');
}

function forceDisconnectSip(){
    webPhone.sipUA.forceDisconnect();
    console.log('Forcing SIP disconnection\n');
}


function startRecording(){

    line.record(true);
    console.log('Start Recording Call\n');
}

function stopRecording(){
    line.record(false);
    console.log('Stop Recording Call\n');
}


function callpark(){
    line.park();
    console.log('Call Parking\n');
}

function callflip(number){
    if(number=="")
        alert('Fill in the number');
    else
        line.flip(number)
}

function callTransfer(number){
    if(number=="")
        alert('Fill in the number');
    else {
        line.transfer(number)
        console.log('Call Transfer\n');
    }
}

function sendDTMF(DTMF){
    if(DTMF=="")
        alert('Fill in the DTMF');
    else {
        line.sendDTMF(DTMF)
        console.log('Send DTMF'+DTMF+'\n');
    }
}

function forward(number) {
    if (number == "")
        alert('Fill in the number');
    else {
        line.forward(number)
        console.log('Call Forwarding\n');
    }
}

function registerSIP(checkFlags, transport) {
    transport = transport || 'WSS';
    return platform
        .post('/client-info/sip-provision', {
            sipInfo: [{
                transport: transport
            }]
        })
        .then(function(res) {
            var data = res.json();

            console.log("Sip Data"+JSON.stringify(data));

            if (!checkFlags || (typeof(data.sipFlags) === 'object' &&
                                //checking for undefined for platform v7.3, which doesn't support this flag
                                (data.sipFlags.outboundCallsEnabled === undefined || data.sipFlags.outboundCallsEnabled === true))) {
                console.log('SIP Provision data', data+'\n');
                 data = data.sipInfo[0];
                sipRegistrationData = data;
            }
            else {
                throw new Error('ERROR.sipOutboundNotAvailable'); //FIXME Better error reporting...
            }

            var headers = [];
            var endpointId = localStorage.webPhoneUUID;
            if (endpointId) {
                headers.push('P-rc-endpoint-id: ' + endpointId);
            }
            webPhone.utils.extend(data, {
                extraHeaders: headers
            });

            return webPhone.sipUA
                .register(data)
                .catch(function(e) {
                    var err = e && e.status_code && e.reason_phrase
                        ? new Error(e.status_code + ' ' + e.reason_phrase)
                        : (e && e.data)
                                  ? new Error('SIP Error: ' + e.data)
                                  : new Error('SIP Error: ' + (e || 'Unknown error'));
                    console.error('SIP Error: ' + ((e && e.data) || e)+'\n');
                    return Promise.reject(err);
                });

        }).catch(function(e) {
            console.error(e);
            return Promise.reject(e);
        });
}

function app() {
    webPhone.monitor.onUpdate(function() {
        console.log('Monitor update', arguments);
        document.getElementById('monitor').innerText = JSON.stringify(arguments, null, 2);

    });
}

function register(apikey,apisecret,username,password){
    var sdk = new RingCentral.SDK({
        appKey: apikey, //localStorage.webPhoneAppKey,
        appSecret: apisecret,//localStorage.webPhoneAppSecret,
        server: RingCentral.SDK.server.sandbox
    });
    platform = sdk.platform();
    platform
        .login({
            username: username,// localStorage.webPhoneLogin,
            password: password// localStorage.webPhonePassword
        })
        .then(function () {
            return registerSIP();
        })
        .then(app);
}

