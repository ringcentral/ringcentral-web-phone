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
exports.startQosStatsCollection = void 0;
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
    var refreshIntervalId = setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
        var sessionDescriptionHandler, getStatsResult, network;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sessionDescriptionHandler = session.sessionDescriptionHandler;
                    return [4 /*yield*/, sessionDescriptionHandler.peerConnection.getStats()];
                case 1:
                    getStatsResult = _a.sent();
                    qosStatsObj.status = true;
                    network = '';
                    getStatsResult.forEach(function (item) {
                        switch (item.type) {
                            case 'local-candidate':
                                if (item.candidateType === 'srflx') {
                                    network = getNetworkType(item.networkType);
                                    qosStatsObj.localAddr = item.ip + ':' + item.port;
                                    qosStatsObj.localcandidate = item;
                                }
                                break;
                            case 'remote-candidate':
                                if (item.candidateType === 'host') {
                                    qosStatsObj.remoteAddr = item.ip + ':' + item.port;
                                    qosStatsObj.remotecandidate = item;
                                }
                                break;
                            case 'inbound-rtp':
                                qosStatsObj.jitterBufferDiscardRate = item.packetsDiscarded / item.packetsReceived;
                                qosStatsObj.inboundPacketsLost = item.packetsLost;
                                qosStatsObj.inboundPacketsReceived = item.packetsReceived; //packetsReceived
                                qosStatsObj.totalSumJitter += parseFloat(item.jitterBufferDelay);
                                qosStatsObj.totalIntervalCount += 1;
                                qosStatsObj.NLR = formatFloat((item.packetsLost / (item.packetsLost + item.packetsReceived)) * 100);
                                qosStatsObj.JBM = Math.max(qosStatsObj.JBM, parseFloat(item.jitterBufferDelay));
                                qosStatsObj.netType = addToMap(qosStatsObj.netType, network);
                                break;
                            case 'candidate-pair':
                                qosStatsObj.RTD = Math.round((item.currentRoundTripTime / 2) * 1000);
                                break;
                            case 'outbound-rtp':
                                qosStatsObj.outboundPacketsSent = item.packetsSent;
                                break;
                            case 'remote-inbound-rtp':
                                qosStatsObj.outboundPacketsLost = item.packetsLost;
                                break;
                            default:
                                break;
                        }
                    });
                    return [2 /*return*/];
            }
        });
    }); }, session.ua.qosCollectInterval);
    session.on('terminated', function () {
        previousGetStatsResult && previousGetStatsResult.nomore();
        session.logger.log('Release media streams');
        session.mediaStreams && session.mediaStreams.release();
        publishQosStats(session, qosStatsObj);
        refreshIntervalId && clearInterval(refreshIntervalId);
    });
};
var publishQosStats = function (session, qosStatsObj, options) {
    if (options === void 0) { options = {}; }
    options = options || {};
    var targetUrl = options.targetUrl || 'rtcpxr@rtcpxr.ringcentral.com:5060';
    var event = options.event || 'vq-rtcpxr';
    options.expires = 60;
    options.contentType = 'application/vq-rtcpxr';
    options.extraHeaders = (options.extraHeaders || []).concat(session.ua.defaultHeaders);
    var cpuOS = session.__qosStats.cpuOS;
    var cpuRC = session.__qosStats.cpuRC;
    var ram = session.__qosStats.ram;
    var networkType = session.__qosStats.netType || calculateNetworkUsage(qosStatsObj) || '';
    var effectiveType = navigator['connection'].effectiveType || '';
    options.extraHeaders.push("p-rc-client-info:cpuRC=" + cpuRC + ";cpuOS=" + cpuOS + ";netType=" + networkType + ";ram=" + ram + ";effectiveType=" + effectiveType);
    session.logger.log("QOS stats " + JSON.stringify(qosStatsObj));
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
    var rawNLR = (qosStatsObj.inboundPacketsLost * 100) /
        (qosStatsObj.inboundPacketsReceived + qosStatsObj.inboundPacketsLost) || 0;
    var rawJBN = qosStatsObj.totalIntervalCount > 0 ? qosStatsObj.totalSumJitter / qosStatsObj.totalIntervalCount : 0;
    return __assign(__assign({}, qosStatsObj), { NLR: formatFloat(rawNLR), JBN: formatFloat(rawJBN), JDR: formatFloat(qosStatsObj.jitterBufferDiscardRate), MOSLQ: calculateMos(qosStatsObj.inboundPacketsLost / (qosStatsObj.inboundPacketsLost + qosStatsObj.inboundPacketsReceived)), MOSCQ: calculateMos(qosStatsObj.outboundPacketsLost / (qosStatsObj.outboundPacketsLost + qosStatsObj.outboundPacketsSent)) });
};
var createPublishBody = function (calculatedStatsObj) {
    var NLR = calculatedStatsObj.NLR || 0;
    var JBM = calculatedStatsObj.JBM || 0;
    var JBN = calculatedStatsObj.JBN || 0;
    var JDR = calculatedStatsObj.JDR || 0;
    var MOSLQ = calculatedStatsObj.MOSLQ || 0;
    var MOSCQ = calculatedStatsObj.MOSCQ || 0;
    var RTD = calculatedStatsObj.RTD || 0;
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
        ("Delay: RTD=" + RTD + " ESD=0 SOWD=0 IAJ=0\r\n") +
        ("QualityEst: MOSLQ=" + MOSLQ + " MOSCQ=" + MOSCQ + "\r\n") +
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
    inboundPacketsLost: 0,
    inboundPacketsReceived: 0,
    outboundPacketsLost: 0,
    outboundPacketsSent: 0,
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
    MOSCQ: 0,
    RTD: 0,
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
function calculateMos(packetLoss) {
    if (packetLoss <= 0.008) {
        return 4.5;
    }
    if (packetLoss > 0.45) {
        return 1.0;
    }
    var bpl = 17.2647;
    var r = 93.2062077233 - 95.0 * ((packetLoss * 100) / (packetLoss * 100 + bpl)) + 4;
    var mos = 2.06405 + 0.031738 * r - 0.000356641 * r * r + 2.93143 * Math.pow(10, -6) * r * r * r;
    if (mos < 1) {
        return 1.0;
    }
    if (mos > 4.5) {
        return 4.5;
    }
    if (packetLoss >= 0.35 && mos > 2.7) {
        mos = 2.7;
    }
    else if (packetLoss >= 0.3 && mos > 3.0) {
        mos = 3.0;
    }
    else if (packetLoss >= 0.2 && mos > 3.6) {
        mos = 3.6;
    }
    else if (packetLoss >= 0.15 && mos > 3.7) {
        mos = 3.7;
    }
    else if (packetLoss >= 0.1 && mos > 3.9) {
        mos = 4.1;
    }
    else if (packetLoss >= 0.05 && mos > 4.1) {
        mos = 4.3;
    }
    else if (packetLoss >= 0.03 && mos > 4.1) {
        mos = 4.4;
    }
    return mos;
}
//# sourceMappingURL=qos.js.map