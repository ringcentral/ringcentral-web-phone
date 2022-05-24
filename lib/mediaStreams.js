"use strict";
/*
 * @Author: Elias Sun(elias.sun@ringcentral.com)
 * @Date: Dec. 15, 2018
 * Copyright © RingCentral. All rights reserved.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaStreams = exports.MediaStreamsImpl = exports.RTPReport = exports.Browsers = void 0;
/**
 * @Supported browsers: @Chrome  @Firefox @Safari
 *
 * @Section1 @type MediaStreams public interfaces
 *
 * @release : release the resource after the call is ended.
 * @param : none
 *
 * @reconnectMedia : reconnect media streams in a call at any time.
 * @param : none
 *
 * @getMediaStats : get the media RTP statistics
 * @param1 onMediaStat : @optional  @callback function to receive the RTP statistics report.
 *   Ways to receive media report:
 *   @way1 onMediaStat = function(report) {...}
 *   @way2 session.on("rtpStat") to listen on the event
 *   @way3 session.onRTPStat = function(report)
 *   @way4 session.mediaStreams.onRTPStat = function(report)
 * @param2 interval : @optional  the interval in seconds to fetch a media statistics report. 1 second by default.
 * @return: @inboundRtpReport : bytesReceived, jitter, packetsLost, packetsReceived, mediaType, fractionLostIn
 *          @outboundRtpReport : bytesSent, packetsSent, mediaType
 *          @rttMS : currentRoundTripTime
 *
 * @stopMediaStats :stop the media statistics
 * @param : none
 *
 * @Section2 @type MediaStreams public properties
 *
 * @property onRTPStat : @optional @callback function to receive the RTP statistics report.
 * @property onMediaConnectionStateChange : @optional @callback function to receive media connectionState
 *   Ways to receive the media connection state
 *   @way1 session.onMediaConnectionStateChange = function(session, event) {...}
 *   @way2 session.mediaStreams.onMediaConnectionStateChange = function(session, event) {...}
 *   @way3 session.on(event)  event = element in connectionState
 *
 * @Section3 @type MediaStreams public events
 * @connectionState : media connection state. @emit :
 *   @state1 'mediaConnectionStateNew' : A new RTCPeerConnection is created.
 *   @state2 'mediaConnectionStateChecking' : A new RTCPeerConnection is created.
 *   @state3 'mediaConnectionStateConnected' : RTCPeerConnection media connection is connected.
 *   @state4 'mediaConnectionStateCompleted' : RTCPeerConnection media connection is ready.
 *   @state5 'mediaConnectionStateFailed' : RTCPeerConnection media connection is failed.
 *   @state6 'mediaConnectionStateDisconnected': RTCPeerConnection media connection is disconnected.
 *   @state7 'mediaConnectionStateClosed' : RTCPeerConnection media connection is closed.
 */
