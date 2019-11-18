export type RTPReport = {
    inboundRtpReport?: InboundRtpReport;
    outboundRtpReport?: OutboundRtpReport;
    rttMs?: RttReport;
}

export type InboundRtpReport = {
    mediaType?: string;
    packetsReceived?: number;
    bytesReceived?: number;
    packetsLost?: number;
    jitter?: number;
}

export type OutboundRtpReport = {
    mediaType?: string;
    packetsSent?: number;
    bytesSent?: number;
}

export type RttReport = {
    currentRoundTripTime?: number;
}