import sdpTransform from "sdp-transform";

import EventEmitter from "../event-emitter.js";
import RequestMessage from "../sip-message/outbound/request.js";
import type InboundMessage from "../sip-message/inbound.js";
import type WebPhone from "../index.js";
import {
  branch,
  extractAddress,
  extractNumber,
  extractTag,
  fakeDomain,
  uuid,
} from "../utils.js";
import ResponseMessage from "../sip-message/outbound/response.js";
import RcMessage from "../rc-message/rc-message.js";
import OutboundCallSession from "./outbound.js";

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

class CallSession extends EventEmitter {
  public webPhone: WebPhone;
  public sipMessage: InboundMessage;
  public localPeer: string;
  public remotePeer: string;
  public rtcPeerConnection: RTCPeerConnection;
  public mediaStream?: MediaStream;
  public audioElement: HTMLAudioElement;
  public state: "init" | "ringing" | "answered" | "disposed" | "failed" =
    "init";
  public direction: "inbound" | "outbound";
  public inputDeviceId: string;
  public outputDeviceId: string | undefined;

  private reqid = 1;
  private sdpVersion = 1;

  private _id: string;

  public constructor(webPhone: WebPhone) {
    super();
    this.webPhone = webPhone;
    this._id = uuid();
  }

  public get id() {
    return this._id;
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

  public get remoteNumber() {
    return this.remotePeer ? extractNumber(this.remotePeer) : "";
  }

  public get localNumber() {
    return this.localPeer ? extractNumber(this.localPeer) : "";
  }

  public get remoteTag() {
    return this.remotePeer ? extractTag(this.remotePeer) : "";
  }

  public get localTag() {
    return this.localPeer ? extractTag(this.localPeer) : "";
  }

  public get isConference() {
    return this.remotePeer
      ? extractNumber(this.remotePeer).startsWith("conf_")
      : false;
  }

  public get rcHeaders() {
    const rcHeaders = this.sipMessage?.headers["P-rc"];
    if (!rcHeaders) {
      return null;
    }
    const msg = RcMessage.fromXml(rcHeaders);
    return msg.headers;
  }

  public async init() {
    this.rtcPeerConnection = new RTCPeerConnection({
      iceServers: this.webPhone.sipInfo.stunServers?.map((url) => ({
        urls: `stun:${url}`,
      })) ?? [],
    });

    // line below is to make sure that you have the permission to access the microphone
    const tempStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    tempStream.getTracks().forEach((track) => track.stop()); // 🔥 Stop immediately!

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
      this.outputDeviceId = await this.webPhone.deviceManager
        .getOutputDeviceId();
      if (this.outputDeviceId) {
        this.audioElement.setSinkId(this.outputDeviceId);
      }
    };
  }

