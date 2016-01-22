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

//generate uuid
function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//cross-browser mediaStream attaching
//https://github.com/HenrikJoreteg/attachMediaStream
function attachMediaStream(stream, el, options) {
    var item;
    var URL = window.URL;
    var element = el;
    var opts = {
        autoplay: true,
        mirror: false,
        muted: false,
        audio: false
    };

    if (options) {
        for (item in options) {
            opts[item] = options[item];
        }
    }

    if (!element) {
        element = document.createElement(opts.audio ? 'audio' : 'video');
    } else if (element.tagName.toLowerCase() === 'audio') {
        opts.audio = true;
    }

    if (opts.autoplay) element.autoplay = 'autoplay';
    if (opts.muted) element.muted = true;
    if (!opts.audio && opts.mirror) {
        ['', 'moz', 'webkit', 'o', 'ms'].forEach(function(prefix) {
            var styleName = prefix ? prefix + 'Transform' : 'transform';
            element.style[styleName] = 'scaleX(-1)';
        });
    }

    // this first one should work most everywhere now
    // but we have a few fallbacks just in case.
    if (URL && URL.createObjectURL) {
        element.src = URL.createObjectURL(stream);
    } else if (element.srcObject) {
        element.srcObject = stream;
    } else if (element.mozSrcObject) {
        element.mozSrcObject = stream;
    } else {
        return false;
    }

    return element;
}

var EVENT_NAMES = {
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
    'ICEDisconnected': 'ICEDisconnected',
    'callReinviteSucceeded': 'callReinviteSucceeded',
    'callReinviteFailed': 'callReinviteFailed'
};

/*
 * We create audio containers here
 * Sorry for DOM manipulations inside a service, but it is for the good :)
 */
var LOCAL_AUDIO = document.createElement('video'),
    REMOTE_AUDIO = document.createElement('video'),
    LOCAL_AUDIO_ID = 'local_' + uuid(),
    REMOTE_AUDIO_ID = 'remote_' + uuid();
LOCAL_AUDIO.setAttribute('id', LOCAL_AUDIO_ID);
LOCAL_AUDIO.setAttribute('autoplay', 'true');
LOCAL_AUDIO.setAttribute('hidden', 'true');
LOCAL_AUDIO.setAttribute('muted', '');
REMOTE_AUDIO.setAttribute('id', REMOTE_AUDIO_ID);
REMOTE_AUDIO.setAttribute('autoplay', 'true');
REMOTE_AUDIO.setAttribute('hidden', 'true');
document.body.appendChild(LOCAL_AUDIO);
document.body.appendChild(REMOTE_AUDIO);
LOCAL_AUDIO.volume = 0;

//-----------------------------------------
var EventEmitter = function() {
    this.handlers = {};
};

EventEmitter.prototype.emit = function(name /*, args */) {
    var self = this, args = Array.prototype.slice.call(arguments, 1);
    if (name in this.handlers) {
        var list = this.handlers[name];
        for (var i = 0; i < list.length; i++) {
            setTimeout(executeListener(list[i]), 0);
        }
    }
    function executeListener(listener) {
        return function() {
            listener.apply(self, args);
        }
    }
};

EventEmitter.prototype.on = function(name, listener) {
    if (!angular.isArray(name)) name = [name];
    for (var i = 0; i < name.length; i++) {
        this.handlers[name[i]] = this.handlers[name[i]] || [];
        var list = this.handlers[name[i]];
        list.push(listener);
    }
};

EventEmitter.prototype.off = function(name, listener) {
    this.handlers[name] = this.handlers[name] || [];
    var index = this.handlers[name].indexOf(listener);
    if (index !== -1) {
        this.handlers[name].splice(index, 1);
    }
};

EventEmitter.prototype.once = function(name, listener) {
    var self = this;

    function listenOnce() {
        listener.apply(this, arguments);
        self.off(name, listenOnce);
    }

    self.on(name, listenOnce);
};
//-----------------------------------------


