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

/**
 * @namespace RingCentral
 * @param {Object} [options.audioHelper] Automatically create audio helper
 * @param {string} [options.uuid] Instance ID
 * @constructor
 */
function WebPhone(options) {

    options = options || {};

    var service = this;

    this.__registerDeferred = undefined;
    this.__unregisterDeferred = undefined;
    this.__callDeferred = undefined;
    this.__sipRegistered = false;
    this.__sipOutboundEnabled = false;

    if (options.uuid) {
        this.uuid = options.uuid;
    } else {
        localStorage['rc-webPhone-uuid'] = localStorage['rc-webPhone-uuid'] || uuid();
        this.uuid = localStorage['rc-webPhone-uuid'];
    }

    this.activeLine = null;

    this.onMute = false;
    this.onHold = false;
    this.onRecord = false;
    this.contact = undefined;

    var ua = new UserAgent();

    this.ua = ua;
    this.on = ua.on.bind(ua);

    this.username = null;

    this.isRegistered = false;
    this.isRegistering = false;
    this.isUnregistering = false;

    this.events = EVENT_NAMES;

    this.causes = SIP.C.causes;
    this.reasons = SIP.C.REASON_PHRASE;

    //naming convention: incoming or sipincoming?
    service.on(EVENT_NAMES.sipIncomingCall, function(line) {
        service.ua.eventEmitter.emit(EVENT_NAMES.incomingCall, line);
    });

    //naming convention: outgoing or sipoutgoing?
    service.on(EVENT_NAMES.outgoingCall, function(line) {
        if (service.activeLine && !service.activeLine.isOnHold()) {
            service.activeLine.setHold();
        }
        service.__callDeferred && service.__callDeferred.resolve(line);
        service.__callDeferred = null;
    });

    //naming convention: call or line?
    service.on([EVENT_NAMES.callEnded, EVENT_NAMES.callFailed], function(call) {
        //delete activeLine property if the call has ended on the other side
        if (call && service.activeLine && call === service.activeLine) {
            service.activeLine = null;
        }
    });

    // On Call Failed due to 503 Invite Connection error reconnect the call
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


    // Setting flags for SIP Registration process
    service.on(EVENT_NAMES.sipRegistered, function(e) {
        service.__sipRegistered = true;
        service.__registerDeferred && service.__registerDeferred.resolve(e);
        service.isRegistered = true;
        service.isRegistering = false;
        service.isUnregistering = false;
        service.isUnregistered = false;
    });

    service.on([EVENT_NAMES.sipRegistrationFailed, EVENT_NAMES.sipConnectionFailed], function(e) {
        service.__sipRegistered = false;
        service.__registerDeferred && service.__registerDeferred.reject(e);
        service.isRegistered = false;
        service.isRegistering = false;
        service.isUnregistering = false;
        service.isUnregistered = false;
    });

    service.on(EVENT_NAMES.sipUnRegistered, function(e) {
        service.__sipRegistered = false;
        service.__unregisterDeferred && service.__unregisterDeferred.resolve(e);
        service.isRegistered = false;
        service.isRegistering = false;
        service.isUnregistered = true;
        service.isUnregistering = false;
    });

    window.addEventListener('unload', function() {
        service.hangup();
        service.unregister();
    });

    this._audioHelper = null;
    if (options.audioHelper) service.createAudioHelper(options.audioHelper);

    this._appKey = options.appKey;
    this._appName = options.appName;
    this._appVersion = options.appVersion;

    this._x_userAgent = (options.appName ? (options.appName + (options.appVersion ? '/' + options.appVersion : '')) + ' ' : '') +
                      'RCWEBPHONE/' + WebPhone.version;

    this._client_id = options.appkey;

}

/*--------------------------------------------------------------------------------------------------------------------*/

WebPhone.version = '0.2.0';

WebPhone.PhoneLine = PhoneLine;
WebPhone.EventEmitter = EventEmitter;
WebPhone.UserAgent = UserAgent;
WebPhone.AudioHelper = AudioHelper;

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * @param [options]
 * @return {AudioHelper}
 */
