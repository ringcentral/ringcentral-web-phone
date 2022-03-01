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
import { default as MediaStreams, MediaStreamsImplementation } from './mediaStreams';
import { uuid, delay, extend } from './utils';
import {
    uuidKey,
    defaultMediaConstraints,
    defaultLogLevel,
    defaultSipErrorCodes,
    defaultStunServers
} from './constants';
import packageJson from '../package.json';
import { WebPhoneSession } from './session';

/** @ignore */
export interface TransportServer {
    uri: string;
    isError?: boolean;
}

export interface WebPhoneRegistrationData {
    /** Sip Info recieved from the registeration endpoint */
    sipInfo?: Array<SipInfo> | SipInfo;
    /** Sip error codes */
    sipErrorCodes?: string[];
}

export interface SipInfo {
    /** Username to connect to transport */
    username: string;
    /** Password to connect to transport */
    password: string;
    /** Authorization Id to connect to transport */
    authorizationId: string;
    /** Domain of transport server */
    domain: string;
    /** URL for outbound transport proxy */
    outboundProxy: string;
    /** V6 IP address for outbound transport proxy */
    outboundProxyIPv6?: string;
    /** URL for outbound backup transport proxy */
    outboundProxyBackup: string;
    /** V6 IP address for outbound backup transport proxy */
    outboundProxyIPv6Backup?: string;
    /** Transport type */
    transport: 'UDP' | 'TCP' | 'TLS' | 'WS' | 'WSS';
    /** Certificate to connect to transport */
    certificate: string;
    /** The interval in seconds after which the app must try to switch back to primary proxy if it was previously switched to backup */
    switchBackInterval: number;
}

export interface WebPhoneOptions {
    /** App key of the RingCentral Developer app */
    appKey?: string;
    /** Name used in user agent string */
    appName?: string;
    /** Version used in user agent string */
    appVersion?: string;
    /**
     * @internal
     * Helper class to load incoming and outgoing audio. The library already comes with an implementation of this class
     *
     * Can be overridden but the custom class should have `loadAudio`, `setVolume`, `playIncoming` and `playOutgoing` methods
     */
    audioHelper?: any;
    /** If `true`, user agent calls the stop() method on unload (if running in browser window).
     *
     * [Reference](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.useragentoptions.autostop.md)
     *
     * default value `true`
     */
    autoStop?: boolean;
    /** If `true` log messages should be written to the browser console.
     *
     * default value `true`
     */
    builtinEnabled?: boolean;
    /** A function which will be called every time a log is generated. [Reference](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.logconnector.md) */
    connector?: LogConnector;
    /** If `true` media will be sent prior to call being answered
     *
     * Set to `true` by default for firefox browser
     *
     * default value `false`
     */
    earlyMedia?: boolean;
    /** If `true`, `stripG722` and `stripTcpCandidates` modifiers will be enabled in SessionDescriptionHandler
     *
     * default value `true`
     */
    enableDefaultModifiers?: boolean;
    /** If `true`, media report is logged using logger */
    enableMediaReportLogging?: boolean;
    /** is `true`, `addMidLines` modifiers will be enabled in SessionDescriptionHandler */
    enableMidLinesInSDP?: boolean;
    /** Use SDP format instead of standards conformant format
     *
     * https://chromestatus.com/feature/5723303167655936
     */
    enablePlanB?: boolean;
    /** If `true`, QOS data will be collected when session starts */
    enableQos?: boolean;
    /** If `true`, turn servers passed with configuration will be used when generating ice candidates */
    enableTurnServers?: boolean;
    /** Max time in milliseconds to be considered when generating ice candidates
     *
     * default value `2000` when `enableTurnServers` is `true`, otherwise `500`
     */
    iceCheckingTimeout?: number;
    /** Policy used when generating ice candidates
     *
     * default value `all`
     */
    iceTransportPolicy?: RTCIceTransportPolicy;
    /** UUID to provide with "+sip.instance" Contact parameter. */
    instanceId?: string;
    /** Time in seconds to debounce sending CLRF keepAlive sequences by
     *
     * default value `10`
     */
    keepAliveDebounce?: number;
    /** Time in seconds to wait in between CLRF keepAlive sequences are sent
     *
     * default value `0`
     */
    keepAliveInterval?: number;
    /** Indicates the verbosity level of the log messages.
     *
     * 0 = Error
     * 1 = Warn
     * 2 = Log
     * 3 = Debug
     *
     * default value `0`
     */
    logLevel?: 0 | 1 | 2 | 3;
    /** Max retry attempts used for retrying to connect to outbound proxy when transport is disconnected
     *
     * If value is passed, `maxReconnectionAttempts` and `maxReconnectionAttemptsNoBackup` will be ignored
     *
     * If value is not passed, retry attempts will be decided using `maxReconnectionAttempts` and `maxReconnectionAttemptsNoBackup` depending on what proxy the transport connects to
     */
    maxReconnectionAttempts?: number;
    /** Max retry attempts used for retrying to connect to outbound proxy when transport is disconnected
     *
     * default value `15`
     */
    maxReconnectionAttemptsNoBackup?: number;
    /** Max retry attempts used for retrying to connect to outbound backup proxy when transport is disconnected
     *
     * default value `10`
     */
    maxReconnectionAttemptsWithBackup?: number;
    /** local and remote reference to HTML media elements */
    media?: { local?: HTMLMediaElement; remote?: HTMLMediaElement };
    /** Constraints used when creating peerConnection
     *
     * default value `{ audio: true, video: false }`
     */
    mediaConstraints?: any;
    /** Default modifiers used for SessionDescriptionHandler
     *
     * [Reference](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.sessiondescriptionhandlermodifier.md)
     */
    modifiers?: SessionDescriptionHandlerModifier[];
    /** Callback function called when session is created */
    onSession?: (session: WebPhoneSession) => any;
    /** Recurring time interval in seconds after which QOS stats are collected
     *
     * default value `5000`
     */
    qosCollectInterval?: number;
    /** Timeout before which reconenction is attempted when transport disconnects
     *
     * If value is passed, `reconnectionTimeoutNoBackup` and `reconnectionTimeoutNoBackup` will be ignored
     *
     * If value is not passed, reconnection timeout will be decided using `reconnectionTimeoutNoBackup` and `reconnectionTimeoutNoBackup` depending on what proxy the transport connects to
     */
    reconnectionTimeout?: number;
    /** Timeout before which reconenction is attempted when transport disconnects when connected to outbound proxy
     *
     * default value `5`
     */
    reconnectionTimeoutNoBackup?: number;
    /** Timeout before which reconenction is attempted when transport disconnects when connected to outbound backup proxy
     *
     * default value `4`
     */
    reconnectionTimeoutWithBackup?: number;
    /** Value to provide with "reg-id" Contact parameter. when registering */
    regId?: number;
    /** Factory for SessionDescriptionHandler.
     *
     * The library already uses a default implementation
     */
    sessionDescriptionHandlerFactory?: SessionDescriptionHandlerFactory;
    /** Options for SessionDescriptionHandler
     *
     * [Reference](https://github.com/onsip/SIP.js/blob/master/docs/api/sip.js.sessiondescriptionhandleroptions.md)
     */
    sessionDescriptionHandlerFactoryOptions?: SessionDescriptionHandlerFactoryOptions;
    /** Sip error codes. This value is picked from registrationData
     *
     * default value `['408', '502', '503', '504']` if registrationData does not have `sipErrorCodes`
     * @internal
     */
    sipErrorCodes?: string[];
    /** Stun servers used when generating ice candidates
     *
     * default value `['stun.l.google.com:19302']`
     */
    stunServers?: string[];
    /** Time in seconds to try connecting back to outbound proxy when transport has connected to backup outbound proxy */
    switchBackInterval?: number;
    /**
     * @internal
     * Used to store transport server details
     */
    transportServers?: TransportServer[];
    /** Turn servers used when generating ice candidates */
    turnServers?: string[];
    /** Unique ID used to make calls to SIP server
     *
     * Is generated by the library if not passed
     */
    uuid?: string;
    /** Key that will be used to save uuid in localStorage
     *
     * default value is used by the library if not passed
     *
     * default value `rc-webPhone-uuid`
     */
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

/**
 * WebPhone class to initiate WebRTC calls
 */
export default class WebPhone {
    /** WebPhone version */
    private static version = packageJson.version;
    /** Utility function to generate uuid */
    public static uuid = uuid;
    /** Utility function to generate delay */
    public static delay = delay;
    /** Utility function to extend object */
    public static extend = extend;
    public static MediaStreams = MediaStreams;
    public static MediaStreamsImplementation = MediaStreamsImplementation;