//-----------------------------------------
var UserAgent = function(options) {
    this.eventEmitter = new EventEmitter();
    this.sipConfig = options ? (options.sipConfig || {}) : ({});
    this.lines = {};
    this.userAgent = undefined;
    this.getUserMedia = undefined;
    this.RTCPeerConnection = undefined;
    this.RTCSessionDescription = undefined;
    checkConfig.apply(this);
};


UserAgent.prototype.setSIPConfig = function(config) {
    var wsServers = config.wsServers,
        useSecureConnection = (document.location.protocol == 'https:');

    for (var i = 0; i < wsServers.length; i++) {
        if (
            (useSecureConnection && /^wss:/.test(wsServers[i]))
            ||
            (!useSecureConnection && /^ws:/.test(wsServers[i]))
        ) {
            config.wsServers = [wsServers[i]];
            break;
        }
    }

    this.sipConfig = config;
    checkConfig.apply(this);
};

UserAgent.prototype.__createLine = function(session, type) {
    var self = this;
    session.data.id = uuid();
    self.eventEmitter.emit(EVENT_NAMES.sipRTCSession, session);
    var line = new PhoneLine({
        session: session,
        userAgent: self,
        instanceId: self.sipConfig.authorizationUser,
        eventEmitter: self.eventEmitter,
        type: type
    });
    self.__clearInactiveLines();
    self.lines[session.data.id] = line;

    window.line = line;

    return line;
};

UserAgent.prototype.getActiveLines = function() {
    this.__clearInactiveLines();
    return this.lines;
};

UserAgent.prototype.getActiveLinesArray = function() {
    var lines = this.getActiveLines();
    var arr = [];
    for (var id in lines) {
        if (lines.hasOwnProperty(id)) {
            arr.push(lines[id]);
        }
    }
    return arr;
};

UserAgent.prototype.getIncomingLinesArray = function() {
    return this.getActiveLinesArray().filter(function(el) {
        return el.isIncoming();
    });
};

UserAgent.prototype.__clearInactiveLines = function() {
    for (var id in this.lines) {
        if (this.lines.hasOwnProperty(id)) {
            if (this.lines[id].isClosed()) {
                delete this.lines[id];
            }
        }
    }
};

var __disconnectCount = 0;
UserAgent.prototype.start = function(options) {
    var self = this;

    function initUA() {
        self.stop();
        if (self.userAgent instanceof SIP.UA) {
            self.userAgent.loadConfig(self.sipConfig);
        }
        else {
            self.userAgent = new SIP.UA(self.sipConfig);
            self.__registerExtraOptions = options || {};
            self.userAgent.on('connected', function(e) {
                __disconnectCount = 0;
                self.eventEmitter.emit(EVENT_NAMES.sipConnected, e);
                self.userAgent.register({
                    extraHeaders: options.extraHeaders || []
                });
            });
            self.userAgent.on('disconnected', function(e) {
                if (++__disconnectCount >= (self.sipConfig.retryCount || 3)) {
                    __disconnectCount = 0;
                    self.stop();
                    self.eventEmitter.emit(EVENT_NAMES.sipConnectionFailed, new Error("Unable to connect to the WS server: exceeded number of attempts"));
                }
                self.eventEmitter.emit(EVENT_NAMES.sipDisconnected, e);
            });
            self.userAgent.on('registered', function(e) {
                self.eventEmitter.emit(EVENT_NAMES.sipRegistered, e);
            });
            self.userAgent.on('unregistered', function(e) {
                self.eventEmitter.emit(EVENT_NAMES.sipUnRegistered, e);
            });
            self.userAgent.on('registrationFailed', function(e) {
                self.eventEmitter.emit(EVENT_NAMES.sipRegistrationFailed, e);
            });
            //happens when call is incoming
            self.userAgent.on('invite', function(session) {
                var newLine;

                if (session && session.request && session.request.hasHeader('replaces')) {
                    var replaces = session.request.getHeader('replaces').split(';'),
                        callId = replaces[0],
                        lines = self.getActiveLinesArray(),
                        foundLine = null;
                    for (var i = 0; i < lines.length; i++) {
                        if (lines[i].session.request.call_id) {
                            if (callId === lines[i].session.request.call_id) {
                                foundLine = lines[i];
                                break;
                            }
                        }
                    }

                    if (foundLine) {
                        var originalSessionId = foundLine.getId();
                        newLine = self.__createLine(session, PhoneLine.types.incoming);
                        newLine.answer().then(function() {
                            self.eventEmitter.emit(EVENT_NAMES.callReplaced, newLine, foundLine);
                            foundLine.cancel();
                        });
                    }
                }
                else {
                    newLine = self.__createLine(session, PhoneLine.types.incoming);
                    self.eventEmitter.emit(EVENT_NAMES.sipIncomingCall, newLine);
                }
            });
        }
        //noop on transport connected (this will cause unwanted REGISTER)
        self.userAgent.registerContext.onTransportConnected = function() {};
        self.userAgent.start();
    }

    initUA();
};

