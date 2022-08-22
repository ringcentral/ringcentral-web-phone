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
var sip_js_1 = require("sip.js");
var constants_1 = require("./constants");
var qos_1 = require("./qos");
var utils_1 = require("./utils");
var mediaStreams_1 = require("./mediaStreams");
var rtpReport_1 = require("./rtpReport");
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
    session.whisper = whisper.bind(session);
    session.barge = barge.bind(session);
    session.mute = mute.bind(session);
    session.unmute = unmute.bind(session);
    session.onLocalHold = onLocalHold.bind(session);
    session.__qosStats = {};
    session.setQosStats = setQosStats.bind(session);
    session.media = session.ua.media; //TODO Remove
    session.addTrack = addTrack.bind(session);
    session.stopMediaStats = stopMediaStats.bind(session);
    session.getIncomingInfoContent = getIncomingInfoContent.bind(session);
    session.sendMoveResponse = sendMoveResponse.bind(session);
    session.sendReceive = sendReceive.bind(session);
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
    session.on('reinviteAccepted', exports.patchIncomingSession);
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
    session.receiveRequest = receiveRequest;
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
                this.logger.error("Can't send SIP MESSAGE related to session: no RC headers available");
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
            delete command.extraHeaders;
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
                                            timeout && clearTimeout(timeout);
                                            session.removeListener('RC_SIP_INFO', onInfo_1);
                                            if (obj.response.result.code.toString() === '0') {
                                                return resolve(obj.response.result);
                                            }
                                            return reject(obj.response.result);
                                        }
                                    }
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
        case sip_js_1.C.UPDATE:
            this.logger.log('Receive UPDATE request. Do nothing just return 200 OK');
            request.reply(200);
            this.emit('updateReceived', request);
            return this;
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
                                },
                                extraHeaders: ["Contact: " + _this.contact]
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
            transferOptions.extraHeaders = (transferOptions.extraHeaders || []).concat(this.ua.defaultHeaders);
            this.logger.log('Completing warm transfer');
            return [2 /*return*/, Promise.resolve(this.refer(target, transferOptions))];
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
function whisper() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, sendReceive(this, constants_1.messages.whisper)];
        });
    });
}
/*--------------------------------------------------------------------------------------------------------------------*/
function barge() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, sendReceive(this, constants_1.messages.barge)];
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
        _this.logger.error('Remote play was rejected');
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
        _this.logger.error('Local play was rejected');
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
function setQosStats(stats) {
    this.__qosStats.cpuOS = stats.cpuOS || '0:0:0';
    this.__qosStats.cpuRC = stats.cpuRC || '0:0:0';
    this.__qosStats.ram = stats.ram || '0:0:0';
    this.__qosStats.netType = stats.netType || null;
}
/*--------------------------------------------------------------------------------------------------------------------*/
function stopMediaStats() {
    this.logger.log('Stopping media stats collection');
    if (!this) {
        return;
    }
    this.mediaStreams && this.mediaStreams.stopMediaStats();
    this.mediaStatsStarted = false;
    this.noAudioReportCount = 0;
}
//# sourceMappingURL=session.js.map