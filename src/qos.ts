import { SessionState, Publisher, UserAgent } from 'sip.js';

import type { WebPhoneSession } from './session';
import type { SessionDescriptionHandler } from 'sip.js/lib/platform/web';
import { Events } from './events';

const formatFloat = (input: any): string => parseFloat(input.toString()).toFixed(2);

export const startQosStatsCollection = (session: WebPhoneSession): void => {
  const qosStatsObj = getQoSStatsTemplate();

  qosStatsObj.callID = session.request.callId || '';
  qosStatsObj.fromTag = session.request.fromTag || '';
  qosStatsObj.toTag = session.request.toTag || '';
  qosStatsObj.localID = session.request.getHeader('From')!;
  qosStatsObj.remoteID = session.request.getHeader('To')!;
  qosStatsObj.origID = session.request.getHeader('From')!;

  const refreshIntervalId = setInterval(async () => {
    const sessionDescriptionHandler = session.sessionDescriptionHandler as SessionDescriptionHandler;
    if (!sessionDescriptionHandler?.peerConnection) {
      (session as any).logger.error('There is no PeerConnection, can not getStats');
      return;
    }
    const getStatsResult = await sessionDescriptionHandler.peerConnection.getStats();
    (session as any).logger.log(`getStatsResult ${JSON.stringify(getStatsResult)}`);
    qosStatsObj.status = true;
    let network = '';
    getStatsResult.forEach((item: any) => {
      switch (item.type) {
        case 'local-candidate':
          if (item.candidateType === 'srflx') {
            network = typeof item.networkType === 'string' ? item.networkType : getNetworkType(item.networkType);
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
        case 'inbound-rtp': {
          qosStatsObj.jitterBufferDiscardRate = item.packetsDiscarded / item.packetsReceived;
          qosStatsObj.inboundPacketsLost = item.packetsLost;
          qosStatsObj.inboundPacketsReceived = item.packetsReceived; // packetsReceived
          const jitterBufferMs: number =
            parseFloat(item.jitterBufferEmittedCount) > 0
              ? (parseFloat(item.jitterBufferDelay) / parseFloat(item.jitterBufferEmittedCount)) * 1000
              : 0;
          qosStatsObj.totalSumJitter += jitterBufferMs;
          qosStatsObj.totalIntervalCount += 1;
          qosStatsObj.NLR = formatFloat((item.packetsLost / (item.packetsLost + item.packetsReceived)) * 100);
          qosStatsObj.JBM = Math.max(qosStatsObj.JBM, jitterBufferMs);
          qosStatsObj.netType = addToMap(qosStatsObj.netType, network);
          break;
        }
        case 'candidate-pair':
          qosStatsObj.RTD = Math.round((item.currentRoundTripTime / 2) * 1000);
          break;
        case 'outbound-rtp':
          qosStatsObj.outboundPacketsSent = item.packetsSent;
          break;
        case 'remote-inbound-rtp':
          qosStatsObj.outboundPacketsLost = item.packetsLost;
          break;
        default:
          break;
      }
    });
  }, session.userAgent.qosCollectInterval);

  session.stateChange.addListener((newState) => {
    if (newState === SessionState.Terminated) {
      (session as any).logger.log('Release media streams');
      publishQosStats(session, qosStatsObj);
      refreshIntervalId && clearInterval(refreshIntervalId);
    }
  });
};

const publishQosStats = async (session: WebPhoneSession, qosStatsObj: QosStats, _options: any = {}): Promise<void> => {
  const options = _options || {};

  const targetUrl = options.targetUrl || 'sip:rtcpxr@rtcpxr.ringcentral.com:5060';
  const event = options.event || 'vq-rtcpxr';
  options.expires = 60;
  options.contentType = 'application/vq-rtcpxr';
  options.extraHeaders = (options.extraHeaders || []).concat(session.userAgent.defaultHeaders);
  const cpuOS = session.__qosStats!.cpuOS;
  const cpuRC = session.__qosStats!.cpuRC;
  const ram = session.__qosStats!.ram;
  const networkType = session.__qosStats!.netType || calculateNetworkUsage(qosStatsObj) || '';
  let effectiveType = '';
  if ('connection' in navigator) {
    effectiveType = (navigator as any).connection.effectiveType;
  }
  options.extraHeaders.push(
    `p-rc-client-info:cpuRC=${cpuRC};cpuOS=${cpuOS};netType=${networkType};ram=${ram};effectiveType=${effectiveType}`,
  );
  (session as any).logger.log(`QOS stats ${JSON.stringify(qosStatsObj)}`);
  const calculatedStatsObj = calculateStats(qosStatsObj);
  const body = createPublishBody(calculatedStatsObj);
  const publisher = new Publisher(session.userAgent, UserAgent.makeURI(targetUrl)!, event, options);
  await publisher.publish(body);
  (session as any).logger.log('Local Candidate: ' + JSON.stringify(qosStatsObj.localcandidate));
  (session as any).logger.log('Remote Candidate: ' + JSON.stringify(qosStatsObj.remotecandidate));
  qosStatsObj.status = false;
  await publisher.dispose();
  session.emit!(Events.Session.QOSPublished, body);
};

const calculateNetworkUsage = (qosStatsObj: QosStats): string => {
  const networkType = [];
  for (const [key, value] of Object.entries(qosStatsObj.netType)) {
    networkType.push(key + ':' + formatFloat(((value as any) * 100) / qosStatsObj.totalIntervalCount));
  }
  return networkType.join();
};

const calculateStats = (qosStatsObj: QosStats): QosStats => {
  const rawNLR =
    (qosStatsObj.inboundPacketsLost * 100) / (qosStatsObj.inboundPacketsReceived + qosStatsObj.inboundPacketsLost) || 0;
  const rawJBN = qosStatsObj.totalIntervalCount > 0 ? qosStatsObj.totalSumJitter / qosStatsObj.totalIntervalCount : 0;

  return {
    ...qosStatsObj,
    NLR: formatFloat(rawNLR),
    JBN: formatFloat(rawJBN), // JitterBufferNominal
    JDR: formatFloat(qosStatsObj.jitterBufferDiscardRate), // JitterBufferDiscardRate
    MOSLQ: calculateMos(
      qosStatsObj.inboundPacketsLost / (qosStatsObj.inboundPacketsLost + qosStatsObj.inboundPacketsReceived),
    ),
    MOSCQ: calculateMos(
      qosStatsObj.outboundPacketsLost / (qosStatsObj.outboundPacketsLost + qosStatsObj.outboundPacketsSent),
    ),
  };
};

const createPublishBody = (calculatedStatsObj: QosStats): string => {
  const NLR = calculatedStatsObj.NLR || 0;
  const JBM = calculatedStatsObj.JBM || 0;
  const JBN = calculatedStatsObj.JBN || 0;
  const JDR = calculatedStatsObj.JDR || 0;
  const MOSLQ = calculatedStatsObj.MOSLQ || 0;
  const MOSCQ = calculatedStatsObj.MOSCQ || 0;
  const RTD = calculatedStatsObj.RTD || 0;

  const callID = calculatedStatsObj.callID || '';
  const fromTag = calculatedStatsObj.fromTag || '';
  const toTag = calculatedStatsObj.toTag || '';
  const localId = calculatedStatsObj.localID || '';
  const remoteId = calculatedStatsObj.remoteID || '';

  const localAddr = calculatedStatsObj.localAddr || '';
  const remoteAddr = calculatedStatsObj.remoteAddr || '';

  return (
    'VQSessionReport: CallTerm\r\n' +
    `CallID: ${callID}\r\n` +
    `LocalID: ${localId}\r\n` +
    `RemoteID: ${remoteId}\r\n` +
    `OrigID: ${localId}\r\n` +
    `LocalAddr: IP=${localAddr} SSRC=0x00000000\r\n` +
    `RemoteAddr: IP=${remoteAddr} SSRC=0x00000000\r\n` +
    'LocalMetrics:\r\n' +
    'Timestamps: START=0 STOP=0\r\n' +
    'SessionDesc: PT=0 PD=opus SR=0 FD=0 FPP=0 PPS=0 PLC=0 SSUP=on\r\n' +
    `JitterBuffer: JBA=0 JBR=0 JBN=${JBN} JBM=${formatFloat(JBM)} JBX=0\r\n` +
    `PacketLoss: NLR=${NLR} JDR=${JDR}\r\n` +
    'BurstGapLoss: BLD=0 BD=0 GLD=0 GD=0 GMIN=0\r\n' +
    `Delay: RTD=${RTD} ESD=0 SOWD=0 IAJ=0\r\n` +
    `QualityEst: MOSLQ=${formatFloat(MOSLQ)} MOSCQ=${formatFloat(MOSCQ)}\r\n` +
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
    stop: '',
  },

  netType: {},

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
  MOSCQ: 0,
  RTD: 0,

  status: false,
  localcandidate: {},
  remotecandidate: {},

  inboundPacketsLost: 0,
  inboundPacketsReceived: 0,
  outboundPacketsLost: 0,
  outboundPacketsSent: 0,
});

