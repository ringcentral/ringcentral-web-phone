var SIP = require('sip.js');
var utils = require('./utils');
var EVENT_NAMES = require('./eventNames');

var delay = utils.delay;
var extend = utils.extend;

var index = 0;

/**
 * @param options
 * @constructor
 */
var PhoneLine = function(options) {

    var self = this;
    this.index = index++;

    this.session = options.session;
    this.userAgent = options.userAgent;
    this.eventEmitter = options.eventEmitter;
    this.instanceId = options.instanceId;
    this.sessionId = this.session && this.session.id;

    this.onCall = false;
    this.onRecord = false;
    this.contact = {};
    this.muted = false;
    this.bothMuted = false;
    this.onHold = false;
    this.timeCallStarted = null;

    this.accepted = false;
    this.type = options.type;

    this.responseTimeout = 10000;

    this.controlSender = {
        messages: {
            park: {reqid: 1, command: 'callpark'},
            startRecord: {reqid: 2, command: 'startcallrecord'},
            stopRecord: {reqid: 3, command: 'stopcallrecord'},
            flip: {reqid: 3, command: 'callflip', target: ''},
            monitor: {reqid: 4, command: 'monitor'},
            barge: {reqid: 5, command: 'barge'},
            whisper: {reqid: 6, command: 'whisper'},
            takeover: {reqid: 7, command: 'takeover'}
        },
        send: function(command, options) {

            options = options || {};
            extend(command, options);

            var cseq = null;

            return new Promise(function(resolve, reject){
                self.session.sendRequest(SIP.C.INFO, {
                    body: JSON.stringify({
                        request: command
                    }),
                    extraHeaders: [
                        "Content-Type: application/json;charset=utf-8"
                    ],
                    receiveResponse: function(response) {
                        var timeout = null;
                        if (response.status_code === 200) {
                            cseq = response.cseq;
                            function onInfo(request) {
                                if (response.cseq === cseq) {
                                    var body = request && request.body || '{}';
                                    var obj;

                                    try {
                                        obj = JSON.parse(body);
                                    }
                                    catch (e) {
                                        obj = {};
                                    }

                                    if (obj.response && obj.response.command === command.command) {
                                        if (obj.response.result) {
                                            if (obj.response.result.code == 0) {
                                                resolve(obj.response.result);
                                            }
                                            else {
                                                reject(obj.response.result);
                                            }
                                        }
                                    }
                                    timeout && clearTimeout(timeout);
                                    self.eventEmitter.off('SIP_INFO', onInfo);
                                    resolve(); //FIXME What to resolve
                                }
                            }

                            timeout = setTimeout(function() {
                                reject(new Error('Timeout: no reply'));
                                self.eventEmitter.off('SIP_INFO', onInfo);
                            }, self.responseTimeout);
                            self.eventEmitter.on('SIP_INFO', onInfo);
                        }
                        else {
                            reject(new Error('The INFO response status code is: ' + response.status_code + ' (waiting for 200)'));
                        }
                    }
                });

            });
        }
    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    var __receiveRequest = this.session.receiveRequest;
    this.session.receiveRequest = function(request) {
        switch (request.method) {
            case SIP.C.INFO:
                self.eventEmitter.emit('SIP_INFO', request);
                //SIP.js does not support application/json content type, so we monkey override its behaviour in this case
                if (this.status === SIP.Session.C.STATUS_CONFIRMED || this.status === SIP.Session.C.STATUS_WAITING_FOR_ACK) {
                    var contentType = request.getHeader('content-type');
                    if (contentType.match(/^application\/json/i)) {
                        request.reply(200);
                        return this;
                    }
                }
                break;
            //Refresh invite should not be rejected with 488
            case SIP.C.INVITE:
                var session = this;
                if (session.status === SIP.Session.C.STATUS_CONFIRMED) {
                    if (request.call_id && session.dialog && session.dialog.id && request.call_id == session.dialog.id.call_id) {
                        //TODO: check that SDP did not change
                        session.logger.log('re-INVITE received');
                        var localSDP = session.mediaHandler.peerConnection.localDescription.sdp;
                        request.reply(200, null, ['Contact: ' + self.contact], localSDP, function() {
                            session.status = SIP.Session.C.STATUS_WAITING_FOR_ACK;
                            session.setInvite2xxTimer(request, localSDP);
                            session.setACKTimer();
                        });
                        return session;
                    }
                    //else will be rejected with 488 by SIP.js
                }
                break;
            //We need to analize NOTIFY messages sometimes, so we fire an event
            case SIP.C.NOTIFY:
                self.eventEmitter.emit('SIP_NOTIFY', request);
                break;
        }
        return __receiveRequest.apply(self.session, arguments);
    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    //Fired when ICE is starting to negotiate between the peers.
    this.session.on('connecting', function(e) {
        self.eventEmitter.emit(EVENT_NAMES.callConnecting, self, e);
        setTimeout(function() {
            if (self.session.mediaHandler.onIceCompleted !== undefined) {
                self.session.mediaHandler.onIceCompleted(self.session);
            }
            else {
                self.session.mediaHandler.callOnIceCompleted = true;
            }
        }, self.userAgent.sipConfig['iceGatheringTimeout'] || 3000);
    });

    this.__hasEarlyMedia = false;

    /*--------------------------------------------------------------------------------------------------------------------*/


    //Monkey patching for handling early media and to delay ACKs
    var __receiveInviteReponse = this.session.receiveInviteResponse,
        __waitingForIce = false;
    this.session.receiveResponse = this.session.receiveInviteResponse = function(response) {
        var sessionSelf = this, args = arguments;
        switch (true) {
            case (/^1[0-9]{2}$/.test(response.status_code)):
                //Let's not allow the library to send PRACK
                if (self.hasEarlyMedia()) {
                    this.emit('progress', response);
                    return;
                }
                break;
            case /^(2[0-9]{2})|(4\d{2})$/.test(response.status_code):
                if (!self.hasEarlyMedia()) break;

                //Let's check the ICE connection state
                if (self.session.mediaHandler.peerConnection.iceConnectionState === 'completed' && !__waitingForIce) {
                    __waitingForIce = false;
                    //if ICE is connected, then let the library to handle the ACK
                    break;
                }
                else {
                    //If ICE is not connected, then we should send ACK after it has been connected
                    if (!__waitingForIce) {
                        self.eventEmitter.once(EVENT_NAMES.ICECompleted, function() {
                            //let the library handle the ACK after ICE connection is completed
                            __waitingForIce = false;
                            __receiveInviteReponse.apply(sessionSelf, args);
                        });

                        self.eventEmitter.once(EVENT_NAMES.ICEFailed, function() {
                            //handle the ICE Failed situation
                            __waitingForIce = false;
                            self.session.acceptAndTerminate(response, null, 'ICE Connection Failed');
                        });

                        __waitingForIce = true;
                    }
                    return;
                }
                break;
        }
        return __receiveInviteReponse.apply(sessionSelf, args);
    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    //Fired each time a provisional (100-199) response is received.
    this.session.on('progress', function(e) {
        self.onCall = true;

        //Early media is supported by SIP.js library
        //But in case it is sent without 100rel support we play it manually
        //STATUS_EARLY_MEDIA === 11, it will be set by SIP.js if 100rel is supported
        if (self.session.status !== SIP.Session.C.STATUS_EARLY_MEDIA && e.status_code === 183 && typeof(e.body) === 'string' && e.body.indexOf('\n') !== -1) {
            var session = self.session,
                response = e;

            if (session.hasOffer) {
                if (!session.createDialog(response, 'UAC')) {
                    return;
                }
                session.hasAnswer = true;
                session.mediaHandler.setDescription(
                    response.body,
                    function() {
                        session.dialog.pracked.push(response.getHeader('rseq'));
                        session.status = SIP.Session.C.STATUS_EARLY_MEDIA;
                        session.mute();
                        self.__hasEarlyMedia = true;
                        self.eventEmitter.emit(EVENT_NAMES.callProgress, self, e);
                    },
                    function(e) {
                        session.logger.warn(e);
                        session.acceptAndTerminate(response, 488, 'Not Acceptable Here');
                        session.failed(response, SIP.C.causes.BAD_MEDIA_DESCRIPTION);
                    }
                );
            }
        }
    });

    /*--------------------------------------------------------------------------------------------------------------------*/

    //Fired each time a successful final (200-299) response is received.
    this.session.on('accepted', function(e) {
        if (self.accepted === true) return;
        self.onCall = true;
        self.accepted = true;
        self.timeCallStarted = new Date();
        self.eventEmitter.emit(EVENT_NAMES.callStarted, self, e);
    });


    /*--------------------------------------------------------------------------------------------------------------------*/

    function onEnd() {
        self.onCall = false;
        self.timeCallStarted = null;
        self.accepted = true;
    }

    /*--------------------------------------------------------------------------------------------------------------------*/
    //Fired each time an unsuccessful final (300-699) response is
    //this will emit failed event
    this.session.on('rejected', function(e) {
        onEnd();
        self.eventEmitter.emit(EVENT_NAMES.callRejected, self, e);
        //terminated is not called by SIP.js when the call is rejected
        //self.eventEmitter.emit(EVENT_NAMES.callTerminated, self, e);
    });

    /*--------------------------------------------------------------------------------------------------------------------*/

    //Fired when the session was canceled by the client
    this.session.on('cancel', function(e) {
        onEnd();
        self.eventEmitter.emit(EVENT_NAMES.callEnded, self, e);
    });

    /*--------------------------------------------------------------------------------------------------------------------*/

    //Fired when a BYE is sent
    this.session.on('bye', function(e) {
        onEnd();
        self.eventEmitter.emit(EVENT_NAMES.callEnded, self, e);
    });

    /*--------------------------------------------------------------------------------------------------------------------*/

    //Fired when the request fails, whether due to an unsuccessful final response or due to timeout, transport, or other error
    this.session.on('failed', function(response, cause) {
        this.terminated(null, cause);
        onEnd();
        self.eventEmitter.emit(EVENT_NAMES.callFailed, self, response, cause);
        //SIP.js 0.6.x does not call terminated event sometimes, so we call it ourselves
        if (cause === SIP.C.causes.REQUEST_TIMEOUT) {
            //this === session
            if (this.status !== SIP.Session.C.STATUS_CONFIRMED) {
                this.terminated(null, SIP.C.causes.REQUEST_TIMEOUT);
            }
        }
    });

    /*--------------------------------------------------------------------------------------------------------------------*/

    this.session.on('terminated', function(response, cause) {
        onEnd();
        self.eventEmitter.emit(EVENT_NAMES.callTerminated, self, response, cause);
    });

    /*--------------------------------------------------------------------------------------------------------------------*/

    function terminateCallOnDisconnected(reason) {
        self.session.terminated(null, reason || SIP.C.causes.CONNECTION_ERROR);
        onEnd();
        self.eventEmitter.emit(EVENT_NAMES.callFailed, self, null, 'Connection error');
    }

    /*--------------------------------------------------------------------------------------------------------------------*/
//FIXME: Explore if it can be replaced with ref: http://sipjs.com/api/0.7.0/mediaHandler/

    //Monkey patching oniceconnectionstatechange because SIP.js 0.6.x does not have this event
    var onStateChange = this.session.mediaHandler.peerConnection.oniceconnectionstatechange || function(){},
        __doubleCompleted = false;
    this.session.mediaHandler.peerConnection.oniceconnectionstatechange = function() {
        //this === peerConnection
        var state = this.iceConnectionState;
        onStateChange.apply(this, arguments);

        switch (state) {
            case 'connected':
                self.eventEmitter.emit(EVENT_NAMES.ICEConnected, self);
                break;
            case 'completed':
                //this may be called twice, see: https://code.google.com/p/chromium/issues/detail?id=371804
                if (!__doubleCompleted) {
                    self.eventEmitter.emit(EVENT_NAMES.ICECompleted, self);
                    __doubleCompleted = true;
                }
                break;
            case 'disconnected':
                terminateCallOnDisconnected();
                self.eventEmitter.emit(EVENT_NAMES.ICEDisconnected, self);
                break;
            case 'failed':
                self.eventEmitter.emit(EVENT_NAMES.ICEFailed, self);
                break;
        }
    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    var __ignoreReinviteDuplicates = false;

    //Monkey patching sendReinvite for better Hold handling
    var __sendReinvite = this.session.sendReinvite;
    this.session.sendReinvite = function() {
        __ignoreReinviteDuplicates = false;
        var res = __sendReinvite.apply(this, arguments);
        var __reinviteSucceeded = this.reinviteSucceeded,
            __reinviteFailed = this.reinviteFailed;
        this.reinviteSucceeded = function() {
            self.eventEmitter.emit(EVENT_NAMES.callReinviteSucceeded, self);
            return __reinviteSucceeded.apply(this, []);
        };
        this.reinviteFailed = function() {
            self.eventEmitter.emit(EVENT_NAMES.callReinviteFailed, self);
            return __reinviteFailed.apply(this, []);
        };
        return res;
    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    //Monkey patching receiveReinviteResponse to ignore duplicates which may break Hold/Unhold
    var __receiveReinviteResponse = this.session.receiveReinviteResponse;
    this.session.receiveReinviteResponse = function(response) {
        switch (true) {
            case /^2[0-9]{2}$/.test(response.status_code):
                if (__ignoreReinviteDuplicates) {
                    this.sendRequest(SIP.C.ACK, {cseq: response.cseq});
                    return;
                }
                __ignoreReinviteDuplicates = true;
                break;
        }
        return __receiveReinviteResponse.apply(this, arguments);
    };

    /*--------------------------------------------------------------------------------------------------------------------*/

    //defining if the session is incoming or outgoing
    if (this.type === PhoneLine.types.incoming) {
        this.contact.name = this.session.request.from.uri.displayName;
        this.contact.number = this.session.request.from.uri.user;

    } else {
        if (this.type === PhoneLine.types.outgoing) {
            this.contact.name = this.session.request.to.uri.displayName;
            this.contact.number = this.session.request.to.uri.user;
        }
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.types = {
    incoming: 'incoming',
    outgoing: 'outgoing'
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.getId = function() {
    return this.session.data.id;
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.getSession = function() {
    return this.session;
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.cancel = function() {
    var session = this.getSession();
    return new Promise(function(resolve, reject) {
        session.terminate({statusCode: 486});
        resolve();
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.record = function(val) {
    var self = this;
    return new Promise(function(resolve, reject){
        if (self.onCall) {
            var message = !!val
                ? self.controlSender.messages.startRecord
                : self.controlSender.messages.stopRecord;

            if ((self.onRecord && !val) || (!self.onRecord && val)) {
                return self.controlSender.send(message)
                    .then(function(data) {
                        self.onRecord = !!val;
                        return data;
                    });
            }
        }
        else {
            reject(new Error('No line or no active line'));
        }
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.flip = function(target) {
    var self = this;

    return new Promise(function(resolve, reject){
        if (!target) return;
        if (self.onCall) {
            return self.controlSender.send(self.controlSender.messages.flip, {
                target: target
            });
        }
        else {
           reject(new Error('No line or no active line'));
        }
    });
};

PhoneLine.prototype.park = function() {

    var self = this;
    return new Promise(function(resolve, reject){
        if (self.onCall) {
            resolve(self.controlSender.send(self.controlSender.messages.park));
        }
        else
            reject(new Error('No line or no active line'));
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Explore ref: http://sipjs.com/api/0.6.0/session/#dtmftone-options

PhoneLine.prototype.sendDTMF = function(value, duration) {
    var self = this;
    return new Promise(function(resolve, reject){
        if(self.onCall) {
            duration = parseInt(duration) || 1000;
            var peer = self.session.mediaHandler.peerConnection;
            var stream = self.session.getLocalStreams()[0];
            var dtmfSender = peer.createDTMFSender(stream.getAudioTracks()[0]);
            if (dtmfSender !== undefined && dtmfSender.canInsertDTMF) {
                dtmfSender.insertDTMF(value, duration);
            }
            resolve();
        }
        else
            reject(new Error('No line or no active line'));
    });
};

/*
Currently not supported
 */
PhoneLine.prototype.sendInfoDTMF = function(value, duration) {
    var session = this.session;
    return new Promise(function(resolve, reject) {
        duration = parseInt(duration) || 1000;
        session.dtmf(value.toString(), {
            duration: duration
        });
        resolve();
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.blindTransfer = function(target, options) {
    var session = this.session;
    var self = this;
    var extraHeaders = [];
    var originalTarget = target;
    options = options || {};

    return new Promise(function(resolve, reject){
        //Blind Transfer is taken from SIP.js source

        // Check Session Status
        if (session.status !== SIP.Session.C.STATUS_CONFIRMED) {
            reject(new SIP.Exceptions.InvalidStateError(session.status));
        }

        // normalizeTarget allows instances of SIP.URI to pass through unaltered,
        // so try to make one ahead of time
        try {
            target = SIP.Grammar.parse(target, 'Refer_To').uri || target;
        } catch (e) {
            session.logger.debug(".refer() cannot parse Refer_To from", target);
            session.logger.debug("...falling through to normalizeTarget()");
        }

        // Check target validity
        target = session.ua.normalizeTarget(target);
        if (!target) {
            throw new TypeError('Invalid target: ' + originalTarget);
        }

        extraHeaders.push('Contact: ' + session.contact);
        extraHeaders.push('Allow: ' + SIP.Utils.getAllowedMethods(session.ua));
        extraHeaders.push('Refer-To: ' + target);

        // Send the request
        session.sendRequest(SIP.C.REFER, {
            extraHeaders: extraHeaders,
            body: options.body,
            receiveResponse: function(response) {
                var timeout = null;
                if (response.status_code === 202) {
                    var callId = response.call_id;

                    function onNotify(request) {
                        if (request.call_id === callId) {
                            var body = request && request.body || '';
                            switch (true) {
                                case /1[0-9]{2}/.test(body):
                                    request.reply(200);
                                    break;
                                case /2[0-9]{2}/.test(body):
                                    self.session.terminate();
                                    clearTimeout(timeout);
                                    self.eventEmitter.off('SIP_NOTIFY', onNotify);
                                    resolve();
                                    break;
                                default:
                                    reject(body);
                                    break;
                            }
                        }
                    }

                    timeout = setTimeout(function() {
                        reject(new Error('Timeout: no reply'));
                        self.eventEmitter.off('SIP_NOTIFY', onNotify);
                    }, self.responseTimeout);
                    self.eventEmitter.on('SIP_NOTIFY', onNotify);
                }
                else {
                    reject(new Error('The response status code is: ' + response.status_code + ' (waiting for 202)'));
                }
            }
        });

    });
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.transfer = function(target, options) {
    var self = this;
    return (self.onHold ? Promise.resolve(null) : self.setHold(true)).then(function(){ return delay(300); }).then(function() {
        return self.blindTransfer(target, options);
    });
};


/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.forward = function(target, options) {
    var self = this, interval = null;
    return self.answer().then(function() {
        return new Promise(function(resolve, reject){
            interval = setInterval(function() {
                if (self.session.status === 12) {
                    clearInterval(interval);
                    self.setMute(true);
                    setTimeout(function() {
                        self.transfer(target, options);
                        resolve();
                    }, 700);
                }
            }, 50);
        });
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/
//ref: http://sipjs.com/api/0.6.0/session/#acceptoptions
//make var option = {}

PhoneLine.prototype.answer = function() {
    var self = this;

    return new Promise(function(resolve, reject){

        function onAnswered() {
            resolve();
            self.eventEmitter.off(EVENT_NAMES.callStarted, onAnswered);
            self.eventEmitter.off(EVENT_NAMES.callFailed, onFail);
        }

        function onFail(e) {
            reject(e);
            self.eventEmitter.off(EVENT_NAMES.callStarted, onAnswered);
            self.eventEmitter.off(EVENT_NAMES.callFailed, onFail);
        }

        self.eventEmitter.on(EVENT_NAMES.callStarted, onAnswered);
        self.eventEmitter.on(EVENT_NAMES.callFailed, onFail);

        self.eventEmitter.emit(EVENT_NAMES.callProgress, self);

        self.session.accept({
            media: {
                constraints: {audio: true, video: false},
                render: {
                    local: {
                        audio: self.userAgent.dom.localAudio
                    },
                    remote: {
                        audio: self.userAgent.dom.remoteAudio
                    }
                }
            }
        });

    });

};


/*--------------------------------------------------------------------------------------------------------------------*/

//FIXME: Use SIPJS mute() and unmute() ref: http://sipjs.com/api/0.7.0/session/#muteoptions

PhoneLine.prototype.setMute = function(val) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.muted = !!val;
        if (self.onCall) {
            setStreamMute(self.session.getLocalStreams()[0], self.muted);
            val ? self.eventEmitter.emit(EVENT_NAMES.callMute, self) : self.eventEmitter.emit(EVENT_NAMES.callUnmute, self);
            resolve();
        }
        else
            reject(new Error('No line or no active line'));
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/

//FIXME: Use SIPJS mute() and unmute() ref: http://sipjs.com/api/0.7.0/session/#muteoptions

function setStreamMute(stream, val) {
    var tracks = stream.getAudioTracks();
    for (var i = 0; i < tracks.length; i++) {
        tracks[i].enabled = !val;
    }
}

/*--------------------------------------------------------------------------------------------------------------------*/

////FIXME: Use SIPJS mute() and unmute() ref: http://sipjs.com/api/0.7.0/session/#muteoptions

PhoneLine.prototype.setMuteBoth = function(val) {
    var self = this;
    return new Promise(function(resolve, reject) {
        self.bothMuted = !!val;
        self.muted = !!val;
        if (self.onCall) {
            setStreamMute(self.session.getLocalStreams()[0], self.bothMuted);
            setStreamMute(self.session.getRemoteStreams()[0], self.bothMuted);
            val ? self.eventEmitter.emit(EVENT_NAMES.callMute, self) : self.eventEmitter.emit(EVENT_NAMES.callUnmute, self);
            resolve();
        }
        else
            reject(new Error('No line or no active line'));
    });

};

/*--------------------------------------------------------------------------------------------------------------------*/

//FIXME: Explore send() ref: http://sipjs.com/api/0.7.0/transport/#sendmsg

/* This is a direct and very tightly coupled code. Please, try to avoid using this method if possible */
PhoneLine.prototype.sendRequest = function(method, body, options) {
    var self = this;
    options = options || {};

    if (!this.session.dialog) return;

    var request = new SIP.OutgoingRequest(
        method,
        self.session.dialog.remote_target,
        self.session.ua,
        {
            cseq: options.cseq || (self.session.dialog.local_seqnum += 1),
            call_id: self.session.dialog.id.call_id,
            from_uri: self.session.dialog.local_uri,
            from_tag: self.session.dialog.id.local_tag,
            to_uri: self.session.dialog.remote_uri,
            to_tag: self.session.dialog.id.remote_tag,
            route_set: self.session.dialog.route_set,
            statusCode: options.statusCode,
            reasonPhrase: options.reasonPhrase
        },
        options.extraHeaders || [],
        body || undefined
    );

    new SIP.RequestSender({
        request: request,
        onRequestTimeout: function() {
            self.session.onRequestTimeout();
        },
        onTransportError: function() {
            self.session.onTransportError();
        },
        receiveResponse: options.receiveResponse || function(response) {
        }
    }, self.session.ua).send();
};


/*--------------------------------------------------------------------------------------------------------------------*/

//FIXME: should be replaced with __hold()
//This can be removed
//Legacy hold uses direct in-dialog messages to trick SIP.js, try to avoid using this method if possible
PhoneLine.prototype.__legacyHold = function(val) {
    var self = this;
    self.onHold = !!val;
    return new Promise(function(resolve, reject){
        if (self.onCall && self.session.dialog) {
            var body = self.session.mediaHandler.peerConnection.localDescription.sdp;
            if (self.onHold) {
                //body = body.replace(/c=IN IP4 \d+\.\d+.\d+.\d+/, "c=IN IP4 0.0.0.0");
                body = body.replace(/a=sendrecv/, "a=sendonly");
                self.session.mediaHandler.hold();
                self.session.onhold('local');
            }
            else {
                self.session.mediaHandler.unhold();
                self.session.onunhold('local');
            }

            self.sendRequest(SIP.C.INVITE, body, {
                extraHeaders: [
                    "Content-Type: application/sdp",
                    "Contact: " + self.session.contact
                ],
                receiveResponse: function(response) {
                    switch (true) {
                        case /^1[0-9]{2}$/.test(response.status_code):
                            break;
                        case /^2[0-9]{2}$/.test(response.status_code):
                            resolve();
                            self.sendRequest(SIP.C.ACK, null, {
                                cseq: response.cseq
                            });
                            break;
                        default:
                            reject('Status code is: ' + response.status_code);
                            self.onHold = !self.onHold;
                            break;
                    }
                }
            });
        }
        else {
            throw new Error('No line or no active line');
        }
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/


PhoneLine.prototype.__hold = function(val) {
    var self = this;
    return new Promise(function(resolve, reject){
        function onSucceeded() {
            resolve();
            self.eventEmitter.off(EVENT_NAMES.callReinviteFailed, onFailed);
        }

        function onFailed(e) {
            reject(e);
            self.eventEmitter.off(EVENT_NAMES.callReinviteSucceeded, onSucceeded);
        }

        self.eventEmitter.once(EVENT_NAMES.callReinviteSucceeded, onSucceeded);
        self.eventEmitter.once(EVENT_NAMES.callReinviteFailed, onFailed);

        val ? self.session.hold() : self.session.unhold();
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.setHold = function(val) {
    var self = this;
    return new Promise(function(resolve, reject){
        self.onHold = !!val;
        if (self.onCall) {
            resolve(self.__hold(val).then(function(res) {
                if (val) {
                    self.eventEmitter.emit(EVENT_NAMES.callHold, self);
                } else {
                    self.eventEmitter.emit(EVENT_NAMES.callUnhold, self);
                }
                return res;
            }).catch(function(e) {
                self.onHold = !self.onHold;
                throw e;
            }));
        }
        else
            reject(new Error('No line or no active line'));
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.isOnHold = function() {
    return this.onHold;
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.isOnMute = function() {
    return this.muted || this.bothMuted;
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.isOnRecord = function() {
    return this.onRecord;
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.getContact = function() {
    return this.contact;
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.getCallDuration = function() {
    if (this.timeCallStarted) {
        return (new Date()).getTime() - this.timeCallStarted.getTime();
    }
    else {
        return 0;
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.isIncoming = function() {
    return this.session.mediaHandler.peerConnection.signalingState !== "closed"
        && !this.session.startTime;
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.isClosed = function() {
    return this.session.status === SIP.Session.C.STATUS_CANCELED || this.session.status === SIP.Session.C.STATUS_TERMINATED;
};

/*--------------------------------------------------------------------------------------------------------------------*/

PhoneLine.prototype.hasEarlyMedia = function() {
    return this.__hasEarlyMedia;
};

/*--------------------------------------------------------------------------------------------------------------------*/

module.exports = PhoneLine;
