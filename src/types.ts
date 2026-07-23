import type EventEmitter from "./event-emitter.js";
import type InboundMessage from "./sip-message/inbound.js";
import type RequestMessage from "./sip-message/outbound/request.js";
import type ResponseMessage from "./sip-message/outbound/response.js";

export interface SipClientOptions {
  sipInfo: SipInfo;
  instanceId?: string; // ref: https://docs.oracle.com/cd/E95618_01/html/sbc_scz810_acliconfiguration/GUID-B2A15693-DA4A-4E24-86D4-58B19435F4DA.htm
  debug?: boolean;
}

export interface WebRtcSession {
  createOffer(options?: { iceRestart?: boolean }): Promise<string>;
  createAnswer(offer: string): Promise<string>;
  applyAnswer(answer: string): Promise<void>;
  changeInputDevice(deviceId: string): Promise<void>;
  changeOutputDevice(deviceId: string): Promise<void>;
  setMuted(muted: boolean): void;
  sendDtmf(tones: string, duration?: number, interToneGap?: number): void;
  dispose(): void;
}

export type WebRtcSessionFactory = (context: {
  callId: string;
  direction: "inbound" | "outbound";
  stunServers: string[];
}) => WebRtcSession;

export type WebPhoneOptions = SipClientOptions & {
  sipClient?: SipClient;
  deviceManager?: DeviceManager;
  autoAnswer?: boolean;
  webRtcSessionFactory?: WebRtcSessionFactory;
};

export interface SipInfo {
  authorizationId: string;
  domain: string;
  outboundProxy: string;
  outboundProxyBackup: string;
  username: string;
  password: string;
  stunServers: string[];
}

export type SipClient = EventEmitter & {
  start: () => Promise<void>;
  request: (message: RequestMessage) => Promise<InboundMessage>;
  reply: (message: ResponseMessage) => Promise<void>;
  dispose: () => Promise<void>;
};

export interface DeviceManager {
  getInputDeviceId: () => Promise<string>;
  getOutputDeviceId: () => Promise<string | undefined>; // firefox doesn't support output device selection
}
