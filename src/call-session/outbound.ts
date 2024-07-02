import { RequestMessage, type InboundMessage } from '../sip-message';
import type WebPhone from '../web-phone';
import CallSession from '.';
import { extractAddress, withoutTag } from '../utils';

class OutboundCallSession extends CallSession {
  public constructor(softphone: WebPhone, answerMessage: InboundMessage, rtcPeerConnection: RTCPeerConnection) {
    super(softphone, answerMessage, rtcPeerConnection);
    this.localPeer = answerMessage.headers.From;
    this.remotePeer = answerMessage.headers.To;
    this.init();
  }

  public async init() {
    // wait for user to answer the call
    const answerHandler = (message: InboundMessage) => {
      if (message.headers.CSeq === this.sipMessage.headers.CSeq) {
        this.softphone.off('message', answerHandler);
        this.emit('answered');
        this.rtcPeerConnection.setRemoteDescription({ type: 'answer', sdp: message.body });
        const ackMessage = new RequestMessage(`ACK ${extractAddress(this.remotePeer)} SIP/2.0`, {
          'Call-Id': this.callId,
          From: this.localPeer,
          To: this.remotePeer,
          Via: this.sipMessage.headers.Via,
          CSeq: this.sipMessage.headers.CSeq.replace(' INVITE', ' ACK'),
        });
        this.softphone.send(ackMessage);
      }
    };
    this.softphone.on('message', answerHandler);
    this.once('answered', async () => this.startLocalServices());
  }

  public async cancel() {
    const requestMessage = new RequestMessage(`CANCEL ${extractAddress(this.remotePeer)} SIP/2.0`, {
      'Call-Id': this.callId,
      From: this.localPeer,
      To: withoutTag(this.remotePeer),
      Via: this.sipMessage.headers.Via,
      CSeq: this.sipMessage.headers.CSeq.replace(' INVITE', ' CANCEL'),
    });
    this.softphone.send(requestMessage);
  }
}

export default OutboundCallSession;
