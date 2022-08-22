import { WebPhoneUserAgent } from './userAgent';
import { SessionDescriptionHandlerModifiers } from 'sip.js';
import { WebPhoneSession } from './session';
import { AudioHelperOptions } from './audioHelper';
import { default as MediaStreams, MediaStreamsImpl } from './mediaStreams';
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
    enableMediaReportLogging?: boolean;
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
    logLevel?: any;
    builtinEnabled?: boolean;
    connector?: any;
    sipErrorCodes?: string[];
    switchBackInterval?: number;
    maxReconnectionAttemptsNoBackup?: number;
    maxReconnectionAttemptsWithBackup?: number;
    reconnectionTimeoutNoBackup?: number;
    reconnectionTimeoutWithBackup?: number;
    instanceId?: string;
    regId?: number;
    enableDefaultModifiers?: boolean;
    enablePlanB?: boolean;
    enableTurnServers?: boolean;
    stunServers?: any;
    turnServers?: any;
    iceCheckingTimeout?: number;
    iceTransportPolicy?: string;
    autoStop?: boolean;
}
export default class WebPhone {
    static version: string;
    static uuid: () => string;
    static delay: (ms: number) => Promise<any>;
    static extend: (dst?: any, src?: any) => any;
    static MediaStreams: typeof MediaStreams;
    static MediaStreamsImpl: typeof MediaStreamsImpl;
    sipInfo: any;
    sipFlags: any;
    uuidKey: string;
    appKey: string;
    appName: string;
    appVersion: string;
    userAgent: WebPhoneUserAgent;
    /**
     * TODO: include 'WebPhone' for all apps other than Chrome and Glip
     * TODO: parse wsservers from new api spec
     */
    constructor(regData?: WebPhoneRegData, options?: WebPhoneOptions);
}
