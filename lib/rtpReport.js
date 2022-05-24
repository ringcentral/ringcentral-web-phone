"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNoAudio = void 0;
function isNoAudio(report) {
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
exports.isNoAudio = isNoAudio;
//# sourceMappingURL=rtpReport.js.map