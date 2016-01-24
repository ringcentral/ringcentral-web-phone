//.factory("ringout", function($rootScope, $q, callMonitor, utils, logging, rcCore, rcPlatform, rcSIPUA, appstorage, settingsService, getLocaleString, $locale) { 'use strict';
var webPhone = RingCentral.WebPhone;

localStorage.webPhoneUUID = localStorage.webPhoneUUID || webPhone.utils.uuid();

var sdk = new RingCentral.SDK({
    appKey: localStorage.webPhoneAppKey,
    appSecret: localStorage.webPhoneAppSecret,
    server: RingCentral.SDK.server.sandbox
});

var platform = sdk.platform();

function startCall(toNumber, fromNumber) {
    fromNumber = fromNumber || localStorage.webPhoneLogin;
    console.log('SIP call to', toNumber, 'from', fromNumber);
    var countryId = null;
    platform
        .get('/restapi/v1.0/account/~/extension/~')
        .then(function(res) {
            var info = res.json();
            if (info && info.regionalSettings && info.regionalSettings.homeCountry) {
                countryId = info.regionalSettings.homeCountry.id;
            }
        })
        .then(function() {
            webPhone.sipUA.call(toNumber, fromNumber, countryId);
        });
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

            if (!checkFlags || (typeof(data.sipFlags) === 'object' &&
                                //checking for undefined for platform v7.3, which doesn't support this flag
                                (data.sipFlags.outboundCallsEnabled === undefined || data.sipFlags.outboundCallsEnabled === true))) {
                console.log('SIP Provision data', data);
                data = data.sipInfo[0];
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
                    console.error('SIP Error: ' + ((e && e.data) || e));
                    return Promise.reject(err);
                });

        }).catch(function(e) {
            console.error(e);
            return Promise.reject(e);
        });
}

function app() {
    console.log('Sip Registered');
    webPhone.monitor.onUpdate(function() {
        console.log('Monitor update', arguments);
        document.getElementById('monitor').innerText = JSON.stringify(arguments, null, 2);
    });
}

platform
    .login({
        username: localStorage.webPhoneLogin,
        password: localStorage.webPhonePassword
    })
    .then(function() { return registerSIP(); })
    .then(app);