UserAgent.prototype.reregister = function(options, reconnect) {
    var self = this, reconnect = !!reconnect;
    options = angular.extend(self.__registerExtraOptions, options);
    if (!self.userAgent) {
        self.start(options);
    }
    if (!reconnect) {
        self.userAgent.register(options);
    }
    else {
        if (!self.isConnected()) {
            self.stop();
            self.start(options);
        }
        else {
            //This will be treated as abrupt disconnection and SIP.js will try to reconnect the WS
            self.userAgent.transport.ws.close();
        }
    }
};


UserAgent.prototype.stop = function() {
    if (this.userAgent instanceof SIP.UA) {
        this.userAgent.stop();
        this.userAgent = null;
    }
};


UserAgent.prototype.call = function(number, inviteOptions) {
    var self = this;
    var options = {
        media: {
            constraints: {audio: true, video: false},
            render: {
                local: {
                    audio: LOCAL_AUDIO
                },
                remote: {
                    audio: REMOTE_AUDIO
                }
            }
        },
        RTCConstraints: {
            "optional": [
                {'DtlsSrtpKeyAgreement': 'true'}
            ]
        }
    };
    var fromNumber = inviteOptions.fromNumber;
    var country = inviteOptions.country;

    var headers = [];
    if (fromNumber) {
        headers.push('P-Asserted-Identity: sip:' + fromNumber + '@' + this.sipConfig.domain);
    }
    if (country) {
        headers.push('P-rc-country-id: ' + country);
    }
    angular.extend(options, {
        extraHeaders: headers
    });
    var session = this.userAgent.invite('' + number, options);
    var line = self.__createLine(session, PhoneLine.types.outgoing);
    this.eventEmitter.emit(EVENT_NAMES.outgoingCall, line);
    return line;
};


UserAgent.prototype.answer = function(line) {
    return line && line.answer();
};


UserAgent.prototype.hangup = function(line) {
    if (line) {
        line.cancel();
        delete this.lines[line.getId()];
    }
};

UserAgent.prototype.on = function(eventName, cb) {
    this.eventEmitter.on(eventName, cb);
    return this;
};

function checkConfig() {
    // set mootools expands to non-enumerables under ES5
    if (typeof this.sipConfig.wsServers === 'string') {
        this.sipConfig.wsServers = [
            {ws_uri: this.sipConfig.wsServers}
        ];
    }
    var key, enums = {enumerable: false};
    for (key in this.sipConfig.wsServers) this.sipConfig.wsServers.hasOwnProperty(key) || Object.defineProperty(Array.prototype, key, enums);
}

UserAgent.prototype.isConnected = function() {
    return !!(this.userAgent && this.userAgent.transport && this.userAgent.transport.connected);
};

