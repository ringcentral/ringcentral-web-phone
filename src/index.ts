import {patchUserAgent, WebPhoneUserAgent} from './userAgent';
import {UA, Web, SessionDescriptionHandlerModifiers} from 'sip.js';
import {uuidKey, defaultMediaConstraints} from './constants';
import {uuid, delay, extend} from './utils';
import {WebPhoneSession} from './session';
import {AudioHelperOptions} from './audioHelper';
import {default as MediaStreams, MediaStreamsImpl} from './mediaStreams';

const {version} = require('../package.json');

export interface WebPhoneRegData {
    sipInfo?: any;
    sipFlags?: any;
    sipErrorCodes?: string[];
}

export interface WebPhoneOptions {
    uuid?: string;
    uuidKey?: string;
    appKey?: string;
    appName?: string;
    appVersion?: string;
    enableUnifiedSDP?: boolean;
    enableMidLinesInSDP?: boolean;
    enableQos?: boolean;
    enableMediaReportLogging?:boolean;
    onSession?: (session: WebPhoneSession) => any;
    audioHelper?: AudioHelperOptions;
    modifiers?: SessionDescriptionHandlerModifiers;
    media?: any;
    mediaConstraints?: any;
    sessionDescriptionHandlerFactoryOptions?: any;
    sessionDescriptionHandlerFactory?: any;
    maxReconnectionAttempts?: number;
    reconnectionTimeout?: number;
    connectionTimeout?: number;
    keepAliveDebounce?: number;
    logLevel?: any; // import {Levels} from "sip.js/types/logger-factory";
    builtinEnabled?: boolean;
    connector?: any;
    sipErrorCodes?: string[];
    switchBackInterval?: number;
    maxReconnectionAttemptsNoBackup?: number;
    maxReconnectionAttemptsWithBackup?: number;
    reconnectionTimeoutNoBackup?: number;
    reconnectionTimeoutWithBackup?: number;
}

export default class WebPhone {
    public static version = '0.8.0';
    public static uuid = uuid;
    public static delay = delay;
    public static extend = extend;
    public static MediaStreams = MediaStreams;
    public static MediaStreamsImpl = MediaStreamsImpl;

    public sipInfo: any;
    public sipFlags: any;
    public uuidKey: string;
    public appKey: string;
    public appName: string;
    public appVersion: string;
    public userAgent: WebPhoneUserAgent;

    /**
     * TODO: include 'WebPhone' for all apps other than Chrome and Glip
     * TODO: parse wsservers from new api spec
     */
    public constructor(regData: WebPhoneRegData = {}, options: WebPhoneOptions = {}) {
        this.sipInfo = regData.sipInfo[0] || regData.sipInfo;
        this.sipFlags = regData.sipFlags;

        this.uuidKey = options.uuidKey || uuidKey;

        const id = options.uuid || localStorage.getItem(this.uuidKey) || uuid(); //TODO Make configurable
        localStorage.setItem(this.uuidKey, id);

        this.appKey = options.appKey;
        this.appName = options.appName;
        this.appVersion = options.appVersion;

        const ua_match = navigator.userAgent.match(/\((.*?)\)/);
        const app_client_os = (ua_match && ua_match.length && ua_match[1]).replace(/[^a-zA-Z0-9.:_]+/g, '-') || '';

        const userAgentString =
            (options.appName ? options.appName + (options.appVersion ? '/' + options.appVersion : '') + ' ' : '') +
            (app_client_os ? app_client_os : '') +
            ` RCWEBPHONE/${version}`;

        const modifiers = options.modifiers || [];
        modifiers.push(Web.Modifiers.stripG722);
        modifiers.push(Web.Modifiers.stripTcpCandidates);

        if (options.enableMidLinesInSDP) {
            modifiers.push(Web.Modifiers.addMidLines);
        }

        const sessionDescriptionHandlerFactoryOptions = options.sessionDescriptionHandlerFactoryOptions || {
            peerConnectionOptions: {
                iceCheckingTimeout: this.sipInfo.iceCheckingTimeout || this.sipInfo.iceGatheringTimeout || 500,
                rtcConfiguration: {}
            },
            constraints: options.mediaConstraints || defaultMediaConstraints,
            modifiers
        };

        const browserUa = navigator.userAgent.toLowerCase();
        let isSafari = false;
        let isFirefox = false;

        if (browserUa.indexOf('safari') > -1 && browserUa.indexOf('chrome') < 0) {
            isSafari = true;
        } else if (browserUa.indexOf('firefox') > -1 && browserUa.indexOf('chrome') < 0) {
            isFirefox = true;
        }

        if (isFirefox) {
            sessionDescriptionHandlerFactoryOptions.alwaysAcquireMediaFirst = true;
        }

        const sessionDescriptionHandlerFactory = options.sessionDescriptionHandlerFactory || [];

        const sipErrorCodes =
            regData.sipErrorCodes && regData.sipErrorCodes.length
                ? regData.sipErrorCodes
                : ['408', '502', '503', '504'];

        let wsServers = [];

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

        const maxReconnectionAttemptsNoBackup = options.maxReconnectionAttemptsNoBackup || 15;
        const maxReconnectionAttemptsWithBackup = options.maxReconnectionAttemptsWithBackup || 10;

        const reconnectionTimeoutNoBackup = options.reconnectionTimeoutNoBackup || 5;
        const reconnectionTimeoutWithBackup = options.reconnectionTimeoutWithBackup || 4;

        const configuration = {
            uri: `sip:${this.sipInfo.username}@${this.sipInfo.domain}`,

            transportOptions: {
                wsServers,
                traceSip: true,
                maxReconnectionAttempts:
                    wsServers.length === 1 ? maxReconnectionAttemptsNoBackup : maxReconnectionAttemptsWithBackup, //Fallback parameters if no backup prxy specified
                reconnectionTimeout:
                    wsServers.length === 1 ? reconnectionTimeoutNoBackup : reconnectionTimeoutWithBackup, //Fallback parameters if no backup prxy specified
                connectionTimeout: 5
            },
            authorizationUser: this.sipInfo.authorizationId,
            password: this.sipInfo.password,
            stunServers: this.sipInfo.stunServers || ['stun:74.125.194.127:19302'], //FIXME Hardcoded?
            turnServers: [],
            log: {
                level: options.logLevel || 1, //FIXME LOG LEVEL 3
                builtinEnabled: typeof options.builtinEnabled === 'undefined' ? true : options.builtinEnabled ,
                connector: options.connector || null
            },
            domain: this.sipInfo.domain,
            autostart: false,
            register: true,
            userAgentString,
            sessionDescriptionHandlerFactoryOptions,
            sessionDescriptionHandlerFactory,
            allowLegacyNotifications: true
        };

        options.sipErrorCodes = sipErrorCodes;
        options.switchBackInterval = this.sipInfo.switchBackInterval;

        this.userAgent = patchUserAgent(new UA(configuration) as WebPhoneUserAgent, this.sipInfo, options, id);
    }
}
