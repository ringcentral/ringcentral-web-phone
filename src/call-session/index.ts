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
  ready: boolean;
  sending: Promise<void>;
  sdp?: string;
  candidates: Array<RTCIceCandidateInit | null>;
  listener?: (event: RTCPeerConnectionIceEvent) => void;
  fragmentPrefix?: string;
}

interface RemoteIceCandidate {
  candidate: RTCIceCandidateInit | null;
  usernameFragment: string;
}

interface RemoteIceGeneration {
  ready: boolean;
  applying: Promise<void>;
  sdp: string;
  candidates: RemoteIceCandidate[];
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
  private remoteIceGeneration?: RemoteIceGeneration;

  public constructor(webPhone: WebPhone) {
    super();
    this.webPhone = webPhone;
    this.on("inboundMessage", (message: InboundMessage) => {
      if (
        message.subject.startsWith("INFO sip:") &&
        message.getHeader("Info-Package")?.toLowerCase() === "trickle-ice"
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

  private get delegatedTrickleIce() {
    return this.webRtcSession?.trickleIce;
  }

  private get supportsTrickleIce() {
    return (
      !this.webPhone.options.webRtcSessionFactory ||
      this.delegatedTrickleIce !== undefined
    );
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
      if (!this.delegatedTrickleIce) {
        this.baseLocalSdp = await this.requireWebRtcSession().createOffer({
          iceRestart: true,
        });
        return this.baseLocalSdp;
      }
      return await this.delegatedIceSdp((session) =>
        session.createOffer({ iceRestart: true }),
      );
    }
    return await this.sdkManagedIceSdp(() =>
      this.rtcPeerConnection.createOffer({ iceRestart: true }),
    );
  }

  protected async createAnswer(offer: string) {
    if (this.webPhone.options.webRtcSessionFactory) {
      if (!this.delegatedTrickleIce) {
        this.stopRemoteIceGeneration();
        this.baseLocalSdp =
          await this.requireWebRtcSession().createAnswer(offer);
        return this.baseLocalSdp;
      }
      return await this.delegatedIceSdp(
        (session) => session.createAnswer(offer),
        offer,
      );
    }
    return await this.sdkManagedIceSdp(
      () => this.rtcPeerConnection.createAnswer(),
      offer,
    );
  }

  protected async applyAnswer(answer: string) {
    const generation = this.remoteIceGeneration;
    if (this.webPhone.options.webRtcSessionFactory) {
      await this.requireWebRtcSession().applyAnswer(answer);
    } else {
      await this.rtcPeerConnection.setRemoteDescription({
        type: "answer",
        sdp: answer,
      });
    }
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
    const replyMessage = await this.sendReInvite(sdp);
    this.startLocalIceCandidateSending();
    await this.applyAnswer(replyMessage.body);
  }

  // handle re-INVITE from SIP server
  public async handleReInvite(reInviteMessage: InboundMessage) {
    this.sipMessage = reInviteMessage;
    await this.replySessionSdp(await this.createAnswer(reInviteMessage.body));

    // note: no need to wait for the final SIP message (refer to inbound call answer function)
    // because nobody is supposed to proactively invoke this function.
  }

  // reply a 200 OK with SDP to the current inbound INVITE and start sending
  // local ICE candidates for the new generation
  protected async replySessionSdp(sdp: string) {
    await this.webPhone.sipClient.reply(
      new ResponseMessage(this.sipMessage, {
        responseCode: 200,
        headers: {
          "Content-Type": "application/sdp",
          ...this.trickleIceHeaders,
        },
        body: sdp,
      }),
    );
    this.startLocalIceCandidateSending();
  }

  // send an in-dialog INVITE (re-INVITE) and acknowledge its final response
  private async sendReInvite(sdp: string) {
    const replyMessage = await this.webPhone.sipClient.request(
      new RequestMessage(
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
      ),
    );
    await this.webPhone.sipClient.reply(
      new RequestMessage(`ACK ${extractAddress(this.remotePeer)} SIP/2.0`, {
        "Call-Id": this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: replyMessage.headers.Via,
        CSeq: replyMessage.headers.CSeq.replace(" INVITE", " ACK"),
      }),
    );
    return replyMessage;
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
    await this.sendReInvite(sdp);
  }

  protected get trickleIceHeaders(): Record<string, string> {
    return this.supportsTrickleIce ? { Supported: "trickle-ice" } : {};
  }

  protected addTrickleIceSupport(headers: Record<string, string>) {
    if (!this.supportsTrickleIce) return;
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
    const generation = this.localIceGeneration;
    if (!generation) return;
    generation.ready = true;
    this.sendLocalIceCandidates(generation);
  }

  private beginLocalIceGeneration() {
    this.stopLocalIceGeneration();
    const generation: LocalIceGeneration = {
      ready: false,
      sending: Promise.resolve(),
      candidates: [],
    };
    this.localIceGeneration = generation;
    // read back so the reference matches later reads when this is a manate proxy
    return this.localIceGeneration;
  }

  private enqueueLocalIceCandidate(
    generation: LocalIceGeneration,
    candidate: RTCIceCandidateInit | null,
  ) {
    if (generation !== this.localIceGeneration) return;
    generation.candidates.push(candidate);
    this.sendLocalIceCandidates(generation);
  }

  private setLocalIceDescription(generation: LocalIceGeneration, sdp: string) {
    generation.sdp = sdp;
    generation.candidates = generation.candidates.filter(
      (candidate) =>
        candidate === null || !sdp.includes(`a=${candidate.candidate}`),
    );
  }

  private setDelegatedLocalIceDescription(
    generation: LocalIceGeneration,
    sdp: string,
  ) {
    const prefix = "a=ice-options:";
    const advertisesTrickle = sdp
      .split(/\r?\n/)
      .some(
        (line) =>
          line.startsWith(prefix) &&
          line.slice(prefix.length).split(/\s+/).includes("trickle"),
      );
    if (!advertisesTrickle) {
      throw new Error(
        "Delegated WebRTC SDP must advertise a=ice-options:trickle",
      );
    }
    this.setLocalIceDescription(generation, sdp);
  }

  private async delegatedIceSdp(
    createSdp: (session: WebRtcSession) => Promise<string>,
    offer?: string,
  ) {
    const remoteGeneration =
      offer !== undefined && this.remoteIceGeneration?.sdp === offer
        ? this.remoteIceGeneration
        : this.beginRemoteIceGeneration(offer);
    const localGeneration = this.beginLocalIceGeneration();
    this.delegatedTrickleIce?.setLocalCandidateHandler((candidate) =>
      this.enqueueLocalIceCandidate(localGeneration, candidate),
    );
    try {
      this.baseLocalSdp = await createSdp(this.requireWebRtcSession());
      this.setDelegatedLocalIceDescription(localGeneration, this.baseLocalSdp);
      if (offer !== undefined) {
        this.setRemoteIceDescription(remoteGeneration, offer);
      }
      return this.baseLocalSdp;
    } catch (error) {
      this.stopLocalIceGeneration(localGeneration);
      this.stopRemoteIceGeneration(remoteGeneration);
      throw error;
    }
  }

  private async sdkManagedIceSdp(
    createSdp: () => Promise<RTCSessionDescriptionInit>,
    offer?: string,
  ) {
    const remoteGeneration =
      offer !== undefined && this.remoteIceGeneration?.sdp === offer
        ? this.remoteIceGeneration
        : this.beginRemoteIceGeneration(offer);
    try {
      if (offer !== undefined) {
        await this.rtcPeerConnection.setRemoteDescription({
          type: "offer",
          sdp: offer,
        });
        this.setRemoteIceDescription(remoteGeneration, offer);
      }
      return await this.setLocalDescriptionForTrickleIce(await createSdp());
    } catch (error) {
      this.stopRemoteIceGeneration(remoteGeneration);
      throw error;
    }
  }

  private async setLocalDescriptionForTrickleIce(
    description: RTCSessionDescriptionInit,
  ) {
    if (!description.sdp) throw new Error("Local description is missing SDP");
    const generation = this.beginLocalIceGeneration();
    const listener = (event: RTCPeerConnectionIceEvent) =>
      this.enqueueLocalIceCandidate(generation, event.candidate);
    generation.listener = listener;
    this.rtcPeerConnection.addEventListener("icecandidate", listener);
    try {
      await this.rtcPeerConnection.setLocalDescription(description);
      const localSdp = this.rtcPeerConnection.localDescription?.sdp;
      if (!localSdp) throw new Error("Local description is missing SDP");
      this.setLocalIceDescription(generation, localSdp);
      return localSdp;
    } catch (error) {
      this.stopLocalIceGeneration(generation);
      throw error;
    }
  }

  private stopLocalIceGeneration(generation = this.localIceGeneration) {
    if (!generation || generation !== this.localIceGeneration) return;
    generation.candidates.length = 0;
    if (generation.listener) {
      this.rtcPeerConnection?.removeEventListener(
        "icecandidate",
        generation.listener,
      );
    }
    this.localIceGeneration = undefined;
  }

  private sendLocalIceCandidates(generation: LocalIceGeneration) {
    if (!generation.ready) return;
    generation.sending = generation.sending.then(() =>
      this.sendLocalIceCandidate(generation),
    );
  }

  private async sendLocalIceCandidate(generation: LocalIceGeneration) {
    while (generation === this.localIceGeneration) {
      const candidate = generation.candidates.shift();
      if (candidate === undefined) return;
      try {
        const response = await this.webPhone.sipClient.request(
          this.infoRequest(
            {
              "Info-Package": "trickle-ice",
              "Content-Type": "application/trickle-ice-sdpfrag",
              "Content-Disposition": "Info-Package",
            },
            this.createLocalIceFragment(generation, candidate),
          ),
        );
        if (/^SIP\/2\.0 2\d\d /.test(response.subject)) continue;
      } catch {}
      this.stopLocalIceGeneration(generation);
    }
  }

  private infoRequest(headers: Record<string, string>, body: string) {
    return new RequestMessage(
      `INFO sip:${this.webPhone.sipInfo.domain} SIP/2.0`,
      {
        "Call-Id": this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
        ...headers,
      },
      body,
    );
  }

  private createLocalIceFragment(
    generation: LocalIceGeneration,
    candidate: RTCIceCandidateInit | null,
  ) {
    generation.fragmentPrefix ??= this.readLocalIceFragmentPrefix(
      generation.sdp,
    );
    return candidate
      ? `${generation.fragmentPrefix}\r\na=${candidate.candidate}`
      : `${generation.fragmentPrefix}\r\na=end-of-candidates`;
  }

  private readLocalIceFragmentPrefix(sdp?: string) {
    const lines = (sdp ?? "").trim().split(/\r?\n/);
    const mediaIndex = lines.findIndex((line) => line.startsWith("m=audio "));
    const section = lines.slice(mediaIndex);
    const findAttribute = (prefix: string) =>
      section.find((line) => line.startsWith(prefix)) ??
      lines.slice(0, mediaIndex).find((line) => line.startsWith(prefix));
    const iceUfrag = findAttribute("a=ice-ufrag:");
    const icePwd = findAttribute("a=ice-pwd:");
    const mid = section.find((line) => line.startsWith("a=mid:"));
    if (mediaIndex === -1 || !iceUfrag || !icePwd || !mid) {
      throw new Error("Local SDP is missing Trickle ICE fragment fields");
    }
    return [iceUfrag, icePwd, lines[mediaIndex], mid].join("\r\n");
  }

  private beginRemoteIceGeneration(sdp?: string) {
    this.stopRemoteIceGeneration();
    const generation: RemoteIceGeneration = {
      ready: false,
      applying: Promise.resolve(),
      sdp: sdp ?? "",
      candidates: [],
    };
    this.remoteIceGeneration = generation;
    // read back so the reference matches later reads when this is a manate proxy
    return this.remoteIceGeneration;
  }

  private stopRemoteIceGeneration(generation = this.remoteIceGeneration) {
    if (!generation || generation !== this.remoteIceGeneration) return;
    generation.candidates.length = 0;
    this.remoteIceGeneration = undefined;
  }

  private setRemoteIceDescription(
    generation: RemoteIceGeneration,
    sdp: string,
  ) {
    if (generation !== this.remoteIceGeneration) return;
    generation.sdp = sdp;
    generation.ready = true;
    this.applyRemoteIceCandidates(generation);
  }

  private receiveRemoteIceCandidate(body: string) {
    if (this.state === "disposed") return;
    // a delegated session without the trickleIce capability ignores candidates
    if (this.webRtcSession && !this.delegatedTrickleIce) return;
    const generation =
      this.remoteIceGeneration ??
      (this.direction === "inbound" && this.sipMessage.body
        ? this.beginRemoteIceGeneration(this.sipMessage.body)
        : undefined);
    const candidates = this.parseRemoteIceCandidates(body);
    if (!generation || !candidates) return;
    generation.candidates.push(...candidates);
    this.applyRemoteIceCandidates(generation);
  }

  private parseRemoteIceCandidates(
    body: string,
  ): RemoteIceCandidate[] | undefined {
    const lines = body.trim().split(/\r?\n/);
    const usernameFragment = this.readIceUsernameFragment(body);
    const mid = lines
      .find((line) => line.startsWith("a=mid:"))
      ?.slice("a=mid:".length);
    if (!usernameFragment || !mid) return;
    const candidates: RemoteIceCandidate[] = [];
    for (const line of lines) {
      if (line.startsWith("a=candidate:")) {
        candidates.push({
          candidate: {
            candidate: line.slice(2),
            sdpMid: mid,
            usernameFragment,
          },
          usernameFragment,
        });
      } else if (line === "a=end-of-candidates") {
        candidates.push({ candidate: null, usernameFragment });
      }
    }
    return candidates.length > 0 ? candidates : undefined;
  }

  private readIceUsernameFragment(sdp: string) {
    return sdp
      .split(/\r?\n/)
      .find((line) => line.startsWith("a=ice-ufrag:"))
      ?.slice("a=ice-ufrag:".length);
  }

  private applyRemoteIceCandidates(generation: RemoteIceGeneration) {
    if (!generation.ready) return;
    generation.applying = generation.applying.then(() =>
      this.applyRemoteIceCandidate(generation),
    );
  }

  private async applyRemoteIceCandidate(generation: RemoteIceGeneration) {
    while (generation === this.remoteIceGeneration) {
      const entry = generation.candidates.shift();
      if (entry === undefined) return;
      if (
        entry.candidate === null &&
        entry.usernameFragment !== this.readIceUsernameFragment(generation.sdp)
      )
        continue;
      try {
        if (this.webPhone.options.webRtcSessionFactory) {
          await this.delegatedTrickleIce?.addRemoteCandidate(entry.candidate);
        } else {
          await this.rtcPeerConnection.addIceCandidate(entry.candidate);
        }
      } catch {}
    }
  }

  protected async sendJsonMessage<T>(
    command: "callpark" | "callflip" | "startcallrecord" | "stopcallrecord",
    args: { [key: string]: string } = {},
  ) {
    const reqid = this.reqid++;
    const jsonBody = JSON.stringify({ request: { reqid, command, ...args } });
    const requestMessage = this.infoRequest(
      { "Content-Type": "application/json;charset=utf-8" },
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