UserAgent.prototype.isConnecting = function() {
    //websocket.readyState === CONNECTING (0)
    return !this.isConnected() && !!(this.userAgent && this.userAgent.transport && this.userAgent.transport.ws && this.userAgent.transport.ws.readyState === 0);
};

UserAgent.prototype.forceDisconnect = function() {
    console.warn(this.isConnecting(), this.isConnected())
    if (this.isConnecting() || this.isConnected()) {
        this.userAgent.transport.disconnect();
        this.userAgent.stop();
        this.userAgent = null;
    }
};
//-----------------------------------------


//-----------------------------------------
var index = 0;

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
            angular.extend(command, options);

            var cseq = null, deferred = $q.defer();
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
                                            deferred.resolve(obj.response.result);
                                        }
                                        else {
                                            deferred.reject(obj.response.result);
                                        }
                                    }
                                }
                                $timeout.cancel(timeout);
                                self.eventEmitter.off('SIP_INFO', onInfo);
                            }
                        }

                        timeout = $timeout(function() {
                            deferred.reject(new Error('Timeout: no reply'));
                            self.eventEmitter.off('SIP_INFO', onInfo);
                        }, self.responseTimeout);
                        self.eventEmitter.on('SIP_INFO', onInfo);
                    }
                    else {
                        deferred.reject(new Error('The INFO response status code is: ' + response.status_code + ' (waiting for 200)'));
                    }
                }
            });

            return deferred.promise;
        }
    };

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

    //Fired when ICE is starting to negotiate between the peers.
    this.session.on('connecting', function(e) {
        self.eventEmitter.emit(EVENT_NAMES.callConnecting, self, e);
        $timeout(function() {
            if (self.session.mediaHandler.onIceCompleted !== undefined) {
                self.session.mediaHandler.onIceCompleted(self.session);
            }
            else {
                self.session.mediaHandler.callOnIceCompleted = true;
            }
        }, self.userAgent.sipConfig['iceGatheringTimeout'] || 3000);
    });

    this.__hasEarlyMedia = false;

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

    //Fired each time a successful final (200-299) response is received.
    this.session.on('accepted', function(e) {
        if (self.accepted === true) return;
        self.onCall = true;
        self.accepted = true;
        self.timeCallStarted = new Date();
        self.eventEmitter.emit(EVENT_NAMES.callStarted, self, e);
    });

    function onEnd() {
        self.onCall = false;
        self.timeCallStarted = null;
        self.accepted = true;
    }

    //Fired each time an unsuccessful final (300-699) response is
    //this will emit failed event
    this.session.on('rejected', function(e) {
        onEnd();
        self.eventEmitter.emit(EVENT_NAMES.callRejected, self, e);
        //terminated is not called by SIP.js when the call is rejected
        //self.eventEmitter.emit(EVENT_NAMES.callTerminated, self, e);
    });

    //Fired when the session was canceled by the client
    this.session.on('cancel', function(e) {
        onEnd();
        self.eventEmitter.emit(EVENT_NAMES.callEnded, self, e);
    });

    //Fired when a BYE is sent
    this.session.on('bye', function(e) {
        onEnd();
        self.eventEmitter.emit(EVENT_NAMES.callEnded, self, e);
    });

    //Fired when the request fails, whether due to an unsuccessful final response or due to timeout, transport, or other error
    this.session.on('failed', function(response, cause) {
        this.terminated(null, cause);
        onEnd();
        self.eventEmitter.emit(EVENT_NAMES.callFailed, self, response, cause);
        //SIP.js 0.6.x does not call terminated event sometimes, so we call it ourselves
        if (cause === service.causes.REQUEST_TIMEOUT) {
            //this === session
            if (this.status !== SIP.Session.C.STATUS_CONFIRMED) {
                this.terminated(null, SIP.C.causes.REQUEST_TIMEOUT);
            }
        }
    });

    this.session.on('terminated', function(response, cause) {
        onEnd();
        self.eventEmitter.emit(EVENT_NAMES.callTerminated, self, response, cause);
    });

    function terminateCallOnDisconnected(reason) {
        self.session.terminated(null, reason || SIP.C.causes.CONNECTION_ERROR);
        onEnd();
        self.eventEmitter.emit(EVENT_NAMES.callFailed, self, null, 'Connection error');
    }

    //Monkey patching oniceconnectionstatechange because SIP.js 0.6.x does not have this event
    var onStateChange = this.session.mediaHandler.peerConnection.oniceconnectionstatechange || angular.noop,
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

    //defining if the session is incoming or outgoing
    if (this.type === PhoneLine.types.incoming) {
        this.contact.name = this.session.request.from.displayName;
        this.contact.number = this.session.request.from.uri.user;
    } else {
        if (this.type === PhoneLine.types.outgoing) {
            this.contact.name = this.session.request.to.displayName;
            this.contact.number = this.session.request.to.uri.user;
        }
    }
};

