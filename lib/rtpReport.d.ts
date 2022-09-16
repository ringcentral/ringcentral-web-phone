export declare type RTPReport = {
    inboundRtpReport?: InboundRtpReport;
    outboundRtpReport?: OutboundRtpReport;
    rttMs?: RttReport;
};
export declare type InboundRtpReport = {
    mediaType?: string;
    packetsReceived?: number;
    bytesReceived?: number;
    packetsLost?: number;
    jitter?: number;
};
export declare type OutboundRtpReport = {
    mediaType?: string;
    packetsSent?: number;
    bytesSent?: number;
};
export declare type RttReport = {
    currentRoundTripTime?: number;
};
export declare function isNoAudio(report: RTPReport): boolean;
