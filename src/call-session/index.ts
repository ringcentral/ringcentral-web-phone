import sdpTransform from 'sdp-transform';

import EventEmitter from '../event-emitter';
import RequestMessage from '../sip-message/outbound/request';
import type InboundMessage from '../sip-message/inbound';
import type WebPhone from '..';
import { branch, extractAddress, extractNumber, extractTag, fakeDomain, uuid } from '../utils';

interface CommandResult {
  code: number;
  description: string;
}
type ParkResult = CommandResult & {
  'park extension': string;
};
type FlipResult = CommandResult & {
  number: string;
  target: string;
};

abstract class CallSession extends EventEmitter {
  public webPhone: WebPhone;
  public sipMessage: InboundMessage;
  public localPeer: string;
  public remotePeer: string;
  public rtcPeerConnection: RTCPeerConnection;
  public mediaStream: MediaStream;
  public audioElement: HTMLAudioElement;
  public state: 'init' | 'ringing' | 'answered' | 'disposed' = 'init';
  public direction: 'inbound' | 'outbound';

  private reqid = 1;
  private sdpVersion = 1;

  public constructor(webPhone: WebPhone) {
    super();
    this.webPhone = webPhone;
  }

  public get callId() {
    return this.sipMessage?.headers['Call-Id'] ?? uuid();
  }

  public get sessionId() {
    return this.sipMessage?.headers['p-rc-api-ids'].match(/session-id=(s-[0-9a-fz]+?)$/)![1];
  }

  public get partyId() {
    return this.sipMessage?.headers['p-rc-api-ids'].match(/party-id=(p-[0-9a-fz]+?-\d);/)![1];
  }

  public get remoteNumber() {
    return this.remotePeer ? extractNumber(this.remotePeer) : '';
  }

  public get localNumber() {
    return this.localPeer ? extractNumber(this.localPeer) : '';
  }

  public get isConference() {
    return this.remotePeer ? extractNumber(this.remotePeer).startsWith('conf_') : false;
  }