PhoneLine.types = {
    incoming: 'incoming',
    outgoing: 'outgoing'
};


PhoneLine.prototype.getId = function() {
    return this.session.data.id;
};


PhoneLine.prototype.getSession = function() {
    return this.session;
};

PhoneLine.prototype.cancel = function() {
    var session = this.getSession();
    session.terminate({statusCode: 486});
    return $q.when();
};


PhoneLine.prototype.record = function(val) {
    var self = this;
    if (self.onCall) {
        var message = !!val
            ? self.controlSender.messages.startRecord
            : self.controlSender.messages.stopRecord;

        if ((self.onRecord && !val) || (!self.onRecord && val)) {
            return this.controlSender.send(message)
                .then(function(data) {
                    self.onRecord = !!val;
                    return data;
                });
        }
    }
    else {
        return $q.reject(new Error('Not on call'));
    }
};

PhoneLine.prototype.flip = function(target) {
    if (!target) return;
    if (this.onCall) {
        return this.controlSender.send(this.controlSender.messages.flip, {
            target: target
        });
    }
    else {
        return $q.reject(new Error('Not on call'));
    }
};

PhoneLine.prototype.park = function() {
    if (this.onCall) {
        return this.controlSender.send(this.controlSender.messages.park);
    }
    else {
        return $q.reject(new Error('Not on call'));
    }
};


PhoneLine.prototype.sendDTMF = function(value, duration) {
    duration = parseInt(duration) || 1000;
    var peer = this.session.mediaHandler.peerConnection;
    var stream = this.session.getLocalStreams()[0];
    var dtmfSender = peer.createDTMFSender(stream.getAudioTracks()[0]);
    if (dtmfSender !== undefined && dtmfSender.canInsertDTMF) {
        dtmfSender.insertDTMF(value, duration);
    }
    return $q.when();
};

PhoneLine.prototype.sendInfoDTMF = function(value, duration) {
    duration = parseInt(duration) || 1000;
    var session = this.session;
    session.dtmf(value.toString(), {
        duration: duration
    });
    return $q.when();
};

PhoneLine.prototype.blindTransfer = function(target, options) {
    //Blind Transfer is taken from SIP.js source
    var session = this.session;
    var extraHeaders = [];
    var deferred = $q.defer();
    var originalTarget = target;
    var self = this;
    options = options || {};

    // Check Session Status
    if (session.status !== SIP.Session.C.STATUS_CONFIRMED) {
        throw new SIP.Exceptions.InvalidStateError(session.status);
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
                                $timeout.cancel(timeout);
                                self.eventEmitter.off('SIP_NOTIFY', onNotify);
                                deferred.resolve();
                                break;
                            default:
                                deferred.reject(body);
                                break;
                        }
                    }
                }

                timeout = $timeout(function() {
                    deferred.reject(new Error('Timeout: no reply'));
                    self.eventEmitter.off('SIP_NOTIFY', onNotify);
                }, self.responseTimeout);
                self.eventEmitter.on('SIP_NOTIFY', onNotify);
            }
            else {
                deferred.reject(new Error('The response status code is: ' + response.status_code + ' (waiting for 202)'));
            }
        }
    });

    return deferred.promise;
};

