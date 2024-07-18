import sdpTransform from 'sdp-transform';

import EventEmitter from '../event-emitter';
import { RequestMessage, type InboundMessage, ResponseMessage } from '../sip-message';
import type WebPhone from '../web-phone';
import { branch, extractAddress, uuid } from '../utils';

abstract class CallSession extends EventEmitter {
  public softphone: WebPhone;
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

  public constructor(softphone: WebPhone) {
    super();
    this.softphone = softphone;
  }

  public get callId() {
    return this.sipMessage?.headers['Call-Id'] ?? uuid();
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

  public async transfer(target: string) {
    const requestMessage = new RequestMessage(`REFER sip:${extractAddress(this.remotePeer)} SIP/2.0`, {
      'Call-Id': this.callId,
      From: this.localPeer,
      To: this.remotePeer,
      Via: `SIP/2.0/WSS ${this.softphone.fakeDomain};branch=${branch()}`,
      'Refer-To': `sip:${target}@sip.ringcentral.com`,
      'Referred-By': `<${extractAddress(this.localPeer)}>`,
    });
    this.softphone.send(requestMessage);
    // reply to those NOTIFY messages
    const notifyHandler = (inboundMessage: InboundMessage) => {
      if (!inboundMessage.subject.startsWith('NOTIFY ')) {
        return;
      }
      const responseMessage = new ResponseMessage(inboundMessage, 200);
      this.softphone.send(responseMessage);
      if (inboundMessage.body.endsWith('SIP/2.0 200 OK')) {
        this.softphone.off('message', notifyHandler);
      }
    };
    this.softphone.on('message', notifyHandler);
  }

  public async hangup() {
    const requestMessage = new RequestMessage(`BYE sip:${this.softphone.sipInfo.domain} SIP/2.0`, {
      'Call-Id': this.callId,
      From: this.localPeer,
      To: this.remotePeer,
      Via: `SIP/2.0/WSS ${this.softphone.fakeDomain};branch=${branch()}`,
    });
    this.softphone.send(requestMessage);
  }

  public async sendJsonMessage(jsonBody: string) {
    const requestMessage = new RequestMessage(
      `INFO sip:${this.softphone.sipInfo.domain} SIP/2.0`,
      {
        'Call-Id': this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: `SIP/2.0/WSS ${this.softphone.fakeDomain};branch=${branch()}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
      jsonBody,
    );
    this.softphone.send(requestMessage, true);
  }

  public async startRecording() {
    await this.sendJsonMessage(JSON.stringify({ request: { reqid: this.reqid++, command: 'startcallrecord' } }));
  }

  public async stopRecording() {
    await this.sendJsonMessage(JSON.stringify({ request: { reqid: this.reqid++, command: 'stopcallrecord' } }));
  }

  // toggle between a=sendrecv and a=sendonly
  public async toggleReceive(toReceive: boolean) {
    if (!this.rtcPeerConnection?.localDescription) {
      return;
    }
    let sdp = this.rtcPeerConnection.localDescription!.sdp;
    if (toReceive) {
      // sdp = sdp.replace(/a=sendonly/g, 'a=sendrecv');
    } else {
      sdp = sdp.replace(/a=sendrecv/g, 'a=sendonly');
    }
    const res = sdpTransform.parse(sdp);
    this.sdpVersion = Math.max(this.sdpVersion, res.origin.sessionVersion + 1);
    res.origin.sessionVersion = this.sdpVersion++;
    sdp = sdpTransform.write(res);
    const requestMessage = new RequestMessage(
      `INVITE sip:${extractAddress(this.remotePeer)} SIP/2.0`,
      {
        'Call-Id': this.callId,
        From: this.localPeer,
        To: this.remotePeer,
        Via: `SIP/2.0/WSS ${this.softphone.fakeDomain};branch=${branch()}`,
        'Content-Type': 'application/sdp',
      },
      sdp,
    );
    const replyMessage = await this.softphone.send(requestMessage, true);
    const ackMessage = new RequestMessage(`ACK ${extractAddress(this.remotePeer)} SIP/2.0`, {
      'Call-Id': this.callId,
      From: this.localPeer,
      To: this.remotePeer,
      Via: replyMessage.headers.Via,
      CSeq: replyMessage.headers.CSeq.replace(' INVITE', ' ACK'),
    });
    this.softphone.send(ackMessage);
  }

  public async hold() {
    await this.toggleReceive(false);
  }

  public async unhold() {
    await this.toggleReceive(true);
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
