import EventEmitter from "../event-emitter.js";
import type WebPhone from "../index.js";
import type InboundMessage from "../sip-message/inbound.js";
import RequestMessage from "../sip-message/outbound/request.js";
import ResponseMessage from "../sip-message/outbound/response.js";
import type {
  DefaultMediaObjects,
  MediaProvider,
  MediaSession,
} from "../types.js";
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

type MediaField<M, K extends PropertyKey> = K extends keyof M
  ? M[K]
  : undefined;

class CallSession<M extends object = DefaultMediaObjects> extends EventEmitter {
  public webPhone: WebPhone<M>;
  public sipMessage!: InboundMessage;
  public localPeer!: string;
  public remotePeer!: string;
  public state: "init" | "ringing" | "answered" | "disposed" | "failed" =
    "init";
  public direction!: "inbound" | "outbound";
  private reqid = 1;
  private mediaSession?: MediaSession<M>;

  public constructor(webPhone: WebPhone<M>) {
    super();
    this.webPhone = webPhone;
  }

  public get media(): M | undefined {
    return this.mediaSession?.media;
  }
  public get rtcPeerConnection(): MediaField<M, "rtcPeerConnection"> {
    return this.mediaField("rtcPeerConnection");
  }
  public get mediaStream(): MediaField<M, "mediaStream"> {
    return this.mediaField("mediaStream");
  }
  public get audioElement(): MediaField<M, "audioElement"> {
    return this.mediaField("audioElement");
  }
  public get inputDeviceId(): MediaField<M, "inputDeviceId"> {
    return this.mediaField("inputDeviceId");
  }
  public get outputDeviceId(): MediaField<M, "outputDeviceId"> {
    return this.mediaField("outputDeviceId");
  }

  // for inbound call, this.sipMessage?.headers["Call-Id"] will be the call id
  // for outbound call, this._callId will be the call id. Once the call session is out of "init" state, this.sipMessage will be set
  private _callId = uuid();
  public get callId() {
    return this.sipMessage?.headers["Call-Id"] ?? this._callId;
  }

  public get sessionId() {
    return this.sipMessage?.headers["p-rc-api-ids"].match(
      /session-id=(s-[0-9a-fz]+?)$/,
    )?.[1];
  }

  public get partyId() {
    return this.sipMessage?.headers["p-rc-api-ids"].match(
      /party-id=(p-[0-9a-fz]+?-\d);/,
    )?.[1];
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
    if (!this.mediaSession) {
      this.mediaSession = await this.webPhone.mediaProvider.create({
        callId: this.callId,
        direction: this.direction,
        iceServers: this.webPhone.sipInfo.stunServers ?? [],
        deviceManager: this.webPhone.deviceManager,
        onMediaStream: (stream) => this.emit("mediaStreamSet", stream),
      });
    }
    await this.mediaSession.init();
  }

  public async changeInputDevice(deviceId: string) {
    await this.requireMediaSession().changeInputDevice(deviceId);
  }

  public async changeOutputDevice(deviceId: string) {
    await this.requireMediaSession().changeOutputDevice(deviceId);
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
    newSession: OutboundCallSession<M>;
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
    existingSession: CallSession<M>,
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

  public async mute() {
    await this.requireMediaSession().setMuted(true);
  }
  public async unmute() {
    await this.requireMediaSession().setMuted(false);
  }

  public async sendDtmf(
    tones: string,
    duration?: number,
    interToneGap?: number,
  ) {
    await this.requireMediaSession().sendDtmf(tones, duration, interToneGap);
  }

  public async dispose() {
    await this.mediaSession?.dispose();
    this.state = "disposed";
    this.emit("disposed");
    this.removeAllListeners();
  }

  // send re-INVITE.
  // If the call is on hold and you don't want to unhold it, set toReceive to false
  public async reInvite(toReceive: boolean = true) {
    const sdp = await this.requireMediaSession().createOffer({
      iceRestart: true,
      receive: toReceive,
    });
    const requestMessage = new RequestMessage(
      `INVITE ${extractAddress(this.remotePeer)} SIP/2.0`,
      {
        "Call-Id": this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
        "Content-Type": "application/sdp",
      },
      sdp,
    );
    const replyMessage = await this.webPhone.sipClient.request(requestMessage);
    await this.requireMediaSession().applyAnswer(replyMessage.body);
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
    const sdp = await this.requireMediaSession().answerOffer(
      reInviteMessage.body,
    );

    const newMessage = new ResponseMessage(this.sipMessage, {
      responseCode: 200,
      headers: {
        "Content-Type": "application/sdp",
      },
      body: sdp,
    });
    await this.webPhone.sipClient.reply(newMessage);

    // note: no need to wait for the final SIP message (refer to inbound call answer function)
    // because nobody is supposed to proactively invoke this function.
  }

  // for hold/unhold
  // toggle between a=sendrecv and a=sendonly
  protected async toggleReceive(toReceive: boolean) {
    if (!this.mediaSession) {
      return;
    }
    const sdp = await this.mediaSession.createOffer({ receive: toReceive });
    const requestMessage = new RequestMessage(
      `INVITE ${extractAddress(this.remotePeer)} SIP/2.0`,
      {
        "Call-Id": this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
        "Content-Type": "application/sdp",
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

  protected requireMediaSession() {
    if (!this.mediaSession) {
      throw new Error("Media session has not been initialized");
    }
    return this.mediaSession;
  }

  private mediaField<K extends PropertyKey>(key: K): MediaField<M, K> {
    return this.media?.[key as unknown as keyof M] as MediaField<M, K>;
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
    await this.webPhone.sipClient.request(requestMessage);
    return new Promise<T>((resolve) => {
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
        this.webPhone.sipClient.off("inboundMessage", resultHandler);
        resolve(response.result);
      };
      this.webPhone.sipClient.on("inboundMessage", resultHandler);
    });
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
    await this.webPhone.sipClient.request(requestMessage);

    // wait for the final SIP message
    let timeoutId: ReturnType<typeof setTimeout>;
    return new Promise<void>((resolve, reject) => {
      const handler = (inboundMessage: InboundMessage) => {
        if (
          inboundMessage.subject.startsWith("BYE sip:") &&
          inboundMessage.headers["Call-Id"] === this.callId
        ) {
          clearTimeout(timeoutId);
          this.webPhone.sipClient.off("inboundMessage", handler);
          resolve();
        }
      };
      timeoutId = setTimeout(() => {
        this.webPhone.sipClient.off("inboundMessage", handler);
        reject(
          new Error(
            `"REFER ${extractAddress(
              this.remotePeer,
            )} SIP/2.0" request timed out. It often means either you don't have permission or the call is not in a correct state.`,
          ),
        );
      }, timeout);
      this.webPhone.sipClient.on("inboundMessage", handler);
    });
  }
}

export default CallSession;
