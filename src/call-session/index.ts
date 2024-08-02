import sdpTransform from 'sdp-transform';

import EventEmitter from '../event-emitter';
import { RequestMessage, type InboundMessage, ResponseMessage } from '../sip-message';
import type WebPhone from '../web-phone';
import { branch, extractAddress, extractTag, uuid } from '../utils';

interface CallParkResult {
  code: number;
  description: string;
  'park extension': string;
}

interface CallFlipResult {
  code: number;
  description: string;
  number: string;
  target: string;
}

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
    return this.sipMessage?.headers['p-rc-api-ids'].match(/session-id=(s-[0-9a-fz]+?)/)![1];
  }

  public get partyId() {
    return this.sipMessage?.headers['p-rc-api-ids'].match(/party-id=(p-[0-9a-fz]+?-\d)/)![1];
  }

  public async init() {
    this.rtcPeerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    });
    this.mediaStream.getTracks().forEach((track) => this.rtcPeerConnection.addTrack(track, this.mediaStream));
    this.rtcPeerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      this.audioElement = document.createElement('audio') as HTMLAudioElement;
      this.audioElement.autoplay = true;
      this.audioElement.hidden = true;
      document.body.appendChild(this.audioElement);
      this.audioElement.srcObject = remoteStream;
    };
  }

  public async _transfer(uri: string) {
    const requestMessage = new RequestMessage(`REFER sip:${extractAddress(this.remotePeer)} SIP/2.0`, {
      'Call-Id': this.callId,
      From: this.localPeer,
      To: this.remotePeer,
      Via: `SIP/2.0/WSS ${this.webPhone.fakeDomain};branch=${branch()}`,
      'Refer-To': uri,
      'Referred-By': `<${extractAddress(this.localPeer)}>`,
    });
    this.webPhone.send(requestMessage);
    // reply to those NOTIFY messages
    const notifyHandler = (inboundMessage: InboundMessage) => {
      if (!inboundMessage.subject.startsWith('NOTIFY ')) {
        return;
      }
      const responseMessage = new ResponseMessage(inboundMessage, 200);
      this.webPhone.send(responseMessage);
      if (inboundMessage.body.trim() === 'SIP/2.0 200 OK') {
        this.webPhone.off('message', notifyHandler);
      }
    };
    this.webPhone.on('message', notifyHandler);
  }

  public async transfer(target: string) {
    return this._transfer(`sip:${target}@sip.ringcentral.com`);
  }

  public async warmTransfer(target: string): Promise<{ complete: () => void; cancel: () => void }> {
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
      Via: `SIP/2.0/WSS ${this.webPhone.fakeDomain};branch=${branch()}`,
    });
    this.webPhone.send(requestMessage);
  }

  public async sendJsonMessage(jsonBody: string) {
    const requestMessage = new RequestMessage(
      `INFO sip:${this.webPhone.sipInfo.domain} SIP/2.0`,
      {
        'Call-Id': this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: `SIP/2.0/WSS ${this.webPhone.fakeDomain};branch=${branch()}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
      jsonBody,
    );
    this.webPhone.send(requestMessage, true);
  }

  public async startRecording() {
    await this.sendJsonMessage(JSON.stringify({ request: { reqid: this.reqid++, command: 'startcallrecord' } }));
  }

  public async stopRecording() {
    await this.sendJsonMessage(JSON.stringify({ request: { reqid: this.reqid++, command: 'stopcallrecord' } }));
  }

  public async flip(target: string): Promise<CallFlipResult> {
    return new Promise((resolve) => {
      const reqid = this.reqid++;
      const flipHandler = (inboundMessage: InboundMessage) => {
        if (!inboundMessage.subject.startsWith('INFO sip:')) {
          return;
        }
        const response = JSON.parse(inboundMessage.body).response;
        if (!response || response.reqid !== reqid || response.command !== 'callflip') {
          return;
        }
        const responseMessage = new ResponseMessage(inboundMessage, 200);
        this.webPhone.send(responseMessage);
        this.webPhone.off('message', flipHandler);
        // note: we can't dispose the call session here
        // otherwise the caller will not be able to talk to the flip target
        // after the flip target answers the call, manually dispose the call session
        resolve(response.result);
      };
      this.webPhone.on('message', flipHandler);
      this.sendJsonMessage(JSON.stringify({ request: { reqid, command: 'callflip', target } }));
    });
  }

  public async park(): Promise<CallParkResult> {
    return new Promise((resolve) => {
      const reqid = this.reqid++;
      const parkHandler = (inboundMessage: InboundMessage) => {
        if (!inboundMessage.subject.startsWith('INFO sip:')) {
          return;
        }
        const response = JSON.parse(inboundMessage.body).response;
        if (!response || response.reqid !== reqid || response.command !== 'callpark') {
          return;
        }
        const responseMessage = new ResponseMessage(inboundMessage, 200);
        this.webPhone.send(responseMessage);
        this.webPhone.off('message', parkHandler);
        if (response.result.code === 0) {
          // park success, dispose the call session
          this.dispose();
        }
        resolve(response.result);
      };
      this.webPhone.on('message', parkHandler);
      this.sendJsonMessage(JSON.stringify({ request: { reqid, command: 'callpark' } }));
    });
  }

  // toggle between a=sendrecv and a=sendonly
  public async toggleReceive(toReceive: boolean) {
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
      `INVITE sip:${extractAddress(this.remotePeer)} SIP/2.0`,
      {
        'Call-Id': this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: `SIP/2.0/WSS ${this.webPhone.fakeDomain};branch=${branch()}`,
        'Content-Type': 'application/sdp',
      },
      sdp,
    );
    const replyMessage = await this.webPhone.send(requestMessage, true);
    const ackMessage = new RequestMessage(`ACK ${extractAddress(this.remotePeer)} SIP/2.0`, {
      'Call-Id': this.callId,
      From: this.localPeer,
      To: this.remotePeer,
      Via: replyMessage.headers.Via,
      CSeq: replyMessage.headers.CSeq.replace(' INVITE', ' ACK'),
    });
    this.webPhone.send(ackMessage);
  }
  public async hold() {
    await this.toggleReceive(false);
  }
  public async unhold() {
    await this.toggleReceive(true);
  }

  public toggleTrack(enabled: boolean) {
    this.rtcPeerConnection.getSenders().forEach((sender) => {
      if (sender.track) {
        sender.track.enabled = enabled;
      }
    });
  }
  public async mute() {
    this.toggleTrack(false);
  }
  public async unmute() {
    this.toggleTrack(true);
  }

  public sendDtmf(tones: string, duration?: number, interToneGap?: number) {
    const senders = this.rtcPeerConnection.getSenders();
    if (senders.length === 0) {
      return;
    }
    const sender = senders[0];
    sender.dtmf?.insertDTMF(tones, duration, interToneGap);
  }

  protected dispose() {
    this.rtcPeerConnection?.close();
    this.audioElement?.remove();
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    this.state = 'disposed';
    this.emit('disposed');
  }
}

export default CallSession;