  public async init() {
    this.rtcPeerConnection = new RTCPeerConnection({
      iceServers: this.webPhone.sipInfo.stunServers?.map((url) => ({ urls: `stun:${url}` })) ?? [],
    });
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    this.mediaStream.getAudioTracks().forEach((track) => this.rtcPeerConnection.addTrack(track, this.mediaStream));
    this.rtcPeerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      this.audioElement = document.createElement('audio') as HTMLAudioElement;
      this.audioElement.autoplay = true;
      this.audioElement.hidden = true;
      this.audioElement.srcObject = remoteStream;
    };
  }

  public async transfer(target: string) {
    return this._transfer(`sip:${target}@sip.ringcentral.com`);
  }

  public async warmTransfer(target: string): Promise<{ complete: () => Promise<void>; cancel: () => Promise<void> }> {
    await this.hold();
    // create a new session and user needs to talk to the target before transfer
    const newSession = await this.webPhone.call(target);
    return {
      // complete the transfer
      complete: async () => {
        await this._transfer(
          `"${target}@sip.ringcentral.com" <sip:${target}@sip.ringcentral.com;transport=wss?Replaces=${newSession.callId}%3Bto-tag%3D${extractTag(newSession.remotePeer)}%3Bfrom-tag%3D${extractTag(newSession.localPeer)}>`,
        );
      },
      // cancel the transfer
      cancel: async () => {
        await newSession.hangup();
        await this.unhold();
      },
    };
  }

  public async hangup() {
    const requestMessage = new RequestMessage(`BYE sip:${this.webPhone.sipInfo.domain} SIP/2.0`, {
      'Call-Id': this.callId,
      From: this.localPeer,
      To: this.remotePeer,
      Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
    });
    await this.webPhone.sipClient.request(requestMessage);
  }

  public async startRecording(): Promise<CommandResult> {
    return await this.sendJsonMessage('startcallrecord');
  }

  public async stopRecording(): Promise<CommandResult> {
    return await this.sendJsonMessage('stopcallrecord');
  }

  public async flip(target: string): Promise<FlipResult> {
    const flipResult = await this.sendJsonMessage<FlipResult>('callflip', { target });
    // note: we can't dispose the call session here
    // otherwise the caller will not be able to talk to the flip target
    // after the flip target answers the call, manually dispose the call session
    return flipResult;
  }

  public async park(): Promise<ParkResult> {
    const parkResult = await this.sendJsonMessage<ParkResult>('callpark');
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
    this.toggleTrack(false);
  }
  public async unmute() {
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
    this.state = 'disposed';
    this.emit('disposed');
  }

  // for mute/unmute
  protected toggleTrack(enabled: boolean) {
    this.rtcPeerConnection.getSenders().forEach((sender) => {
      if (sender.track) {
        sender.track.enabled = enabled;
      }
    });
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
      sdp = sdp.replace(/a=sendrecv/g, 'a=sendonly');
    }
    // increase the sdp version
    const res = sdpTransform.parse(sdp);
    this.sdpVersion = Math.max(this.sdpVersion, res.origin!.sessionVersion + 1);
    res.origin!.sessionVersion = this.sdpVersion++;
    sdp = sdpTransform.write(res);
    const requestMessage = new RequestMessage(
      `INVITE ${extractAddress(this.remotePeer)} SIP/2.0`,
      {
        'Call-Id': this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
        'Content-Type': 'application/sdp',
      },
      sdp,
    );
    const replyMessage = await this.webPhone.sipClient.request(requestMessage);
    const ackMessage = new RequestMessage(`ACK ${extractAddress(this.remotePeer)} SIP/2.0`, {
      'Call-Id': this.callId,
      From: this.localPeer,
      To: this.remotePeer,
      Via: replyMessage.headers.Via,
      CSeq: replyMessage.headers.CSeq.replace(' INVITE', ' ACK'),
    });
    await this.webPhone.sipClient.reply(ackMessage);
  }

  protected async sendJsonMessage<T>(
    command: 'callpark' | 'callflip' | 'startcallrecord' | 'stopcallrecord',
    args: { [key: string]: string } = {},
  ) {
    const reqid = this.reqid++;
    const jsonBody = JSON.stringify({ request: { reqid, command, ...args } });
    const requestMessage = new RequestMessage(
      `INFO sip:${this.webPhone.sipInfo.domain} SIP/2.0`,
      {
        'Call-Id': this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
      jsonBody,
    );
    await this.webPhone.sipClient.request(requestMessage);
    return new Promise<T>((resolve) => {
      const resultHandler = (inboundMessage: InboundMessage) => {
        if (!inboundMessage.subject.startsWith('INFO sip:')) {
          return;
        }
        const response = JSON.parse(inboundMessage.body).response;
        if (!response || response.reqid !== reqid || response.command !== command) {
          return;
        }
        this.webPhone.sipClient.off('inboundMessage', resultHandler);
        resolve(response.result);
      };
      this.webPhone.sipClient.on('inboundMessage', resultHandler);
    });
  }

  protected async _transfer(uri: string) {
    const requestMessage = new RequestMessage(`REFER ${extractAddress(this.remotePeer)} SIP/2.0`, {
      'Call-Id': this.callId,
      From: this.localPeer,
      To: this.remotePeer,
      Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
      'Refer-To': uri,
      'Referred-By': `<${extractAddress(this.localPeer)}>`,
    });
    await this.webPhone.sipClient.request(requestMessage);

    // wait for the final SIP message
    return new Promise<void>((resolve) => {
      const handler = async (inboundMessage: InboundMessage) => {
        if (inboundMessage.subject.startsWith('BYE sip:') && inboundMessage.headers['Call-Id'] === this.callId) {
          this.webPhone.sipClient.off('inboundMessage', handler);
          resolve();
        }
      };
      this.webPhone.sipClient.on('inboundMessage', handler);
    });
  }
}

export default CallSession;
