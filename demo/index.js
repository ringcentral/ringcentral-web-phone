//.factory("ringout", function($rootScope, $q, callMonitor, utils, logging, rcCore, rcPlatform, rcSIPUA, appstorage, settingsService, getLocaleString, $locale) { 'use strict';
var webPhone = new RingCentral.WebPhone({audioHelper: true});
var platform;



(function(){
    webPhone.ua.on('sipIncomingCall', function(e) {
        document.getElementById("hid2").style.display = "block";
    });

    webPhone.ua.on('callStarted',function(e){
        setInterval(function() {
            document.getElementById('activeCalls').innerText = webPhone.ua.getActiveLinesArray().length;
            function f(val, d) {
                var sval = val + '';
                return '000000'.substr(0, d - sval.length) + val;
            }
            var dur = Math.ceil(line.getCallDuration() / 1000);
            var sec = dur % 60;
            var min = Math.floor(dur / 60);
            var hours = Math.floor(dur / 3600);
            document.getElementById("duration").innerText = 'Duration: ' + f(hours, 2) + ':' + f(min, 2) + ':' + f(sec, 2);
        }, 500);
    })



})();


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
    webPhone.mute().catch(function(e){ console.error(e);});
    console.log('Call Mute\n');
}

function unmute() {
    webPhone.unmute().catch(function(e){ console.error(e);});
    console.log('Call Unmute\n');
}

function hold() {
    webPhone.getLine().setHold(true).catch(function(e){ console.error(e);});
    console.log('Call Hold\n');
}

function unhold() {
    webPhone.getLine().setHold(false).catch(function(e){ console.error(e);});
    console.log('Call UnHold\n');
}

function answerIncomingCall() {
    webPhone.answer(line).catch(function(e){ console.error(e);});
   var delay = 1000; //1 seconds

    //setTimeout(function() {
    //    if (line.getContact().number == "16197619503") {
    //        console.log("incoming call - recording")
    //        line.record(true);
    //    }
    //}, delay);
    console.log('Answering Incoming Call\n');
}

function disconnect() {
    webPhone.hangup(line).catch(function(e){ console.error(e);});
    document.getElementById("hid2").style.display = "none";
    console.log('Hangup Call\n');
}

function isOnCall() {
    return webPhone.onCall();
}


function reregister() {
    webPhone.reregister().catch(function(e){console.error(e);});
    console.log('Reregistered SIP\n');
}


function unregisterSip() {
    document.getElementById("hid").style.display = "none"
    webPhone.unregister().catch(function(e){ console.error(e);});
    console.log('Unregistered SIP\n');
}

function forceDisconnectSip() {
    document.getElementById("hid").style.display = "none"
    webPhone.forceDisconnect();
    console.log('Forcing SIP disconnection\n');
}


function startRecording() {
    webPhone.getLine().record(true);
    console.log('Start Recording Call\n');
}

function stopRecording() {
    webPhone.getLine().record(false);
    console.log('Stop Recording Call\n');
}


function callpark() {
    webPhone.getLine().park();
    console.log('Call Parking\n');
}

function callflip(number) {
    webPhone.getLine().flip(number);
}

function callTransfer(number) {
    webPhone.getLine(line).transfer(number).then(function(){
        console.log('Call Transfer\n');
    }).catch(function(e){console.error(e)});

}


function sendDTMF(DTMF) {
        webPhone.sendDTMF(DTMF).catch(function(e){ console.error(e);});
        console.log('Send DTMF' + DTMF + '\n');
}

function forward(number) {
    webPhone.getLine(line).forward(number).then(function(){
        console.log('Call Transfer\n');
    }).catch(function(e){console.error(e)});
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

            console.log("Sip Provisioning Data from RC API: " + JSON.stringify(data));

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
 * @param server
 * @param apikey
 * @param apisecret
 * @param username
 * @param extension
 * @param password
 */
function register(server, apikey, apisecret, username,extension, password) {
    server = server || RingCentral.SDK.server.sandbox;
    // TODO: Fix this to handle non-US country codes properly
    if (username) {
        username = (username.match(/^1/)) ? username : '1' + username;
    }
    if (document.getElementById('remember').checked) {
        localStorage.webPhoneServer = server;
        localStorage.webPhoneAppKey = apikey || '';
        localStorage.webPhoneAppSecret = apisecret || '';
        localStorage.webPhoneLogin = username || '';
        localStorage.webPhoneExtension = extension || '';
        localStorage.webPhonePassword = password || '';
        localStorage.webPhoneRemember = true;
    }

    var sdk = new RingCentral.SDK({
        appKey: apikey, //,
        appSecret: apisecret,//localStorage.webPhoneAppSecret,
        server: server
    });
    platform = sdk.platform();
    platform
        .login({
            username: username,// localStorage.webPhoneLogin,
            extension: extension,
            password: password// localStorage.webPhonePassword
        })
        .then(function() {
            return registerSIP();
        })
        .then(function () {
           if(webPhone.isRegistered==true){
               document.getElementById("hid").style.display = "block"
           }
            else {
               document.getElementById("hid").style.display = "none"
           }
        });

}

setTimeout(function(){
    document.getElementById('server').value = localStorage.webPhoneServer || RingCentral.SDK.server.sandbox;
    document.getElementById('apikey').value = localStorage.webPhoneAppKey || '';
    document.getElementById('apisecret').value = localStorage.webPhoneAppSecret || '';
    document.getElementById('fromnumber').value = localStorage.webPhoneLogin || '';
    document.getElementById('extension').value = localStorage.webPhoneExtension || '';
    document.getElementById('password').value = localStorage.webPhonePassword || '';

    if (localStorage.webPhoneRemember) {
        document.getElementById('remember').checked = true;
    }
}, 100);

function switchEnv(env) {
    environment = env;
    document.getElementById('env').textContent = env;
}

console.log('WebPhone version: ' + RingCentral.WebPhone.version);
