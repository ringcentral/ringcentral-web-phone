import {patchUserAgent, WebPhoneUserAgent} from './userAgent';
import {UA, Web, SessionDescriptionHandlerModifiers} from 'sip.js';
import {uuidKey, defaultMediaConstraints} from './constants';
import {uuid, delay, extend} from './utils';
import {WebPhoneSession} from './session';
import {AudioHelperOptions} from './audioHelper';

const {version} = require('../package.json');

interface WebPhoneRegData {
    sipInfo?: any;
    sipFlags?: any;
}

interface WebPhoneOptions {
    uuid?: string;
    uuidKey?: string;
    appKey?: string;
    appName?: string;
    appVersion?: string;
    enableUnifiedSDP?: boolean;
    enableMidLinesInSDP?: boolean;
    enableQos?: boolean;
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
}

class WebPhone {
    public static version = version;
    public static uuid = uuid;
    public static delay = delay;
    public static extend = extend;

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

        let sdpSemantics = 'plan-b';

        if (options.enableUnifiedSDP) {
            sdpSemantics = 'unified-plan';
        }

        if (options.enableMidLinesInSDP) {
            modifiers.push(Web.Modifiers.addMidLines);
        }

        const sessionDescriptionHandlerFactoryOptions = options.sessionDescriptionHandlerFactoryOptions || {
            peerConnectionOptions: {
                iceCheckingTimeout: this.sipInfo.iceCheckingTimeout || this.sipInfo.iceGatheringTimeout || 500,
                rtcConfiguration: {
                    rtcpMuxPolicy: 'negotiate',
                    sdpSemantics: sdpSemantics
                }
            },
            constraints: options.mediaConstraints || defaultMediaConstraints,
            modifiers: modifiers
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

        const configuration = {
            uri: `sip:${this.sipInfo.username}@${this.sipInfo.domain}`,

            transportOptions: {
                wsServers:
                    this.sipInfo.outboundProxy && this.sipInfo.transport
                        ? this.sipInfo.transport.toLowerCase() + '://' + this.sipInfo.outboundProxy
                        : this.sipInfo.wsServers,
                traceSip: true,
                maxReconnectionAttempts: options.maxReconnectionAttempts || 10,
                reconnectionTimeout: options.reconnectionTimeout || 15,
                connectionTimeout: options.connectionTimeout || 10,
                keepAliveDebounce: options.keepAliveDebounce || 10
            },
            authorizationUser: this.sipInfo.authorizationId,
            password: this.sipInfo.password,
            stunServers: this.sipInfo.stunServers || ['stun:74.125.194.127:19302'], //FIXME Hardcoded?
            turnServers: [],
            log: {
                level: options.logLevel || 1, //FIXME LOG LEVEL 3
                builtinEnabled: options.builtinEnabled || true,
                connector: options.connector || null
            },
            domain: this.sipInfo.domain,
            autostart: false,
            register: false,
            userAgentString: userAgentString,
            sessionDescriptionHandlerFactoryOptions: sessionDescriptionHandlerFactoryOptions,
            sessionDescriptionHandlerFactory: sessionDescriptionHandlerFactory
        };

        this.userAgent = patchUserAgent(new UA(configuration) as WebPhoneUserAgent, this.sipInfo, options, id);
    }
}

export = WebPhone;