  public async changeInputDevice(deviceId: string) {
    this.inputDeviceId = deviceId;
    this.mediaStream?.getAudioTracks().forEach((track) => track.stop());
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { deviceId: { exact: deviceId } },
    });
    const newAudioTrack = this.mediaStream.getAudioTracks()[0];
    const sender = this.rtcPeerConnection.getSenders().find((sender) =>
      sender.track?.kind === "audio"
    );
    if (sender) {
      sender.replaceTrack(newAudioTrack);
    }
  }

  public async changeOutputDevice(deviceId: string) {
    this.outputDeviceId = deviceId;
    if (deviceId) {
      await this.audioElement.setSinkId(deviceId);
    }
  }

  public async transfer(target: string) {
    return await this._transfer(`sip:${target}@sip.ringcentral.com`);
  }

  public async warmTransfer(
    target: string,
  ): Promise<
    {
      complete: () => Promise<void>;
      cancel: () => Promise<void>;
      newSession: OutboundCallSession;
    }
  > {
    await this.hold();
    // create a new session and user needs to talk to the target before transfer
    const newSession = await this.webPhone.call(target);
    return {
      // complete the transfer
      complete: async () => {
        await this._transfer(
          `"${target}@sip.ringcentral.com" <sip:${target}@sip.ringcentral.com;transport=wss?Replaces=${newSession.callId}%3Bto-tag%3D${
            newSession.remoteTag
          }%3Bfrom-tag%3D${newSession.localTag}>`,
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

  public async completeWarmTransfer(newSession: CallSession) {
    const target = newSession.remoteNumber;
    return await this._transfer(
      `"${target}@sip.ringcentral.com" <sip:${target}@sip.ringcentral.com;transport=wss?Replaces=${newSession.callId}%3Bto-tag%3D${
        newSession.remoteTag
      }%3Bfrom-tag%3D${newSession.localTag}>`,
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
    for (const sender of this.rtcPeerConnection.getSenders()) {
      if (sender.dtmf?.canInsertDTMF) {
        sender.dtmf?.insertDTMF(tones, duration, interToneGap);
      }
    }
  }

  public dispose() {
    this.rtcPeerConnection?.close();
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    if (this.audioElement) {
      this.audioElement.srcObject = null;
    }
    this.state = "disposed";
    this.emit("disposed");
    this.removeAllListeners();
  }

  // for mute/unmute
  protected toggleTrack(enabled: boolean) {
    this.rtcPeerConnection.getSenders().forEach((sender) => {
      if (sender.track) {
        sender.track.enabled = enabled;
      }
    });
  }

  // send re-INVITE.
  // If the call is on hold and you don't want to unhold it, set toReceive to false
  public async reInvite(toReceive: boolean = true) {
    const offer = await this.rtcPeerConnection.createOffer({
      iceRestart: true,
    });
    await this.rtcPeerConnection.setLocalDescription(offer);
    // wait for ICE gathering to complete
    await new Promise((resolve) => {
      this.rtcPeerConnection.onicecandidate = (event) => {
        if (event.candidate === null) {
          resolve(true);
        }
      };
      setTimeout(() => resolve(false), 2000);
    });
    let sdp = this.rtcPeerConnection.localDescription!.sdp;
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
      },
      sdp,
    );
    const replyMessage = await this.webPhone.sipClient.request(requestMessage);
    await this.rtcPeerConnection.setRemoteDescription({
      type: "answer",
      sdp: replyMessage.body,
    });
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
    await this.rtcPeerConnection.setRemoteDescription({
      type: "offer",
      sdp: reInviteMessage.body,
    });
    const answer = await this.rtcPeerConnection.createAnswer();
    await this.rtcPeerConnection.setLocalDescription(answer);
    // wait for ICE gathering to complete
    await new Promise((resolve) => {
      this.rtcPeerConnection.onicecandidate = (event) => {
        if (event.candidate === null) {
          resolve(true);
        }
      };
      setTimeout(() => resolve(false), 2000);
    });

    const newMessage = new ResponseMessage(this.sipMessage, {
      responseCode: 200,
      headers: {
        "Content-Type": "application/sdp",
      },
      body: answer.sdp,
    });
    await this.webPhone.sipClient.reply(newMessage);

    // todo: wait for the final SIP message, refer to inbound call answer function
  }

  // for hold/unhold
  // toggle between a=sendrecv and a=sendonly
  protected async toggleReceive(toReceive: boolean) {
    if (!this.rtcPeerConnection?.localDescription) {
      return;
    }
    let sdp = this.rtcPeerConnection.localDescription!.sdp;
    // default value is `a=sendrecv`
    if (!toReceive) {
      sdp = sdp.replace(/a=sendrecv/g, "a=sendonly");
    }
    // increase the sdp version
    const res = sdpTransform.parse(sdp);
    this.sdpVersion = Math.max(this.sdpVersion, res.origin!.sessionVersion + 1);
    res.origin!.sessionVersion = this.sdpVersion++;
    sdp = sdpTransform.write(res);
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
          !response || response.reqid !== reqid || response.command !== command
        ) {
          return;
        }
        this.webPhone.sipClient.off("inboundMessage", resultHandler);
        resolve(response.result);
      };
      this.webPhone.sipClient.on("inboundMessage", resultHandler);
    });
  }

  protected async _transfer(uri: string) {
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
    return new Promise<void>((resolve) => {
      const handler = (inboundMessage: InboundMessage) => {
        if (
          inboundMessage.subject.startsWith("BYE sip:") &&
          inboundMessage.headers["Call-Id"] === this.callId
        ) {
          this.webPhone.sipClient.off("inboundMessage", handler);
          resolve();
        }
      };
      this.webPhone.sipClient.on("inboundMessage", handler);
    });
  }
}

export default CallSession;
