import EventEmitter from "../event-emitter.js";
import type WebPhone from "../index.js";
import type InboundMessage from "../sip-message/inbound.js";
import RequestMessage from "../sip-message/outbound/request.js";
import ResponseMessage from "../sip-message/outbound/response.js";
import type { WebRtcSession } from "../types.js";
import {
  branch,
  extractAddress,
  extractNumber,
  extractTag,
  fakeDomain,
  uuid,
} from "../utils.js";
import type OutboundCallSession from "./outbound.js";

interface CommandResult {
  code: number;
  description: string;
}
type ParkResult = CommandResult & {
  "park extension": string;
};
type FlipResult = CommandResult & {
  number: string;
  target: string;
};
const DEFAULT_TRANSFER_TIMEOUT_MS = 10000;

interface LocalIceGeneration {
  active: boolean;
  ended: boolean;
  ready: boolean;
  sdp: string;
  candidates: Array<RTCIceCandidate | null>;
  listener: (event: RTCPeerConnectionIceEvent) => void;
}

interface RemoteIceFragment {
  iceUfrag: string;
  icePwd: string;
  media: string;
  mid: string;
  candidate: string | null;
}

interface RemoteIceGeneration {
  active: boolean;
  applying: boolean;
  ready: boolean;
  sdp?: string;
  candidates: RemoteIceFragment[];
}

class CallSession extends EventEmitter {
  public webPhone: WebPhone;
  public sipMessage!: InboundMessage;
  public localPeer!: string;
  public remotePeer!: string;
  public rtcPeerConnection!: RTCPeerConnection;
  public _mediaStream?: MediaStream;
  public audioElement!: HTMLAudioElement;
  public state: "init" | "ringing" | "answered" | "disposed" | "failed" =
    "init";
  public direction!: "inbound" | "outbound";
  public inputDeviceId!: string;
  public outputDeviceId: string | undefined;

  private reqid = 1;
  private sdpVersion = 1;
  private webRtcSession?: WebRtcSession;
  private baseLocalSdp?: string;
  private localIceGeneration?: LocalIceGeneration;
  private localIceSending = false;
  private remoteIceGeneration?: RemoteIceGeneration;

  public constructor(webPhone: WebPhone) {
    super();
    this.webPhone = webPhone;
    this.on("inboundMessage", (message: InboundMessage) => {
      if (
        message.subject.startsWith("INFO sip:") &&
        message.getHeader("Info-Package")?.toLowerCase() === "trickle-ice" &&
        message
          .getHeader("Content-Type")
          ?.split(";", 1)[0]
          .trim()
          .toLowerCase() === "application/trickle-ice-sdpfrag"
      ) {
        queueMicrotask(() => this.receiveRemoteIceCandidate(message.body));
      }
    });
  }

  private requireWebRtcSession() {
    if (!this.webRtcSession)
      throw new Error("WebRTC session is not initialized");
    return this.webRtcSession;
  }

  public get mediaStream(): MediaStream | undefined {
    return this._mediaStream;
  }
  public set mediaStream(stream: MediaStream) {
    this._mediaStream = stream;
    this.emit("mediaStreamSet", stream);
  }

  // for inbound call, this.sipMessage?.headers["Call-Id"] will be the call id
  // for outbound call, this._callId will be the call id. Once the call session is out of "init" state, this.sipMessage will be set
  private _callId = uuid();
  public get callId() {
    return this.sipMessage?.getHeader("Call-Id") ?? this._callId;
  }

  public get sessionId() {
    return this.sipMessage
      ?.getHeader("p-rc-api-ids")
      ?.match(/session-id=(s-[0-9a-fz]+?)$/)?.[1];
  }

  public get partyId() {
    return this.sipMessage
      ?.getHeader("p-rc-api-ids")
      ?.match(/party-id=(p-[0-9a-fz]+?-\d);/)?.[1];
  }

  public get remoteNumber(): string {
    return extractNumber(this.remotePeer);
  }

  public get localNumber(): string {
    return this.localPeer
      ? extractNumber(this.localPeer)
      : this.webPhone.sipInfo.username;
  }

  public get remoteTag() {
    return extractTag(this.remotePeer);
  }

  public get localTag() {
    return extractTag(this.localPeer);
  }

  public get isConference() {
    return this.remotePeer
      ? extractNumber(this.remotePeer).startsWith("conf_")
      : false;
  }

