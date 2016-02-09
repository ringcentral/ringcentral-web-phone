var SIP = require('sip.js');
var EventEmitter = require('./emitter');
var UserAgent = require('./userAgent');
var PhoneLine = require('./phoneLine');
var AudioHelper = require('./audioHelper');
var defer = require('./utils').defer;
var uuid = require('./utils').uuid;
var extend = require('./utils').extend;
var EVENT_NAMES = require('./eventNames');

/*--------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/

//Patching proto because of https://developers.google.com/web/updates/2015/07/mediastream-deprecations
var mediaStreamManagerProto = Object.create(SIP.WebRTC.MediaStreamManager.prototype, {
    'release': {
        value: function release(stream) {
            var streamId = SIP.WebRTC.MediaStreamManager.streamId(stream);
            if (this.acquisitions[streamId] === false) {
                //MediaStream.stop removed in M47
                if (typeof (stream.stop) === 'function') {
                    stream.stop();
                }
                else {
                    stream.getTracks().forEach(function(track) {
                        track.stop()
                    });
                }
            }
            delete this.acquisitions[streamId];
        }
    }
});

SIP.WebRTC.MediaStreamManager.prototype = mediaStreamManagerProto;

/*--------------------------------------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------------------------------------*/

var ua = new UserAgent();
var __registerDeferred, __unregisterDeferred, __callDeferred;
var __sipRegistered = false;

