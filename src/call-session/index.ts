import EventEmitter from '../event-emitter';

import { RequestMessage, type InboundMessage, ResponseMessage } from '../sip-message';
import type WebPhone from '../web-phone';
import { branch, extractAddress } from '../utils';

abstract class CallSession extends EventEmitter {
  public softphone: WebPhone;
  public sipMessage: InboundMessage;
  public localPeer: string;
  public remotePeer: string;
  public remoteIP: string;
  public remotePort: number;
  public disposed = false;

  public constructor(softphone: WebPhone, sipMessage: InboundMessage) {
    super();
    this.softphone = softphone;
    this.sipMessage = sipMessage;
    this.remoteIP = this.sipMessage.body.match(/c=IN IP4 ([\d.]+)/)![1];
    this.remotePort = parseInt(this.sipMessage.body.match(/m=audio (\d+) /)![1], 10);
  }

  public get callId() {
    return this.sipMessage.headers['Call-Id'];
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

  protected async startLocalServices() {
    const byeHandler = (inboundMessage: InboundMessage) => {
      if (inboundMessage.headers['Call-Id'] !== this.callId) {
        return;
      }
      if (inboundMessage.headers.CSeq.endsWith(' BYE')) {
        this.softphone.off('message', byeHandler);
        this.dispose();
      }
    };
    this.softphone.on('message', byeHandler);
  }

  private dispose() {
    this.disposed = true;
    this.emit('disposed');
  }
}

export default CallSession;