var ConnectionState;
(function (ConnectionState) {
    ConnectionState["new"] = "mediaConnectionStateNew";
    ConnectionState["checking"] = "mediaConnectionStateChecking";
    ConnectionState["connected"] = "mediaConnectionStateConnected";
    ConnectionState["completed"] = "mediaConnectionStateCompleted";
    ConnectionState["failed"] = "mediaConnectionStateFailed";
    ConnectionState["disconnected"] = "mediaConnectionStateDisconnected";
    ConnectionState["closed"] = "mediaConnectionStateClosed";
})(ConnectionState || (ConnectionState = {}));
var Browsers;
(function (Browsers) {
    Browsers["MSIE"] = "IE";
    Browsers["Chrome"] = "Chrome";
    Browsers["Firefox"] = "Firefox";
    Browsers["Safari"] = "Safari";
    Browsers["Opera"] = "Opera";
})(Browsers = exports.Browsers || (exports.Browsers = {}));
var RTPReport = /** @class */ (function () {
    function RTPReport() {
        this.outboundRtpReport = {};
        this.inboundRtpReport = {};
        this.rttMS = {};
        this.localCandidates = [];
        this.remoteCandidates = [];
        this.transport = {};
    }
    return RTPReport;
}());
exports.RTPReport = RTPReport;
var MediaStreams = /** @class */ (function () {
    function MediaStreams(session) {
        this.mediaStreamsImpl = new MediaStreamsImpl(session);
        this.release = this.mediaStreamsImpl.release.bind(this.mediaStreamsImpl);
        this.reconnectMedia = this.mediaStreamsImpl.reconnectMedia.bind(this.mediaStreamsImpl);
        this.getMediaStats = this.mediaStreamsImpl.getMediaStats.bind(this.mediaStreamsImpl);
        this.stopMediaStats = this.mediaStreamsImpl.stopMediaStats.bind(this.mediaStreamsImpl);
    }
    Object.defineProperty(MediaStreams.prototype, "onRTPStat", {
        set: function (statsCallback) {
            this.mediaStreamsImpl.onRTPStat = statsCallback;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MediaStreams.prototype, "onMediaConnectionStateChange", {
        set: function (stateChangeCallBack) {
            this.mediaStreamsImpl.onMediaConnectionStateChange = stateChangeCallBack;
        },
        enumerable: false,
        configurable: true
    });
    return MediaStreams;
}());
exports.MediaStreams = MediaStreams;
exports.default = MediaStreams;
/**
 * MediaStreams Implementation
 */
var MediaStreamsImpl = /** @class */ (function () {
    function MediaStreamsImpl(session) {
        var _this = this;
        this.ktag = 'MediaStreams';
        this.onIceCandidate = function (event) {
            if (event.candidate === null) {
                _this.rcWPLogd(_this.tag, 'ice candidate completed for reconnect media');
                _this.session.sessionDescriptionHandler.off('iceCandidate', _this.onIceCandidate);
                _this.session.reinvite();
            }
        };
        this.ktag = 'MediaStreams';
        if (!session) {
            this.rcWPLoge(this.ktag, 'The session cannot be null!');
            throw new Error('Fail to create the media session. session is null or undefined!');
        }
        this.session = session;
        this.onMediaConnectionStateChange = null;
        this.onStateChange = this.onPeerConnectionStateChange.bind(this);
        if (this.session && this.session.sessionDescriptionHandler) {
            this.session.sessionDescriptionHandler.on('iceConnection', this.onStateChange);
            this.session.sessionDescriptionHandler.on('iceConnectionChecking', this.onStateChange);
            this.session.sessionDescriptionHandler.on('iceConnectionConnected', this.onStateChange);
            this.session.sessionDescriptionHandler.on('iceConnectionCompleted', this.onStateChange);
            this.session.sessionDescriptionHandler.on('iceConnectionFailed', this.onStateChange);
            this.session.sessionDescriptionHandler.on('iceConnectionDisconnected', this.onStateChange);
            this.session.sessionDescriptionHandler.on('iceConnectionClosed', this.onStateChange);
        }
        this.isChrome = this.browser() === Browsers['Chrome'];
        this.isFirefox = this.browser() === Browsers['Firefox'];
        this.isSafari = this.browser() === Browsers['Safari'];
        this.preRTT = { currentRoundTripTime: 0 };
        if (!this.isChrome && !this.isFirefox && !this.isSafari) {
            this.rcWPLoge(this.ktag, "The web browser " + this.browser() + " is not in the recommended list [Chrome, Safari, Firefox] !");
        }
    }
    MediaStreamsImpl.prototype.getMediaStats = function (onMediaStat, interval) {
        var _this = this;
        if (onMediaStat === void 0) { onMediaStat = null; }
        if (interval === void 0) { interval = 1000; }
        if (onMediaStat) {
            this.onRTPStat = onMediaStat;
        }
        if (this.mediaStatsTimer) {
            clearTimeout(this.mediaStatsTimer);
            this.mediaStatsTimer = null;
        }
        this.mediaStatsTimer = setInterval(function () {
            _this.mediaStatsTimerCallback();
        }, interval);
    };
    MediaStreamsImpl.prototype.mediaStatsTimerCallback = function () {
        var pc = this.session.sessionDescriptionHandler.peerConnection;
        if (!pc) {
            this.rcWPLoge(this.ktag, 'the peer connection cannot be null');
            return;
        }
        var connectionState = pc.iceConnectionState;
        if (connectionState !== 'connected' && connectionState !== 'completed') {
            this.preRTT['currentRoundTripTime'] = 0;
            return;
        }
        var rtpStatInSession = this.session.listeners('rtpStat');
        if (!this.session.onRTPStat && !this.onRTPStat && rtpStatInSession.length <= 0) {
            this.rcWPLoge(this.ktag, 'No callback to accept receive media report. usage: session.on("rtpStat") = function(report) or session.onRTPStat = function(report) or set a mediaCallback as a paramter');
            return;
        }
        this.getRTPReport(new RTPReport());
    };
    MediaStreamsImpl.prototype.stopMediaStats = function () {
        if (this.mediaStatsTimer) {
            clearTimeout(this.mediaStatsTimer);
            this.onRTPStat = null;
        }
    };
    Object.defineProperty(MediaStreamsImpl.prototype, "tag", {
        get: function () {
            return this.ktag;
        },
        enumerable: false,
        configurable: true
    });
    MediaStreamsImpl.prototype.onPeerConnectionStateChange = function (sessionDescriptionHandler) {
        var eventState = 'unknown';
        if (ConnectionState.hasOwnProperty(sessionDescriptionHandler.peerConnection.iceConnectionState)) {
            eventState = ConnectionState[sessionDescriptionHandler.peerConnection.iceConnectionState];
            if (this.onMediaConnectionStateChange) {
                this.onMediaConnectionStateChange(this.session, eventState);
            }
            else if (this.session && this.session.onMediaConnectionStateChange) {
                this.session.onMediaConnectionStateChange(this.session, eventState);
            }
            else {
                this.session.emit(eventState);
            }
        }
        else {
            this.rcWPLogd(this.tag, "Unknown peerConnection state: " + sessionDescriptionHandler.peerConnection.iceConnectionState);
        }
        this.rcWPLogd(this.tag, "peerConnection State: " + eventState);
    };
    MediaStreamsImpl.prototype.reconnectMedia = function (options) {
        var self = this;
        return new Promise(function (resolve, reject) {
            return __awaiter(this, void 0, void 0, function () {
                var RTCOptions, offerOptions, pc, offer, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!self.session) return [3 /*break*/, 6];
                            RTCOptions = {
                                offerToReceiveAudio: 1,
                                offerToReceiveVideo: 0,
                                iceRestart: true
                            };
                            offerOptions = (options && options.RTCOptions) || RTCOptions;
                            if (!options) {
                                options = {};
                            }
                            if (!options.extraHeaders) {
                                options.extraHeaders = self.session.ua.defaultHeaders;
                            }
                            options.eventHandlers = {
                                succeeded: resolve,
                                failed: reject
                            };
                            pc = self.session.sessionDescriptionHandler.peerConnection;
                            offer = void 0;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            return [4 /*yield*/, pc.createOffer(offerOptions)];
                        case 2:
                            offer = _a.sent();
                            self.session.sessionDescriptionHandler.on('iceCandidate', self.onIceCandidate);
                            return [4 /*yield*/, pc.setLocalDescription(offer)];
                        case 3:
                            _a.sent();
                            self.rcWPLogd(self.tag, 'reconnecting media');
                            resolve('reconnecting media');
                            return [3 /*break*/, 5];
                        case 4:
                            e_1 = _a.sent();
                            self.rcWPLoge(self.tag, e_1);
                            reject(e_1);
                            return [3 /*break*/, 5];
                        case 5: return [3 /*break*/, 7];
                        case 6:
                            reject(new Error('The session cannot be empty'));
                            _a.label = 7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        });
    };
    MediaStreamsImpl.prototype.getRTPReport = function (reports) {
        var _this = this;
        var self = this;
        var pc = self.session.sessionDescriptionHandler.peerConnection;
        pc.getStats()
            .then(function (stats) {
            stats.forEach(function (report) {
                switch (report.type) {
                    case 'inbound-rtp':
                        Object.keys(report).forEach(function (statName) {
                            switch (statName) {
                                case 'bytesReceived':
                                case 'packetsReceived':
                                case 'jitter':
                                case 'packetsLost':
                                case 'fractionLost':
                                case 'mediaType':
                                    reports.inboundRtpReport[statName] = report[statName];
                                    break;
                                case 'roundTripTime':
                                    reports.rttMS[statName] = report[statName];
                                    break;
                            }
                        });
                        break;
                    case 'outbound-rtp':
                        Object.keys(report).forEach(function (statName) {
                            switch (statName) {
                                case 'bytesSent':
                                case 'packetsSent':
                                case 'mediaType':
                                    reports.outboundRtpReport[statName] = report[statName];
                                    break;
                            }
                        });
                        break;
                    case 'candidate-pair':
                        Object.keys(report).forEach(function (statName) {
                            switch (statName) {
                                case 'currentRoundTripTime':
                                    reports.rttMS[statName] = report[statName];
                                    break;
                            }
                        });
                        break;
                    case 'local-candidate':
                        var local_candidate_1 = {};
                        Object.keys(report).forEach(function (statName) {
                            switch (statName) {
                                case 'id':
                                case 'isRemote':
                                case 'ip':
                                case 'candidateType':
                                case 'networkType':
                                case 'priority':
                                case 'port':
                                    local_candidate_1[statName] = report[statName];
                                    break;
                            }
                        });
                        reports.localCandidates.push(local_candidate_1);
                        break;
                    case 'remote-candidate':
                        var remote_candidate_1 = {};
                        Object.keys(report).forEach(function (statName) {
                            switch (statName) {
                                case 'id':
                                case 'isRemote':
                                case 'ip':
                                case 'priority':
                                case 'port':
                                case 'candidateType':
                                    remote_candidate_1[statName] = report[statName];
                                    break;
                            }
                        });
                        reports.remoteCandidates.push(remote_candidate_1);
                        break;
                    case 'media-source':
                        reports.outboundRtpReport['rtpLocalAudioLevel'] = report.audioLevel ? report.audioLevel : 0;
                        break;
                    case 'track':
                        if (!report.remoteSource) {
                            break;
                        }
                        reports.inboundRtpReport['rtpRemoteAudioLevel'] = report.audioLevel ? report.audioLevel : 0;
                        break;
                    case 'transport':
                        Object.keys(report).forEach(function (statName) {
                            switch (statName) {
                                case 'dtlsState':
                                case 'packetsSent':
                                case 'packetsReceived':
                                case 'selectedCandidatePairChanges':
                                case 'selectedCandidatePairId':
                                    reports.transport[statName] = report[statName];
                                    break;
                            }
                        });
                        break;
                    default:
                        break;
                }
            });
            if (!reports.rttMS.hasOwnProperty('currentRoundTripTime')) {
                if (!reports.rttMS.hasOwnProperty('roundTripTime')) {
                    reports.rttMS['currentRoundTripTime'] = self.preRTT['currentRoundTripTime'];
                }
                else {
                    reports.rttMS['currentRoundTripTime'] = reports.rttMS['roundTripTime']; // for Firefox
                    delete reports.rttMS['roundTripTime'];
                }
            }
            else {
                reports.rttMS['currentRoundTripTime'] = Math.round(reports.rttMS['currentRoundTripTime'] * 1000);
            }
            if (reports.rttMS.hasOwnProperty('currentRoundTripTime')) {
                self.preRTT['currentRoundTripTime'] = reports.rttMS['currentRoundTripTime'];
            }
            if (self.session) {
                if (self.session.onRTPStat) {
                    self.session.onRTPStat(reports, self.session);
                }
                else if (self.onRTPStat) {
                    self.onRTPStat(reports, self.session);
                }
                else {
                    self.session.emit('rtpStat', reports, self.session);
                }
            }
        })
            .catch(function (error) {
            _this.rcWPLoge(self.ktag, JSON.stringify(error));
        });
    };
    MediaStreamsImpl.prototype.browser = function () {
        if (navigator.userAgent.search('MSIE') >= 0) {
            return Browsers['MSIE'];
        }
        else if (navigator.userAgent.search('Chrome') >= 0) {
            return Browsers['Chrome'];
        }
        else if (navigator.userAgent.search('Firefox') >= 0) {
            return Browsers['Firefox'];
        }
        else if (navigator.userAgent.search('Safari') >= 0 && navigator.userAgent.search('Chrome') < 0) {
            return Browsers['Safari'];
        }
        else if (navigator.userAgent.search('Opera') >= 0) {
            return Browsers['Opera'];
        }
        return 'unknown';
    };
    MediaStreamsImpl.prototype.release = function () {
        if (this.mediaStatsTimer) {
            clearTimeout(this.mediaStatsTimer);
            this.mediaStatsTimer = null;
        }
        if (this.session) {
            this.session.sessionDescriptionHandler.removeListener('iceConnection', this.onStateChange);
            this.session.sessionDescriptionHandler.removeListener('iceConnectionChecking', this.onStateChange);
            this.session.sessionDescriptionHandler.removeListener('iceConnectionConnected', this.onStateChange);
            this.session.sessionDescriptionHandler.removeListener('iceConnectionCompleted', this.onStateChange);
            this.session.sessionDescriptionHandler.removeListener('iceConnectionFailed', this.onStateChange);
            this.session.sessionDescriptionHandler.removeListener('iceConnectionDisconnected', this.onStateChange);
            this.session.sessionDescriptionHandler.removeListener('iceConnectionClosed', this.onStateChange);
        }
    };
    MediaStreamsImpl.prototype.rcWPLoge = function (label, msg) {
        if (this.session) {
            this.session.logger.error(label + " " + msg);
        }
    };
    MediaStreamsImpl.prototype.rcWPLogd = function (label, msg) {
        if (this.session) {
            this.session.logger.log(label + " " + msg);
        }
    };
    return MediaStreamsImpl;
}());
exports.MediaStreamsImpl = MediaStreamsImpl;
//# sourceMappingURL=mediaStreams.js.map