  public async init() {
    const factory = this.webPhone.options.webRtcSessionFactory;
    if (factory) {
      this.webRtcSession ??= factory({
        callId: this.callId,
        direction: this.direction,
        stunServers: this.webPhone.sipInfo.stunServers,
      });
      return;
    }

    this.rtcPeerConnection = new RTCPeerConnection({
      iceServers:
        this.webPhone.sipInfo.stunServers?.map((url) => ({
          urls: `stun:${url}`,
        })) ?? [],
    });

    // line below is to make sure that you have the permission to access the microphone
    const tempStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    for (const track of tempStream.getTracks()) track.stop(); // 🔥 Stop immediately!

    this.inputDeviceId = await this.webPhone.deviceManager.getInputDeviceId();
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { deviceId: { exact: this.inputDeviceId } },
    });
    this.mediaStream.getAudioTracks().forEach((track) => {
      const rtcRtpSender = this.rtcPeerConnection.addTrack(track);

      // ref: https://github.com/ringcentral/ringcentral-web-phone/issues/257
      const params = rtcRtpSender.getParameters();
      if (!params.encodings || params.encodings.length === 0) {
        params.encodings = [{}];
      }
      params.encodings.forEach((encoding) => {
        encoding.priority = "high";
      });
      rtcRtpSender.setParameters(params);
    });
    this.rtcPeerConnection.ontrack = async (event) => {
      const remoteStream = event.streams[0];
      this.audioElement = document.createElement("audio") as HTMLAudioElement;
      this.audioElement.hidden = true;
      this.audioElement.autoplay = true;
      this.audioElement.srcObject = remoteStream;

      // this code should be run last
      this.outputDeviceId =
        await this.webPhone.deviceManager.getOutputDeviceId();
      if (this.outputDeviceId) {
        this.audioElement.setSinkId(this.outputDeviceId);
      }
    };
  }

  public async changeInputDevice(deviceId: string) {
    if (this.webPhone.options.webRtcSessionFactory) {
      return await this.requireWebRtcSession().changeInputDevice(deviceId);
    }
    this.inputDeviceId = deviceId;
    for (const track of this.mediaStream?.getAudioTracks() ?? []) track.stop();
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { deviceId: { exact: deviceId } },
    });
    const newAudioTrack = this.mediaStream.getAudioTracks()[0];
    const sender = this.rtcPeerConnection
      .getSenders()
      .find((sender) => sender.track?.kind === "audio");
    if (sender) {
      sender.replaceTrack(newAudioTrack);
    }
  }

  public async changeOutputDevice(deviceId: string) {
    if (this.webPhone.options.webRtcSessionFactory) {
      return await this.requireWebRtcSession().changeOutputDevice(deviceId);
    }
    this.outputDeviceId = deviceId;
    if (deviceId) {
      await this.audioElement.setSinkId(deviceId);
    }
  }

  public async transfer(target: string, timeout = DEFAULT_TRANSFER_TIMEOUT_MS) {
    return await this._transfer(`sip:${target}@sip.ringcentral.com`, timeout);
  }

  public async warmTransfer(
    target: string,
    options?: { callerId?: string; timeout?: number },
  ): Promise<{
    complete: () => Promise<void>;
    cancel: () => Promise<void>;
    newSession: OutboundCallSession;
  }> {
    await this.hold();
    // create a new session and user needs to talk to the target before transfer
    const newSession = await this.webPhone.call(target, options?.callerId);
    return {
      // complete the transfer
      complete: async () => {
        await this.completeWarmTransfer(
          newSession,
          options?.timeout ?? DEFAULT_TRANSFER_TIMEOUT_MS,
        );
      },
      // cancel the transfer
      cancel: async () => {
        await newSession.hangup();
        await this.unhold();
      },
      newSession,
    };
  }

  public async completeWarmTransfer(
    existingSession: CallSession,
    timeout = DEFAULT_TRANSFER_TIMEOUT_MS,
  ) {
    const target = existingSession.remoteNumber;
    await this._transfer(
      `"${target}@sip.ringcentral.com" <sip:${target}@sip.ringcentral.com;transport=wss?Replaces=${existingSession.callId}%3Bto-tag%3D${existingSession.remoteTag}%3Bfrom-tag%3D${existingSession.localTag}>`,
      timeout,
    );
  }

  public async hangup() {
    const requestMessage = new RequestMessage(
      `BYE sip:${this.webPhone.sipInfo.domain} SIP/2.0`,
      {
        "Call-Id": this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
      },
    );
    await this.webPhone.sipClient.request(requestMessage);
  }

  public async startRecording(): Promise<CommandResult> {
    return await this.sendJsonMessage("startcallrecord");
  }

  public async stopRecording(): Promise<CommandResult> {
    return await this.sendJsonMessage("stopcallrecord");
  }

  public async flip(target: string): Promise<FlipResult> {
    const flipResult = await this.sendJsonMessage<FlipResult>("callflip", {
      target,
    });
    // note: we can't dispose the call session here
    // otherwise the caller will not be able to talk to the flip target
    // after the flip target answers the call, manually dispose the call session
    // todo: review this part
    return flipResult;
  }

  public async park(): Promise<ParkResult> {
    const parkResult = await this.sendJsonMessage<ParkResult>("callpark");
    if (parkResult.code === 0) {
      await this.hangup();
    }
    return parkResult;
  }

  public async hold() {
    await this.toggleReceive(false);
  }
  public async unhold() {
    await this.toggleReceive(true);
  }

  public mute() {
    this.toggleTrack(false);
  }
  public unmute() {
    this.toggleTrack(true);
  }

  public sendDtmf(tones: string, duration?: number, interToneGap?: number) {
    if (this.webPhone.options.webRtcSessionFactory) {
      this.requireWebRtcSession().sendDtmf(tones, duration, interToneGap);
      return;
    }
    for (const sender of this.rtcPeerConnection.getSenders()) {
      if (sender.dtmf?.canInsertDTMF) {
        sender.dtmf?.insertDTMF(tones, duration, interToneGap);
      }
    }
  }

  public dispose() {
    this.stopLocalIceGeneration();
    this.stopRemoteIceGeneration();
    if (this.webPhone.options.webRtcSessionFactory) {
      this.webRtcSession?.dispose();
    } else {
      this.rtcPeerConnection?.close();
      for (const track of this.mediaStream?.getTracks() ?? []) track.stop();
      if (this.audioElement) {
        this.audioElement.srcObject = null;
      }
    }
    this.state = "disposed";
    this.emit("disposed");
    this.removeAllListeners();
  }

  // for mute/unmute
  protected toggleTrack(enabled: boolean) {
    if (this.webPhone.options.webRtcSessionFactory) {
      this.requireWebRtcSession().setMuted(!enabled);
      return;
    }
    this.rtcPeerConnection.getSenders().forEach((sender) => {
      if (sender.track) {
        sender.track.enabled = enabled;
      }
    });
  }

  protected async createOffer() {
    if (this.webPhone.options.webRtcSessionFactory) {
      this.baseLocalSdp = await this.requireWebRtcSession().createOffer({
        iceRestart: true,
      });
      return this.baseLocalSdp;
    }
    const generation = this.beginRemoteIceGeneration();
    try {
      const offer = await this.rtcPeerConnection.createOffer({
        iceRestart: true,
      });
      return await this.setLocalDescriptionForTrickleIce(offer);
    } catch (error) {
      this.deactivateRemoteIceGeneration(generation);
      throw error;
    }
  }

  protected async createAnswer(offer: string) {
    if (this.webPhone.options.webRtcSessionFactory) {
      this.baseLocalSdp = await this.requireWebRtcSession().createAnswer(offer);
      return this.baseLocalSdp;
    }
    const generation =
      this.remoteIceGeneration?.active && this.remoteIceGeneration.sdp === offer
        ? this.remoteIceGeneration
        : this.beginRemoteIceGeneration(offer);
    try {
      await this.rtcPeerConnection.setRemoteDescription({
        type: "offer",
        sdp: offer,
      });
      this.setRemoteIceDescription(generation, offer);
      const answer = await this.rtcPeerConnection.createAnswer();
      return await this.setLocalDescriptionForTrickleIce(answer);
    } catch (error) {
      this.deactivateRemoteIceGeneration(generation);
      throw error;
    }
  }

  protected async applyAnswer(answer: string) {
    if (this.webPhone.options.webRtcSessionFactory) {
      return this.requireWebRtcSession().applyAnswer(answer);
    }
    const generation = this.remoteIceGeneration;
    await this.rtcPeerConnection.setRemoteDescription({
      type: "answer",
      sdp: answer,
    });
    if (generation) this.setRemoteIceDescription(generation, answer);
  }

  // send re-INVITE.
  // If the call is on hold and you don't want to unhold it, set toReceive to false
  public async reInvite(toReceive: boolean = true) {
    let sdp = await this.createOffer();
    // default value is `a=sendrecv`
    if (!toReceive) {
      sdp = sdp.replace(/a=sendrecv/g, "a=sendonly");
    }
    const requestMessage = new RequestMessage(
      `INVITE ${extractAddress(this.remotePeer)} SIP/2.0`,
      {
        "Call-Id": this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
        "Content-Type": "application/sdp",
        ...this.trickleIceHeaders,
      },
      sdp,
    );
    const replyMessage = await this.webPhone.sipClient.request(requestMessage);
    this.startLocalIceCandidateSending();
    await this.applyAnswer(replyMessage.body);
    const ackMessage = new RequestMessage(
      `ACK ${extractAddress(this.remotePeer)} SIP/2.0`,
      {
        "Call-Id": this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: replyMessage.headers.Via,
        CSeq: replyMessage.headers.CSeq.replace(" INVITE", " ACK"),
      },
    );
    await this.webPhone.sipClient.reply(ackMessage);
  }

  // handle re-INVITE from SIP server
  public async handleReInvite(reInviteMessage: InboundMessage) {
    this.sipMessage = reInviteMessage;
    const sdp = await this.createAnswer(reInviteMessage.body);

    const newMessage = new ResponseMessage(this.sipMessage, {
      responseCode: 200,
      headers: {
        "Content-Type": "application/sdp",
        ...this.trickleIceHeaders,
      },
      body: sdp,
    });
    await this.webPhone.sipClient.reply(newMessage);
    this.startLocalIceCandidateSending();

    // note: no need to wait for the final SIP message (refer to inbound call answer function)
    // because nobody is supposed to proactively invoke this function.
  }

  // for hold/unhold
  // toggle between a=sendrecv and a=sendonly
  protected async toggleReceive(toReceive: boolean) {
    let sdp = this.webPhone.options.webRtcSessionFactory
      ? this.baseLocalSdp
      : this.rtcPeerConnection?.localDescription?.sdp;
    if (sdp === undefined) return;
    // default value is `a=sendrecv`
    if (!toReceive) {
      sdp = sdp.replace(/a=sendrecv/g, "a=sendonly");
    }
    // increase the sdp version
    const origin = sdp.match(/^(o=\S+ \d+) (\d+)/m);
    if (!origin) throw new Error("Invalid SDP origin");
    this.sdpVersion = Math.max(this.sdpVersion, Number(origin[2]) + 1);
    sdp = sdp.replace(origin[0], `${origin[1]} ${this.sdpVersion++}`);
    const requestMessage = new RequestMessage(
      `INVITE ${extractAddress(this.remotePeer)} SIP/2.0`,
      {
        "Call-Id": this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
        "Content-Type": "application/sdp",
        ...this.trickleIceHeaders,
      },
      sdp,
    );
    const replyMessage = await this.webPhone.sipClient.request(requestMessage);
    const ackMessage = new RequestMessage(
      `ACK ${extractAddress(this.remotePeer)} SIP/2.0`,
      {
        "Call-Id": this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: replyMessage.headers.Via,
        CSeq: replyMessage.headers.CSeq.replace(" INVITE", " ACK"),
      },
    );
    await this.webPhone.sipClient.reply(ackMessage);
  }

  protected get trickleIceHeaders(): Record<string, string> {
    return this.webPhone.options.webRtcSessionFactory
      ? {}
      : { Supported: "trickle-ice" };
  }

  protected addTrickleIceSupport(headers: Record<string, string>) {
    if (this.webPhone.options.webRtcSessionFactory) return;
    const key = Object.keys(headers).find(
      (header) => header.toLowerCase() === "supported",
    );
    if (!key) {
      headers.Supported = "trickle-ice";
    } else if (
      !headers[key]
        .split(",")
        .some((token) => token.trim().toLowerCase() === "trickle-ice")
    ) {
      headers[key] += ", trickle-ice";
    }
  }

  protected startLocalIceCandidateSending() {
    if (!this.localIceGeneration) return;
    this.localIceGeneration.ready = true;
    void this.sendLocalIceCandidates(this.localIceGeneration);
  }

  private beginLocalIceGeneration(sdp: string) {
    this.stopLocalIceGeneration();
    const generation: LocalIceGeneration = {
      active: true,
      ended: false,
      ready: false,
      sdp,
      candidates: [],
      listener: (event) => {
        if (!generation.active || generation.ended) return;
        generation.candidates.push(event.candidate);
        generation.ended = event.candidate === null;
        void this.sendLocalIceCandidates(generation);
      },
    };
    this.localIceGeneration = generation;
    this.rtcPeerConnection.addEventListener(
      "icecandidate",
      generation.listener,
    );
    return generation;
  }

  private async setLocalDescriptionForTrickleIce(
    description: RTCSessionDescriptionInit,
  ) {
    if (!description.sdp) throw new Error("Local description is missing SDP");
    const generation = this.beginLocalIceGeneration(description.sdp);
    try {
      await this.rtcPeerConnection.setLocalDescription(description);
      const localSdp = this.rtcPeerConnection.localDescription?.sdp;
      if (!localSdp) throw new Error("Local description is missing SDP");
      generation.sdp = localSdp;
      generation.candidates = generation.candidates.filter(
        (candidate) =>
          candidate === null ||
          !generation.sdp.includes(`a=${candidate.candidate}`),
      );
      return generation.sdp;
    } catch (error) {
      this.deactivateLocalIceGeneration(generation);
      throw error;
    }
  }

  private stopLocalIceGeneration() {
    const generation = this.localIceGeneration;
    if (!generation) return;
    this.deactivateLocalIceGeneration(generation);
  }

  private deactivateLocalIceGeneration(generation: LocalIceGeneration) {
    generation.active = false;
    generation.candidates.length = 0;
    this.rtcPeerConnection?.removeEventListener(
      "icecandidate",
      generation.listener,
    );
    if (this.localIceGeneration === generation) {
      this.localIceGeneration = undefined;
    }
  }

  private async sendLocalIceCandidates(generation: LocalIceGeneration) {
    if (!generation.active || !generation.ready || this.localIceSending) return;
    this.localIceSending = true;
    try {
      while (
        generation.active &&
        generation === this.localIceGeneration &&
        generation.candidates.length > 0
      ) {
        const candidate = generation.candidates.shift();
        if (candidate === undefined) break;
        const response = await this.webPhone.sipClient.request(
          new RequestMessage(
            `INFO sip:${this.webPhone.sipInfo.domain} SIP/2.0`,
            {
              "Call-Id": this.callId,
              From: this.localPeer,
              To: this.remotePeer,
              Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
              "Info-Package": "trickle-ice",
              "Content-Type": "application/trickle-ice-sdpfrag",
              "Content-Disposition": "Info-Package",
            },
            this.createLocalIceFragment(generation.sdp, candidate),
          ),
        );
        if (!/^SIP\/2\.0 2\d\d /.test(response.subject)) {
          this.deactivateLocalIceGeneration(generation);
        }
      }
    } catch {
      this.deactivateLocalIceGeneration(generation);
    } finally {
      this.localIceSending = false;
      if (this.localIceGeneration !== generation && this.localIceGeneration) {
        void this.sendLocalIceCandidates(this.localIceGeneration);
      }
    }
  }

  private createLocalIceFragment(
    sdp: string,
    candidate: RTCIceCandidate | null,
  ) {
    const lines = sdp.trim().split(/\r?\n/);
    const mediaIndexes = lines.flatMap((line, index) =>
      line.startsWith("m=") ? [index] : [],
    );
    const mediaIndex =
      candidate?.sdpMid === null || candidate?.sdpMid === undefined
        ? mediaIndexes[candidate?.sdpMLineIndex ?? 0]
        : lines.indexOf(`a=mid:${candidate.sdpMid}`);
    const sectionStart = lines.findLastIndex(
      (line, index) => index <= mediaIndex && line.startsWith("m="),
    );
    const sectionEnd =
      mediaIndexes.find((index) => index > sectionStart) ?? lines.length;
    const section = lines.slice(sectionStart, sectionEnd);
    const session = lines.slice(0, mediaIndexes[0]);
    const findAttribute = (prefix: string) =>
      section.find((line) => line.startsWith(prefix)) ??
      session.find((line) => line.startsWith(prefix));
    const iceUfrag = findAttribute("a=ice-ufrag:");
    const icePwd = findAttribute("a=ice-pwd:");
    const mid = section.find((line) => line.startsWith("a=mid:"));
    if (!iceUfrag || !icePwd || sectionStart === -1 || !mid) {
      throw new Error("Local SDP is missing Trickle ICE fragment fields");
    }
    return [
      iceUfrag,
      icePwd,
      lines[sectionStart],
      mid,
      candidate ? `a=${candidate.candidate}` : "a=end-of-candidates",
    ].join("\r\n");
  }

  private beginRemoteIceGeneration(sdp?: string) {
    this.stopRemoteIceGeneration();
    const generation: RemoteIceGeneration = {
      active: true,
      applying: false,
      ready: false,
      sdp,
      candidates: [],
    };
    this.remoteIceGeneration = generation;
    return generation;
  }

  private stopRemoteIceGeneration() {
    if (this.remoteIceGeneration) {
      this.deactivateRemoteIceGeneration(this.remoteIceGeneration);
    }
  }

  private deactivateRemoteIceGeneration(generation: RemoteIceGeneration) {
    generation.active = false;
    generation.candidates.length = 0;
    if (this.remoteIceGeneration === generation) {
      this.remoteIceGeneration = undefined;
    }
  }

  private setRemoteIceDescription(
    generation: RemoteIceGeneration,
    sdp: string,
  ) {
    if (!generation.active || generation !== this.remoteIceGeneration) return;
    generation.sdp = sdp;
    generation.ready = true;
    void this.applyRemoteIceCandidates(generation);
  }

  private receiveRemoteIceCandidate(body: string) {
    if (this.state === "disposed") return;
    const generation =
      this.remoteIceGeneration ??
      (!this.webPhone.options.webRtcSessionFactory &&
      this.direction === "inbound" &&
      this.sipMessage.body
        ? this.beginRemoteIceGeneration(this.sipMessage.body)
        : undefined);
    const candidate = this.parseRemoteIceFragment(body);
    if (!generation?.active || !candidate) return;
    generation.candidates.push(candidate);
    void this.applyRemoteIceCandidates(generation);
  }

  private parseRemoteIceFragment(body: string): RemoteIceFragment | undefined {
    const lines = body.trim().split(/\r?\n/);
    const readUniqueValue = (prefix: string) => {
      const matches = lines.filter((line) => line.startsWith(prefix));
      return matches.length === 1 ? matches[0].slice(prefix.length) : undefined;
    };
    const iceUfrag = readUniqueValue("a=ice-ufrag:");
    const icePwd = readUniqueValue("a=ice-pwd:");
    const media = readUniqueValue("m=");
    const mid = readUniqueValue("a=mid:");
    const candidates = lines.filter((line) => line.startsWith("a=candidate:"));
    const endMarkerCount = lines.filter(
      (line) => line === "a=end-of-candidates",
    ).length;
    if (
      !iceUfrag ||
      !icePwd ||
      !media ||
      !mid ||
      candidates.length + endMarkerCount !== 1
    ) {
      return;
    }
    return {
      iceUfrag,
      icePwd,
      media: `m=${media}`,
      mid,
      candidate: candidates[0]?.slice(2) ?? null,
    };
  }

  private async applyRemoteIceCandidates(generation: RemoteIceGeneration) {
    if (
      !generation.active ||
      !generation.ready ||
      !generation.sdp ||
      generation.applying
    )
      return;
    generation.applying = true;
    try {
      while (
        generation.active &&
        generation === this.remoteIceGeneration &&
        generation.candidates.length > 0
      ) {
        const fragment = generation.candidates.shift();
        if (!fragment) break;
        const candidate = this.matchRemoteIceCandidate(
          generation.sdp,
          fragment,
        );
        if (candidate === undefined) continue;
        try {
          await this.rtcPeerConnection.addIceCandidate(candidate);
        } catch {}
      }
    } finally {
      generation.applying = false;
    }
  }

  private matchRemoteIceCandidate(
    sdp: string,
    fragment: RemoteIceFragment,
  ): RTCIceCandidateInit | null | undefined {
    const lines = sdp.trim().split(/\r?\n/);
    const mediaIndexes = lines.flatMap((line, index) =>
      line.startsWith("m=") ? [index] : [],
    );
    const mediaIndex = mediaIndexes.findIndex((start, index) => {
      const section = lines.slice(start, mediaIndexes[index + 1]);
      return (
        section[0]?.split(/\s+/, 1)[0] === fragment.media.split(/\s+/, 1)[0] &&
        section.includes(`a=mid:${fragment.mid}`)
      );
    });
    if (mediaIndex === -1) return;
    const start = mediaIndexes[mediaIndex];
    const section = lines.slice(start, mediaIndexes[mediaIndex + 1]);
    const session = lines.slice(0, mediaIndexes[0]);
    const attribute = (prefix: string) =>
      section.find((line) => line.startsWith(prefix)) ??
      session.find((line) => line.startsWith(prefix));
    if (
      attribute("a=ice-ufrag:") !== `a=ice-ufrag:${fragment.iceUfrag}` ||
      attribute("a=ice-pwd:") !== `a=ice-pwd:${fragment.icePwd}`
    ) {
      return;
    }
    return fragment.candidate
      ? {
          candidate: fragment.candidate,
          sdpMid: fragment.mid,
          sdpMLineIndex: mediaIndex,
          usernameFragment: fragment.iceUfrag,
        }
      : null;
  }

  protected async sendJsonMessage<T>(
    command: "callpark" | "callflip" | "startcallrecord" | "stopcallrecord",
    args: { [key: string]: string } = {},
  ) {
    const reqid = this.reqid++;
    const jsonBody = JSON.stringify({ request: { reqid, command, ...args } });
    const requestMessage = new RequestMessage(
      `INFO sip:${this.webPhone.sipInfo.domain} SIP/2.0`,
      {
        "Call-Id": this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
        "Content-Type": "application/json;charset=utf-8",
      },
      jsonBody,
    );
    let resolveResult!: (result: T) => void;
    const resultReply = new Promise<T>((resolve) => {
      resolveResult = resolve;
    });
    // register the completion listener before sending the request,
    // otherwise an early command result could be missed
    const resultHandler = (inboundMessage: InboundMessage) => {
      if (!inboundMessage.subject.startsWith("INFO sip:")) {
        return;
      }
      const response = JSON.parse(inboundMessage.body).response;
      if (
        !response ||
        response.reqid !== reqid ||
        response.command !== command
      ) {
        return;
      }
      this.off("inboundMessage", resultHandler);
      resolveResult(response.result);
    };
    this.on("inboundMessage", resultHandler);
    try {
      await this.webPhone.sipClient.request(requestMessage);
      return await resultReply;
    } catch (error) {
      this.off("inboundMessage", resultHandler);
      throw error;
    }
  }

  protected async _transfer(
    uri: string,
    timeout = DEFAULT_TRANSFER_TIMEOUT_MS,
  ) {
    const requestMessage = new RequestMessage(
      `REFER ${extractAddress(this.remotePeer)} SIP/2.0`,
      {
        "Call-Id": this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
        "Refer-To": uri,
        "Referred-By": `<${extractAddress(this.localPeer)}>`,
      },
    );
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let settled = false;
    let resolveTransfer!: () => void;
    let rejectTransfer!: (error: Error) => void;
    const transferCompleted = new Promise<void>((resolve, reject) => {
      resolveTransfer = resolve;
      rejectTransfer = reject;
    });
    // register the completion listener before sending the request,
    // otherwise an early BYE could be missed
    const handler = (inboundMessage: InboundMessage) => {
      if (inboundMessage.subject.startsWith("BYE sip:")) {
        settled = true;
        clearTimeout(timeoutId);
        this.off("inboundMessage", handler);
        resolveTransfer();
      }
    };
    this.on("inboundMessage", handler);
    try {
      await this.webPhone.sipClient.request(requestMessage);
      // wait for the final SIP message
      if (!settled) {
        timeoutId = setTimeout(() => {
          this.off("inboundMessage", handler);
          rejectTransfer(
            new Error(
              `"REFER ${extractAddress(
                this.remotePeer,
              )} SIP/2.0" request timed out. It often means either you don't have permission or the call is not in a correct state.`,
            ),
          );
        }, timeout);
      }
      return await transferCompleted;
    } catch (error) {
      clearTimeout(timeoutId);
      this.off("inboundMessage", handler);
      throw error;
    }
  }
}

export default CallSession;
