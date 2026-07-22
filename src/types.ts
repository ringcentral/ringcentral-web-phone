import type EventEmitter from "./event-emitter.js";
import type InboundMessage from "./sip-message/inbound.js";
import type RequestMessage from "./sip-message/outbound/request.js";
import type ResponseMessage from "./sip-message/outbound/response.js";

export interface DefaultMediaObjects {
  rtcPeerConnection: RTCPeerConnection;
  mediaStream?: MediaStream;
  audioElement: HTMLAudioElement;
  inputDeviceId: string;
  outputDeviceId?: string;
}

export interface MediaProviderContext {
  callId: string;
  direction: "inbound" | "outbound";
  iceServers: string[];
  deviceManager: DeviceManager;
  onMediaStream?: (stream: MediaStream) => void;
}

export interface MediaSession<M extends object> {
  media: M;
  createOffer: (options?: { iceRestart?: boolean }) => Promise<string>;
  answerOffer: (sdp: string) => Promise<string>;
  applyAnswer: (sdp: string) => Promise<void>;
  changeInputDevice: (deviceId: string) => Promise<void>;
  changeOutputDevice: (deviceId: string) => Promise<void>;
  setMuted: (muted: boolean) => Promise<void>;
  sendDtmf: (
    tones: string,
    duration?: number,
    interToneGap?: number,
  ) => Promise<void>;
  // The SDK does not await provider cleanup. Remote providers own completion,
  // timeout, and retry behavior after disposal is requested.
  dispose: () => Promise<void>;
}

export interface MediaProvider<M extends object = DefaultMediaObjects> {
  create: (context: MediaProviderContext) => Promise<MediaSession<M>>;
}

export interface SipClientOptions {
  sipInfo: SipInfo;
  instanceId?: string; // ref: https://docs.oracle.com/cd/E95618_01/html/sbc_scz810_acliconfiguration/GUID-B2A15693-DA4A-4E24-86D4-58B19435F4DA.htm
  debug?: boolean;
}

type CommonWebPhoneOptions = {
  sipClient?: SipClient;
  deviceManager?: DeviceManager;
  autoAnswer?: boolean;
};

type IsDefaultMedia<M extends object> = [M] extends [DefaultMediaObjects]
  ? [DefaultMediaObjects] extends [M]
    ? true
    : false
  : false;

type MediaProviderOption<M extends object> =
  IsDefaultMedia<M> extends true
    ? { mediaProvider?: MediaProvider<DefaultMediaObjects> }
    : { mediaProvider: MediaProvider<M> };

export type WebPhoneOptions<M extends object = DefaultMediaObjects> =
  SipClientOptions & CommonWebPhoneOptions & MediaProviderOption<M>;

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