    /** Sip Info recieved from the registeration endpoint */
    public sipInfo: SipInfo;
    /** Key that will be used to save uuid in localStorage */
    public uuidKey: string | undefined;
    /** Name used in user agent string */
    public appName: string | undefined;
    /** Version used in user agent string */
    public appVersion: string | undefined;
    /** WebPhoneUserAgent instance */
    public userAgent: WebPhoneUserAgent;

    // TODO: include 'WebPhone' for all apps other than Chrome and Glip
    // TODO: parse wsservers from new api spec
    public constructor(registrationData: WebPhoneRegistrationData = {}, options: WebPhoneOptions = {}) {
        options = Object.assign({}, defaultWebPhoneOptions, options);

        this.sipInfo = registrationData.sipInfo[0] || registrationData.sipInfo;

        this.uuidKey = options.uuidKey;
        this.appName = options.appName;
        this.appVersion = options.appVersion;

        const id = options.uuid;
        localStorage.setItem(this.uuidKey as string, id as string);
        const uaMatch = navigator.userAgent.match(/\((.*?)\)/);
        const appClientOs = (uaMatch && uaMatch.length && uaMatch[1]).replace(/[^a-zA-Z0-9.:_]+/g, '-') || '';

        const userAgentString =
            (this.appName ? this.appName + (this.appVersion ? '/' + this.appVersion : '') + ' ' : '') +
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

        const sdpSemantics = options.enablePlanB ? 'plan-b' : 'unified-plan';

        const stunServers = options.stunServers || defaultStunServers;
        const iceTransportPolicy = options.iceTransportPolicy;
        let iceServers: Array<RTCIceServer> = [];
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

        const sessionDescriptionHandlerFactoryOptions = options.sessionDescriptionHandlerFactoryOptions || {
            iceGatheringTimeout: options.iceCheckingTimeout || 500,
            peerConnectionConfiguration: {
                iceServers,
                iceTransportPolicy,
                sdpSemantics
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
            registrationData.sipErrorCodes && registrationData.sipErrorCodes.length
                ? registrationData.sipErrorCodes
                : defaultSipErrorCodes;

        let reconnectionTimeout = options.reconnectionTimeoutWithBackup;
        let maxReconnectionAttempts = options.maxReconnectionAttemptsWithBackup;
        if (this.sipInfo.outboundProxy && this.sipInfo.transport) {
            options.transportServers.push({
                uri: this.sipInfo.transport.toLowerCase() + '://' + this.sipInfo.outboundProxy
            });
            reconnectionTimeout = options.reconnectionTimeoutNoBackup;
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