var service = {

    version: '0.1.0',

    PhoneLine: PhoneLine,
    EventEmitter: EventEmitter,
    UserAgent: UserAgent,
    AudioHelper: AudioHelper,

    createAudioHelper: function(options) {
        return new AudioHelper(this, options);
    },

    activeLine: null,

    onMute: false,
    onHold: false,
    onRecord: false,
    contact: undefined,

    ua: ua,
    on: ua.on.bind(ua),

    username: null,

    isRegistered: false,
    isRegistering: false,
    isUnregistering: false,

    /*--------------------------------------------------------------------------------------------------------------------*/

    register: function(info, checkFlags) {

        // console.log("Sip Data"+JSON.stringify(data));

        if (!checkFlags || (
            typeof(info.sipFlags) === 'object' &&
            //checking for undefined for platform v7.3, which doesn't support this flag
            (info.sipFlags.outboundCallsEnabled === undefined || info.sipFlags.outboundCallsEnabled === true))
        ) {

            // console.log('SIP Provision data', data+'\n');
            info = info.sipInfo[0];

        } else {
            throw new Error('ERROR.sipOutboundNotAvailable'); //FIXME Better error reporting...
        }

        localStorage['rc-webPhone-uuid'] = localStorage['rc-webPhone-uuid'] || uuid();

        var headers = [];
        var endpointId = localStorage['rc-webPhone-uuid'];
        if (endpointId) {
            headers.push('P-rc-endpoint-id: ' + endpointId);
        }

        extend(info, {
            extraHeaders: headers
        });

        if (service.isRegistered) {
            console.warn('Already registered, please unregister the UA first');
            return __registerDeferred.promise;
        }

        if (service.isRegistering) {
            console.warn('Already registering the UA');
            return __registerDeferred.promise;
        }

        try {
            __registerDeferred = defer();
            service.isRegistering = true;
            service.isRegistered = false;

            //compatability properties
            info.wsServers = info.outboundProxy && info.transport
                ? info.transport.toLowerCase() + '://' + info.outboundProxy
                : info.wsServers;
            info.domain = info.domain || info.sipDomain;
            info.username = info.username || info.userName;
            info.extraHeaders = Array.isArray(info.extraHeaders) ? info.extraHeaders : [];

            var options = {
                wsServers: info.wsServers,
                uri: "sip:" + info.username + "@" + info.domain,
                password: info.password,
                authorizationUser: info.authorizationId,
                traceSip: true,
                stunServers: info.stunServers || ['stun:74.125.194.127:19302'],
                turnServers: [],
                log: {
                    level: 1 //FIXME LOG LEVEL 3
                },
                domain: info.domain,
                autostart: false,   //turn off autostart on UA creation
                register: false,     //turn off auto register on UA creation,
                iceGatheringTimeout: info.iceGatheringTimeout || 3000
            };

            service.username = info.userName;
            service.ua.setSIPConfig(options);
            service.ua.start({
                extraHeaders: info.extraHeaders
            });
        }
        catch (e) {
            service.isRegistering = false;
            service.isRegistered = false;
            throw e;
        }

        return __registerDeferred.promise;
    },

    /*--------------------------------------------------------------------------------------------------------------------*/

    reregister: function(reconnect) {
        if (service.isRegistering) return __registerDeferred;
        __registerDeferred = defer();
        service.isRegistering = true;
        service.ua.reregister({}, !!reconnect);
        return __registerDeferred.promise;
    },

    /*--------------------------------------------------------------------------------------------------------------------*/

    unregister: function() {
        if (service.isRegistering) {
            service.ua.forceDisconnect();
            service.isRegistering = false;
            service.isUnregistering = false;
            service.isRegistered = false;
            service.isUnregistered = true;
        }

        if (service.isUnregistered || service.isUnregistering) return __unregisterDeferred;

        service.isUnregistering = true;
        service.isUnregistered = false;

        __unregisterDeferred = defer();
        if (__sipRegistered) {
            service.ua.stop();
        }
        else {
            __unregisterDeferred.resolve(null);
        }
        return __unregisterDeferred.promise.catch(function() {
            return null;
        });
    },

    /*--------------------------------------------------------------------------------------------------------------------*/

    forceDisconnect: function() {
        service.ua.forceDisconnect();
    },

    /*--------------------------------------------------------------------------------------------------------------------*/

    call: function(toNumber, fromNumber, country) {
        if (!__callDeferred) {
            __callDeferred = defer();
            this.activeLine = ua.call.call(ua, toNumber, {
                fromNumber: fromNumber,
                country: country
            });
        }
        return __callDeferred;
    },

    /*--------------------------------------------------------------------------------------------------------------------*/

    answer: function(line) {
        var incomingLines = this.ua.getIncomingLinesArray();
        var activeLines = this.ua.getActiveLinesArray();
        var self = this;

        if (!line) {
            line = incomingLines.length > 0 && arr[0];
        }

        if (line) {
            var promises = [];
            activeLines.forEach(function(activeLine) {
                if (activeLine !== line) {
                    !activeLine.isOnHold() && promises.push(activeLine.setHold(true));
                }
            });
            Promise.all(promises).then(function() {
                self.activeLine = line;
                self.ua.answer(line);
            }, function(e) {
                self.hangup(line);
            });
        }

        return Promise.resolve(null);
    },

    /*--------------------------------------------------------------------------------------------------------------------*/

    onCall: function() {
        return this.ua.getActiveLinesArray().filter(function(line) {
                return line.onCall;
            }).length > 0;
    },

    /*--------------------------------------------------------------------------------------------------------------------*/

    hangup: function(line) {
        if (!line) line = this.activeLine;
        line && this.ua.hangup(line);
        if (line === this.activeLine) this.activeLine = null;
        return Promise.resolve(null);
    },

    /*--------------------------------------------------------------------------------------------------------------------*/

    //FIXME: Check if we can replace this with  SIPJS dtmf(tone,[options]) ref: http://sipjs.com/api/0.7.0/session/#dtmftone-options
    sendDTMF: function(value, line) {
        if (!line) line = this.activeLine;
        line && line.sendDTMF.call(line, value);
        return Promise.resolve(null);
    },


    /*--------------------------------------------------------------------------------------------------------------------*/

    hold: function(line) {
        if (!line) line = this.activeLine;
        line && line.setHold(true);
        if (line === this.activeLine) this.activeLine = null;
        return Promise.resolve(null);
    },

    /*--------------------------------------------------------------------------------------------------------------------*/

    unhold: function(line) {
        if (!line) line = this.activeLine;
        if (line) {
            this.ua.getActiveLinesArray().forEach(function(activeLine) {
                if (activeLine !== line && !activeLine.isIncoming() && !activeLine.isOnHold()) {
                    activeLine.setHold(true);
                }
            });
            line.setHold(false);
            this.activeLine = line;
        }
        return Promise.resolve(null);
    },


    ////FIXME: Use SIPJS mute() and unmute() ref:http://sipjs.com/api/0.7.0/session/#muteoptions
    /*--------------------------------------------------------------------------------------------------------------------*/

    mute: function(line) {
        if (!line) line = this.activeLine;
        line && line.setMute(true);
        return Promise.resolve(null);
    },

    /*--------------------------------------------------------------------------------------------------------------------*/

    unmute: function(line) {
        if (!line) line = this.activeLine;
        line && line.setMute(false);
        return Promise.resolve(null);
    },

    /*--------------------------------------------------------------------------------------------------------------------*/

    //Phone-line->transfer->blindTransfer
    transfer: function(line, target, options) {

        if (!line)
            line = this.activeLine;

        line && line.transfer(target, options);

        if (line === this.activeLine)
            this.activeLine = null;

        return Promise.resolve(null);
    },

    /*--------------------------------------------------------------------------------------------------------------------*/

    events: EVENT_NAMES,

    causes: SIP.C.causes,
    reasons: SIP.C.REASON_PHRASE

};

