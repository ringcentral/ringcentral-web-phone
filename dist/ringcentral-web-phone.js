(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("sip.js"), require("getstats"));
	else if(typeof define === 'function' && define.amd)
		define(["sip.js", "getstats"], factory);
	else if(typeof exports === 'object')
		exports["WebPhone"] = factory(require("sip.js"), require("getstats"));
	else
		root["RingCentral"] = root["RingCentral"] || {}, root["RingCentral"]["WebPhone"] = factory(root["SIP"], root["getStats"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__0__, __WEBPACK_EXTERNAL_MODULE__11__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultMediaConstraints = exports.responseTimeout = exports.uuidKey = exports.messages = void 0;
exports.messages = {
    park: { reqid: 1, command: 'callpark' },
    startRecord: { reqid: 2, command: 'startcallrecord' },
    stopRecord: { reqid: 3, command: 'stopcallrecord' },
    flip: { reqid: 3, command: 'callflip', target: '' },
    monitor: { reqid: 4, command: 'monitor' },
    barge: { reqid: 5, command: 'barge' },
    whisper: { reqid: 6, command: 'whisper' },
    takeover: { reqid: 7, command: 'takeover' },
    toVoicemail: { reqid: 11, command: 'toVoicemail' },
    ignore: { reqid: 12, command: 'ignore' },
    receiveConfirm: { reqid: 17, command: 'receiveConfirm' },
    replyWithMessage: { reqid: 14, command: 'replyWithMessage' }
};
exports.uuidKey = 'rc-webPhone-uuid';
exports.responseTimeout = 60000;
exports.defaultMediaConstraints = {
    audio: true,
    video: false
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
exports.extend = exports.delay = exports.uuid = void 0;
exports.uuid = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        var v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
exports.delay = function (ms) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/, new Promise(function (resolve) { return setTimeout(resolve, ms); })];
}); }); };
exports.extend = function (dst, src) {
    if (dst === void 0) { dst = {}; }
    if (src === void 0) { src = {}; }
    return Object.assign(dst || {}, src || {});
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

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
                            self.rcWPLoge(self.tag, 'The session cannot be empty');
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
                    case 'media-source':
                        reports.outboundRtpReport['rtpLocalAudioLevel'] = report.audioLevel ? report.audioLevel : 0;
                        break;
                    case 'track':
                        if (!report.remoteSource) {
                            break;
                        }
                        reports.inboundRtpReport['rtpRemoteAudioLevel'] = report.audioLevel ? report.audioLevel : 0;
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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// enums can't really be declared, so they are set here.
// pulled out of individual files to avoid circular dependencies
Object.defineProperty(exports, "__esModule", { value: true });
var DialogStatus;
(function (DialogStatus) {
    DialogStatus[DialogStatus["STATUS_EARLY"] = 1] = "STATUS_EARLY";
    DialogStatus[DialogStatus["STATUS_CONFIRMED"] = 2] = "STATUS_CONFIRMED";
})(DialogStatus = exports.DialogStatus || (exports.DialogStatus = {}));
var SessionStatus;
(function (SessionStatus) {
    // Session states
    SessionStatus[SessionStatus["STATUS_NULL"] = 0] = "STATUS_NULL";
    SessionStatus[SessionStatus["STATUS_INVITE_SENT"] = 1] = "STATUS_INVITE_SENT";
    SessionStatus[SessionStatus["STATUS_1XX_RECEIVED"] = 2] = "STATUS_1XX_RECEIVED";
    SessionStatus[SessionStatus["STATUS_INVITE_RECEIVED"] = 3] = "STATUS_INVITE_RECEIVED";
    SessionStatus[SessionStatus["STATUS_WAITING_FOR_ANSWER"] = 4] = "STATUS_WAITING_FOR_ANSWER";
    SessionStatus[SessionStatus["STATUS_ANSWERED"] = 5] = "STATUS_ANSWERED";
    SessionStatus[SessionStatus["STATUS_WAITING_FOR_PRACK"] = 6] = "STATUS_WAITING_FOR_PRACK";
    SessionStatus[SessionStatus["STATUS_WAITING_FOR_ACK"] = 7] = "STATUS_WAITING_FOR_ACK";
    SessionStatus[SessionStatus["STATUS_CANCELED"] = 8] = "STATUS_CANCELED";
    SessionStatus[SessionStatus["STATUS_TERMINATED"] = 9] = "STATUS_TERMINATED";
    SessionStatus[SessionStatus["STATUS_ANSWERED_WAITING_FOR_PRACK"] = 10] = "STATUS_ANSWERED_WAITING_FOR_PRACK";
    SessionStatus[SessionStatus["STATUS_EARLY_MEDIA"] = 11] = "STATUS_EARLY_MEDIA";
    SessionStatus[SessionStatus["STATUS_CONFIRMED"] = 12] = "STATUS_CONFIRMED";
})(SessionStatus = exports.SessionStatus || (exports.SessionStatus = {}));
var TransactionStatus;
(function (TransactionStatus) {
    // Transaction states
    TransactionStatus[TransactionStatus["STATUS_TRYING"] = 1] = "STATUS_TRYING";
    TransactionStatus[TransactionStatus["STATUS_PROCEEDING"] = 2] = "STATUS_PROCEEDING";
    TransactionStatus[TransactionStatus["STATUS_CALLING"] = 3] = "STATUS_CALLING";
    TransactionStatus[TransactionStatus["STATUS_ACCEPTED"] = 4] = "STATUS_ACCEPTED";
    TransactionStatus[TransactionStatus["STATUS_COMPLETED"] = 5] = "STATUS_COMPLETED";
    TransactionStatus[TransactionStatus["STATUS_TERMINATED"] = 6] = "STATUS_TERMINATED";
    TransactionStatus[TransactionStatus["STATUS_CONFIRMED"] = 7] = "STATUS_CONFIRMED";
})(TransactionStatus = exports.TransactionStatus || (exports.TransactionStatus = {}));
var TypeStrings;
(function (TypeStrings) {
    TypeStrings[TypeStrings["AckClientTransaction"] = 0] = "AckClientTransaction";
    TypeStrings[TypeStrings["ClientContext"] = 1] = "ClientContext";
    TypeStrings[TypeStrings["ConfigurationError"] = 2] = "ConfigurationError";
    TypeStrings[TypeStrings["Dialog"] = 3] = "Dialog";
    TypeStrings[TypeStrings["DigestAuthentication"] = 4] = "DigestAuthentication";
    TypeStrings[TypeStrings["DTMF"] = 5] = "DTMF";
    TypeStrings[TypeStrings["IncomingMessage"] = 6] = "IncomingMessage";
    TypeStrings[TypeStrings["IncomingRequest"] = 7] = "IncomingRequest";
    TypeStrings[TypeStrings["IncomingResponse"] = 8] = "IncomingResponse";
    TypeStrings[TypeStrings["InvalidStateError"] = 9] = "InvalidStateError";
    TypeStrings[TypeStrings["InviteClientContext"] = 10] = "InviteClientContext";
    TypeStrings[TypeStrings["InviteClientTransaction"] = 11] = "InviteClientTransaction";
    TypeStrings[TypeStrings["InviteServerContext"] = 12] = "InviteServerContext";
    TypeStrings[TypeStrings["InviteServerTransaction"] = 13] = "InviteServerTransaction";
    TypeStrings[TypeStrings["Logger"] = 14] = "Logger";
    TypeStrings[TypeStrings["LoggerFactory"] = 15] = "LoggerFactory";
    TypeStrings[TypeStrings["MethodParameterError"] = 16] = "MethodParameterError";
    TypeStrings[TypeStrings["NameAddrHeader"] = 17] = "NameAddrHeader";
    TypeStrings[TypeStrings["NonInviteClientTransaction"] = 18] = "NonInviteClientTransaction";
    TypeStrings[TypeStrings["NonInviteServerTransaction"] = 19] = "NonInviteServerTransaction";
    TypeStrings[TypeStrings["NotSupportedError"] = 20] = "NotSupportedError";
    TypeStrings[TypeStrings["OutgoingRequest"] = 21] = "OutgoingRequest";
    TypeStrings[TypeStrings["Parameters"] = 22] = "Parameters";
    TypeStrings[TypeStrings["PublishContext"] = 23] = "PublishContext";
    TypeStrings[TypeStrings["ReferClientContext"] = 24] = "ReferClientContext";
    TypeStrings[TypeStrings["ReferServerContext"] = 25] = "ReferServerContext";
    TypeStrings[TypeStrings["RegisterContext"] = 26] = "RegisterContext";
    TypeStrings[TypeStrings["RenegotiationError"] = 27] = "RenegotiationError";
    TypeStrings[TypeStrings["RequestSender"] = 28] = "RequestSender";
    TypeStrings[TypeStrings["ServerContext"] = 29] = "ServerContext";
    TypeStrings[TypeStrings["Session"] = 30] = "Session";
    TypeStrings[TypeStrings["SessionDescriptionHandler"] = 31] = "SessionDescriptionHandler";
    TypeStrings[TypeStrings["SessionDescriptionHandlerError"] = 32] = "SessionDescriptionHandlerError";
    TypeStrings[TypeStrings["SessionDescriptionHandlerObserver"] = 33] = "SessionDescriptionHandlerObserver";
    TypeStrings[TypeStrings["Subscription"] = 34] = "Subscription";
    TypeStrings[TypeStrings["Transport"] = 35] = "Transport";
    TypeStrings[TypeStrings["TransportError"] = 36] = "TransportError";
    TypeStrings[TypeStrings["UA"] = 37] = "UA";
    TypeStrings[TypeStrings["URI"] = 38] = "URI";
})(TypeStrings = exports.TypeStrings || (exports.TypeStrings = {}));
// UA status codes
var UAStatus;
(function (UAStatus) {
    UAStatus[UAStatus["STATUS_INIT"] = 0] = "STATUS_INIT";
    UAStatus[UAStatus["STATUS_STARTING"] = 1] = "STATUS_STARTING";
    UAStatus[UAStatus["STATUS_READY"] = 2] = "STATUS_READY";
    UAStatus[UAStatus["STATUS_USER_CLOSED"] = 3] = "STATUS_USER_CLOSED";
    UAStatus[UAStatus["STATUS_NOT_READY"] = 4] = "STATUS_NOT_READY";
})(UAStatus = exports.UAStatus || (exports.UAStatus = {}));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Enums_1 = __webpack_require__(4);
/* SessionDescriptionHandlerObserver
 * @class SessionDescriptionHandler Observer Class.
 * @param {SIP.Session} session
 * @param {Object} [options]
 */
var SessionDescriptionHandlerObserver = /** @class */ (function () {
    function SessionDescriptionHandlerObserver(session, options) {
        this.type = Enums_1.TypeStrings.SessionDescriptionHandlerObserver;
        this.session = session;
        this.options = options;
    }
    SessionDescriptionHandlerObserver.prototype.trackAdded = function () {
        this.session.emit("trackAdded");
    };
    SessionDescriptionHandlerObserver.prototype.directionChanged = function () {
        this.session.emit("directionChanged");
    };
    return SessionDescriptionHandlerObserver;
}());
exports.SessionDescriptionHandlerObserver = SessionDescriptionHandlerObserver;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var userAgent_1 = __webpack_require__(7);
var sip_js_1 = __webpack_require__(0);
var constants_1 = __webpack_require__(1);
var utils_1 = __webpack_require__(2);
var mediaStreams_1 = __importStar(__webpack_require__(3));
var DefaultSessionDescriptionHandler_1 = __webpack_require__(14);
var SessionDescriptionHandlerObserver_1 = __webpack_require__(5);
var version = __webpack_require__(18).version;
var WebPhone = /** @class */ (function () {
    /**
     * TODO: include 'WebPhone' for all apps other than Chrome and Glip
     * TODO: parse wsservers from new api spec
     */
    function WebPhone(regData, options) {
        if (regData === void 0) { regData = {}; }
        if (options === void 0) { options = {}; }
        this.sipInfo = regData.sipInfo[0] || regData.sipInfo;
        this.sipFlags = regData.sipFlags;
        this.uuidKey = options.uuidKey || constants_1.uuidKey;
        var id = options.uuid || localStorage.getItem(this.uuidKey) || utils_1.uuid(); //TODO Make configurable
        localStorage.setItem(this.uuidKey, id);
        this.appKey = options.appKey;
        this.appName = options.appName;
        this.appVersion = options.appVersion;
        var ua_match = navigator.userAgent.match(/\((.*?)\)/);
        var app_client_os = (ua_match && ua_match.length && ua_match[1]).replace(/[^a-zA-Z0-9.:_]+/g, '-') || '';
        var userAgentString = (options.appName ? options.appName + (options.appVersion ? '/' + options.appVersion : '') + ' ' : '') +
            (app_client_os ? app_client_os : '') +
            (" RCWEBPHONE/" + version);
        var modifiers = options.modifiers || [];
        if (options.enableDefaultModifiers !== false) {
            modifiers.push(sip_js_1.Web.Modifiers.stripG722);
            modifiers.push(sip_js_1.Web.Modifiers.stripTcpCandidates);
        }
        if (options.enableMidLinesInSDP) {
            modifiers.push(sip_js_1.Web.Modifiers.addMidLines);
        }
        var sdpSemantics = 'unified-plan';
        if (options.enablePlanB) {
            sdpSemantics = 'plan-b';
        }
        var stunServerArr = options.stunServers || this.sipInfo.stunServers || ['stun:74.125.194.127:19302'];
        var iceServers = [];
        stunServerArr.forEach(function (addr) {
            addr = !/^(stun:)/.test(addr) ? 'stun:' + addr : addr;
            iceServers.push({ urls: addr });
        });
        var sessionDescriptionHandlerFactoryOptions = options.sessionDescriptionHandlerFactoryOptions || {
            peerConnectionOptions: {
                iceCheckingTimeout: this.sipInfo.iceCheckingTimeout || this.sipInfo.iceGatheringTimeout || 500,
                rtcConfiguration: {
                    sdpSemantics: sdpSemantics,
                    iceServers: iceServers
                }
            },
            constraints: options.mediaConstraints || constants_1.defaultMediaConstraints,
            modifiers: modifiers
        };
        var browserUa = navigator.userAgent.toLowerCase();
        var isSafari = false;
        var isFirefox = false;
        if (browserUa.indexOf('safari') > -1 && browserUa.indexOf('chrome') < 0) {
            isSafari = true;
        }
        else if (browserUa.indexOf('firefox') > -1 && browserUa.indexOf('chrome') < 0) {
            isFirefox = true;
        }
        if (isFirefox) {
            sessionDescriptionHandlerFactoryOptions.alwaysAcquireMediaFirst = true;
        }
        var sessionDescriptionHandlerFactory = function (session, options) {
            var logger = session.ua.getLogger("sip.invitecontext.defaultSessionDescriptionHandler", session.id);
            var observer = new SessionDescriptionHandlerObserver_1.SessionDescriptionHandlerObserver(session, options);
            return new DefaultSessionDescriptionHandler_1.DefaultSessionDescriptionHandler(logger, observer, sessionDescriptionHandlerFactoryOptions);
        };
        var sipErrorCodes = regData.sipErrorCodes && regData.sipErrorCodes.length
            ? regData.sipErrorCodes
            : ['408', '502', '503', '504'];
        var wsServers = [];
        if (this.sipInfo.outboundProxy && this.sipInfo.transport) {
            wsServers.push({
                wsUri: this.sipInfo.transport.toLowerCase() + '://' + this.sipInfo.outboundProxy,
                weight: 10
            });
        }
        if (this.sipInfo.outboundProxyBackup && this.sipInfo.transport) {
            wsServers.push({
                wsUri: this.sipInfo.transport.toLowerCase() + '://' + this.sipInfo.outboundProxyBackup,
                weight: 0
            });
        }
        wsServers = wsServers.length ? wsServers : this.sipInfo.wsServers;
        var maxReconnectionAttemptsNoBackup = options.maxReconnectionAttemptsNoBackup || 15;
        var maxReconnectionAttemptsWithBackup = options.maxReconnectionAttemptsWithBackup || 10;
        var reconnectionTimeoutNoBackup = options.reconnectionTimeoutNoBackup || 5;
        var reconnectionTimeoutWithBackup = options.reconnectionTimeoutWithBackup || 4;
        var configuration = {
            uri: "sip:" + this.sipInfo.username + "@" + this.sipInfo.domain,
            transportOptions: {
                wsServers: wsServers,
                traceSip: true,
                maxReconnectionAttempts: wsServers.length === 1 ? maxReconnectionAttemptsNoBackup : maxReconnectionAttemptsWithBackup,
                reconnectionTimeout: wsServers.length === 1 ? reconnectionTimeoutNoBackup : reconnectionTimeoutWithBackup,
                connectionTimeout: 5
            },
            authorizationUser: this.sipInfo.authorizationId,
            password: this.sipInfo.password,
            // turnServers: [],
            log: {
                level: options.logLevel || 1,
                builtinEnabled: typeof options.builtinEnabled === 'undefined' ? true : options.builtinEnabled,
                connector: options.connector || null
            },
            domain: this.sipInfo.domain,
            autostart: false,
            register: true,
            userAgentString: userAgentString,
            sessionDescriptionHandlerFactoryOptions: sessionDescriptionHandlerFactoryOptions,
            sessionDescriptionHandlerFactory: sessionDescriptionHandlerFactory,
            allowLegacyNotifications: true,
            registerOptions: {
                instanceId: options.instanceId || undefined,
                regId: options.regId || undefined
            }
        };
        options.sipErrorCodes = sipErrorCodes;
        options.switchBackInterval = this.sipInfo.switchBackInterval;
        this.userAgent = userAgent_1.patchUserAgent(new sip_js_1.UA(configuration), this.sipInfo, options, id);
    }
    WebPhone.version = '0.8.1';
    WebPhone.uuid = utils_1.uuid;
    WebPhone.delay = utils_1.delay;
    WebPhone.extend = utils_1.extend;
    WebPhone.MediaStreams = mediaStreams_1.default;
    WebPhone.MediaStreamsImpl = mediaStreams_1.MediaStreamsImpl;
    return WebPhone;
}());
exports.default = WebPhone;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchUserAgent = void 0;
var audioHelper_1 = __webpack_require__(8);
var session_1 = __webpack_require__(9);
var sipTransportConstructor_1 = __webpack_require__(13);
exports.patchUserAgent = function (userAgent, sipInfo, options, id) {
    userAgent.defaultHeaders = ['P-rc-endpoint-id: ' + id, 'Client-id:' + options.appKey];
    userAgent.media = {};
    userAgent.enableQos = options.enableQos;
    userAgent.enableMediaReportLogging = options.enableMediaReportLogging;
    userAgent.qosCollectInterval = options.qosCollectInterval || 5000;
    if (options.media && (options.media.remote && options.media.local)) {
        userAgent.media.remote = options.media.remote;
        userAgent.media.local = options.media.local;
    }
    else
        userAgent.media = null;
    userAgent.sipInfo = sipInfo;
    userAgent.__invite = userAgent.invite;
    userAgent.invite = invite.bind(userAgent);
    userAgent.__register = userAgent.register;
    userAgent.register = register.bind(userAgent);
    userAgent.__unregister = userAgent.unregister;
    userAgent.unregister = unregister.bind(userAgent);
    userAgent.audioHelper = new audioHelper_1.AudioHelper(options.audioHelper);
    userAgent.__transportConstructor = userAgent.configuration.transportConstructor;
    userAgent.configuration.transportConstructor = sipTransportConstructor_1.TransportConstructorWrapper(userAgent.__transportConstructor, options);
    userAgent.onSession = options.onSession || null;
    userAgent.createRcMessage = createRcMessage;
    userAgent.sendMessage = sendMessage;
    userAgent.__onTransportConnected = userAgent.onTransportConnected;
    userAgent.onTransportConnected = onTransportConnected.bind(userAgent);
    userAgent.on('invite', function (session) {
        userAgent.audioHelper.playIncoming(true);
        session_1.patchSession(session);
        session_1.patchIncomingSession(session);
        session.logger.log('UA recieved incoming call invite');
        session._sendReceiveConfirmPromise = session
            .sendReceiveConfirm()
            .then(function () {
            session.logger.log('sendReceiveConfirm success');
        })
            .catch(function (error) {
            session.logger.error('failed to send receive confirmation via SIP MESSAGE due to ' + error);
        });
    });
    userAgent.on('registrationFailed', function (e) {
        // Check the status of message is in sipErrorCodes and disconnecting from server if it so;
        if (!e) {
            return;
        }
        var message = e.data || e;
        if (message && typeof message === 'string' && userAgent.transport.isSipErrorCode(message)) {
            userAgent.transport.onSipErrorCode();
        }
        userAgent.logger.warn('UA Registration Failed');
    });
    userAgent.on('notify', function (_a) {
        var request = _a.request;
        var event = request && request.headers && request.headers.Event && request.headers.Event[0];
        if (event && event.raw === 'check-sync') {
            userAgent.emit('provisionUpdate');
        }
        userAgent.logger.log('UA recieved notify');
    });
    userAgent.start();
    return userAgent;
};
/*--------------------------------------------------------------------------------------------------------------------*/
function onTransportConnected() {
    if (this.configuration.register) {
        return this.register();
    }
}
/*--------------------------------------------------------------------------------------------------------------------*/
function createRcMessage(options) {
    options.body = options.body || '';
    return ('<Msg>' +
        '<Hdr SID="' +
        options.sid +
        '" Req="' +
        options.request +
        '" From="' +
        options.from +
        '" To="' +
        options.to +
        '" Cmd="' +
        options.reqid +
        '"/> ' +
        '<Bdy Cln="' +
        this.sipInfo.authorizationId +
        '" ' +
        options.body +
        '/>' +
        '</Msg>');
}
/*--------------------------------------------------------------------------------------------------------------------*/
function sendMessage(to, messageData) {
    var userAgent = this;
    var sipOptions = {};
    sipOptions.contentType = 'x-rc/agent';
    sipOptions.extraHeaders = [];
    sipOptions.extraHeaders.push('P-rc-ws: ' + this.contact);
    return new Promise(function (resolve, reject) {
        var message = userAgent.message(to, messageData, sipOptions);
        message.once('accepted', function (response, cause) { return resolve(response); });
        message.once('failed', function (response, cause) { return reject(new Error(cause)); });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function register(options) {
    if (options === void 0) { options = {}; }
    return this.__register.call(this, __assign(__assign({}, options), { extraHeaders: __spreadArrays((options.extraHeaders || []), this.defaultHeaders) }));
}
/*--------------------------------------------------------------------------------------------------------------------*/
function unregister(options) {
    if (options === void 0) { options = {}; }
    return this.__unregister.call(this, __assign(__assign({}, options), { extraHeaders: __spreadArrays((options.extraHeaders || []), this.defaultHeaders) }));
}
function invite(number, options) {
    if (options === void 0) { options = {}; }
    options.extraHeaders = (options.extraHeaders || []).concat(this.defaultHeaders);
    options.extraHeaders.push('P-Asserted-Identity: sip:' + (options.fromNumber || this.sipInfo.username) + '@' + this.sipInfo.domain //FIXME Phone Number
    );
    //FIXME Backend should know it already
    if (options.homeCountryId) {
        options.extraHeaders.push('P-rc-country-id: ' + options.homeCountryId);
    }
    options.RTCConstraints = options.RTCConstraints || {
        optional: [{ DtlsSrtpKeyAgreement: 'true' }]
    };
    this.audioHelper.playOutgoing(true);
    this.logger.log('Invite to ' + number + ' created with playOutgoing set to true');
    return session_1.patchSession(this.__invite(number, options));
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.AudioHelper = void 0;
var AudioHelper = /** @class */ (function () {
    function AudioHelper(options) {
        if (options === void 0) { options = {}; }
        this._enabled = !!options.enabled;
        this.loadAudio(options);
    }
    AudioHelper.prototype._playSound = function (url, val, volume) {
        if (!this._enabled || !url)
            return this;
        if (!this._audio[url]) {
            if (val) {
                this._audio[url] = new Audio();
                this._audio[url].src = url;
                this._audio[url].loop = true;
                this._audio[url].volume = volume;
                this._audio[url].playPromise = this._audio[url].play();
            }
        }
        else {
            if (val) {
                this._audio[url].currentTime = 0;
                this._audio[url].playPromise = this._audio[url].play();
            }
            else {
                var audio = this._audio[url];
                if (audio.playPromise !== undefined) {
                    audio.playPromise.then(function () {
                        audio.pause();
                    });
                }
            }
        }
        return this;
    };
    AudioHelper.prototype.loadAudio = function (options) {
        this._incoming = options.incoming;
        this._outgoing = options.outgoing;
        this._audio = {};
    };
    AudioHelper.prototype.setVolume = function (volume) {
        if (volume < 0) {
            volume = 0;
        }
        if (volume > 1) {
            volume = 1;
        }
        this.volume = volume;
        for (var url in this._audio) {
            if (this._audio.hasOwnProperty(url)) {
                this._audio[url].volume = volume;
            }
        }
    };
    AudioHelper.prototype.playIncoming = function (val) {
        return this._playSound(this._incoming, val, this.volume || 0.5);
    };
    AudioHelper.prototype.playOutgoing = function (val) {
        return this._playSound(this._outgoing, val, this.volume || 1);
    };
    return AudioHelper;
}());
exports.AudioHelper = AudioHelper;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchIncomingSession = exports.patchSession = void 0;
var sip_js_1 = __webpack_require__(0);
var constants_1 = __webpack_require__(1);
var qos_1 = __webpack_require__(10);
var utils_1 = __webpack_require__(2);
var mediaStreams_1 = __webpack_require__(3);
var rtpReport_1 = __webpack_require__(12);
exports.patchSession = function (session) {
    if (session.__patched)
        return session;
    session.__patched = true;
    session.__sendRequest = session.sendRequest;
    session.__receiveRequest = session.receiveRequest;
    session.__accept = session.accept;
    session.__hold = session.hold;
    session.__unhold = session.unhold;
    session.__dtmf = session.dtmf;
    session.__reinvite = session.reinvite;
    session.sendRequest = sendRequest.bind(session);
    session.receiveRequest = receiveRequest.bind(session);
    session.accept = accept.bind(session);
    session.hold = hold.bind(session);
    session.unhold = unhold.bind(session);
    session.dtmf = dtmf.bind(session);
    session.reinvite = reinvite.bind(session);
    session.warmTransfer = warmTransfer.bind(session);
    session.blindTransfer = blindTransfer.bind(session);
    session.transfer = transfer.bind(session);
    session.park = park.bind(session);
    session.forward = forward.bind(session);
    session.startRecord = startRecord.bind(session);
    session.stopRecord = stopRecord.bind(session);
    session.flip = flip.bind(session);
    session.mute = mute.bind(session);
    session.unmute = unmute.bind(session);
    session.onLocalHold = onLocalHold.bind(session);
    session.media = session.ua.media; //TODO Remove
    session.addTrack = addTrack.bind(session);
    session.stopMediaStats = stopMediaStats.bind(session);
    session.getIncomingInfoContent = getIncomingInfoContent.bind(session);
    session.sendMoveResponse = sendMoveResponse.bind(session);
    session._sendReinvite = sendReinvite.bind(session);
    session.on('replaced', exports.patchSession);
    // Audio
    session.on('progress', function (incomingResponse) {
        stopPlaying();
        if (incomingResponse.statusCode === 183) {
            session.logger.log('Receiving 183 In Progress from server');
            session.createDialog(incomingResponse, 'UAC');
            session.hasAnswer = true;
            session.status = sip_js_1.Session.C.STATUS_EARLY_MEDIA;
            session.logger.log('Created UAC Dialog');
            session.sessionDescriptionHandler.setDescription(incomingResponse.body).catch(function (exception) {
                session.logger.warn(exception);
                session.failed(incomingResponse, sip_js_1.C.causes.BAD_MEDIA_DESCRIPTION);
                session.terminate({
                    status_code: 488,
                    reason_phrase: 'Bad Media Description'
                });
                session.logger.log('Call failed with Bad Media Description');
            });
        }
    });
    if (session.media)
        session.on('trackAdded', addTrack);
    var stopPlaying = function () {
        session.ua.audioHelper.playOutgoing(false);
        session.ua.audioHelper.playIncoming(false);
        session.removeListener('accepted', stopPlaying);
        session.removeListener('rejected', stopPlaying);
        session.removeListener('bye', stopPlaying);
        session.removeListener('terminated', stopPlaying);
        session.removeListener('cancel', stopPlaying);
        session.removeListener('failed', stopPlaying);
        session.removeListener('replaced', stopPlaying);
    };
    session.on('accepted', stopPlaying);
    session.on('rejected', stopPlaying);
    session.on('bye', stopPlaying);
    session.on('terminated', stopPlaying);
    session.on('cancel', stopPlaying);
    session.on('failed', stopPlaying);
    session.on('replaced', stopPlaying);
    if (session.ua.enableQos) {
        session.on('SessionDescriptionHandler-created', function () {
            session.logger.log('SessionDescriptionHandler Created');
            qos_1.startQosStatsCollection(session);
            navigator.mediaDevices.enumerateDevices().then(function (devices) {
                devices.forEach(function (device) {
                    session.logger.log(device.kind + ' = ' + device.label + JSON.stringify(device));
                });
            });
        });
    }
    if (session.ua.onSession)
        session.ua.onSession(session);
    session.mediaStatsStarted = false;
    session.noAudioReportCount = 0;
    session.reinviteForNoAudioSent = false;
    return session;
};
/*--------------------------------------------------------------------------------------------------------------------*/
exports.patchIncomingSession = function (session) {
    try {
        parseRcHeader(session);
    }
    catch (e) {
        session.logger.error("Can't parse RC headers from invite request due to " + e);
    }
    session.canUseRCMCallControl = canUseRCMCallControl;
    session.createSessionMessage = createSessionMessage;
    session.sendSessionMessage = sendSessionMessage;
    session.sendReceiveConfirm = sendReceiveConfirm;
    session.ignore = ignore;
    session.toVoicemail = toVoicemail;
    session.replyWithMessage = replyWithMessage;
};
/*--------------------------------------------------------------------------------------------------------------------*/
var parseRcHeaderString = function (str) {
    if (str === void 0) { str = ''; }
    var obj = {};
    var pairs = str.split(/; */);
    pairs.forEach(function (pair) {
        var eq_idx = pair.indexOf('=');
        // skip things that don't look like key=value
        if (eq_idx < 0) {
            return;
        }
        var key = pair.substr(0, eq_idx).trim();
        var val = pair.substr(++eq_idx, pair.length).trim();
        // only assign once
        if (undefined === obj[key]) {
            obj[key] = val;
        }
    });
    return obj;
};
var parseRcHeader = function (session) {
    var prc = session.request.headers['P-Rc'];
    var prcCallInfo = session.request.headers['P-Rc-Api-Call-Info'];
    if (prc && prc.length) {
        var rawInviteMsg = prc[0].raw;
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(rawInviteMsg, 'text/xml');
        var hdrNode = xmlDoc.getElementsByTagName('Hdr')[0];
        var bdyNode = xmlDoc.getElementsByTagName('Bdy')[0];
        if (hdrNode) {
            session.rcHeaders = {
                sid: hdrNode.getAttribute('SID'),
                request: hdrNode.getAttribute('Req'),
                from: hdrNode.getAttribute('From'),
                to: hdrNode.getAttribute('To')
            };
        }
        if (bdyNode) {
            utils_1.extend(session.rcHeaders, {
                srvLvl: bdyNode.getAttribute('SrvLvl'),
                srvLvlExt: bdyNode.getAttribute('SrvLvlExt'),
                nm: bdyNode.getAttribute('Nm'),
                toNm: bdyNode.getAttribute('ToNm')
            });
        }
    }
    if (prcCallInfo && prcCallInfo.length) {
        var rawCallInfo = prcCallInfo[0].raw;
        if (rawCallInfo) {
            var parsed = parseRcHeaderString(rawCallInfo);
            utils_1.extend(session.rcHeaders, parsed);
        }
    }
};
var mediaCheckTimer = 2000;
/*--------------------------------------------------------------------------------------------------------------------*/
function canUseRCMCallControl() {
    return !!this.rcHeaders;
}
/*--------------------------------------------------------------------------------------------------------------------*/
function createSessionMessage(options) {
    if (!this.rcHeaders) {
        return undefined;
    }
    utils_1.extend(options, {
        sid: this.rcHeaders.sid,
        request: this.rcHeaders.request,
        from: this.rcHeaders.to,
        to: this.rcHeaders.from
    });
    return this.ua.createRcMessage(options);
}
/*--------------------------------------------------------------------------------------------------------------------*/
function ignore() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, this._sendReceiveConfirmPromise.then(function () {
                    return _this.sendSessionMessage(constants_1.messages.ignore);
                })];
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function sendSessionMessage(options) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (!this.rcHeaders) {
                throw new Error("Can't send SIP MESSAGE related to session: no RC headers available");
            }
            return [2 /*return*/, this.ua.sendMessage(this.rcHeaders.from, this.createSessionMessage(options))];
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function sendReceiveConfirm() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, this.sendSessionMessage(constants_1.messages.receiveConfirm)];
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function toVoicemail() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2 /*return*/, this._sendReceiveConfirmPromise.then(function () {
                    return _this.sendSessionMessage(constants_1.messages.toVoicemail);
                })];
        });
    });
}
function replyWithMessage(replyOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var body;
        var _this = this;
        return __generator(this, function (_a) {
            body = 'RepTp="' + replyOptions.replyType + '"';
            if (replyOptions.replyType === 0) {
                body += ' Bdy="' + replyOptions.replyText + '"';
            }
            else if (replyOptions.replyType === 1 || replyOptions.replyType === 4) {
                body += ' Vl="' + replyOptions.timeValue + '"';
                body += ' Units="' + replyOptions.timeUnits + '"';
                body += ' Dir="' + replyOptions.callbackDirection + '"';
            }
            return [2 /*return*/, this._sendReceiveConfirmPromise.then(function () {
                    return _this.sendSessionMessage({
                        reqid: constants_1.messages.replyWithMessage.reqid,
                        body: body
                    });
                })];
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function sendReceive(session, command, options) {
    return __awaiter(this, void 0, void 0, function () {
        var cseq;
        return __generator(this, function (_a) {
            options = options || {};
            utils_1.extend(command, options);
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var extraHeaders = (options.extraHeaders || [])
                        .concat(session.ua.defaultHeaders)
                        .concat(['Content-Type: application/json;charset=utf-8']);
                    session.sendRequest(sip_js_1.C.INFO, {
                        body: JSON.stringify({
                            request: command
                        }),
                        extraHeaders: extraHeaders,
                        receiveResponse: function (response) {
                            var timeout = null;
                            if (response.statusCode === 200) {
                                cseq = response.cseq;
                                var onInfo_1 = function (request) {
                                    if (response.cseq !== cseq)
                                        return;
                                    var body = (request && request.body) || '{}';
                                    var obj;
                                    try {
                                        obj = JSON.parse(body);
                                    }
                                    catch (e) {
                                        obj = {};
                                    }
                                    if (obj.response && obj.response.command === command.command) {
                                        if (obj.response.result) {
                                            if (obj.response.result.code.toString() === '0') {
                                                return resolve(obj.response.result);
                                            }
                                            return reject(obj.response.result);
                                        }
                                    }
                                    timeout && clearTimeout(timeout);
                                    session.removeListener('RC_SIP_INFO', onInfo_1);
                                    resolve(null); //FIXME What to resolve
                                };
                                timeout = setTimeout(function () {
                                    reject(new Error('Timeout: no reply'));
                                    session.removeListener('RC_SIP_INFO', onInfo_1);
                                }, constants_1.responseTimeout);
                                session.on('RC_SIP_INFO', onInfo_1);
                            }
                            else {
                                reject(new Error('The INFO response status code is: ' + response.statusCode + ' (waiting for 200)'));
                            }
                        }
                    });
                })];
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function sendRequest(type, config) {
    if (type === sip_js_1.C.PRACK) {
        // type = C.ACK;
        return this;
    }
    return this.__sendRequest(type, config);
}
/*--------------------------------------------------------------------------------------------------------------------*/
function setRecord(session, flag) {
    return __awaiter(this, void 0, void 0, function () {
        var message, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    message = !!flag ? constants_1.messages.startRecord : constants_1.messages.stopRecord;
                    if (!((session.__onRecord && !flag) || (!session.__onRecord && flag))) return [3 /*break*/, 2];
                    return [4 /*yield*/, sendReceive(session, message)];
                case 1:
                    data = _a.sent();
                    session.__onRecord = !!flag;
                    return [2 /*return*/, data];
                case 2: return [2 /*return*/];
            }
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
//TODO: Convert to toggleHold() and deprecate this function
function setLocalHold(session, flag) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!flag) return [3 /*break*/, 2];
                    return [4 /*yield*/, session.__hold()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, session.__unhold()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function getIncomingInfoContent(request) {
    if (!request || !request.body) {
        return {};
    }
    var ret = {};
    try {
        ret = JSON.parse(request.body);
    }
    catch (e) {
        return {};
    }
    return ret;
}
function sendMoveResponse(reqId, code, description, options) {
    if (options === void 0) { options = {}; }
    var extraHeaders = __spreadArrays((options.extraHeaders || []), this.ua.defaultHeaders, ['Content-Type: application/json;charset=utf-8']);
    this.sendRequest(sip_js_1.C.INFO, {
        body: JSON.stringify({ response: {
                reqId: reqId,
                command: 'move',
                result: {
                    code: code,
                    description: description
                }
            }
        }),
        extraHeaders: extraHeaders
    });
}
function receiveRequest(request) {
    var _a, _b, _c;
    switch (request.method) {
        case sip_js_1.C.INFO:
            // For the Move2RCV request from server
            var content = this.getIncomingInfoContent(request);
            if (((_a = content === null || content === void 0 ? void 0 : content.request) === null || _a === void 0 ? void 0 : _a.reqId) && ((_b = content === null || content === void 0 ? void 0 : content.request) === null || _b === void 0 ? void 0 : _b.command) === 'move'
                && ((_c = content === null || content === void 0 ? void 0 : content.request) === null || _c === void 0 ? void 0 : _c.target) === 'rcv') {
                request.reply(200);
                this.emit('moveToRcv', content.request);
                return this;
            }
            // For other SIP INFO from server
            this.emit('RC_SIP_INFO', request);
            // SIP.js does not support application/json content type, so we monkey override its behaviour in this case
            if (this.status === sip_js_1.Session.C.STATUS_CONFIRMED || this.status === sip_js_1.Session.C.STATUS_WAITING_FOR_ACK) {
                var contentType = request.getHeader('content-type');
                if (contentType.match(/^application\/json/i)) {
                    request.reply(200);
                    return this;
                }
            }
            break;
    }
    return this.__receiveRequest.apply(this, arguments);
}
/*--------------------------------------------------------------------------------------------------------------------*/
function accept(options) {
    var _this = this;
    if (options === void 0) { options = {}; }
    options = options || {};
    options.extraHeaders = (options.extraHeaders || []).concat(this.ua.defaultHeaders);
    options.RTCConstraints = options.RTCConstraints || {
        optional: [{ DtlsSrtpKeyAgreement: 'true' }]
    };
    return new Promise(function (resolve, reject) {
        var onAnswered = function () {
            resolve(_this);
            _this.removeListener('failed', onFail);
        };
        var onFail = function (e) {
            reject(e);
            _this.removeListener('accepted', onAnswered);
        };
        //TODO More events?
        _this.once('accepted', onAnswered);
        _this.once('failed', onFail);
        _this.__accept(options);
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function dtmf(dtmf, duration, interToneGap) {
    if (duration === void 0) { duration = 100; }
    if (interToneGap === void 0) { interToneGap = 50; }
    duration = parseInt(duration.toString());
    interToneGap = parseInt(interToneGap.toString());
    var pc = this.sessionDescriptionHandler.peerConnection;
    var senders = pc.getSenders();
    var audioSender = senders.find(function (sender) {
        return sender.track && sender.track.kind === 'audio';
    });
    var dtmfSender = audioSender.dtmf;
    if (dtmfSender !== undefined && dtmfSender) {
        this.logger.log("Send DTMF: " + dtmf + " Duration: " + duration + " InterToneGap: " + interToneGap);
        return dtmfSender.insertDTMF(dtmf, duration, interToneGap);
    }
    var sender = dtmfSender && !dtmfSender.canInsertDTMF ? "can't insert DTMF" : 'Unknown';
    throw new Error('Send DTMF failed: ' + (!dtmfSender ? 'no sender' : sender));
}
/*--------------------------------------------------------------------------------------------------------------------*/
function sendReinvite(options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var description_1, result, e_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (this.pendingReinvite) {
                        throw new Error('Reinvite in progress. Please wait until complete, then try again.');
                    }
                    if (!this.sessionDescriptionHandler) {
                        throw new Error("No SessionDescriptionHandler, can't send reinvite..");
                    }
                    this.pendingReinvite = true;
                    options.modifiers = options.modifiers || [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, this.sessionDescriptionHandler.getDescription(options.sessionDescriptionHandlerOptions, options.modifiers)];
                case 2:
                    description_1 = _a.sent();
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            _this.sendRequest(sip_js_1.C.INVITE, {
                                body: description_1,
                                receiveResponse: function (response) {
                                    if (response.statusCode === 200)
                                        resolve(response);
                                }
                            });
                        })];
                case 3:
                    result = _a.sent();
                    return [4 /*yield*/, this.receiveReinviteResponse(result)];
                case 4:
                    _a.sent();
                    return [2 /*return*/, result];
                case 5:
                    e_1 = _a.sent();
                    this.pendingReinvite = false;
                    throw new Error('Reinvite Failed with the reason ' + e_1.message);
                case 6: return [2 /*return*/];
            }
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function hold() {
    return __awaiter(this, void 0, void 0, function () {
        var options, response, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (this.status !== sip_js_1.Session.C.STATUS_WAITING_FOR_ACK && this.status !== sip_js_1.Session.C.STATUS_CONFIRMED) {
                        throw new sip_js_1.Exceptions.InvalidStateError(this.status);
                    }
                    if (this.localHold) {
                        throw new Error('Session already on hold');
                    }
                    this.stopMediaStats();
                    options = {
                        modifiers: []
                    };
                    options.modifiers.push(this.sessionDescriptionHandler.holdModifier);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    this.logger.log('Hold Initiated');
                    return [4 /*yield*/, this._sendReinvite(options)];
                case 2:
                    response = _a.sent();
                    this.localHold = (response.statusCode === 200 && (this.sessionDescriptionHandler.getDirection() === 'sendonly'));
                    this.logger.log('Hold completed, localhold is set to ' + this.localHold);
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    throw new Error('Hold could not be completed');
                case 4: return [2 /*return*/];
            }
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function unhold() {
    return __awaiter(this, void 0, void 0, function () {
        var response, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (this.status !== sip_js_1.Session.C.STATUS_WAITING_FOR_ACK && this.status !== sip_js_1.Session.C.STATUS_CONFIRMED) {
                        throw new sip_js_1.Exceptions.InvalidStateError(this.status);
                    }
                    if (!this.localHold) {
                        throw new Error('Session not on hold, cannot unhold');
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    this.logger.log('Unhold Initiated');
                    return [4 /*yield*/, this._sendReinvite()];
                case 2:
                    response = _a.sent();
                    this.localHold = response.statusCode === 200 && this.sessionDescriptionHandler.getDirection() === 'sendonly';
                    this.logger.log('Unhold completed, localhold is set to ' + this.localHold);
                    return [3 /*break*/, 4];
                case 3:
                    e_3 = _a.sent();
                    throw new Error('Unhold could not be completed');
                case 4: return [2 /*return*/];
            }
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function blindTransfer(target, options) {
    if (options === void 0) { options = {}; }
    this.logger.log('Call transfer initiated');
    return Promise.resolve(this.refer(target, options));
}
/*--------------------------------------------------------------------------------------------------------------------*/
function warmTransfer(target, transferOptions) {
    if (transferOptions === void 0) { transferOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (this.localHold ? Promise.resolve(null) : this.hold())];
                case 1:
                    _a.sent();
                    transferOptions.extraHeaders = (transferOptions.extraHeaders || []).concat(this.ua.defaultHeaders);
                    this.logger.log('Completing warm transfer');
                    return [2 /*return*/, Promise.resolve(this.refer(target, transferOptions))];
            }
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function transfer(target, options) {
    if (options === void 0) { options = {}; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            options.extraHeaders = (options.extraHeaders || []).concat(this.ua.defaultHeaders);
            return [2 /*return*/, this.blindTransfer(target, options)];
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function forward(target, acceptOptions, transferOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var interval;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    interval = null;
                    return [4 /*yield*/, this.accept(acceptOptions)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, new Promise(function (resolve) {
                            interval = setInterval(function () {
                                if (_this.status === sip_js_1.Session.C.STATUS_CONFIRMED) {
                                    clearInterval(interval);
                                    _this.mute();
                                    setTimeout(function () {
                                        resolve(_this.transfer(target, transferOptions));
                                    }, 700);
                                }
                            }, 50);
                        })];
            }
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function startRecord() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, setRecord(this, true)];
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function stopRecord() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, setRecord(this, false)];
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function flip(target) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, sendReceive(this, constants_1.messages.flip, { target: target })];
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function park() {
    return sendReceive(this, constants_1.messages.park);
}
/*--------------------------------------------------------------------------------------------------------------------*/
function reinvite(options, modifier) {
    if (options === void 0) { options = {}; }
    if (modifier === void 0) { modifier = null; }
    options.sessionDescriptionHandlerOptions = options.sessionDescriptionHandlerOptions || {};
    return this.__reinvite(options, modifier);
}
/*--------------------------------------------------------------------------------------------------------------------*/
function toggleMute(session, mute) {
    var pc = session.sessionDescriptionHandler.peerConnection;
    if (pc.getSenders) {
        pc.getSenders().forEach(function (sender) {
            if (sender.track) {
                sender.track.enabled = !mute;
            }
        });
    }
}
/*--------------------------------------------------------------------------------------------------------------------*/
function mute(silent) {
    if (this.status !== sip_js_1.Session.C.STATUS_CONFIRMED) {
        this.logger.warn('An active call is required to mute audio');
        return;
    }
    this.logger.log('Muting Audio');
    if (!silent) {
        this.emit('muted', this);
    }
    return toggleMute(this, true);
}
/*--------------------------------------------------------------------------------------------------------------------*/
function unmute(silent) {
    if (this.status !== sip_js_1.Session.C.STATUS_CONFIRMED) {
        this.logger.warn('An active call is required to unmute audio');
        return;
    }
    this.logger.log('Unmuting Audio');
    if (!silent) {
        this.emit('unmuted', this);
    }
    return toggleMute(this, false);
}
/*--------------------------------------------------------------------------------------------------------------------*/
function onLocalHold() {
    return this.localHold;
}
/*--------------------------------------------------------------------------------------------------------------------*/
function addTrack(remoteAudioEle, localAudioEle) {
    var _this = this;
    var pc = this.sessionDescriptionHandler.peerConnection;
    var remoteAudio;
    var localAudio;
    if (remoteAudioEle && localAudioEle) {
        remoteAudio = remoteAudioEle;
        localAudio = localAudioEle;
    }
    else if (this.media) {
        remoteAudio = this.media.remote;
        localAudio = this.media.local;
    }
    else {
        throw new Error('HTML Media Element not Defined');
    }
    var remoteStream = new MediaStream();
    if (pc.getReceivers) {
        pc.getReceivers().forEach(function (receiver) {
            var rtrack = receiver.track;
            if (rtrack) {
                remoteStream.addTrack(rtrack);
                _this.logger.log('Remote track added');
            }
        });
    }
    else {
        remoteStream = pc.getRemoteStreams()[0];
        this.logger.log('Remote track added');
    }
    remoteAudio.srcObject = remoteStream;
    remoteAudio.play().catch(function () {
        _this.logger.log('Remote play was rejected');
    });
    var localStream = new MediaStream();
    if (pc.getSenders) {
        pc.getSenders().forEach(function (sender) {
            var strack = sender.track;
            if (strack && strack.kind === 'audio') {
                localStream.addTrack(strack);
                _this.logger.log('Local track added');
            }
        });
    }
    else {
        localStream = pc.getLocalStreams()[0];
        this.logger.log('Local track added');
    }
    localAudio.srcObject = localStream;
    localAudio.play().catch(function () {
        _this.logger.log('Local play was rejected');
    });
    if (localStream && remoteStream && !this.mediaStatsStarted) {
        this.mediaStreams = new mediaStreams_1.MediaStreams(this);
        this.logger.log('Start gathering media report');
        this.mediaStatsStarted = true;
        this.mediaStreams.getMediaStats(function (report) {
            if (_this.ua.enableMediaReportLogging) {
                _this.logger.log("Got media report: " + JSON.stringify(report));
            }
            if (!_this.reinviteForNoAudioSent && rtpReport_1.isNoAudio(report)) {
                _this.logger.log('No audio report');
                _this.noAudioReportCount++;
                if (_this.noAudioReportCount === 3) {
                    _this.logger.log('No audio for 6 sec. Trying to recover audio by sending Re-invite');
                    _this.mediaStreams.reconnectMedia();
                    _this.reinviteForNoAudioSent = true;
                    _this.noAudioReportCount = 0;
                }
            }
            else if (!rtpReport_1.isNoAudio(report)) {
                _this.noAudioReportCount = 0;
            }
        }, mediaCheckTimer);
    }
}
function stopMediaStats() {
    this.logger.log('Stopping media stats collection');
    if (!this) {
        return;
    }
    this.mediaStreams && this.mediaStreams.stopMediaStats();
    this.mediaStatsStarted = false;
    this.noAudioReportCount = 0;
}


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startQosStatsCollection = void 0;
var getstats_1 = __importDefault(__webpack_require__(11));
var formatFloat = function (input) { return parseFloat(input.toString()).toFixed(2); };
exports.startQosStatsCollection = function (session) {
    var qosStatsObj = getQoSStatsTemplate();
    qosStatsObj.callID = session.request.callId || '';
    qosStatsObj.fromTag = session.request.fromTag || '';
    qosStatsObj.toTag = session.request.toTag || '';
    qosStatsObj.localID = session.request.headers.From[0].raw || session.request.headers.From[0];
    qosStatsObj.remoteID = session.request.headers.To[0].raw || session.request.headers.To[0];
    qosStatsObj.origID = session.request.headers.From[0].raw || session.request.headers.From[0];
    var previousGetStatsResult;
    if (!getstats_1.default)
        throw new Error('getStats module was not provided!');
    getstats_1.default(session.sessionDescriptionHandler.peerConnection, function (getStatsResult) {
        previousGetStatsResult = getStatsResult;
        qosStatsObj.status = true;
        var network = getNetworkType(previousGetStatsResult.connectionType);
        qosStatsObj.localAddr = previousGetStatsResult.connectionType.local.ipAddress[0];
        qosStatsObj.remoteAddr = previousGetStatsResult.connectionType.remote.ipAddress[0];
        previousGetStatsResult.results.forEach(function (item) {
            if (item.type === 'localcandidate') {
                qosStatsObj.localcandidate = item;
            }
            if (item.type === 'remotecandidate') {
                qosStatsObj.remotecandidate = item;
            }
            if (item.type === 'ssrc' && item.id.includes('send') && session.ua.enableMediaReportLogging) {
                if (parseInt(item.audioInputLevel, 10) === 0) {
                    session.logger.log('AudioInputLevel is 0. The local track might be muted or could have potential one-way audio issue. Check Microphone Volume settings.');
                    session.emit('no-input-volume');
                }
            }
            if (item.type === 'ssrc' && item.id.includes('recv')) {
                qosStatsObj.jitterBufferDiscardRate = item.googSecondaryDiscardedRate || 0;
                qosStatsObj.packetLost = item.packetsLost;
                qosStatsObj.packetsReceived = item.packetsReceived;
                qosStatsObj.totalSumJitter += parseFloat(item.googJitterBufferMs);
                qosStatsObj.totalIntervalCount += 1;
                qosStatsObj.JBM = Math.max(qosStatsObj.JBM, parseFloat(item.googJitterBufferMs));
                qosStatsObj.netType = addToMap(qosStatsObj.netType, network);
                if (session.ua.enableMediaReportLogging) {
                    if (parseInt(item.audioOutputLevel, 10) <= 1) {
                        session.logger.log('Remote audioOutput level is 1. The remote track might be muted or could have potential one-way audio issue');
                        session.emit('no-output-volume');
                    }
                }
            }
        });
    }, session.ua.qosCollectInterval);
    session.on('terminated', function () {
        previousGetStatsResult && previousGetStatsResult.nomore();
        session.logger.log('Release media streams');
        session.mediaStreams && session.mediaStreams.release();
        publishQosStats(session, qosStatsObj);
    });
};
var publishQosStats = function (session, qosStatsObj, options) {
    if (options === void 0) { options = {}; }
    options = options || {};
    var effectiveType = navigator['connection'].effectiveType || '';
    var networkType = calculateNetworkUsage(qosStatsObj) || '';
    var targetUrl = options.targetUrl || 'rtcpxr@rtcpxr.ringcentral.com:5060';
    var event = options.event || 'vq-rtcpxr';
    options.expires = 60;
    options.contentType = 'application/vq-rtcpxr';
    options.extraHeaders = (options.extraHeaders || []).concat(session.ua.defaultHeaders);
    options.extraHeaders.push('p-rc-client-info:' + 'cpuRC=0:0;cpuOS=0:0;netType=' + networkType + ';ram=0:0;effectiveType=' + effectiveType);
    var calculatedStatsObj = calculateStats(qosStatsObj);
    var body = createPublishBody(calculatedStatsObj);
    var pub = session.ua.publish(targetUrl, event, body, options);
    session.logger.log('Local Candidate: ' + JSON.stringify(qosStatsObj.localcandidate));
    session.logger.log('Remote Candidate: ' + JSON.stringify(qosStatsObj.remotecandidate));
    qosStatsObj.status = false;
    pub.close();
    session.emit('qos-published', body);
};
var calculateNetworkUsage = function (qosStatsObj) {
    var networkType = [];
    for (var _i = 0, _a = Object.entries(qosStatsObj.netType); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        networkType.push(key + ':' + formatFloat((value * 100) / qosStatsObj.totalIntervalCount));
    }
    return networkType.join();
};
var calculateStats = function (qosStatsObj) {
    var rawNLR = (qosStatsObj.packetLost * 100) / (qosStatsObj.packetsReceived + qosStatsObj.packetLost) || 0;
    var rawJBN = qosStatsObj.totalIntervalCount > 0 ? qosStatsObj.totalSumJitter / qosStatsObj.totalIntervalCount : 0;
    return __assign(__assign({}, qosStatsObj), { NLR: formatFloat(rawNLR), JBN: formatFloat(rawJBN), JDR: formatFloat(qosStatsObj.jitterBufferDiscardRate), MOSLQ: 0 //MOS Score
     });
};
var createPublishBody = function (calculatedStatsObj) {
    var NLR = calculatedStatsObj.NLR || 0;
    var JBM = calculatedStatsObj.JBM || 0;
    var JBN = calculatedStatsObj.JBN || 0;
    var JDR = calculatedStatsObj.JDR || 0;
    var MOSLQ = calculatedStatsObj.MOSLQ || 0;
    var callID = calculatedStatsObj.callID || '';
    var fromTag = calculatedStatsObj.fromTag || '';
    var toTag = calculatedStatsObj.toTag || '';
    var localId = calculatedStatsObj.localID || '';
    var remoteId = calculatedStatsObj.remoteID || '';
    var localAddr = calculatedStatsObj.localAddr || '';
    var remoteAddr = calculatedStatsObj.remoteAddr || '';
    return ("VQSessionReport: CallTerm\r\n" +
        ("CallID: " + callID + "\r\n") +
        ("LocalID: " + localId + "\r\n") +
        ("RemoteID: " + remoteId + "\r\n") +
        ("OrigID: " + localId + "\r\n") +
        ("LocalAddr: IP=" + localAddr + " SSRC=0x00000000\r\n") +
        ("RemoteAddr: IP=" + remoteAddr + " SSRC=0x00000000\r\n") +
        "LocalMetrics:\r\n" +
        "Timestamps: START=0 STOP=0\r\n" +
        "SessionDesc: PT=0 PD=opus SR=0 FD=0 FPP=0 PPS=0 PLC=0 SSUP=on\r\n" +
        ("JitterBuffer: JBA=0 JBR=0 JBN=" + JBN + " JBM=" + JBM + " JBX=0\r\n") +
        ("PacketLoss: NLR=" + NLR + " JDR=" + JDR + "\r\n") +
        "BurstGapLoss: BLD=0 BD=0 GLD=0 GD=0 GMIN=0\r\n" +
        "Delay: RTD=0 ESD=0 SOWD=0 IAJ=0\r\n" +
        ("QualityEst: MOSLQ=" + MOSLQ + " MOSCQ=0.0\r\n") +
        ("DialogID: " + callID + ";to-tag=" + toTag + ";from-tag=" + fromTag));
};
var getQoSStatsTemplate = function () { return ({
    localAddr: '',
    remoteAddr: '',
    callID: '',
    localID: '',
    remoteID: '',
    origID: '',
    fromTag: '',
    toTag: '',
    timestamp: {
        start: '',
        stop: ''
    },
    netType: {},
    packetLost: 0,
    packetsReceived: 0,
    jitterBufferNominal: 0,
    jitterBufferMax: 0,
    jitterBufferDiscardRate: 0,
    totalSumJitter: 0,
    totalIntervalCount: 0,
    NLR: '',
    JBM: 0,
    JBN: '',
    JDR: '',
    MOSLQ: 0,
    status: false,
    localcandidate: {},
    remotecandidate: {}
}); };
var addToMap = function (map, key) {
    var _a;
    if (map === void 0) { map = {}; }
    return (__assign(__assign({}, map), (_a = {}, _a[key] = (key in map ? parseInt(map[key]) : 0) + 1, _a)));
};
var networkTypeMap;
(function (networkTypeMap) {
    networkTypeMap["bluetooth"] = "Bluetooth";
    networkTypeMap["cellular"] = "Cellulars";
    networkTypeMap["ethernet"] = "Ethernet";
    networkTypeMap["wifi"] = "WiFi";
    networkTypeMap["vpn"] = "VPN";
    networkTypeMap["wimax"] = "WiMax";
    networkTypeMap["2g"] = "2G";
    networkTypeMap["3g"] = "3G";
    networkTypeMap["4g"] = "4G";
})(networkTypeMap || (networkTypeMap = {}));
//TODO: find relaible way to find network type , use navigator.connection.type?
var getNetworkType = function (connectionType) {
    var sysNetwork = connectionType.systemNetworkType || 'unknown';
    var localNetwork = connectionType.local.networkType || ['unknown'];
    var networkType = !sysNetwork || sysNetwork === 'unknown' ? localNetwork[0] : sysNetwork;
    return networkType in networkTypeMap ? networkTypeMap[networkType] : networkType;
};


/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__11__;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isNoAudio = void 0;
function isNoAudio(report) {
    if (!report.inboundRtpReport) {
        return true;
    }
    if (!report.outboundRtpReport) {
        return true;
    }
    if (report.inboundRtpReport.packetsReceived === 0 || report.outboundRtpReport.packetsSent === 0) {
        return true;
    }
    return false;
}
exports.isNoAudio = isNoAudio;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

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
exports.TransportConstructorWrapper = void 0;
exports.TransportConstructorWrapper = function (SipTransportConstructor, webPhoneOptions) {
    return function (logger, options) {
        var transport = new SipTransportConstructor(logger, options);
        transport.nextReconnectInterval = 0;
        transport.sipErrorCodes = webPhoneOptions.sipErrorCodes;
        transport.switchBackInterval = webPhoneOptions.switchBackInterval;
        transport.mainProxy = transport.configuration.wsServers[0];
        transport.computeRandomTimeout = computeRandomTimeout;
        transport.reconnect = reconnect.bind(transport);
        transport.isSipErrorCode = isSipErrorCode.bind(transport);
        transport.scheduleSwitchBackMainProxy = scheduleSwitchBackMainProxy.bind(transport);
        transport.onSipErrorCode = onSipErrorCode.bind(transport);
        transport.__isCurrentMainProxy = __isCurrentMainProxy.bind(transport);
        transport.__afterWSConnected = __afterWSConnected.bind(transport);
        transport.__onConnectedToBackup = __onConnectedToBackup.bind(transport);
        transport.__onConnectedToMain = __onConnectedToMain.bind(transport);
        transport.__clearSwitchBackTimer = __clearSwitchBackTimer.bind(transport);
        transport.__connect = transport.connect;
        transport.connect = __connect.bind(transport);
        transport.on('connected', transport.__afterWSConnected);
        return transport;
    };
};
var C = {
    // Transport status codes
    STATUS_CONNECTING: 0,
    STATUS_OPEN: 1,
    STATUS_CLOSING: 2,
    STATUS_CLOSED: 3
};
var computeRandomTimeout = function (reconnectionAttempts, randomMinInterval, randomMaxInterval) {
    if (reconnectionAttempts === void 0) { reconnectionAttempts = 1; }
    if (randomMinInterval === void 0) { randomMinInterval = 0; }
    if (randomMaxInterval === void 0) { randomMaxInterval = 0; }
    if (randomMinInterval < 0 || randomMaxInterval < 0 || reconnectionAttempts < 1) {
        throw new Error('Arguments must be positive numbers');
    }
    var randomInterval = Math.floor(Math.random() * Math.abs(randomMaxInterval - randomMinInterval)) + randomMinInterval;
    var retryOffset = ((reconnectionAttempts - 1) * (randomMinInterval + randomMaxInterval)) / 2;
    return randomInterval + retryOffset;
};
function __connect(options) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, this.__connect(options).catch(function (err) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.emit('wsConnectionError', err);
                                    this.logger.warn('Connection Error occured. Trying to reconnect to websocket...');
                                    this.onError(err);
                                    this.disconnect({ force: true });
                                    this.disposeWs();
                                    return [4 /*yield*/, this.reconnect()];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function reconnect(forceReconnectToMain) {
    return __awaiter(this, void 0, void 0, function () {
        var randomMinInterval, randomMaxInterval;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (this.reconnectionAttempts > 0) {
                        this.logger.warn('Reconnection attempt ' + this.reconnectionAttempts + ' failed');
                    }
                    if (!forceReconnectToMain) return [3 /*break*/, 3];
                    this.logger.warn('forcing connect to main WS server');
                    return [4 /*yield*/, this.disconnect({ force: true })];
                case 1:
                    _a.sent();
                    this.server = this.getNextWsServer(true);
                    this.reconnectionAttempts = 0;
                    return [4 /*yield*/, this.connect()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
                case 3:
                    if (this.noAvailableServers()) {
                        this.logger.warn('no available ws servers left - going to closed state');
                        this.status = C.STATUS_CLOSED;
                        this.emit('closed');
                        this.resetServerErrorStatus();
                        this.server = this.getNextWsServer(true);
                        this.__clearSwitchBackTimer();
                        return [2 /*return*/];
                    }
                    if (!this.isConnected()) return [3 /*break*/, 6];
                    this.logger.warn('attempted to reconnect while connected - forcing disconnect');
                    return [4 /*yield*/, this.disconnect({ force: true })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, this.reconnect()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
                case 6:
                    randomMinInterval = (this.configuration.reconnectionTimeout - 2) * 1000;
                    randomMaxInterval = (this.configuration.reconnectionTimeout + 2) * 1000;
                    this.reconnectionAttempts += 1;
                    this.nextReconnectInterval = this.computeRandomTimeout(this.reconnectionAttempts, randomMinInterval, randomMaxInterval);
                    if (!(this.reconnectionAttempts > this.configuration.maxReconnectionAttempts)) return [3 /*break*/, 8];
                    this.logger.warn('maximum reconnection attempts for WebSocket ' + this.server.wsUri);
                    this.logger.warn('transport ' + this.server.wsUri + " failed | connection state set to 'error'");
                    this.server.isError = true;
                    this.emit('transportError');
                    this.server = this.getNextWsServer();
                    this.reconnectionAttempts = 0;
                    return [4 /*yield*/, this.reconnect()];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8:
                    this.logger.warn('trying to reconnect to WebSocket ' +
                        this.server.wsUri +
                        ' (reconnection attempt ' +
                        this.reconnectionAttempts +
                        ')');
                    this.reconnectTimer = setTimeout(function () {
                        _this.connect();
                        _this.reconnectTimer = undefined;
                    }, this.nextReconnectInterval);
                    this.logger.warn('next reconnection attempt in:' + Math.round(this.nextReconnectInterval / 1000) + ' seconds.');
                    _a.label = 9;
                case 9: return [2 /*return*/];
            }
        });
    });
}
function isSipErrorCode(message) {
    var statusLine = message.substring(0, message.indexOf('\r\n'));
    var statusCode = statusLine.split(' ')[1];
    return statusCode && this.sipErrorCodes && this.sipErrorCodes.length && this.sipErrorCodes.includes(statusCode);
}
function scheduleSwitchBackMainProxy() {
    var _this = this;
    var randomInterval = 15 * 60 * 1000; //15 min
    var switchBackInterval = this.switchBackInterval ? this.switchBackInterval * 1000 : null;
    // Add random time to expand clients connections in time;
    if (switchBackInterval) {
        switchBackInterval += this.computeRandomTimeout(1, 0, randomInterval);
        this.logger.warn('Try to switch back to main proxy after ' + Math.round(switchBackInterval / 1000 / 60) + ' min');
        this.mainProxy.switchBackTimer = setTimeout(function () {
            _this.mainProxy.isError = false;
            _this.mainProxy.switchBackTimer = null;
            _this.logger.warn('switchBack initiated');
            _this.emit('switchBackProxy');
        }, switchBackInterval);
    }
    else {
        this.logger.warn('switchBackInterval is not set. Will be switched with next provision update ');
    }
}
function onSipErrorCode() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    this.logger.warn('Error received from the server. Disconnecting from the proxy');
                    this.server.isError = true;
                    this.emit('transportError');
                    return [4 /*yield*/, this.disconnect({ force: true })];
                case 1:
                    _a.sent();
                    this.server = this.getNextWsServer();
                    this.reconnectionAttempts = 0;
                    return [2 /*return*/, this.reconnect()];
            }
        });
    });
}
function __isCurrentMainProxy() {
    return this.server === this.configuration.wsServers[0];
}
function __clearSwitchBackTimer() {
    if (this.mainProxy.switchBackTimer) {
        clearTimeout(this.mainProxy.switchBackTimer);
        this.mainProxy.switchBackTimer = null;
    }
}
function __onConnectedToMain() {
    this.__clearSwitchBackTimer();
}
function __onConnectedToBackup() {
    if (!this.mainProxy.switchBackTimer) {
        this.scheduleSwitchBackMainProxy();
    }
}
function __afterWSConnected() {
    this.__isCurrentMainProxy() ? this.__onConnectedToMain() : this.__onConnectedToBackup();
}


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSessionDescriptionHandler = void 0;
var events_1 = __webpack_require__(16);
var Enums_1 = __webpack_require__(4);
var sip_js_1 = __webpack_require__(0);
var SessionDescriptionHandlerObserver_1 = __webpack_require__(5);
var Modifiers = __importStar(__webpack_require__(17));
//TODO vyshakhbabji Check this
// import {Utils} from 'sip.js/types/utils';
var DefaultSessionDescriptionHandler = /** @class */ (function (_super) {
    __extends(DefaultSessionDescriptionHandler, _super);
    function DefaultSessionDescriptionHandler(logger, observer, options) {
        var _this = _super.call(this) || this;
        _this.type = Enums_1.TypeStrings.SessionDescriptionHandler;
        // TODO: Validate the options
        _this.options = options || {};
        _this.logger = logger;
        _this.observer = observer;
        _this.dtmfSender = undefined;
        _this.shouldAcquireMedia = true;
        _this.CONTENT_TYPE = 'application/sdp';
        _this.C = {
            DIRECTION: {
                NULL: null,
                SENDRECV: 'sendrecv',
                SENDONLY: 'sendonly',
                RECVONLY: 'recvonly',
                INACTIVE: 'inactive'
            }
        };
        _this.logger.log('SessionDescriptionHandlerOptions: ' + JSON.stringify(_this.options));
        _this.direction = _this.C.DIRECTION.NULL;
        _this.modifiers = _this.options.modifiers || [];
        if (!Array.isArray(_this.modifiers)) {
            _this.modifiers = [_this.modifiers];
        }
        var environment = global.window || global;
        _this.WebRTC = {
            MediaStream: environment.MediaStream,
            getUserMedia: environment.navigator.mediaDevices.getUserMedia.bind(environment.navigator.mediaDevices),
            RTCPeerConnection: environment.RTCPeerConnection
        };
        _this.iceGatheringTimeout = false;
        _this.initPeerConnection(_this.options.peerConnectionOptions);
        _this.constraints = _this.checkAndDefaultConstraints(_this.options.constraints);
        return _this;
    }
    /**
     * @param {SIP.Session} session
     * @param {Object} [options]
     */
    DefaultSessionDescriptionHandler.defaultFactory = function (session, options) {
        var logger = session.ua.getLogger('sip.invitecontext.sessionDescriptionHandler', session.id);
        var observer = new SessionDescriptionHandlerObserver_1.SessionDescriptionHandlerObserver(session, options);
        return new DefaultSessionDescriptionHandler(logger, observer, options);
    };
    // Functions the sesssion can use
    /**
     * Destructor
     */
    DefaultSessionDescriptionHandler.prototype.close = function () {
        this.logger.log('closing PeerConnection');
        // have to check signalingState since this.close() gets called multiple times
        if (this.peerConnection && this.peerConnection.signalingState !== 'closed') {
            if (this.peerConnection.getSenders) {
                this.peerConnection.getSenders().forEach(function (sender) {
                    if (sender.track) {
                        sender.track.stop();
                    }
                });
            }
            else {
                this.logger.warn('Using getLocalStreams which is deprecated');
                this.peerConnection.getLocalStreams().forEach(function (stream) {
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                });
            }
            if (this.peerConnection.getReceivers) {
                this.peerConnection.getReceivers().forEach(function (receiver) {
                    if (receiver.track) {
                        receiver.track.stop();
                    }
                });
            }
            else {
                this.logger.warn('Using getRemoteStreams which is deprecated');
                this.peerConnection.getRemoteStreams().forEach(function (stream) {
                    stream.getTracks().forEach(function (track) {
                        track.stop();
                    });
                });
            }
            this.resetIceGatheringComplete();
            this.peerConnection.close();
        }
    };
    /**
     * Gets the local description from the underlying media implementation
     * @param {Object} [options] Options object to be used by getDescription
     * @param {MediaStreamConstraints} [options.constraints] MediaStreamConstraints
     *   https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
     * @param {Object} [options.peerConnectionOptions] If this is set it will recreate the peer
     *   connection with the new options
     * @param {Array} [modifiers] Array with one time use description modifiers
     * @returns {Promise} Promise that resolves with the local description to be used for the session
     */
    DefaultSessionDescriptionHandler.prototype.getDescription = function (options, modifiers) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (modifiers === void 0) { modifiers = []; }
        if (options.peerConnectionOptions) {
            this.initPeerConnection(options.peerConnectionOptions);
        }
        // Merge passed constraints with saved constraints and save
        var newConstraints = Object.assign({}, this.constraints, options.constraints);
        newConstraints = this.checkAndDefaultConstraints(newConstraints);
        if (JSON.stringify(newConstraints) !== JSON.stringify(this.constraints)) {
            this.constraints = newConstraints;
            this.shouldAcquireMedia = true;
        }
        if (!Array.isArray(modifiers)) {
            modifiers = [modifiers];
        }
        modifiers = modifiers.concat(this.modifiers);
        return Promise.resolve()
            .then(function () {
            if (_this.shouldAcquireMedia) {
                return _this.acquire(_this.constraints).then(function () {
                    _this.shouldAcquireMedia = false;
                });
            }
        })
            .then(function () { return _this.createOfferOrAnswer(options.RTCOfferOptions, modifiers); })
            .then(function (description) {
            _this.emit('getDescription', description);
            return {
                body: description.sdp,
                contentType: _this.CONTENT_TYPE
            };
        });
    };
    /**
     * Check if the Session Description Handler can handle the Content-Type described by a SIP Message
     * @param {String} contentType The content type that is in the SIP Message
     * @returns {boolean}
     */
    DefaultSessionDescriptionHandler.prototype.hasDescription = function (contentType) {
        return contentType === this.CONTENT_TYPE;
    };
    /**
     * The modifier that should be used when the session would like to place the call on hold
     * @param {String} [sdp] The description that will be modified
     * @returns {Promise} Promise that resolves with modified SDP
     */
    DefaultSessionDescriptionHandler.prototype.holdModifier = function (description) {
        if (!description.sdp) {
            return Promise.resolve(description);
        }
        if (!/a=(sendrecv|sendonly|recvonly|inactive)/.test(description.sdp)) {
            description.sdp = description.sdp.replace(/(m=[^\r]*\r\n)/g, '$1a=sendonly\r\n');
        }
        else {
            description.sdp = description.sdp.replace(/a=sendrecv\r\n/g, 'a=sendonly\r\n');
            description.sdp = description.sdp.replace(/a=recvonly\r\n/g, 'a=inactive\r\n');
        }
        return Promise.resolve(description);
    };
    /**
     * Set the remote description to the underlying media implementation
     * @param {String} sessionDescription The description provided by a SIP message to be set on the media implementation
     * @param {Object} [options] Options object to be used by getDescription
     * @param {MediaStreamConstraints} [options.constraints] MediaStreamConstraints
     *   https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
     * @param {Object} [options.peerConnectionOptions] If this is set it will recreate the peer
     *   connection with the new options
     * @param {Array} [modifiers] Array with one time use description modifiers
     * @returns {Promise} Promise that resolves once the description is set
     */
    DefaultSessionDescriptionHandler.prototype.setDescription = function (sessionDescription, options, modifiers) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (modifiers === void 0) { modifiers = []; }
        if (options.peerConnectionOptions) {
            this.initPeerConnection(options.peerConnectionOptions);
        }
        if (!Array.isArray(modifiers)) {
            modifiers = [modifiers];
        }
        modifiers = modifiers.concat(this.modifiers);
        var description = {
            type: this.hasOffer('local') ? 'answer' : 'offer',
            sdp: sessionDescription
        };
        return Promise.resolve()
            .then(function () {
            // Media should be acquired in getDescription unless we need to do it sooner for some reason (FF61+)
            if (_this.shouldAcquireMedia && _this.options.alwaysAcquireMediaFirst) {
                return _this.acquire(_this.constraints).then(function () {
                    _this.shouldAcquireMedia = false;
                });
            }
        })
            .then(function () { return sip_js_1.Utils.reducePromises(modifiers, description); })
            .catch(function (e) {
            if (e.type === Enums_1.TypeStrings.SessionDescriptionHandlerError) {
                throw e;
            }
            var error = new sip_js_1.Exceptions.SessionDescriptionHandlerError('setDescription', e, 'The modifiers did not resolve successfully');
            _this.logger.error(error.message);
            _this.emit('peerConnection-setRemoteDescriptionFailed', error);
            throw error;
        })
            .then(function (modifiedDescription) {
            _this.emit('setDescription', modifiedDescription);
            return _this.peerConnection.setRemoteDescription(modifiedDescription);
        })
            .catch(function (e) {
            if (e.type === Enums_1.TypeStrings.SessionDescriptionHandlerError) {
                throw e;
            }
            // Check the original SDP for video, and ensure that we have want to do audio fallback
            if (/^m=video.+$/gm.test(sessionDescription) && !options.disableAudioFallback) {
                // Do not try to audio fallback again
                options.disableAudioFallback = true;
                // Remove video first, then do the other modifiers
                return _this.setDescription(sessionDescription, options, [Modifiers.stripVideo].concat(modifiers));
            }
            var error = new sip_js_1.Exceptions.SessionDescriptionHandlerError('setDescription', e);
            if (error.error) {
                _this.logger.error(error.error);
            }
            _this.emit('peerConnection-setRemoteDescriptionFailed', error);
            throw error;
        })
            .then(function () {
            if (_this.peerConnection.getReceivers) {
                _this.emit('setRemoteDescription', _this.peerConnection.getReceivers());
            }
            else {
                _this.emit('setRemoteDescription', _this.peerConnection.getRemoteStreams());
            }
            _this.emit('confirmed', _this);
        });
    };
    /**
     * Send DTMF via RTP (RFC 4733)
     * @param {String} tones A string containing DTMF digits
     * @param {Object} [options] Options object to be used by sendDtmf
     * @returns {boolean} true if DTMF send is successful, false otherwise
     */
    DefaultSessionDescriptionHandler.prototype.sendDtmf = function (tones, options) {
        if (options === void 0) { options = {}; }
        if (!this.dtmfSender && this.hasBrowserGetSenderSupport()) {
            var senders = this.peerConnection.getSenders();
            if (senders.length > 0) {
                this.dtmfSender = senders[0].dtmf;
            }
        }
        if (!this.dtmfSender && this.hasBrowserTrackSupport()) {
            var streams = this.peerConnection.getLocalStreams();
            if (streams.length > 0) {
                var audioTracks = streams[0].getAudioTracks();
                if (audioTracks.length > 0) {
                    this.dtmfSender = this.peerConnection.createDTMFSender(audioTracks[0]);
                }
            }
        }
        if (!this.dtmfSender) {
            return false;
        }
        try {
            this.dtmfSender.insertDTMF(tones, options.duration, options.interToneGap);
        }
        catch (e) {
            if (e.type === 'InvalidStateError' || e.type === 'InvalidCharacterError') {
                this.logger.error(e);
                return false;
            }
            throw e;
        }
        this.logger.log('DTMF sent via RTP: ' + tones.toString());
        return true;
    };
    /**
     * Get the direction of the session description
     * @returns {String} direction of the description
     */
    DefaultSessionDescriptionHandler.prototype.getDirection = function () {
        return this.direction;
    };
    // Internal functions
    DefaultSessionDescriptionHandler.prototype.createOfferOrAnswer = function (RTCOfferOptions, modifiers) {
        var _this = this;
        if (RTCOfferOptions === void 0) { RTCOfferOptions = {}; }
        if (modifiers === void 0) { modifiers = []; }
        var methodName = this.hasOffer('remote') ? 'createAnswer' : 'createOffer';
        var pc = this.peerConnection;
        this.logger.log(methodName);
        return pc[methodName](RTCOfferOptions)
            .catch(function (e) {
            if (e.type === Enums_1.TypeStrings.SessionDescriptionHandlerError) {
                throw e;
            }
            var error = new sip_js_1.Exceptions.SessionDescriptionHandlerError('createOfferOrAnswer', e, 'peerConnection-' + methodName + 'Failed');
            _this.emit('peerConnection-' + methodName + 'Failed', error);
            throw error;
        })
            .then(function (sdp) {
            return sip_js_1.Utils.reducePromises(modifiers, _this.createRTCSessionDescriptionInit(sdp));
        })
            .then(function (sdp) {
            _this.resetIceGatheringComplete();
            _this.logger.log('Setting local sdp.');
            _this.logger.log('sdp is ' + sdp.sdp || false);
            return pc.setLocalDescription(sdp);
        })
            .catch(function (e) {
            if (e.type === Enums_1.TypeStrings.SessionDescriptionHandlerError) {
                throw e;
            }
            var error = new sip_js_1.Exceptions.SessionDescriptionHandlerError('createOfferOrAnswer', e, 'peerConnection-SetLocalDescriptionFailed');
            _this.emit('peerConnection-SetLocalDescriptionFailed', error);
            throw error;
        })
            .then(function () { return _this.waitForIceGatheringComplete(); })
            .then(function () {
            var localDescription = _this.createRTCSessionDescriptionInit(_this.peerConnection.localDescription);
            return sip_js_1.Utils.reducePromises(modifiers, localDescription);
        })
            .then(function (localDescription) {
            _this.setDirection(localDescription.sdp || '');
            return localDescription;
        })
            .catch(function (e) {
            if (e.type === Enums_1.TypeStrings.SessionDescriptionHandlerError) {
                throw e;
            }
            var error = new sip_js_1.Exceptions.SessionDescriptionHandlerError('createOfferOrAnswer', e);
            _this.logger.error(error.toString());
            throw error;
        });
    };
    // Creates an RTCSessionDescriptionInit from an RTCSessionDescription
    DefaultSessionDescriptionHandler.prototype.createRTCSessionDescriptionInit = function (RTCSessionDescription) {
        return {
            type: RTCSessionDescription.type,
            sdp: RTCSessionDescription.sdp
        };
    };
    DefaultSessionDescriptionHandler.prototype.addDefaultIceCheckingTimeout = function (peerConnectionOptions) {
        if (peerConnectionOptions.iceCheckingTimeout === undefined) {
            peerConnectionOptions.iceCheckingTimeout = 5000;
        }
        return peerConnectionOptions;
    };
    DefaultSessionDescriptionHandler.prototype.addDefaultIceServers = function (rtcConfiguration) {
        if (!rtcConfiguration.iceServers) {
            rtcConfiguration.iceServers = [{ urls: 'stun:stun.l.google.com:19302' }];
        }
        return rtcConfiguration;
    };
    DefaultSessionDescriptionHandler.prototype.checkAndDefaultConstraints = function (constraints) {
        var defaultConstraints = { audio: true, video: !this.options.alwaysAcquireMediaFirst };
        constraints = constraints || defaultConstraints;
        // Empty object check
        if (Object.keys(constraints).length === 0 && constraints.constructor === Object) {
            return defaultConstraints;
        }
        return constraints;
    };
    DefaultSessionDescriptionHandler.prototype.hasBrowserTrackSupport = function () {
        return Boolean(this.peerConnection.addTrack);
    };
    DefaultSessionDescriptionHandler.prototype.hasBrowserGetSenderSupport = function () {
        return Boolean(this.peerConnection.getSenders);
    };
    DefaultSessionDescriptionHandler.prototype.initPeerConnection = function (options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        options = this.addDefaultIceCheckingTimeout(options);
        options.rtcConfiguration = options.rtcConfiguration || {};
        options.rtcConfiguration = this.addDefaultIceServers(options.rtcConfiguration);
        this.logger.log('initPeerConnection');
        if (this.peerConnection) {
            this.logger.log('Already have a peer connection for this session. Tearing down.');
            this.resetIceGatheringComplete();
            this.peerConnection.close();
        }
        console.error('RTCConfiguration: ', options.rtcConfiguration);
        this.peerConnection = new this.WebRTC.RTCPeerConnection(options.rtcConfiguration, {
            optional: [{ googDscp: true }]
        });
        this.logger.log('New peer connection created');
        console.error('newPeerconnection', this.peerConnection);
        if ('ontrack' in this.peerConnection) {
            this.peerConnection.addEventListener('track', function (e) {
                _this.logger.log('track added');
                _this.observer.trackAdded();
                _this.emit('addTrack', e);
            });
        }
        else {
            this.logger.warn('Using onaddstream which is deprecated');
            this.peerConnection.onaddstream = function (e) {
                _this.logger.log('stream added');
                _this.emit('addStream', e);
            };
        }
        this.peerConnection.onicecandidate = function (e) {
            _this.emit('iceCandidate', e);
            if (e.candidate) {
                _this.logger.log('ICE candidate received: ' + (e.candidate.candidate === null ? null : e.candidate.candidate.trim()));
            }
            else if (e.candidate === null) {
                // indicates the end of candidate gathering
                _this.logger.log('ICE candidate gathering complete');
                _this.triggerIceGatheringComplete();
            }
        };
        this.peerConnection.onicegatheringstatechange = function () {
            _this.logger.log('RTCIceGatheringState changed: ' + _this.peerConnection.iceGatheringState);
            switch (_this.peerConnection.iceGatheringState) {
                case 'gathering':
                    _this.emit('iceGathering', _this);
                    if (!_this.iceGatheringTimer && options.iceCheckingTimeout) {
                        _this.iceGatheringTimeout = false;
                        _this.iceGatheringTimer = setTimeout(function () {
                            _this.logger.log('RTCIceChecking Timeout Triggered after ' + options.iceCheckingTimeout + ' milliseconds');
                            _this.iceGatheringTimeout = true;
                            _this.triggerIceGatheringComplete();
                        }, options.iceCheckingTimeout);
                    }
                    break;
                case 'complete':
                    _this.triggerIceGatheringComplete();
                    break;
            }
        };
        this.peerConnection.oniceconnectionstatechange = function () {
            var stateEvent;
            switch (_this.peerConnection.iceConnectionState) {
                case 'new':
                    stateEvent = 'iceConnection';
                    break;
                case 'checking':
                    stateEvent = 'iceConnectionChecking';
                    break;
                case 'connected':
                    stateEvent = 'iceConnectionConnected';
                    break;
                case 'completed':
                    stateEvent = 'iceConnectionCompleted';
                    break;
                case 'failed':
                    stateEvent = 'iceConnectionFailed';
                    break;
                case 'disconnected':
                    stateEvent = 'iceConnectionDisconnected';
                    break;
                case 'closed':
                    stateEvent = 'iceConnectionClosed';
                    break;
                default:
                    _this.logger.warn('Unknown iceConnection state: ' + _this.peerConnection.iceConnectionState);
                    return;
            }
            _this.logger.log('ICE Connection State changed to ' + stateEvent);
            _this.emit(stateEvent, _this);
        };
    };
    DefaultSessionDescriptionHandler.prototype.acquire = function (constraints) {
        var _this = this;
        // Default audio & video to true
        constraints = this.checkAndDefaultConstraints(constraints);
        return new Promise(function (resolve, reject) {
            /*
             * Make the call asynchronous, so that ICCs have a chance
             * to define callbacks to `userMediaRequest`
             */
            _this.logger.log('acquiring local media');
            _this.emit('userMediaRequest', constraints);
            if (constraints.audio || constraints.video) {
                _this.WebRTC.getUserMedia(constraints)
                    .then(function (streams) {
                    _this.observer.trackAdded();
                    _this.emit('userMedia', streams);
                    resolve(streams);
                })
                    .catch(function (e) {
                    _this.emit('userMediaFailed', e);
                    reject(e);
                });
            }
            else {
                // Local streams were explicitly excluded.
                resolve([]);
            }
        })
            .catch(function (e) {
            if (e.type === Enums_1.TypeStrings.SessionDescriptionHandlerError) {
                throw e;
            }
            var error = new sip_js_1.Exceptions.SessionDescriptionHandlerError('acquire', e, 'unable to acquire streams');
            _this.logger.error(error.message);
            if (error.error) {
                _this.logger.error(error.error);
            }
            throw error;
        })
            .then(function (streams) {
            _this.logger.log('acquired local media streams');
            try {
                // Remove old tracks
                if (_this.peerConnection.removeTrack) {
                    _this.peerConnection.getSenders().forEach(function (sender) {
                        _this.peerConnection.removeTrack(sender);
                    });
                }
                return streams;
            }
            catch (e) {
                return Promise.reject(e);
            }
        })
            .catch(function (e) {
            if (e.type === Enums_1.TypeStrings.SessionDescriptionHandlerError) {
                throw e;
            }
            var error = new sip_js_1.Exceptions.SessionDescriptionHandlerError('acquire', e, 'error removing streams');
            _this.logger.error(error.message);
            if (error.error) {
                _this.logger.error(error.error);
            }
            throw error;
        })
            .then(function (streams) {
            try {
                streams = [].concat(streams);
                streams.forEach(function (stream) {
                    if (_this.peerConnection.addTrack) {
                        stream.getTracks().forEach(function (track) {
                            _this.peerConnection.addTrack(track, stream);
                        });
                    }
                    else {
                        // Chrome 59 does not support addTrack
                        _this.peerConnection.addStream(stream);
                    }
                });
            }
            catch (e) {
                return Promise.reject(e);
            }
            return Promise.resolve();
        })
            .catch(function (e) {
            if (e.type === Enums_1.TypeStrings.SessionDescriptionHandlerError) {
                throw e;
            }
            var error = new sip_js_1.Exceptions.SessionDescriptionHandlerError('acquire', e, 'error adding stream');
            _this.logger.error(error.message);
            if (error.error) {
                _this.logger.error(error.error);
            }
            throw error;
        });
    };
    DefaultSessionDescriptionHandler.prototype.hasOffer = function (where) {
        var offerState = 'have-' + where + '-offer';
        return this.peerConnection.signalingState === offerState;
    };
    // ICE gathering state handling
    DefaultSessionDescriptionHandler.prototype.isIceGatheringComplete = function () {
        return this.peerConnection.iceGatheringState === 'complete' || this.iceGatheringTimeout;
    };
    DefaultSessionDescriptionHandler.prototype.resetIceGatheringComplete = function () {
        this.iceGatheringTimeout = false;
        this.logger.log('resetIceGatheringComplete');
        if (this.iceGatheringTimer) {
            clearTimeout(this.iceGatheringTimer);
            this.iceGatheringTimer = undefined;
        }
        if (this.iceGatheringDeferred) {
            this.iceGatheringDeferred.reject();
            this.iceGatheringDeferred = undefined;
        }
    };
    DefaultSessionDescriptionHandler.prototype.setDirection = function (sdp) {
        var match = sdp.match(/a=(sendrecv|sendonly|recvonly|inactive)/);
        if (match === null) {
            this.direction = this.C.DIRECTION.NULL;
            this.observer.directionChanged();
            return;
        }
        var direction = match[1];
        switch (direction) {
            case this.C.DIRECTION.SENDRECV:
            case this.C.DIRECTION.SENDONLY:
            case this.C.DIRECTION.RECVONLY:
            case this.C.DIRECTION.INACTIVE:
                this.direction = direction;
                break;
            default:
                this.direction = this.C.DIRECTION.NULL;
                break;
        }
        this.observer.directionChanged();
    };
    DefaultSessionDescriptionHandler.prototype.triggerIceGatheringComplete = function () {
        if (this.isIceGatheringComplete()) {
            this.emit('iceGatheringComplete', this);
            if (this.iceGatheringTimer) {
                clearTimeout(this.iceGatheringTimer);
                this.iceGatheringTimer = undefined;
            }
            if (this.iceGatheringDeferred) {
                this.iceGatheringDeferred.resolve();
                this.iceGatheringDeferred = undefined;
            }
        }
    };
    DefaultSessionDescriptionHandler.prototype.waitForIceGatheringComplete = function () {
        this.logger.log('waitForIceGatheringComplete');
        if (this.isIceGatheringComplete()) {
            this.logger.log('ICE is already complete. Return resolved.');
            return Promise.resolve();
        }
        //TODO:Check this
        // else if (!this.iceGatheringDeferred) {
        //     // this.iceGatheringDeferred = Utils.defer();
        // }
        this.logger.log('ICE is not complete. Returning promise');
        return this.iceGatheringDeferred ? this.iceGatheringDeferred.promise : Promise.resolve();
    };
    return DefaultSessionDescriptionHandler;
}(events_1.EventEmitter));
exports.DefaultSessionDescriptionHandler = DefaultSessionDescriptionHandler;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(15)))

/***/ }),
/* 15 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = $getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var stripPayload = function (sdp, payload) {
    var mediaDescs = [];
    var lines = sdp.split(/\r\n/);
    var currentMediaDesc;
    for (var i = 0; i < lines.length;) {
        var line = lines[i];
        if (/^m=(?:audio|video)/.test(line)) {
            currentMediaDesc = {
                index: i,
                stripped: []
            };
            mediaDescs.push(currentMediaDesc);
        }
        else if (currentMediaDesc) {
            var rtpmap = /^a=rtpmap:(\d+) ([^/]+)\//.exec(line);
            if (rtpmap && payload === rtpmap[2]) {
                lines.splice(i, 1);
                currentMediaDesc.stripped.push(rtpmap[1]);
                continue; // Don't increment 'i'
            }
        }
        i++;
    }
    for (var _i = 0, mediaDescs_1 = mediaDescs; _i < mediaDescs_1.length; _i++) {
        var mediaDesc = mediaDescs_1[_i];
        var mline = lines[mediaDesc.index].split(" ");
        // Ignore the first 3 parameters of the mline. The codec information is after that
        for (var j = 3; j < mline.length;) {
            if (mediaDesc.stripped.indexOf(mline[j]) !== -1) {
                mline.splice(j, 1);
                continue;
            }
            j++;
        }
        lines[mediaDesc.index] = mline.join(" ");
    }
    return lines.join("\r\n");
};
var stripMediaDescription = function (sdp, description) {
    var descriptionRegExp = new RegExp("m=" + description + ".*$", "gm");
    var groupRegExp = new RegExp("^a=group:.*$", "gm");
    if (descriptionRegExp.test(sdp)) {
        var midLineToRemove_1;
        sdp = sdp.split(/^m=/gm).filter(function (section) {
            if (section.substr(0, description.length) === description) {
                midLineToRemove_1 = section.match(/^a=mid:.*$/gm);
                if (midLineToRemove_1) {
                    var step = midLineToRemove_1[0].match(/:.+$/g);
                    if (step) {
                        midLineToRemove_1 = step[0].substr(1);
                    }
                }
                return false;
            }
            return true;
        }).join("m=");
        var groupLine = sdp.match(groupRegExp);
        if (groupLine && groupLine.length === 1) {
            var groupLinePortion = groupLine[0];
            var groupRegExpReplace = new RegExp("\ *" + midLineToRemove_1 + "[^\ ]*", "g");
            groupLinePortion = groupLinePortion.replace(groupRegExpReplace, "");
            sdp = sdp.split(groupRegExp).join(groupLinePortion);
        }
    }
    return sdp;
};
function stripTcpCandidates(description) {
    description.sdp = (description.sdp || "").replace(/^a=candidate:\d+ \d+ tcp .*?\r\n/img, "");
    return Promise.resolve(description);
}
exports.stripTcpCandidates = stripTcpCandidates;
function stripTelephoneEvent(description) {
    description.sdp = stripPayload(description.sdp || "", "telephone-event");
    return Promise.resolve(description);
}
exports.stripTelephoneEvent = stripTelephoneEvent;
function cleanJitsiSdpImageattr(description) {
    description.sdp = (description.sdp || "").replace(/^(a=imageattr:.*?)(x|y)=\[0-/gm, "$1$2=[1:");
    return Promise.resolve(description);
}
exports.cleanJitsiSdpImageattr = cleanJitsiSdpImageattr;
function stripG722(description) {
    description.sdp = stripPayload(description.sdp || "", "G722");
    return Promise.resolve(description);
}
exports.stripG722 = stripG722;
function stripRtpPayload(payload) {
    return function (description) {
        description.sdp = stripPayload(description.sdp || "", payload);
        return Promise.resolve(description);
    };
}
exports.stripRtpPayload = stripRtpPayload;
function stripVideo(description) {
    description.sdp = stripMediaDescription(description.sdp || "", "video");
    return Promise.resolve(description);
}
exports.stripVideo = stripVideo;
function addMidLines(description) {
    var sdp = description.sdp || "";
    if (sdp.search(/^a=mid.*$/gm) === -1) {
        var mlines_1 = sdp.match(/^m=.*$/gm);
        var sdpArray_1 = sdp.split(/^m=.*$/gm);
        if (mlines_1) {
            mlines_1.forEach(function (elem, idx) {
                mlines_1[idx] = elem + "\na=mid:" + idx;
            });
        }
        sdpArray_1.forEach(function (elem, idx) {
            if (mlines_1 && mlines_1[idx]) {
                sdpArray_1[idx] = elem + mlines_1[idx];
            }
        });
        sdp = sdpArray_1.join("");
        description.sdp = sdp;
    }
    return Promise.resolve(description);
}
exports.addMidLines = addMidLines;


/***/ }),
/* 18 */
/***/ (function(module) {

module.exports = {"name":"ringcentral-web-phone","version":"0.8.1","scripts":{"test":"npm run test:ut && npm run test:e2e","test:coverage":"cat .coverage/lcov.info | coveralls -v","test:e2e":"jest --config jest.config.e2e.js --runInBand","test:ut":"jest --config jest.config.ut.js","build":"npm run build:tsc && npm run build:webpack","build:tsc":"tsc","build:webpack":"cross-env NODE_ENV=production webpack --config webpack.config.js --progress --color","start":"webpack-dev-server --config webpack.config.js --progress --color","server":"http-server --port ${PORT:-8080}","watch":"npm-run-all --print-label --parallel \"build:** -- --watch\"","lint":"eslint --cache --cache-location node_modules/.cache/eslint --fix","lint:all":"npm run lint \"src/**/*.ts\" \"demo/**/*.js\"","lint:staged":"lint-staged"},"dependencies":{"getstats":"1.2.0","sip.js":"0.13.5"},"devDependencies":{"@types/expect-puppeteer":"3.3.1","@types/jest":"24.0.15","@types/jest-environment-puppeteer":"4.0.0","@types/node":"12.0.8","bootstrap":"3.4.1","cache-loader":"4.0.0","copy-webpack-plugin":"5.0.3","coveralls":"3.0.4","cross-env":"5.2.0","dotenv":"8.0.0","eslint":"6.8.0","eslint-config-ringcentral-typescript":"3.0.0","html-webpack-plugin":"3.2.0","http-server":"0.11.1","husky":"2.4.1","istanbul-instrumenter-loader":"3.0.1","jest":"24.8.0","jest-puppeteer":"4.2.0","jquery":"3.4.1","lint-staged":"8.2.1","npm-run-all":"4.1.5","puppeteer":"1.18.0","ringcentral":"3.2.2","ts-jest":"24.0.2","ts-loader":"6.0.3","typescript":"3.9.2","uglifyjs-webpack-plugin":"2.1.3","webpack":"4.35.0","webpack-cli":"3.3.4","webpack-dev-server":"3.7.2"},"preferGlobal":false,"private":false,"main":"./lib/index.js","types":"./lib/index.d.ts","author":{"name":"RingCentral, Inc.","email":"devsupport@ringcentral.com"},"contributors":[{"name":"Kirill Konshin"},{"name":"Elias Sun"}],"repository":{"type":"git","url":"git://github.com/ringcentral/ringcentral-web-phone.git"},"bugs":{"url":"https://github.com/ringcentral/ringcentral-web-phone/issues"},"homepage":"https://github.com/ringcentral/ringcentral-web-phone","engines":{"node":">=0.10.36"},"license":"MIT"};

/***/ })
/******/ ])["default"];
});
//# sourceMappingURL=ringcentral-web-phone.js.map