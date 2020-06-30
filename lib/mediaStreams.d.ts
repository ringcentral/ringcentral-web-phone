export declare enum Browsers {
    MSIE = "IE",
    Chrome = "Chrome",
    Firefox = "Firefox",
    Safari = "Safari",
    Opera = "Opera"
}
export declare class RTPReport {
    outboundRtpReport: any;
    inboundRtpReport: any;
    rttMS: any;
    constructor();
}
export default class MediaStreams {
    mediaStreamsImpl: MediaStreamsImpl;
    release: any;
    reconnectMedia: any;
    getMediaStats: any;
    stopMediaStats: any;
    constructor(session: any);
    set onRTPStat(statsCallback: any);
    set onMediaConnectionStateChange(stateChangeCallBack: any);
}
/**
 * MediaStreams Implementation
 */
export declare class MediaStreamsImpl {
    onMediaConnectionStateChange: any;
    onRTPStat: any;
    on: any;
    localStream: any;
    remoteStream: any;
    validateSDP: any;
    preRTT: any;
    private ktag;
    private session;
    private onStateChange;
    private isChrome;
    private isFirefox;
    private isSafari;
    private mediaStatsTimer;
    constructor(session: any);
    getMediaStats(onMediaStat?: any, interval?: number): void;
    mediaStatsTimerCallback(): void;
    stopMediaStats(): void;
    private get tag();
    onPeerConnectionStateChange(sessionDescriptionHandler: any): void;
    reconnectMedia(options?: any): Promise<unknown>;
    private onIceCandidate;
    getRTPReport(reports: any): void;
    browser(): "unknown" | Browsers;
    release(): void;
    private rcWPLoge;
    private rcWPLogd;
}
export { MediaStreams };
