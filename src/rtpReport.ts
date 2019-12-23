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

export function isNoAudio(report: RTPReport): boolean {
    if (!report.inboundRtpReport) {
        return true;
    }
    if (!report.outboundRtpReport) {
        return true;
    }
    if (report.inboundRtpReport.packetsReceived === 0 || report.outboundRtpReport.packetsSent === 0) {
        return true;
    }
    return false;
}