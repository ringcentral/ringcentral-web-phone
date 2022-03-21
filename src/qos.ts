import { SessionState, Publisher, UserAgent } from 'sip.js';

import { WebPhoneSession } from './session';
import { SessionDescriptionHandler } from 'sip.js/lib/platform/web';
import { Events } from './events';

const formatFloat = (input: any): string => parseFloat(input.toString()).toFixed(2);

export const startQosStatsCollection = (session: WebPhoneSession): void => {
    const qosStatsObj = getQoSStatsTemplate();

    qosStatsObj.callID = session.request.callId || '';
    qosStatsObj.fromTag = session.request.fromTag || '';
    qosStatsObj.toTag = session.request.toTag || '';
    qosStatsObj.localID = session.request.getHeader('From');
    qosStatsObj.remoteID = session.request.getHeader('To');
    qosStatsObj.origID = session.request.getHeader('From');

    let previousGetStatsResult;

    const refreshIntervalId = setInterval(async () => {
        const sessionDescriptionHandler = session.sessionDescriptionHandler as SessionDescriptionHandler;
        const getStatsResult = await sessionDescriptionHandler.peerConnection.getStats();
        (session as any).logger.log(`getStatsResult ${JSON.stringify(getStatsResult)}`);
        qosStatsObj.status = true;
        var network = '';
        getStatsResult.forEach(function (item: any) {
            switch (item.type) {
                case 'local-candidate':
                    if (item.candidateType === 'srflx') {
                        network = getNetworkType(item.networkType);
                        qosStatsObj.localAddr = item.ip + ':' + item.port;
                        qosStatsObj.localcandidate = item;
                    }
                    break;
                case 'remote-candidate':
                    if (item.candidateType === 'host') {
                        qosStatsObj.remoteAddr = item.ip + ':' + item.port;
                        qosStatsObj.remotecandidate = item;
                    }
                    break;
                case 'inbound-rtp':
                    qosStatsObj.jitterBufferDiscardRate = 0;
                    qosStatsObj.packetLost = item.packetsLost;
                    qosStatsObj.packetsReceived = item.packetsReceived; //packetsReceived
                    qosStatsObj.totalSumJitter += parseFloat(item.jitterBufferDelay);
                    qosStatsObj.totalIntervalCount += 1;
                    qosStatsObj.JBM = Math.max(qosStatsObj.JBM, parseFloat(item.jitterBufferDelay));
                    qosStatsObj.netType = addToMap(qosStatsObj.netType, network);
                    break;
                default:
                    break;
            }
        });
    }, session.userAgent.qosCollectInterval);

    session.stateChange.addListener((newState) => {
        if (newState === SessionState.Terminated) {
            refreshIntervalId && clearInterval(refreshIntervalId);
            previousGetStatsResult && previousGetStatsResult.nomore();
            publishQosStats(session, qosStatsObj);
        }
    });
};

const publishQosStats = async (session: WebPhoneSession, qosStatsObj: QosStats, options: any = {}): Promise<void> => {
    options = options || {};

    const effectiveType = (navigator['connection'] as any).effectiveType || '';
    const networkType = calculateNetworkUsage(qosStatsObj) || '';
    const targetUrl = options.targetUrl || 'sip:rtcpxr@rtcpxr.ringcentral.com:5060';
    const event = options.event || 'vq-rtcpxr';
    options.expires = 60;
    options.contentType = 'application/vq-rtcpxr';
    options.extraHeaders = (options.extraHeaders || []).concat(session.userAgent.defaultHeaders);
    options.extraHeaders.push(
        `p-rc-client-info: cpuRC=0:0;cpuOS=0:0;netType=${networkType};ram=0:0;effectiveType=${effectiveType}`
    );

    const calculatedStatsObj = calculateStats(qosStatsObj);
    const body = createPublishBody(calculatedStatsObj);
    const publisher = new Publisher(session.userAgent, UserAgent.makeURI(targetUrl), event, options);
    await publisher.publish(body);
    (session as any).logger.log('Local Candidate: ' + JSON.stringify(qosStatsObj.localcandidate));
    (session as any).logger.log('Remote Candidate: ' + JSON.stringify(qosStatsObj.remotecandidate));
    qosStatsObj.status = false;
    await publisher.dispose();
    session.emit(Events.Session.QOSPublished, body);
};

const calculateNetworkUsage = (qosStatsObj: QosStats): string => {
    const networkType = [];
    for (const [key, value] of Object.entries(qosStatsObj.netType)) {
        networkType.push(key + ':' + formatFloat(((value as any) * 100) / qosStatsObj.totalIntervalCount));
    }
    return networkType.join();
};