PhoneLine.prototype.transfer = function(target, options) {
    var self = this;
    return (self.onHold ? $q.when() : self.setHold(true)).then(function() {
        return $timeout(function() {
            return self.blindTransfer(target, options);
        }, 300);
    });
};

PhoneLine.prototype.forward = function(target, options) {
    var self = this, interval = null;
    return self.answer().then(function() {
        var deferred = $q.defer();
        interval = $interval(function() {
            if (self.session.status === 12) {
                $interval.cancel(interval);
                self.setMute(true);
                $timeout(function() {
                    self.transfer(target, options);
                    deferred.resolve();
                }, 700);
            }
        }, 50);
        return deferred.promise;
    });
};

PhoneLine.prototype.answer = function() {
    var self = this,
        deferred = $q.defer();

    function onAnswered() {
        deferred.resolve();
        self.eventEmitter.off(EVENT_NAMES.callStarted, onAnswered);
        self.eventEmitter.off(EVENT_NAMES.callFailed, onFail);
    }

    function onFail(e) {
        deferred.reject(e);
        self.eventEmitter.off(EVENT_NAMES.callStarted, onAnswered);
        self.eventEmitter.off(EVENT_NAMES.callFailed, onFail);
    }

    self.eventEmitter.on(EVENT_NAMES.callStarted, onAnswered);
    self.eventEmitter.on(EVENT_NAMES.callFailed, onFail);

    console.warn('emitting callProgress');
    self.eventEmitter.emit(EVENT_NAMES.callProgress, self);

    self.session.accept({
        media: {
            constraints: {audio: true, video: false},
            render: {
                local: {
                    audio: LOCAL_AUDIO
                },
                remote: {
                    audio: REMOTE_AUDIO
                }
            }
        }
    });

    return deferred.promise;
};

PhoneLine.prototype.setMute = function(val) {
    this.muted = !!val;
    try {
        setStreamMute(this.session.getLocalStreams()[0], this.muted);
        val ? this.eventEmitter.emit(EVENT_NAMES.callMute, this) : this.eventEmitter.emit(EVENT_NAMES.callUnmute, this);
    } catch (e) {
        console.error(e);
    }
    return $q.when();
};


function setStreamMute(stream, val) {
    var tracks = stream.getAudioTracks();
    for (var i = 0; i < tracks.length; i++) {
        tracks[i].enabled = !val;
    }
}


PhoneLine.prototype.setMuteBoth = function(val) {
    this.bothMuted = !!val;
    try {
        setStreamMute(this.session.getLocalStreams()[0], this.bothMuted);
        setStreamMute(this.session.getRemoteStreams()[0], this.bothMuted);
        val ? this.eventEmitter.emit(EVENT_NAMES.callMute, this) : this.eventEmitter.emit(EVENT_NAMES.callUnmute, this);
    }
    catch (e) {
        console.error(e);
    }
    return $q.when();
};

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

//Legacy hold uses direct in-dialog messages to trick SIP.js, try to avoid using this method if possible
PhoneLine.prototype.__legacyHold = function(val) {
    var self = this;

    self.onHold = !!val;
    var deferred = $q.defer();
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
                        deferred.resolve();
                        self.sendRequest(SIP.C.ACK, null, {
                            cseq: response.cseq
                        });
                        break;
                    default:
                        deferred.reject('Status code is: ' + response.status_code);
                        self.onHold = !self.onHold;
                        break;
                }
            }
        });
    }
    else {
        deferred.reject(new Error('Not on call or no dialog'));
    }
    return deferred.promise;
};

