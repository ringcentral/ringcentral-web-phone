//.factory("ringout", function($rootScope, $q, callMonitor, utils, logging, rcCore, rcPlatform, rcSIPUA, appstorage, settingsService, getLocaleString, $locale) { 'use strict';
var webPhone = new RingCentral.WebPhone({audioHelper: true});
var platform;
var log = document.getElementById('log');

function startCall(toNumber, fromNumber) {
    if (fromNumber == "")
        alert('Fill in the number');
    else {
        fromNumber = fromNumber || localStorage.webPhoneLogin;
        platform
            .get('/restapi/v1.0/account/~/extension/~')
            .then(function(res) {
                var info = res.json();
                if (info && info.regionalSettings && info.regionalSettings.homeCountry) {
                    return info.regionalSettings.homeCountry.id;
                }
                return null;
            })
            .then(function(countryId) {
                console.log('SIP call to', toNumber, 'from', fromNumber + '\n');
                webPhone.call(toNumber, fromNumber, countryId);
            })
            .catch(function(e){
                console.error(e.stack);
            });
    }
}

function mute() {
    webPhone.mute(line);
    console.log('Call Mute\n');
}

function unmute() {
    webPhone.unmute(line);
    console.log('Call Unmute\n');
}

function hold() {
    webPhone.hold(line);
    console.log('Call Hold\n');
}

function unhold() {
    webPhone.unhold(line);
    console.log('Call UnHold\n');
}

function answerIncomingCall() {
    webPhone.answer(line);
    //
    console.log("Incoming call from : " + line.getContact().number);
    //

    var delay = 1000; //1 seconds

    setTimeout(function() {
        if (line.getContact().number == "16197619503") {
            console.log("incoming call - recording")
            line.record(true);
        }
    }, delay);


    console.log('Answering Incoming Call\n');
}

function disconnect() {
    webPhone.hangup(line);
    console.log('Hangup Call\n');
}

function isOnCall() {
    return webPhone.onCall();
}


function reregister() {
    webPhone.reregister();
    console.log('Reregistered SIP\n');
}


function unregisterSip() {
    webPhone.unregister();
    console.log('Unregistered SIP\n');
}

function forceDisconnectSip() {
    webPhone.forceDisconnect();
    console.log('Forcing SIP disconnection\n');
}


function startRecording() {

    line.record(true);
    console.log('Start Recording Call\n');
}

function stopRecording() {
    line.record(false);
    console.log('Stop Recording Call\n');
}


function callpark() {
    line.park();
    console.log('Call Parking\n');
}

function callflip(number) {
    if (number == "")
        alert('Fill in the number');
    else
        line.flip(number)
}

function callTransfer(number) {
    if (number == "")
        alert('Fill in the number');
    else {
        line.transfer(number)
        console.log('Call Transfer\n');
    }
}

function sendDTMF(DTMF) {
    if (DTMF == "")
        alert('Fill in the DTMF');
    else {
        line.sendDTMF(DTMF)
        console.log('Send DTMF' + DTMF + '\n');
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

            console.log("Sip Data" + JSON.stringify(data));

            return webPhone.register(data, checkFlags)
                .then(function(){
                    console.log('Registered');
                })
                .catch(function(e) {
                    var err = e && e.status_code && e.reason_phrase
                        ? new Error(e.status_code + ' ' + e.reason_phrase)
                        : (e && e.data)
                                  ? new Error('SIP Error: ' + e.data)
                                  : new Error('SIP Error: ' + (e || 'Unknown error'));
                    console.error('SIP Error: ' + ((e && e.data) || e) + '\n');
                    return Promise.reject(err);
                });

        }).catch(function(e) {
            console.error(e);
            return Promise.reject(e);
        });
}

function app() {
}

/**
 * TODO Create remember flag
 * @param apikey
 * @param apisecret
 * @param username
 * @param password
 */
function register(apikey, apisecret, username, password) {

    localStorage.webPhoneAppKey = apikey;
    localStorage.webPhoneAppSecret = apisecret;
    localStorage.webPhoneLogin = username;
    localStorage.webPhonePassword = password;

    var sdk = new RingCentral.SDK({
        appKey: apikey, //,
        appSecret: apisecret,//localStorage.webPhoneAppSecret,
        server: RingCentral.SDK.server.sandbox
    });
    platform = sdk.platform();
    platform
        .login({
            username: username,// localStorage.webPhoneLogin,
            password: password// localStorage.webPhonePassword
        })
        .then(function() {
            return registerSIP();
        })
        .then(app);

}

setTimeout(function(){
    document.getElementById('apikey').value = localStorage.webPhoneAppKey;
    document.getElementById('apisecret').value = localStorage.webPhoneAppSecret;
    document.getElementById('fromnumber').value = localStorage.webPhoneLogin;
    document.getElementById('password').value = localStorage.webPhonePassword;
}, 100);

console.log('WebPhone version: ' + RingCentral.WebPhone.version);