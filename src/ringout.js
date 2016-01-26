
//FIXME: Need to be removed?


//.factory("ringout", function($rootScope, $q, callMonitor, utils, logging, rcCore, rcPlatform, rcSIPUA, appstorage, settingsService, getLocaleString, $locale) { 'use strict';
var rcSIPUA = require('./web-phone');
var settingsService = require('./settingsService');
var rcPlatform = require('./platform');
var utils = require('./utils');

/*--------------------------------------------------------------------------------------------------------------------*/

function startWebCall(toNumber, fromNumber) {
    log('SIP call to', toNumber, 'from', fromNumber);
    var countryId = null;
    rcPlatform.extension.info().then(function(info) {
        if (info && info.regionalSettings && info.regionalSettings.homeCountry) {
            countryId = info.regionalSettings.homeCountry.id;
        }
    }).finally(function() {
        rcSIPUA.call(toNumber, fromNumber, countryId);
    })
}

/*--------------------------------------------------------------------------------------------------------------------*/

var service = {
    start: function(toNo, fromNo, promptToPress) {
        var self = this;
        var normalizedToNumber = utils.normalizeNumberForParser(toNo);
        var normalizedFromNumber = utils.normalizeNumberForParser(fromNo);
        var countryCode = settingsService.countryCode || 'US';

        return rcPlatform.api.phoneParser([normalizedToNumber, normalizedFromNumber], {country: countryCode}).then(function(parsedNumbers) {
            var toNumber = /^\*/.test(normalizedToNumber) ? normalizedToNumber : parsedNumbers[0],
                fromNumber = parsedNumbers[1];

            if (!toNumber) {
                throw new Error("You didn't specify the number to call to or the number is incorrect");
            }

            if (self.currentMode == self.modes.ringout && fromNumber === "") {
                throw new Error("You didn't specify the number to call from or the number is incorrect");
            }

            if (self.currentMode == self.modes.webphone && utils.isBlockedNumber(toNumber, $rootScope.countryCode)) {
                throw new Error('Dialing this number is prohibited');
            }

            switch (self.currentMode) {
                case self.modes.ringout:
                case self.modes.webphoneIncoming:
                    startRingoutCall(toNumber, fromNumber, promptToPress);
                    break;
                case self.modes.webphone:
                    startWebCall(toNumber, fromNumber || undefined);
                    break;
            }
        });
    },
    sip: rcSIPUA,
    inProgress: function() {
        return __inProgress;
    },

    currentMode: RINGOUTS_MODES.ringout,
    changingToMode: null,
    modes: RINGOUTS_MODES,
    switchMode: function(mode, silent) {
        var self = this;
        if (self.modes[mode] === undefined) mode = self.modes.ringout;

        if (mode === self.currentMode) {
            if (!self.modeChangeInProgress || (mode === self.changingToMode)) {
                return $q.when(true);
            }
        }

        if (self.modeChangeInProgress && mode === self.changingToMode) {
            return __switchModePromise;
        }

        if (!silent) {
            $rootScope.$broadcast('app:ringout:modeChangeStarted');
        }

        self.modeChangeInProgress = true;
        self.changingToMode = mode;



        function registerSIP(checkFlags) {
            return rcPlatform.sip.register().then(function(data) {
                if (!checkFlags || (typeof(data.sipFlags) === 'object' &&
                                    //checking for undefined for platform v7.3, which doesn't support this flag
                                    (data.sipFlags.outboundCallsEnabled === undefined || data.sipFlags.outboundCallsEnabled === true))) {
                    data = data.sipInfo[0];
                }
                else {
                    throw new Error('ERROR.sipOutboundNotAvailable'); //FIXME Better error reporting...
                }

                var headers = [];
                var endpointId = settingsService.endpointId || '';
                if (endpointId) {
                    headers.push('P-rc-endpoint-id: ' + endpointId);
                }
                utils.extend(data, {
                    extraHeaders: headers
                });
                return rcSIPUA.register(data).catch(function(e) {
                    var err = e && e.status_code && e.reason_phrase
                        ? new Error(e.status_code + ' ' + e.reason_phrase)
                        : (e && e.data)
                                  ? new Error('SIP Error: ' + e.data)
                                  : new Error('SIP Error: ' + (e || 'Unknown error'));
                    console.error('SIP Error: ' + ((e && e.data) || e));
                    return Promise.reject(err);
                })
            }).catch(function(e) {
                console.error(e);
                return Promise.reject(e);
            });
        }

        switch (mode) {
            case self.modes.webphone:
                __switchModePromise = registerSIP(true).then(function() {
                    setCurrentMode(self.modes.webphone);
                });
                break;
            case self.modes.webphoneIncoming:
                __switchModePromise = registerSIP().then(function() {
                    setCurrentMode(self.modes.webphoneIncoming);
                });
                break;
            case self.modes.ringout:
            default:
                __switchModePromise = rcSIPUA.unregister()
                    .then(function() {
                        setCurrentMode(self.modes.ringout);
                        log('Unregistering SIP');
                    })
                    .catch(function(e) {
                        log('Unregistering SIP error', e);
                    });
                break;
        }

        __switchModePromise.finally(function() {
            self.modeChangeInProgress = false;
            self.changingToMode = null;
            if (!silent) {
                $rootScope.$broadcast('app:ringout:modeChangeCompleted');
            }
        });

        return __switchModePromise;
    },
    modeChangeInProgress: false
};

/*--------------------------------------------------------------------------------------------------------------------*/

//As SIP.js always sends REGISTER messages, it may fail during the working process
rcSIPUA.on([rcSIPUA.events.sipRegistrationFailed, rcSIPUA.events.sipUnRegistered], function(e) {
    $rootScope.$broadcast('app:ringout:modeChangeStarted');
    setCurrentMode(service.modes.ringout);
    $rootScope.$broadcast('app:ringout:modeChangeCompleted');
});

/*--------------------------------------------------------------------------------------------------------------------*/

//Registration also may happen outside of this code
rcSIPUA.on(rcSIPUA.events.sipRegistered, function() {
    if (!service.modeChangeInProgress) {
        $rootScope.$broadcast('app:ringout:modeChangeStarted');
        setCurrentMode(service.currentMode === service.modes.ringout ? service.modes.webphoneIncoming : service.currentMode);
        $rootScope.$broadcast('app:ringout:modeChangeCompleted');
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

module.exports = service;