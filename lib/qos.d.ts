import { WebPhoneSession } from './session';
export declare const startQosStatsCollection: (session: WebPhoneSession) => void;
export interface QosStats {
    localAddr: string;
    remoteAddr: string;
    callID: string;
    localID: string;
    remoteID: string;
    origID: string;
    fromTag: string;
    toTag: string;
    timestamp: {
        start: string;
        stop: string;
    };
    netType: any;
    packetLost: number;
    packetsReceived: number;
    jitterBufferNominal: number;
    jitterBufferMax: number;
    jitterBufferDiscardRate: number;
    totalSumJitter: number;
    totalIntervalCount: number;
    NLR: string;
    JBM: number;
    JBN: string;
    JDR: string;
    MOSLQ: number;
    status: boolean;
    localcandidate: any;
    remotecandidate: any;
}