PhoneLine.prototype.__hold = function(val) {
    var deferred = $q.defer(), self = this;

    function onSucceeded() {
        deferred.resolve();
        self.eventEmitter.off(EVENT_NAMES.callReinviteFailed, onFailed);
    }

    function onFailed(e) {
        deferred.reject(e);
        self.eventEmitter.off(EVENT_NAMES.callReinviteSucceeded, onSucceeded);
    }

    self.eventEmitter.once(EVENT_NAMES.callReinviteSucceeded, onSucceeded);
    self.eventEmitter.once(EVENT_NAMES.callReinviteFailed, onFailed);

    val ? self.session.hold() : self.session.unhold();

    return deferred.promise;
};

PhoneLine.prototype.setHold = function(val) {
    var promise;
    var self = this;
    this.onHold = !!val;
    if (this.onCall) {
        promise = self.__hold(val).then(function() {
            val ? self.eventEmitter.emit(EVENT_NAMES.callHold, self) : self.eventEmitter.emit(EVENT_NAMES.callUnhold, self);
        }, function(e) {
            self.onHold = !self.onHold;
        });
    }
    return $q.when(promise);
};

PhoneLine.prototype.isOnHold = function() {
    return this.onHold;
};

PhoneLine.prototype.isOnMute = function() {
    return this.muted || this.bothMuted;
};

PhoneLine.prototype.isOnRecord = function() {
    return this.onRecord;
};

PhoneLine.prototype.getContact = function() {
    return this.contact;
};

PhoneLine.prototype.getCallDuration = function() {
    if (this.timeCallStarted) {
        return (new Date()).getTime() - this.timeCallStarted.getTime();
    }
    else {
        return 0;
    }
};

PhoneLine.prototype.isIncoming = function() {
    return this.session.mediaHandler.peerConnection.signalingState !== "closed"
           && !this.session.startTime;
};

PhoneLine.prototype.isClosed = function() {
    return this.session.status === SIP.Session.C.STATUS_CANCELED || this.session.status === SIP.Session.C.STATUS_TERMINATED;
};

PhoneLine.prototype.hasEarlyMedia = function() {
    return this.__hasEarlyMedia;
};


//monkey patching emit for assuring that $apply is called
var __emit = EventEmitter.prototype.emit;
EventEmitter.prototype.emit = function() {
    var self = this, args = arguments;
    $timeout(function() {
        __emit.apply(self, args);
    });
};

var ua = new UserAgent();
var __registerDeferred, __unregisterDeferred, __callDeferred;
var __sipRegistered = false;