/*--------------------------------------------------------------------------------------------------------------------*/

//naming convention: incoming or sipincoming?

service.on(EVENT_NAMES.sipIncomingCall, function(line) {
    service.ua.eventEmitter.emit(EVENT_NAMES.incomingCall, line);
});

/*--------------------------------------------------------------------------------------------------------------------*/

//naming convention: outgoing or sipoutgoing?

service.on(EVENT_NAMES.outgoingCall, function(line) {
    if (this.activeLine && !this.activeLine.isOnHold()) {
        this.activeLine.setHold();
    }
    __callDeferred && __callDeferred.resolve(line);
    __callDeferred = null;
});

/*--------------------------------------------------------------------------------------------------------------------*/

//naming convention: call or line?

service.on([EVENT_NAMES.callEnded, EVENT_NAMES.callFailed], function(call) {
    //delete activeLine property if the call has ended on the other side
    if (call && service.activeLine && call === service.activeLine) {
        service.activeLine = null;
    }
});

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * On Call Failed due to 503 Invite Connection error reconnect the call
 */

service.on(EVENT_NAMES.callFailed, function(call, response, cause) {
    if (response) {
        switch (true) {
            //[WRTC-424] Should reconnect the websocket if received 503 on INVITE
            case (/^503$/.test(response.status_code)):
                //This method will throw 'Connection Error', so we just remove it
                call.session.onTransportError = function() {};
                //Re-register after 500ms
                setTimeout(service.reregister.bind(service, true), 500);
                break;
        }
    }
});


/*
 * Setting flags for SIP Registration process
 */

/*--------------------------------------------------------------------------------------------------------------------*/

service.on(EVENT_NAMES.sipRegistered, function(e) {
    __sipRegistered = true;
    __registerDeferred && __registerDeferred.resolve(e);
    service.isRegistered = true;
    service.isRegistering = false;
    service.isUnregistering = false;
    service.isUnregistered = false;
});

/*--------------------------------------------------------------------------------------------------------------------*/

service.on([EVENT_NAMES.sipRegistrationFailed, EVENT_NAMES.sipConnectionFailed], function(e) {
    __sipRegistered = false;
    __registerDeferred && __registerDeferred.reject(e);
    service.isRegistered = false;
    service.isRegistering = false;
    service.isUnregistering = false;
    service.isUnregistered = false;
});

/*--------------------------------------------------------------------------------------------------------------------*/

service.on(EVENT_NAMES.sipUnRegistered, function(e) {
    __sipRegistered = false;
    __unregisterDeferred && __unregisterDeferred.resolve(e);
    service.isRegistered = false;
    service.isRegistering = false;
    service.isUnregistered = true;
    service.isUnregistering = false;
});

/*--------------------------------------------------------------------------------------------------------------------*/

window.addEventListener('unload', function() {
    service.hangup();
    service.unregister();
});

/*--------------------------------------------------------------------------------------------------------------------*/

module.exports = service;