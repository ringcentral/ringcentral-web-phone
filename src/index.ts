import { Levels as LogLevels } from 'sip.js/lib/core/log/levels';
import { LogLevel } from 'sip.js/lib/api/user-agent-options';
import { SessionDescriptionHandlerFactoryOptions } from 'sip.js/lib/platform/web';
import {
    UserAgent,
    Web,
    SessionDescriptionHandlerModifier,
    UserAgentOptions,
    LogConnector,
    SessionDescriptionHandlerFactory
} from 'sip.js';

import { createWebPhoneUserAgent, WebPhoneUserAgent } from './userAgent';
import { default as MediaStreams, MediaStreamsImpl } from './mediaStreams';
import { uuid, delay, extend } from './utils';
import { uuidKey, defaultMediaConstraints } from './constants';
import packageJson from '../package.json';
import { WebPhoneSession } from './session';
export interface WebPhoneRegData {
    sipInfo?: any;
    sipFlags?: any;
    sipErrorCodes?: string[];
}

export interface TransportServer {
    uri: string;
    isError?: boolean;
}

export interface WebPhoneOptions {
    appKey?: string;
    appName?: string;
    appVersion?: string;
    audioHelper?: any;
    autoStop?: boolean;
    builtinEnabled?: boolean;
    connector?: LogConnector;
    earlyMedia?: boolean;
    enableDefaultModifiers?: boolean;
    enableMediaReportLogging?: boolean;
    enableMidLinesInSDP?: boolean;
    enablePlanB?: boolean;
    enableQos?: boolean;
    enableTurnServers?: boolean;
    iceCheckingTimeout?: number;
    iceTransportPolicy?: RTCIceTransportPolicy;
    instanceId?: string;
    keepAliveDebounce?: number;
    keepAliveInterval?: number;
    logLevel?: number;
    maxReconnectionAttempts?: number;
    maxReconnectionAttemptsNoBackup?: number;
    maxReconnectionAttemptsWithBackup?: number;
    media?: any;
    mediaConstraints?: any;
    modifiers?: SessionDescriptionHandlerModifier[];
    onSession?: (session: WebPhoneSession) => any;
    qosCollectInterval?: number;
    reconnectionTimeout?: number;
    reconnectionTimeoutNoBackup?: number;
    reconnectionTimeoutWithBackup?: number;
    regId?: number;
    sessionDescriptionHandlerFactory?: SessionDescriptionHandlerFactory;
    sessionDescriptionHandlerFactoryOptions?: SessionDescriptionHandlerFactoryOptions;
    sipErrorCodes?: string[];
    stunServers?: string[];
    switchBackInterval?: number;
    transportServers?: TransportServer[];
    turnServers?: string[];
    uuid?: string;
    uuidKey?: string;
}

const defaultWebPhoneOptions: WebPhoneOptions = {
    autoStop: true,
    builtinEnabled: true,
    earlyMedia: false,
    enableDefaultModifiers: true,
    iceTransportPolicy: 'all',
    maxReconnectionAttemptsNoBackup: 15,
    maxReconnectionAttemptsWithBackup: 10,
    mediaConstraints: defaultMediaConstraints,
    modifiers: [],
    //FIXME: This should be in seconds since every other config is in seconds
    qosCollectInterval: 5000,
    reconnectionTimeoutNoBackup: 5,
    reconnectionTimeoutWithBackup: 4,
    transportServers: [],
    turnServers: [],
    uuid: uuid(),
    uuidKey
};

const defaultStunServers = ['stun.l.google.com:19302'];
const defaultSipErrorCodes = ['408', '502', '503', '504'];
const defaultLogLevel = 'debug';

export default class WebPhone {
    public static version = packageJson.version;
    public static uuid = uuid;
    public static delay = delay;
    public static extend = extend;
    public static MediaStreams = MediaStreams;
    public static MediaStreamsImpl = MediaStreamsImpl;

    public sipInfo: any;
    public sipFlags: any;
    public uuidKey: string | undefined;
    public appKey: string | undefined;
    public appName: string | undefined;
    public appVersion: string | undefined;
    public userAgent: WebPhoneUserAgent;