WebPhone.prototype.createAudioHelper = function(options) {
    if (!this._audioHelper) {
        console.log('Helper Created');
        this._audioHelper = new AudioHelper(this, options);
    }
    return this._audioHelper;
};

/*--------------------------------------------------------------------------------------------------------------------*/

WebPhone.prototype.register = function(info, checkFlags) {

    try {
        var service = this;

        // console.log("Sip Data"+JSON.stringify(data));

        if (!checkFlags || (
            typeof(info.sipFlags) === 'object' &&
                //checking for undefined for platform v7.3, which doesn't support this flag
            (info.sipFlags.outboundCallsEnabled === undefined || info.sipFlags.outboundCallsEnabled === true))
        ) {

            // Access SIP flags
            this.__sipOutboundEnabled = info.sipFlags.outboundCallsEnabled;

            // console.log('SIP Provision data', data+'\n');
            info = info.sipInfo[0];

        } else {
            throw new Error('ERROR.sipOutboundNotAvailable'); //FIXME Better error reporting...
        }

        var headers = [];
        var endpointId = this.uuid;
        if (endpointId) {
            headers.push('P-rc-endpoint-id: ' + endpointId);
            headers.push('x-user-agent:'+ this._x_userAgent);
            headers.push('client-id:'+this._client_id);
        }

        extend(info, {
            extraHeaders: headers
        });

        if (service.isRegistered) {
            console.warn('Already registered, please unregister the UA first');
            return service.__registerDeferred.promise;
        }

        if (service.isRegistering) {
            console.warn('Already registering the UA');
            return service.__registerDeferred.promise;
        }

        service.__registerDeferred = defer();
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
                level: 3 //FIXME LOG LEVEL 3
            },
            domain: info.domain,
            autostart: false,   //turn off autostart on UA creation
            register: false,     //turn off auto register on UA creation,
            iceGatheringTimeout: info.iceGatheringTimeout || 3000,

            headers: headers
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
        return Promise.reject(e);
    }

    return service.__registerDeferred.promise;
};

/*--------------------------------------------------------------------------------------------------------------------*/

WebPhone.prototype.reregister = function(reconnect) {
    var service = this;
    if (service.isRegistering) return service.__registerDeferred;
    service.__registerDeferred = defer();
    service.isRegistering = true;
    service.ua.reregister({}, !!reconnect);
    return service.__registerDeferred.promise;
};

/*--------------------------------------------------------------------------------------------------------------------*/

