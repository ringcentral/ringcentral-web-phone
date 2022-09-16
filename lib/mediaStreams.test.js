"use strict";
/*
 * @Author: Elias Sun(elias.sun@ringcentral.com)
 * @Date: Dec. 15, 2018
 * Copyright © RingCentral. All rights reserved.
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mediaStreams_1 = __importStar(require("../src/mediaStreams"));
var events_1 = __importDefault(require("events"));
var globalEmitter = new events_1.default();
globalEmitter.setMaxListeners(0);
var Navigator = /** @class */ (function () {
    function Navigator() {
        this.userAgent = 'Chrome';
    }
    Object.defineProperty(Navigator.prototype, "defaultUserAgent", {
        get: function () {
            return 'Chrome';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "chrome", {
        get: function () {
            return this.defaultUserAgent;
        },
        set: function (name) {
            this.userAgent = name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "firefox", {
        get: function () {
            return 'Firefox';
        },
        set: function (name) {
            this.userAgent = name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Navigator.prototype, "opera", {
        get: function () {
            return 'Opera';
        },
        set: function (name) {
            this.userAgent = name;
        },
        enumerable: false,
        configurable: true
    });
    return Navigator;
}());
global.navigator = new Navigator();
var FadeSessionDescriptionHandler = /** @class */ (function () {
    function FadeSessionDescriptionHandler(label) {
        this.peerConnection = new FadePeerConnection();
        this.label = label;
    }
    FadeSessionDescriptionHandler.prototype.testEvent = function (event) {
        globalEmitter.emit(event, this);
    };
    FadeSessionDescriptionHandler.prototype.onPeerConnectionStateChange = function (event) {
        console.log(event);
    };
    FadeSessionDescriptionHandler.prototype.on = function (event, func) {
        globalEmitter.on(event, func);
    };
    FadeSessionDescriptionHandler.prototype.removeListener = function (event, func) {
        globalEmitter.removeListener(event, func);
    };
    FadeSessionDescriptionHandler.prototype.listeners = function (event) {
        return globalEmitter.listeners(event);
    };
    return FadeSessionDescriptionHandler;
}());
var FadeSession = /** @class */ (function () {
    function FadeSession() {
        this.sessionDescriptionHandler = new FadeSessionDescriptionHandler('sdp1');
        this.ua = {};
        this.ua.defaultHeaders = {};
        this.logger = new (/** @class */ (function () {
            function Logger() {
            }
            Logger.prototype.log = function (msg) {
                console.log(msg);
            };
            Logger.prototype.error = function (msg) {
                console.log(msg);
            };
            return Logger;
        }()))();
    }
    Object.defineProperty(FadeSession.prototype, "sessionOptions", {
        get: function () {
            return this.sessionOptions_;
        },
        set: function (options) {
            this.sessionOptions_ = options;
        },
        enumerable: false,
        configurable: true
    });
    FadeSession.prototype.emit = function (event, parameter) {
        globalEmitter.emit(event, parameter);
    };
    FadeSession.prototype.on = function (event, parameter) {
        globalEmitter.on(event, parameter);
    };
    FadeSession.prototype.reinvite = function (options) {
        this.sessionOptions = options;
    };
    FadeSession.prototype.listeners = function (event) {
        return globalEmitter.listeners(event);
    };
    return FadeSession;
}());
var FadeStream = /** @class */ (function () {
    function FadeStream(label) {
        this.label = label;
    }
    return FadeStream;
}());
var FadePeerConnection = /** @class */ (function () {
    function FadePeerConnection() {
        this.connectionState = 'new';
        this.iceConnectionStates = {
            new: 'mediaConnectionStateNew',
            checking: 'mediaConnectionStateChecking',
            connected: 'mediaConnectionStateConnected',
            completed: 'mediaConnectionStateCompleted',
            failed: 'mediaConnectionStateFailed',
            disconnected: 'mediaConnectionStateDisconnected',
            closed: 'mediaConnectionStateClosed'
        };
        this.localDescription = {
            sdp: 'c=IN IP4 50.237.72.154\r\na=rtcp:61349 IN IP4 50.237.72.154\r\n',
            type: 'offer'
        };
        this.chromeStats = [
            {
                type: 'inbound-rtp',
                bytesReceived: 100,
                packetsReceived: 200,
                jitter: 300,
                packetsLost: 400,
                fractionLost: 500,
                mediaType: 'audio'
            },
            {
                type: 'outbound-rtp',
                bytesSent: 100,
                packetsSent: 200,
                mediaType: 'audio'
            },
            {
                type: 'candidate-pair',
                currentRoundTripTime: 1.05
            }
        ];
        this.firefoxStats = [
            {
                type: 'inbound-rtp',
                bytesReceived: 100,
                packetsReceived: 200,
                jitter: 300,
                packetsLost: 400,
                roundTripTime: 1000,
                mediaType: 'audio'
            },
            {
                type: 'outbound-rtp',
                bytesSent: 100,
                packetsSent: 200,
                mediaType: 'audio'
            },
            {
                type: 'candidate-pair',
                whatever: 1.05
            }
        ];
    }
    Object.defineProperty(FadePeerConnection.prototype, "iceConnectionState", {
        get: function () {
            return this.connectionState;
        },
        set: function (state) {
            this.connectionState = state;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FadePeerConnection.prototype, "localOffer", {
        get: function () {
            return this.localOffer_;
        },
        set: function (offer) {
            this.localOffer_ = offer;
        },
        enumerable: false,
        configurable: true
    });
    FadePeerConnection.prototype.createOffer = function (options) {
        var offer = {};
        if (!options.hasOwnProperty('ok')) {
            options.ok = true;
        }
        return new Promise(function (resolve, reject) {
            if (options.ok === true) {
                resolve(options); //offer = options
            }
            else {
                reject(options); //error = options
            }
        });
    };
    FadePeerConnection.prototype.setLocalDescription = function (offer) {
        if (!offer.hasOwnProperty('offerok')) {
            offer.offerok = true;
        }
        this.localOffer = offer;
        var self = this;
        return new Promise(function (resolve, reject) {
            if (offer.offerok === true) {
                resolve('true');
            }
            else {
                self.localOffer.reject = 'yes';
                reject('false');
            }
        });
    };
    FadePeerConnection.prototype.getStats = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (global['navigator'].userAgent === 'Chrome') {
                resolve(_this.chromeStats);
            }
            else if (global['navigator'].userAgent === global.navigator.firefox) {
                resolve(_this.firefoxStats);
            }
            else {
                reject('unknown browser');
            }
        });
    };
    return FadePeerConnection;
}());
test('input wrong parameters in MediaStreamsImpl constructor', function () {
    var mediaStreams = null;
    try {
        mediaStreams = new mediaStreams_1.MediaStreamsImpl(null);
    }
    catch (e) {
        expect(e.message).toBe('Fail to create the media session. session is null or undefined!');
        expect(mediaStreams).toBe(null);
    }
});
test('test media connection - event received in session', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, f, r;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                mediaStreams.on = function (event, func) {
                    globalEmitter.on(event, func);
                };
                fadeSession.on('mediaConnectionStateNew', function (parameter) {
                    fadeSession.testState = 'new';
                });
                fadeSession.sessionDescriptionHandler.testEvent('iceConnection');
                return [4 /*yield*/, expect(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(fadeSession.testState);
                        }, 500);
                    })).resolves.toEqual('new')];
            case 1:
                _a.sent();
                f = mediaStreams.onPeerConnectionStateChange.bind(mediaStreams);
                r = f === mediaStreams.onPeerConnectionStateChange.bind(mediaStreams);
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test media connection - callback in MediaStreamsImpl class', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                mediaStreams.onMediaConnectionStateChange = function (session, eventState) {
                    fadeSession.testState = 'new';
                };
                mediaStreams.on = function (event, func) {
                    globalEmitter.on(event, func);
                };
                fadeSession.sessionDescriptionHandler.testEvent('iceConnection');
                return [4 /*yield*/, expect(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(fadeSession.testState);
                        }, 500);
                    })).resolves.toEqual('new')];
            case 1:
                _a.sent();
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test media connection - callback in session', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                fadeSession.onMediaConnectionStateChange = function (session, eventState) {
                    fadeSession.testState = 'new';
                };
                mediaStreams.on = function (event, func) {
                    globalEmitter.on(event, func);
                };
                fadeSession.sessionDescriptionHandler.testEvent('iceConnection');
                return [4 /*yield*/, expect(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(fadeSession.testState);
                        }, 500);
                    })).resolves.toEqual('new')];
            case 1:
                _a.sent();
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test media connection - event - checking ', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                mediaStreams.on = function (event, func) {
                    globalEmitter.on(event, func);
                };
                fadeSession.on('mediaConnectionStateChecking', function (parameter) {
                    fadeSession.testState = 'checking';
                });
                fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'checking';
                fadeSession.sessionDescriptionHandler.testEvent('iceConnectionChecking');
                return [4 /*yield*/, expect(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(fadeSession.testState);
                        }, 500);
                    })).resolves.toEqual('checking')];
            case 1:
                _a.sent();
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test media connection - event - connected ', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                mediaStreams.on = function (event, func) {
                    globalEmitter.on(event, func);
                };
                fadeSession.on('mediaConnectionStateConnected', function (parameter) {
                    fadeSession.testState = 'connected';
                });
                fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'connected';
                fadeSession.sessionDescriptionHandler.testEvent('iceConnectionConnected');
                return [4 /*yield*/, expect(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(fadeSession.testState);
                        }, 500);
                    })).resolves.toEqual('connected')];
            case 1:
                _a.sent();
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test media connection - event - completed ', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                mediaStreams.on = function (event, func) {
                    globalEmitter.on(event, func);
                };
                fadeSession.on('mediaConnectionStateCompleted', function (parameter) {
                    fadeSession.testState = 'completed';
                });
                fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'completed';
                fadeSession.sessionDescriptionHandler.testEvent('iceConnectionCompleted');
                return [4 /*yield*/, expect(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(fadeSession.testState);
                        }, 500);
                    })).resolves.toEqual('completed')];
            case 1:
                _a.sent();
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test media connection - event - failed ', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                mediaStreams.on = function (event, func) {
                    globalEmitter.on(event, func);
                };
                fadeSession.on('mediaConnectionStateFailed', function (parameter) {
                    fadeSession.testState = 'failed';
                });
                fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'failed';
                fadeSession.sessionDescriptionHandler.testEvent('iceConnectionFailed');
                return [4 /*yield*/, expect(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(fadeSession.testState);
                        }, 500);
                    })).resolves.toEqual('failed')];
            case 1:
                _a.sent();
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test media connection - event - disconnected ', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                mediaStreams.on = function (event, func) {
                    globalEmitter.on(event, func);
                };
                fadeSession.on('mediaConnectionStateDisconnected', function (parameter) {
                    fadeSession.testState = 'disconnected';
                });
                fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'disconnected';
                fadeSession.sessionDescriptionHandler.testEvent('iceConnectionDisconnected');
                return [4 /*yield*/, expect(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(fadeSession.testState);
                        }, 500);
                    })).resolves.toEqual('disconnected')];
            case 1:
                _a.sent();
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test media connection - event - closed ', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                mediaStreams.on = function (event, func) {
                    globalEmitter.on(event, func);
                };
                fadeSession.on('mediaConnectionStateClosed', function (parameter) {
                    fadeSession.testState = 'closed';
                });
                fadeSession.sessionDescriptionHandler.peerConnection.iceConnectionState = 'closed';
                fadeSession.sessionDescriptionHandler.testEvent('iceConnectionClosed');
                return [4 /*yield*/, expect(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(fadeSession.testState);
                        }, 500);
                    })).resolves.toEqual('closed')];
            case 1:
                _a.sent();
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test change media stream', function () {
    var fadeSession = new FadeSession();
    var mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
    mediaStreams.localStream = new FadeStream('lStream2');
    mediaStreams.remoteStream = new FadeStream('rStream2');
    expect(mediaStreams.localStream.label).toEqual('lStream2');
    expect(mediaStreams.remoteStream.label).toEqual('rStream2');
    mediaStreams.release();
});
test('test media reconnect with invalid parameters', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, pc, offer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                mediaStreams.reconnectMedia();
                pc = fadeSession.sessionDescriptionHandler.peerConnection;
                return [4 /*yield*/, expect(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(pc.localOffer);
                        }, 500);
                    })).resolves.toBeDefined()];
            case 1:
                _a.sent();
                offer = pc.localOffer;
                expect(offer.ok).toBe(true);
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test media reconnect with the correct customized settings', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, options, pc, offer;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                options = {};
                options.RTCOptions = {
                    audio: 10,
                    video: 100,
                    restart: 15,
                    ok: true
                };
                mediaStreams.reconnectMedia(options);
                pc = fadeSession.sessionDescriptionHandler.peerConnection;
                return [4 /*yield*/, expect(new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(pc.localOffer);
                        }, 500);
                    })).resolves.toBeDefined()];
            case 1:
                _a.sent();
                offer = pc.localOffer;
                expect(offer.audio).toBe(10);
                expect(offer.video).toBe(100);
                expect(offer.restart).toBe(15);
                expect(offer.ok).toBe(true);
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test media reconnect - fail to set local offer', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, options, pc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                options = {};
                options.RTCOptions = {
                    audio: 100,
                    video: 1001,
                    restart: 151,
                    ok: true,
                    offerok: true
                };
                return [4 /*yield*/, mediaStreams.reconnectMedia(options)];
            case 1:
                _a.sent();
                pc = fadeSession.sessionDescriptionHandler.peerConnection;
                expect(pc.localOffer).toBeDefined();
                options.RTCOptions = {
                    audio: 200,
                    video: 2001,
                    restart: 251,
                    ok: true,
                    offerok: false
                };
                return [4 /*yield*/, expect(mediaStreams.reconnectMedia(options)).rejects.toBeDefined()];
            case 2:
                _a.sent();
                expect(pc.localOffer.reject).toEqual('yes');
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test.skip('test media reconnect - check validateSDP', function () {
    var fadeSession = new FadeSession();
    var mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
    var case1 = mediaStreams.validateSDP('c=IN IP4 50.237.72.154\r\na=rtcp:61349 IN IP4 50.237.72.154\r\n');
    expect(case1).toBe(true);
    var case2 = mediaStreams.validateSDP('c=IN IP4 0.0.0.0\r\na=rtcp:61349 IN IP4 50.237.72.154\r\n');
    expect(case2).toBe(false);
    var case3 = mediaStreams.validateSDP('c=IN IP4 50.237.72.154\r\na=rtcp:61349 IN IP4 0.0.0.0\r\n');
    expect(case3).toBe(false);
    var case4 = mediaStreams.validateSDP('c=IN IP4 0.0.0.0\r\na=rtcp:61349 IN IP4 0.0.0.0\r\n');
    expect(case4).toBe(false);
    var case5 = mediaStreams.validateSDP(null);
    expect(case4).toBe(false);
    mediaStreams.release();
});
test('test getMediaStats in MediaStreamsImpl- getMediaStats(func, interval)', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, pc;
    return __generator(this, function (_a) {
        fadeSession = new FadeSession();
        mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
        pc = fadeSession.sessionDescriptionHandler.peerConnection;
        pc.iceConnectionState = 'connected';
        jest.useFakeTimers();
        mediaStreams.getMediaStats(function (report, session) {
            console.log('test');
        }, 1000);
        expect(setInterval).toHaveBeenCalledTimes(1);
        mediaStreams.release();
        return [2 /*return*/];
    });
}); });
test('test getMediaStats in MediaStreamsImpl - getMediaStats(func)', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, pc;
    return __generator(this, function (_a) {
        fadeSession = new FadeSession();
        mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
        pc = fadeSession.sessionDescriptionHandler.peerConnection;
        pc.iceConnectionState = 'connected';
        jest.useFakeTimers();
        mediaStreams.getMediaStats(function (report, session) {
            console.log('test');
        });
        expect(setInterval).toHaveBeenCalledTimes(1);
        mediaStreams.release();
        return [2 /*return*/];
    });
}); });
test('test getMediaStats in MediaStreamsImpl - getMediaStats()', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, pc;
    return __generator(this, function (_a) {
        fadeSession = new FadeSession();
        mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
        pc = fadeSession.sessionDescriptionHandler.peerConnection;
        pc.iceConnectionState = 'connected';
        jest.useFakeTimers();
        mediaStreams.getMediaStats();
        expect(setInterval).toHaveBeenCalledTimes(1);
        mediaStreams.release();
        return [2 /*return*/];
    });
}); });
test('test getMediaStats in MediaStreamsImpl- mediaStatsTimerCallback - no callback', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, pc;
    return __generator(this, function (_a) {
        global.console = {
            warn: jest.fn(),
            log: jest.fn()
        };
        fadeSession = new FadeSession();
        mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
        pc = fadeSession.sessionDescriptionHandler.peerConnection;
        pc.iceConnectionState = 'new';
        mediaStreams.mediaStatsTimerCallback();
        expect(mediaStreams.preRTT['currentRoundTripTime']).toEqual(0);
        pc.iceConnectionState = 'connected';
        mediaStreams.mediaStatsTimerCallback();
        (function () {
            var prefix = [new Date(), 'WebPhone'];
            var label = '';
            if (label) {
                prefix.push(label);
            }
            var content = 'MediaStreams No callback to accept receive media report. usage: session.on("rtpStat") = function(report) or session.onRTPStat = function(report) or set a mediaCallback as a paramter';
            //content = prefix.concat(content).join(' | ');
            expect(global.console.log).toHaveBeenCalledWith(content);
        })();
        mediaStreams.release();
        return [2 /*return*/];
    });
}); });
test('test getMediaStats in MediaStreamsImpl - mediaStatsTimerCallback - listen on the event', function () {
    var fadeSession = new FadeSession();
    var mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
    var pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'connected';
    var mockCallback = jest.fn(function (report) { });
    mediaStreams.getRTPReport = jest.fn(function (reports) { });
    fadeSession.on('rtpStat', mockCallback);
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport['mock'].calls.length).toBe(1);
    mediaStreams.release();
});
test('test getMediaStats in MediaStreamsImpl - mediaStatsTimerCallback - session.onRTPStat ', function () {
    var fadeSession = new FadeSession();
    var mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
    var pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'connected';
    mediaStreams.getRTPReport = jest.fn(function (reports) { });
    fadeSession.onRTPStat = function (report, session) { };
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport['mock'].calls.length).toBe(1);
    mediaStreams.release();
});
test('test getMediaStats in MediaStreamsImpl - mediaStatsTimerCallback - session.mediaStreams.onRTPStat ', function () {
    global.console = {
        warn: jest.fn(),
        log: jest.fn()
    };
    var fadeSession = new FadeSession();
    var mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
    var pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'connected';
    mediaStreams.getRTPReport = jest.fn(function (reports) { });
    mediaStreams.onRTPStat = function (report, session) { };
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport['mock'].calls.length).toBe(1);
    mediaStreams.release();
});
test('test getMediaStats  in MediaStreamsImpl- mediaStatsTimerCallback -  if (connectionState !== "connected" && connectionState !== "completed") ', function () {
    var fadeSession = new FadeSession();
    var mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
    var pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'new';
    mediaStreams.getRTPReport = jest.fn(function (reports) { });
    mediaStreams.onRTPStat = function (report, session) { };
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport['mock'].calls.length).toBe(0);
    mediaStreams.release();
});
test('test getMediaStats in MediaStreamsImpl - mediaStatsTimerCallback -  if (!pc)) ', function () {
    var fadeSession = new FadeSession();
    var mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
    var pc = fadeSession.sessionDescriptionHandler.peerConnection;
    pc.iceConnectionState = 'new';
    mediaStreams.mediaStatsTimerCallback();
    pc.iceConnectionState = 'new';
    mediaStreams.getRTPReport = jest.fn(function (reports) { });
    mediaStreams.onRTPStat = function (report, session) { };
    pc = null;
    mediaStreams.mediaStatsTimerCallback();
    expect(mediaStreams.getRTPReport['mock'].calls.length).toBe(0);
    mediaStreams.release();
});
test('test getRTPReport in MediaStreamsImpl -- session.mediaStreams.onRTPStat', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, pc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                global.navigator.userAgent = global.navigator.chrome;
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                pc = fadeSession.sessionDescriptionHandler.peerConnection;
                pc.iceConnectionState = 'connected';
                mediaStreams.onRTPStat = jest.fn(function (report, session) { });
                return [4 /*yield*/, mediaStreams.getRTPReport(new mediaStreams_1.RTPReport())];
            case 1:
                _a.sent();
                expect(mediaStreams.onRTPStat.mock.calls.length).toBe(1);
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test getRTPReport in MediaStreamsImpl-- session.onRTPStat', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, pc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                global.navigator.userAgent = global.navigator.chrome;
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                pc = fadeSession.sessionDescriptionHandler.peerConnection;
                pc.iceConnectionState = 'connected';
                fadeSession.onRTPStat = jest.fn(function (report, session) { });
                return [4 /*yield*/, mediaStreams.getRTPReport(new mediaStreams_1.RTPReport())];
            case 1:
                _a.sent();
                expect(fadeSession.onRTPStat.mock.calls.length).toBe(1);
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test getRTPReport  in MediaStreamsImpl-- session.on("rtpStat")', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, pc, onRTPStat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                global.navigator.userAgent = global.navigator.chrome;
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                pc = fadeSession.sessionDescriptionHandler.peerConnection;
                pc.iceConnectionState = 'connected';
                onRTPStat = jest.fn(function (report, session) { });
                fadeSession.onRTPStat = null;
                mediaStreams.onRTPStat = null;
                fadeSession.on('rtpStat', onRTPStat);
                return [4 /*yield*/, mediaStreams.getRTPReport(new mediaStreams_1.RTPReport())];
            case 1:
                _a.sent();
                expect(onRTPStat.mock.calls.length).toBe(1);
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test getRTPReport in MediaStreamsImpl -- verify chrome and safari', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, pc, reports;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                global.navigator.userAgent = global.navigator.chrome;
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                pc = fadeSession.sessionDescriptionHandler.peerConnection;
                pc.iceConnectionState = 'connected';
                reports = {};
                fadeSession.onRTPStat = jest.fn(function (report, session) {
                    reports = report;
                });
                return [4 /*yield*/, mediaStreams.getRTPReport(new mediaStreams_1.RTPReport())];
            case 1:
                _a.sent();
                expect(fadeSession.onRTPStat.mock.calls.length).toBe(1);
                expect(reports.inboundRtpReport['bytesReceived']).toEqual(100);
                expect(reports.inboundRtpReport['packetsReceived']).toEqual(200);
                expect(reports.inboundRtpReport['jitter']).toEqual(300);
                expect(reports.inboundRtpReport['packetsLost']).toEqual(400);
                expect(reports.inboundRtpReport['fractionLost']).toEqual(500);
                expect(reports.inboundRtpReport['mediaType']).toEqual('audio');
                expect(reports.outboundRtpReport['bytesSent']).toEqual(100);
                expect(reports.outboundRtpReport['packetsSent']).toEqual(200);
                expect(reports.outboundRtpReport['mediaType']).toEqual('audio');
                expect(reports.rttMS['currentRoundTripTime']).toEqual(1.05 * 1000);
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test getRTPReport in MediaStreamsImpl -- verify firefox', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, pc, reports;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                global.navigator.userAgent = global.navigator.firefox;
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                pc = fadeSession.sessionDescriptionHandler.peerConnection;
                pc.iceConnectionState = 'connected';
                reports = {};
                fadeSession.onRTPStat = jest.fn(function (report, session) {
                    reports = report;
                });
                return [4 /*yield*/, mediaStreams.getRTPReport(new mediaStreams_1.RTPReport())];
            case 1:
                _a.sent();
                expect(fadeSession.onRTPStat.mock.calls.length).toBe(1);
                expect(reports.inboundRtpReport['bytesReceived']).toEqual(100);
                expect(reports.inboundRtpReport['packetsReceived']).toEqual(200);
                expect(reports.inboundRtpReport['jitter']).toEqual(300);
                expect(reports.inboundRtpReport['packetsLost']).toEqual(400);
                expect(typeof reports.inboundRtpReport['fractionLost']).toEqual('undefined');
                expect(reports.inboundRtpReport['mediaType']).toEqual('audio');
                expect(reports.outboundRtpReport['bytesSent']).toEqual(100);
                expect(reports.outboundRtpReport['packetsSent']).toEqual(200);
                expect(reports.outboundRtpReport['mediaType']).toEqual('audio');
                expect(reports.rttMS['currentRoundTripTime']).toEqual(1000);
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test getRTPReport in MediaStreamsImpl -- unknow browser and fail to get the statistics', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, pc, reports;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                global.navigator.userAgent = 'unknow';
                fadeSession = new FadeSession();
                mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
                pc = fadeSession.sessionDescriptionHandler.peerConnection;
                pc.iceConnectionState = 'connected';
                reports = {};
                fadeSession.onRTPStat = jest.fn(function (report, session) {
                    reports = report;
                });
                return [4 /*yield*/, mediaStreams.getRTPReport(new mediaStreams_1.RTPReport())];
            case 1:
                _a.sent();
                expect(fadeSession.onRTPStat.mock.calls.length).toBe(0);
                mediaStreams.release();
                return [2 /*return*/];
        }
    });
}); });
test('test getRTPReport in MediaStreamsImpl -- test web browser() type', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, i;
    return __generator(this, function (_a) {
        fadeSession = new FadeSession();
        mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
        for (i in mediaStreams_1.Browsers) {
            global.navigator.userAgent = i;
            expect(mediaStreams.browser()).toEqual(mediaStreams_1.Browsers[i]);
        }
        mediaStreams.release();
        return [2 /*return*/];
    });
}); });
test('test MediaStreamsImpl and getMediaStats -- release without timer', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, rtpStatInSession, rtpStatInSession2;
    return __generator(this, function (_a) {
        fadeSession = new FadeSession();
        mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
        rtpStatInSession = fadeSession.sessionDescriptionHandler.listeners('iceConnection');
        expect(rtpStatInSession.length).toEqual(1);
        mediaStreams.release();
        rtpStatInSession2 = fadeSession.sessionDescriptionHandler.listeners('iceConnection');
        expect(rtpStatInSession.length - rtpStatInSession2.length).toEqual(1);
        return [2 /*return*/];
    });
}); });
test('test MediaStreamsImpl and getMediaStats -- release with stopMediaStat', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, rtpStatInSession, pc, reports, rtpStatInSession2;
    return __generator(this, function (_a) {
        fadeSession = new FadeSession();
        mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
        rtpStatInSession = fadeSession.sessionDescriptionHandler.listeners('iceConnection');
        pc = fadeSession.sessionDescriptionHandler.peerConnection;
        expect(rtpStatInSession.length).toEqual(1);
        pc.iceConnectionState = 'connected';
        fadeSession.onRTPStat = jest.fn(function (report, session) {
            reports = report;
        });
        mediaStreams.getMediaStats(fadeSession.onRTPStat, 2000);
        mediaStreams.release();
        rtpStatInSession2 = fadeSession.sessionDescriptionHandler.listeners('iceConnection');
        expect(rtpStatInSession.length - rtpStatInSession2.length).toEqual(1);
        expect(fadeSession.onRTPStat.mock.calls.length).toBe(0);
        return [2 /*return*/];
    });
}); });
test('test MediaStreamsImpl and getMediaStats -- opera', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams;
    return __generator(this, function (_a) {
        global.navigator.userAgent = global.navigator.opera;
        fadeSession = new FadeSession();
        mediaStreams = new mediaStreams_1.MediaStreamsImpl(fadeSession);
        expect(mediaStreams_1.RTPReport).not.toBeNull();
        return [2 /*return*/];
    });
}); });
test('test property onRTPStat in MediaStreams', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, options, onRTPStat;
    return __generator(this, function (_a) {
        fadeSession = new FadeSession();
        mediaStreams = new mediaStreams_1.default(fadeSession);
        options = {};
        options.RTCOptions = {
            audio: 10,
            video: 100,
            restart: 15,
            ok: true
        };
        onRTPStat = jest.fn(function (report, session) { });
        mediaStreams.onRTPStat = onRTPStat;
        expect(onRTPStat).toEqual(mediaStreams.mediaStreamsImpl.onRTPStat);
        mediaStreams.release();
        return [2 /*return*/];
    });
}); });
test('test property onMediaConnectionStateChange in MediaStreams', function () { return __awaiter(void 0, void 0, void 0, function () {
    var fadeSession, mediaStreams, options, onMediaConnectionStateChange;
    return __generator(this, function (_a) {
        fadeSession = new FadeSession();
        mediaStreams = new mediaStreams_1.default(fadeSession);
        options = {};
        options.RTCOptions = {
            audio: 10,
            video: 100,
            restart: 15,
            ok: true
        };
        onMediaConnectionStateChange = jest.fn(function (state, session) { });
        mediaStreams.onMediaConnectionStateChange = onMediaConnectionStateChange;
        expect(onMediaConnectionStateChange).toEqual(mediaStreams.mediaStreamsImpl.onMediaConnectionStateChange);
        mediaStreams.release();
        return [2 /*return*/];
    });
}); });
//# sourceMappingURL=mediaStreams.test.js.map