var service = {
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

    register: function(info) {
        if (service.isRegistered) {
            console.warn('Already registered, please unregister the UA first');
            return __registerDeferred.promise;
        }

        if (service.isRegistering) {
            console.warn('Already registering the UA');
            return __registerDeferred.promise;
        }

        try {
            __registerDeferred = $q.defer();
            service.isRegistering = true;
            service.isRegistered = false;

            //compatability properties
            info.wsServers = info.outboundProxy && info.transport
                ? info.transport.toLowerCase() + '://' + info.outboundProxy
                : info.wsServers;
            info.domain = info.domain || info.sipDomain;
            info.username = info.username || info.userName;
            info.extraHeaders = angular.isArray(info.extraHeaders) ? info.extraHeaders : [];

            var options = {
                wsServers: info.wsServers,
                uri: "sip:" + info.username + "@" + info.domain,
                password: info.password,
                authorizationUser: info.authorizationId,
                traceSip: true,
                stunServers: info.stunServers || ['stun:74.125.194.127:19302'],
                turnServers: [],
                log: {
                    level: 3
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

    reregister: function(reconnect) {
        if (service.isRegistering) return __registerDeferred;
        __registerDeferred = $q.defer();
        service.isRegistering = true;
        service.ua.reregister({}, !!reconnect);
        return __registerDeferred.promise;
    },

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

        __unregisterDeferred = $q.defer();
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

    forceDisconnect: function() {
        service.ua.forceDisconnect();
    },

    call: function(toNumber, fromNumber, country) {
        if (!__callDeferred) {
            __callDeferred = $q.defer();
            this.activeLine = ua.call.call(ua, toNumber, {
                fromNumber: fromNumber,
                country: country
            });
        }
        return __callDeferred;
    },

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
            $q.all(promises).then(function() {
                self.activeLine = line;
                self.ua.answer(line);
            }, function(e) {
                self.hangup(line);
            });
        }

        return $q.when();
    },

    onCall: function() {
        return this.ua.getActiveLinesArray().filter(function(line) {
                return line.onCall;
            }).length > 0;
    },

    hangup: function(line) {
        if (!line) line = this.activeLine;
        line && this.ua.hangup(line);
        if (line === this.activeLine) this.activeLine = null;
        return $q.when();
    },

    sendDTMF: function(value, line) {
        if (!line) line = this.activeLine;
        line && line.sendDTMF.call(line, value);
        return $q.when();
    },

    hold: function(line) {
        if (!line) line = this.activeLine;
        line && line.setHold(true);
        if (line === this.activeLine) this.activeLine = null;
        return $q.when();
    },

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
        return $q.when();
    },

    mute: function(line) {
        if (!line) line = this.activeLine;
        line && line.setMute(true);
        return $q.when();
    },

    unmute: function(line) {
        if (!line) line = this.activeLine;
        line && line.setMute(false);
        return $q.when();
    },

    transfer: function(line, target, options) {
        if (!line) line = this.activeLine;
        line && line.transfer(target, options);
        if (line === this.activeLine) this.activeLine = null;
        return $q.when();
    },

    events: EVENT_NAMES,

    causes: SIP.C.causes,
    reasons: SIP.C.REASON_PHRASE
};

service.on(EVENT_NAMES.sipIncomingCall, function(line) {
    service.ua.eventEmitter.emit(EVENT_NAMES.incomingCall, line);
});

service.on(EVENT_NAMES.outgoingCall, function(line) {
    if (this.activeLine && !this.activeLine.isOnHold()) {
        this.activeLine.setHold();
    }
    __callDeferred && __callDeferred.resolve(line);
    __callDeferred = null;
});

service.on([EVENT_NAMES.callEnded, EVENT_NAMES.callFailed], function(call) {
    //delete activeLine property if the call has ended on the other side
    if (call && service.activeLine && call === service.activeLine) {
        service.activeLine = null;
    }
});

service.on(EVENT_NAMES.callFailed, function(call, response, cause) {
    if (response) {
        switch (true) {
            //[WRTC-424] Should reconnect the websocket if received 503 on INVITE
            case (/^503$/.test(response.status_code)):
                //This method will throw 'Connection Error', so we just remove it
                call.session.onTransportError = function() {};
                //Re-register after 500ms
                $timeout(service.reregister.bind(service, true), 500);
                break;
        }
    }
});

service.on(EVENT_NAMES.sipRegistered, function(e) {
    __sipRegistered = true;
    __registerDeferred && __registerDeferred.resolve(e);
    service.isRegistered = true;
    service.isRegistering = false;
    service.isUnregistering = false;
    service.isUnregistered = false;
});

service.on([EVENT_NAMES.sipRegistrationFailed, EVENT_NAMES.sipConnectionFailed], function(e) {
    __sipRegistered = false;
    __registerDeferred && __registerDeferred.reject(e);
    service.isRegistered = false;
    service.isRegistering = false;
    service.isUnregistering = false;
    service.isUnregistered = false;
});

service.on(EVENT_NAMES.sipUnRegistered, function(e) {
    __sipRegistered = false;
    __unregisterDeferred && __unregisterDeferred.resolve(e);
    service.isRegistered = false;
    service.isRegistering = false;
    service.isUnregistered = true;
    service.isUnregistering = false;
});

$window.addEventListener('unload', function() {
    service.hangup();
    service.unregister();
});