const calculateStats = (qosStatsObj: QosStats): QosStats => {
    const rawNLR = (qosStatsObj.packetLost * 100) / (qosStatsObj.packetsReceived + qosStatsObj.packetLost) || 0;
    const rawJBN = qosStatsObj.totalIntervalCount > 0 ? qosStatsObj.totalSumJitter / qosStatsObj.totalIntervalCount : 0;

    return {
        ...qosStatsObj,
        NLR: formatFloat(rawNLR),
        JBN: formatFloat(rawJBN), //JitterBufferNominal
        JDR: formatFloat(qosStatsObj.jitterBufferDiscardRate), //JitterBufferDiscardRate
        MOSLQ: 0 //MOS Score
    };
};

const createPublishBody = (calculatedStatsObj: QosStats): string => {
    const NLR = calculatedStatsObj.NLR || 0;
    const JBM = calculatedStatsObj.JBM || 0;
    const JBN = calculatedStatsObj.JBN || 0;
    const JDR = calculatedStatsObj.JDR || 0;
    const MOSLQ = calculatedStatsObj.MOSLQ || 0;

    const callID = calculatedStatsObj.callID || '';
    const fromTag = calculatedStatsObj.fromTag || '';
    const toTag = calculatedStatsObj.toTag || '';
    const localId = calculatedStatsObj.localID || '';
    const remoteId = calculatedStatsObj.remoteID || '';

    const localAddr = calculatedStatsObj.localAddr || '';
    const remoteAddr = calculatedStatsObj.remoteAddr || '';

    return (
        `VQSessionReport: CallTerm\r\n` +
        `CallID: ${callID}\r\n` +
        `LocalID: ${localId}\r\n` +
        `RemoteID: ${remoteId}\r\n` +
        `OrigID: ${localId}\r\n` +
        `LocalAddr: IP=${localAddr} SSRC=0x00000000\r\n` +
        `RemoteAddr: IP=${remoteAddr} SSRC=0x00000000\r\n` +
        `LocalMetrics:\r\n` +
        `Timestamps: START=0 STOP=0\r\n` +
        `SessionDesc: PT=0 PD=opus SR=0 FD=0 FPP=0 PPS=0 PLC=0 SSUP=on\r\n` +
        `JitterBuffer: JBA=0 JBR=0 JBN=${JBN} JBM=${JBM} JBX=0\r\n` +
        `PacketLoss: NLR=${NLR} JDR=${JDR}\r\n` +
        `BurstGapLoss: BLD=0 BD=0 GLD=0 GD=0 GMIN=0\r\n` +
        `Delay: RTD=0 ESD=0 SOWD=0 IAJ=0\r\n` +
        `QualityEst: MOSLQ=${MOSLQ} MOSCQ=0.0\r\n` +
        `DialogID: ${callID};to-tag=${toTag};from-tag=${fromTag}`
    );
};

const getQoSStatsTemplate = (): QosStats => ({
    localAddr: '',
    remoteAddr: '',
    callID: '',
    localID: '',
    remoteID: '',
    origID: '',
    fromTag: '',
    toTag: '',
    timestamp: {
        start: '',
        stop: ''
    },

    netType: {},

    packetLost: 0,
    packetsReceived: 0,

    jitterBufferNominal: 0,
    jitterBufferMax: 0,

    jitterBufferDiscardRate: 0,

    totalSumJitter: 0,
    totalIntervalCount: 0,

    NLR: '',
    JBM: 0,
    JBN: '',
    JDR: '',
    MOSLQ: 0,

    status: false,
    localcandidate: {},
    remotecandidate: {}
});

const addToMap = (map: any = {}, key: string): any => ({
    ...map,
    [key]: (key in map ? parseInt(map[key]) : 0) + 1
});

enum networkTypeMap {
    bluetooth = 'Bluetooth',
    cellular = 'Cellulars',
    ethernet = 'Ethernet',
    wifi = 'WiFi',
    vpn = 'VPN',
    wimax = 'WiMax',
    '2g' = '2G',
    '3g' = '3G',
    '4g' = '4G'
}

//TODO: find relaible way to find network type , use navigator.connection.type?
const getNetworkType = (connectionType: any): networkTypeMap => {
    const sysNetwork = connectionType.systemNetworkType || 'unknown';
    const localNetwork = connectionType || 'unknown';
    const networkType = !sysNetwork || sysNetwork === 'unknown' ? localNetwork : sysNetwork;
    return networkType in networkTypeMap ? networkTypeMap[networkType] : networkType;
};

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