const addToMap = (map: any = {}, key: string): any => ({
  ...map,
  [key]: (key in map ? parseInt(map[key], 10) : 0) + 1,
});

const networkTypeMap: { [key: string]: string } = {
  bluetooth: 'Bluetooth',
  cellular: 'Cellulars',
  ethernet: 'Ethernet',
  wifi: 'WiFi',
  vpn: 'VPN',
  wimax: 'WiMax',
  '2g': '2G',
  '3g': '3G',
  '4g': '4G',
};

// TODO: find reliable way to find network type , use navigator.connection.type?
const getNetworkType = (connectionType: any): string => {
  const sysNetwork: string = connectionType.systemNetworkType || 'unknown';
  const localNetwork: string = connectionType || 'unknown';
  const networkType: string = !sysNetwork || sysNetwork === 'unknown' ? localNetwork : sysNetwork;
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
  MOSCQ: number;
  RTD: number;

  status: boolean;

  localcandidate: any;
  remotecandidate: any;

  inboundPacketsLost: number;
  inboundPacketsReceived: number;
  outboundPacketsLost: number;
  outboundPacketsSent: number;
}

function calculateMos(packetLoss: number) {
  if (packetLoss <= 0.008) {
    return 4.5;
  }
  if (packetLoss > 0.45) {
    return 1.0;
  }
  const bpl = 17.2647;
  const r = 93.2062077233 - 95.0 * ((packetLoss * 100) / (packetLoss * 100 + bpl)) + 4;
  let mos = 2.06405 + 0.031738 * r - 0.000356641 * r * r + 2.93143 * Math.pow(10, -6) * r * r * r;
  if (mos < 1) {
    return 1.0;
  }
  if (mos > 4.5) {
    return 4.5;
  }
  if (packetLoss >= 0.35 && mos > 2.7) {
    mos = 2.7;
  } else if (packetLoss >= 0.3 && mos > 3.0) {
    mos = 3.0;
  } else if (packetLoss >= 0.2 && mos > 3.6) {
    mos = 3.6;
  } else if (packetLoss >= 0.15 && mos > 3.7) {
    mos = 3.7;
  } else if (packetLoss >= 0.1 && mos > 3.9) {
    mos = 4.1;
  } else if (packetLoss >= 0.05 && mos > 4.1) {
    mos = 4.3;
  } else if (packetLoss >= 0.03 && mos > 4.1) {
    mos = 4.4;
  }
  return mos;
}