WebPhone.prototype.unregister = function() {
    var service = this;
    if (service.isRegistering) {
        service.ua.forceDisconnect();
        service.isRegistering = false;
        service.isUnregistering = false;
        service.isRegistered = false;
        service.isUnregistered = true;
    }

    if (service.isUnregistered || service.isUnregistering) return service.__unregisterDeferred;

    service.isUnregistering = true;
    service.isUnregistered = false;

    service.__unregisterDeferred = defer();
    if (service.__sipRegistered) {
        service.ua.stop();
    }
    else {
        service.__unregisterDeferred.resolve(null);
    }
    return service.__unregisterDeferred.promise.catch(function() {
        return null;
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/

WebPhone.prototype.forceDisconnect = function() {
    this.ua.forceDisconnect();
};

/*--------------------------------------------------------------------------------------------------------------------*/

WebPhone.prototype.call = function(toNumber, fromNumber, country) {
    var service = this;
    if(!this.__sipOutboundEnabled || false === Boolean(this.__sipOutboundEnabled)) {
        throw new Error('Outbound calling is disabled'); // TODO: Fix this to be more robust error messaging
    }
    if(!toNumber)
        throw new Error('Invalid or undefined [toNumber]');
    if (!service.__callDeferred) {
        service.__callDeferred = defer();
        this.activeLine = service.ua.call.call(service.ua, toNumber, {
            fromNumber: fromNumber,
            country: country
        });
    }
    return service.__callDeferred;
};


/*--------------------------------------------------------------------------------------------------------------------*/
WebPhone.prototype.answer = function(line) {
    var incomingLines = this.ua.getIncomingLinesArray();
    var activeLines = this.ua.getActiveLinesArray();
    var self = this;

    return new Promise(function(resolve, reject) {
        if (!line) {
            line = incomingLines.length > 0 && incomingLines[0];
        }

        if (line) {
            var promises = [];
            activeLines.forEach(function (activeLine) {
                if (activeLine !== line) {
                    !activeLine.isOnHold() && promises.push(activeLine.setHold(true));
                }
            });
            resolve(Promise
                .all(promises)
                .then(function () {
                    self.activeLine = line;
                    self.ua.answer(line);
                })
                .catch(function (e) {
                    self.hangup(line);
                    throw e;
                }));
        } else {
            reject();            
        }
    });

};

/*--------------------------------------------------------------------------------------------------------------------*/

WebPhone.prototype.onCall = function() {
    return this.ua.getActiveLinesArray().filter(function(line) {
            return line.onCall;
        }).length > 0;
};

/*--------------------------------------------------------------------------------------------------------------------*/
/***
 * deprecated
 * @param line
 * @returns {*}
 */
WebPhone.prototype.hangup = function(line) {
    var self = this;
    return new Promise(function(resolve, reject){
        line = self.getLine(line);
        self.ua.hangup(line);
        if (line === self.activeLine) self.activeLine = null;
        resolve();
    });
};

WebPhone.prototype.getLine = function(line) {
    if (!line) line = this.activeLine;
    if (!line) throw new Error('No line or no active line');
    return line;
};

/*--------------------------------------------------------------------------------------------------------------------*/

//FIXME: Check if we can replace this with  SIPJS dtmf(tone,[options]) ref: http://sipjs.com/api/0.7.0/session/#dtmftone-options
/***
 * deprecated
 * @param value
 * @param line
 * @returns {*}
 */
WebPhone.prototype.sendDTMF = function(value, line) {
    var self = this;
    return new Promise(function(resolve, reject){
        line = self.getLine(line);
        line && line.sendDTMF.call(line, value);
        resolve();
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/
/***
 * deprecated
 * @param line
 * @returns {*}
 */
WebPhone.prototype.hold = function(line) {
    var self = this;
    return new Promise(function(resolve, reject){
        line = self.getLine(line);
        line && line.setHold(true);
        if (line === self.activeLine) self.activeLine = null;
        resolve();
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/
/***
 * deprecated
 * @param line
 * @returns {*}
 */
WebPhone.prototype.unhold = function(line) {
    var self = this;
    return new Promise(function(resolve, reject){
        line = self.getLine(line);
        if (line) {
            self.ua.getActiveLinesArray().forEach(function (activeLine) {
                if (activeLine !== line && !activeLine.isIncoming() && !activeLine.isOnHold()) {
                    activeLine.setHold(true);
                }
            });
            line.setHold(false);
            self.activeLine = line;
        }
        resolve();
    });
};

////FIXME: Use SIPJS mute() and unmute() ref:http://sipjs.com/api/0.7.0/session/#muteoptions
/*--------------------------------------------------------------------------------------------------------------------*/
/***
 * deprecated
 * @param line
 * @returns {*}
 */
WebPhone.prototype.mute = function(line) {
    var self = this;
    return new Promise(function(resolve, reject){
        line = self.getLine(line);
        line && line.setMute(true);
        resolve();
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/
/***
 * deprecated
 * @param line
 * @returns {*}
 */
WebPhone.prototype.unmute = function(line) {
    var self = this;
    return new Promise(function(resolve, reject){
        line = self.getLine(line);
        line && line.setMute(false);
        resolve();
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/
/***
 * deprecated
 * @param line
 * @param target
 * @param options
 * @returns {*}
 */
//Phone-line->transfer->blindTransfer
WebPhone.prototype.transfer = function(line, target, options) {
    var self = this;
    return new Promise(function(resolve, reject){
        line = self.getLine(line);
        line && line.transfer(target, options);
        if (line === self.activeLine) self.activeLine = null;
        resolve();
    });
};

module.exports = WebPhone;
