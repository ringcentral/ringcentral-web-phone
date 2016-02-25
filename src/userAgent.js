var SIP = require('sip.js');
var EventEmitter = require('./emitter');
var PhoneLine = require('./phoneLine');
var utils = require('./utils');

var extend = utils.extend;
var uuid = utils.uuid;

var EVENT_NAMES = require('./eventNames');
var DomAudio = require('./dom');

/*--------------------------------------------------------------------------------------------------------------------*/

/**
 * @param options
 * @constructor
 */
var UserAgent = function(options) {
    this.eventEmitter = new EventEmitter();
    this.sipConfig = options ? (options.sipConfig || {}) : ({});
    this.lines = {};
    this.userAgent = undefined;
    this.getUserMedia = undefined;
    this.RTCPeerConnection = undefined;
    this.RTCSessionDescription = undefined;
    this.dom = new DomAudio();
    this.checkConfig();
};

/*--------------------------------------------------------------------------------------------------------------------*/

UserAgent.prototype.checkConfig = function() {
    // set mootools expands to non-enumerables under ES5
    if (typeof this.sipConfig.wsServers === 'string') {
        this.sipConfig.wsServers = [
            {ws_uri: this.sipConfig.wsServers}
        ];
    }
    var key, enums = {enumerable: false};
    for (key in this.sipConfig.wsServers) this.sipConfig.wsServers.hasOwnProperty(key) || Object.defineProperty(Array.prototype, key, enums);
};

/*--------------------------------------------------------------------------------------------------------------------*/

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
    this.checkConfig();
};

/*--------------------------------------------------------------------------------------------------------------------*/

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

/*--------------------------------------------------------------------------------------------------------------------*/

UserAgent.prototype.getActiveLines = function() {
    this.__clearInactiveLines();
    return this.lines;
};

/*--------------------------------------------------------------------------------------------------------------------*/

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

/*--------------------------------------------------------------------------------------------------------------------*/

UserAgent.prototype.getIncomingLinesArray = function() {
    return this.getActiveLinesArray().filter(function(el) {
        return el.isIncoming();
    });
};

/*--------------------------------------------------------------------------------------------------------------------*/

UserAgent.prototype.__clearInactiveLines = function() {
    for (var id in this.lines) {
        if (this.lines.hasOwnProperty(id)) {
            if (this.lines[id].isClosed()) {
                delete this.lines[id];
            }
        }
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

var __disconnectCount = 0;


UserAgent.prototype.start = function(options) {
    var self = this;

    self.stop();
    if (self.userAgent instanceof SIP.UA) {
        self.userAgent.loadConfig(self.sipConfig);
        self.userAgent.traceSip = true;
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

};

/*--------------------------------------------------------------------------------------------------------------------*/

UserAgent.prototype.reregister = function(options, reconnect) {
    var self = this, reconnect = !!reconnect;
    options = extend(self.__registerExtraOptions, options);
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

/*--------------------------------------------------------------------------------------------------------------------*/

UserAgent.prototype.stop = function() {
    if (this.userAgent instanceof SIP.UA) {
        this.userAgent.stop();
        this.userAgent = null;
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

UserAgent.prototype.call = function(number, inviteOptions) {
    var self = this;
    var options = {
        media: {
            constraints: {audio: true, video: false},
            render: {
                local: {
                    audio: self.dom.localAudio
                },
                remote: {
                    audio: self.dom.remoteAudio
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
    extend(options, {
        extraHeaders: headers
    });
    var session = this.userAgent.invite('' + number, options);
    var line = self.__createLine(session, PhoneLine.types.outgoing);
    this.eventEmitter.emit(EVENT_NAMES.outgoingCall, line);
    return line;
};

/*--------------------------------------------------------------------------------------------------------------------*/

UserAgent.prototype.answer = function(line) {
    return line && line.answer();
};

/*--------------------------------------------------------------------------------------------------------------------*/


UserAgent.prototype.hangup = function(line) {
    if (line) {
        line.cancel();
        delete this.lines[line.getId()];
    }
};

/*--------------------------------------------------------------------------------------------------------------------*/

UserAgent.prototype.on = function(eventName, cb) {
    this.eventEmitter.on(eventName, cb);
    return this;
};

/*--------------------------------------------------------------------------------------------------------------------*/

UserAgent.prototype.isConnected = function() {
    return !!(this.userAgent && this.userAgent.transport && this.userAgent.transport.connected);
};

/*--------------------------------------------------------------------------------------------------------------------*/

UserAgent.prototype.isConnecting = function() {
    //websocket.readyState === CONNECTING (0)
    return !this.isConnected() && !!(this.userAgent && this.userAgent.transport && this.userAgent.transport.ws && this.userAgent.transport.ws.readyState === 0);
};

/*--------------------------------------------------------------------------------------------------------------------*/

UserAgent.prototype.forceDisconnect = function() {
    console.warn(this.isConnecting(), this.isConnected())
    if (this.isConnecting() || this.isConnected()) {
        this.userAgent.transport.disconnect();
        this.userAgent.stop();
        this.userAgent = null;
    }
};

module.exports = UserAgent;