    /**
     * TODO: include 'WebPhone' for all apps other than Chrome and Glip
     * TODO: parse wsservers from new api spec
     */
    public constructor(regData: WebPhoneRegData = {}, options: WebPhoneOptions = {}) {
        options = Object.assign({}, defaultWebPhoneOptions, options);

        this.sipInfo = regData.sipInfo[0] || regData.sipInfo;
        this.sipFlags = regData.sipFlags;

        this.uuidKey = options.uuidKey;
        this.appKey = options.appKey;
        this.appName = options.appName;
        this.appVersion = options.appVersion;

        const id = options.uuid; //TODO Make configurable
        localStorage.setItem(this.uuidKey as string, id as string);
        const uaMatch = navigator.userAgent.match(/\((.*?)\)/);
        const appClientOs = (uaMatch && uaMatch.length && uaMatch[1]).replace(/[^a-zA-Z0-9.:_]+/g, '-') || '';

        const userAgentString =
            (options.appName ? options.appName + (options.appVersion ? '/' + options.appVersion : '') + ' ' : '') +
            (appClientOs ? appClientOs : '') +
            ` RCWEBPHONE/${WebPhone.version}`;

        const modifiers = options.modifiers;

        if (!options.enableDefaultModifiers) {
            modifiers.push(Web.stripG722);
            modifiers.push(Web.stripTcpCandidates);
        }

        if (options.enableMidLinesInSDP) {
            modifiers.push(Web.addMidLines);
        }

        // FIXME: SIPjs does not seem to have support for this. Why are we even using this? For the future?
        // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/RTCPeerConnection
        let sdpSemantics = 'unified-plan';
        if (options.enablePlanB) {
            sdpSemantics = 'plan-b';
        }

        const stunServers = options.stunServers || this.sipInfo.stunServers || defaultStunServers;
        const iceTransportPolicy = options.iceTransportPolicy;
        let iceServers = [];
        if (options.enableTurnServers) {
            iceServers = options.turnServers.map((url) => ({ urls: url }));
            options.iceCheckingTimeout = options.iceCheckingTimeout || 2000;
        }
        iceServers = [
            ...iceServers,
            ...stunServers.map((_url) => {
                const url = !/^(stun:)/.test(_url) ? `stun:${_url}` : _url;
                return { urls: url };
            })
        ];

        const sessionDescriptionHandlerFactoryOptions: SessionDescriptionHandlerFactoryOptions =
            options.sessionDescriptionHandlerFactoryOptions || {
                iceGatheringTimeout:
                    options.iceCheckingTimeout ||
                    this.sipInfo.iceCheckingTimeout ||
                    this.sipInfo.iceGatheringTimeout ||
                    500,
                peerConnectionConfiguration: {
                    iceServers,
                    iceTransportPolicy
                }
            };

        options.modifiers = modifiers;

        const browserUa = navigator.userAgent.toLowerCase();

        if (browserUa.includes('firefox') && !browserUa.includes('chrome')) {
            // FIXME: alwaysAcquireMediaFirst has been removed from SIP.js. Is it the same as earlyMedia?
            options.earlyMedia = true;
        }

        const sessionDescriptionHandlerFactory = options.sessionDescriptionHandlerFactory || undefined;

        const sipErrorCodes =
            regData.sipErrorCodes && regData.sipErrorCodes.length ? regData.sipErrorCodes : defaultSipErrorCodes;

        let reconnectionTimeout = options.reconnectionTimeoutWithBackup;
        let maxReconnectionAttempts = options.maxReconnectionAttemptsWithBackup;
        if (this.sipInfo.outboundProxy && this.sipInfo.transport) {
            options.transportServers.push({
                uri: this.sipInfo.transport.toLowerCase() + '://' + this.sipInfo.outboundProxy
            });
            reconnectionTimeout = options.reconnectionTimeoutNoBackup || 5;
            maxReconnectionAttempts = options.maxReconnectionAttemptsNoBackup;
        }

        if (this.sipInfo.outboundProxyBackup && this.sipInfo.transport) {
            options.transportServers.push({
                uri: this.sipInfo.transport.toLowerCase() + '://' + this.sipInfo.outboundProxyBackup
            });
        }

        options.reconnectionTimeout = options.reconnectionTimeout || reconnectionTimeout;
        options.maxReconnectionAttempts = options.maxReconnectionAttempts || maxReconnectionAttempts;

        const transportServer = options.transportServers.length ? options.transportServers[0].uri : '';

        const configuration: UserAgentOptions = {
            uri: UserAgent.makeURI(`sip:${this.sipInfo.username}@${this.sipInfo.domain}`),
            transportOptions: {
                server: transportServer,
                traceSip: true,
                connectionTimeout: 5,
                keepAliveDebounce: options.keepAliveDebounce,
                keepAliveInterval: options.keepAliveInterval
            },
            // WebPhoneTransport will handle reconnection.
            reconnectionAttempts: 0,
            authorizationUsername: this.sipInfo.authorizationId,
            authorizationPassword: this.sipInfo.password,
            logLevel: (LogLevels[options.logLevel] as unknown as LogLevel) || defaultLogLevel,
            logBuiltinEnabled: options.builtinEnabled,
            logConnector: options.connector || null,
            autoStart: false,
            autoStop: options.autoStop,
            userAgentString,
            sessionDescriptionHandlerFactoryOptions,
            sessionDescriptionHandlerFactory,
            allowLegacyNotifications: true
        };

        options.sipErrorCodes = sipErrorCodes;
        options.switchBackInterval = this.sipInfo.switchBackInterval;
        this.userAgent = createWebPhoneUserAgent(configuration, this.sipInfo, options, id);
    }
}
