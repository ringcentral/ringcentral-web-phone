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
var userAgent_1 = require("./userAgent");
var sip_js_1 = require("sip.js");
var constants_1 = require("./constants");
var utils_1 = require("./utils");
var mediaStreams_1 = __importStar(require("./mediaStreams"));
var version = require('../package.json').version;
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
        var stunServerArr = options.stunServers || this.sipInfo.stunServers || ['stun.l.google.com:19302'];
        var turnServerArr = options.turnServers;
        var iceTransportPolicy = options.iceTransportPolicy || 'all';
        var iceServers = [];
        if (options.enableTurnServers && options.turnServers !== undefined && options.turnServers.length !== 0) {
            turnServerArr.forEach(function (server) {
                iceServers.push(server);
            });
            options.iceCheckingTimeout = options.iceCheckingTimeout || 2000;
        }
        stunServerArr.forEach(function (addr) {
            addr = !/^(stun:)/.test(addr) ? 'stun:' + addr : addr;
            iceServers.push({ urls: addr });
        });
        var sessionDescriptionHandlerFactoryOptions = options.sessionDescriptionHandlerFactoryOptions || {
            peerConnectionOptions: {
                iceCheckingTimeout: options.iceCheckingTimeout ||
                    this.sipInfo.iceCheckingTimeout ||
                    this.sipInfo.iceGatheringTimeout ||
                    500,
                rtcConfiguration: {
                    sdpSemantics: sdpSemantics,
                    iceServers: iceServers,
                    iceTransportPolicy: iceTransportPolicy
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
        var sessionDescriptionHandlerFactory = options.sessionDescriptionHandlerFactory || [];
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
            autostop: typeof options.autoStop === 'undefined' ? true : options.autoStop,
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
    WebPhone.version = '0.8.11';
    WebPhone.uuid = utils_1.uuid;
    WebPhone.delay = utils_1.delay;
    WebPhone.extend = utils_1.extend;
    WebPhone.MediaStreams = mediaStreams_1.default;
    WebPhone.MediaStreamsImpl = mediaStreams_1.MediaStreamsImpl;
    return WebPhone;
}());
exports.default = WebPhone;
//# sourceMappingURL=index.js.map