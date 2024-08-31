import RequestMessage from '../sip-message/outbound/request';
import type InboundMessage from '../sip-message/inbound';
import type WebPhone from '..';
import CallSession from '.';
import { extractAddress, withoutTag, branch, generateAuthorization, uuid } from '../utils';

class OutboundCallSession extends CallSession {
  public constructor(webPhone: WebPhone) {
    super(webPhone);
    this.direction = 'outbound';
  }

  public async call(callee: string, callerId?: string) {
    const offer = await this.rtcPeerConnection.createOffer({ iceRestart: true });
    await this.rtcPeerConnection.setLocalDescription(offer);

    // wait for ICE gathering to complete
    await new Promise((resolve) => {
      this.rtcPeerConnection.onicecandidate = (event) => {
        if (event.candidate === null) {
          resolve(true);
        }
      };
      setTimeout(() => resolve(false), 3000);
    });

    const inviteMessage = new RequestMessage(
      `INVITE sip:${callee}@${this.webPhone.sipInfo.domain} SIP/2.0`,
      {
        'Call-ID': uuid(),
        Contact: `<sip:${this.webPhone.fakeEmail};transport=wss>;expires=60`,
        From: `<sip:${this.webPhone.sipInfo.username}@${this.webPhone.sipInfo.domain}>;tag=${uuid()}`,
        To: `<sip:${callee}@${this.webPhone.sipInfo.domain}>`,
        Via: `SIP/2.0/WSS ${this.webPhone.fakeDomain};branch=${branch()}`,
        'Content-Type': 'application/sdp',
      },
      this.rtcPeerConnection.localDescription!.sdp!,
    );
    if (callerId) {
      inviteMessage.headers['P-Asserted-Identity'] = `sip:${callerId}@${this.webPhone.sipInfo.domain}`;
    }

    const inboundMessage = await this.webPhone.request(inviteMessage);
    if (inboundMessage.subject.startsWith('SIP/2.0 403 ')) {
      // for exmaple, webPhone.sipRegister(0) has been called
      return;
    }
    const proxyAuthenticate = inboundMessage.headers['Proxy-Authenticate'];
    const nonce = proxyAuthenticate.match(/, nonce="(.+?)"/)![1];
    const newMessage = inviteMessage.fork();
    newMessage.headers['Proxy-Authorization'] = generateAuthorization(this.webPhone.sipInfo, nonce, 'INVITE');
    const progressMessage = await this.webPhone.request(newMessage);
    this.sipMessage = progressMessage;
    this.state = 'ringing';
    this.emit('ringing');
    this.localPeer = progressMessage.headers.From;
    this.remotePeer = progressMessage.headers.To;

    // when the call is answered
    const answerHandler = async (message: InboundMessage) => {
      if (message.headers.CSeq === this.sipMessage.headers.CSeq) {
        this.webPhone.off('inboundMessage', answerHandler);
        this.state = 'answered';
        this.emit('answered');
        this.rtcPeerConnection.setRemoteDescription({ type: 'answer', sdp: message.body });
        const ackMessage = new RequestMessage(`ACK ${extractAddress(this.remotePeer)} SIP/2.0`, {
          'Call-ID': this.callId,
          From: this.localPeer,
          To: this.remotePeer,
          Via: this.sipMessage.headers.Via,
          CSeq: this.sipMessage.headers.CSeq.replace(' INVITE', ' ACK'),
        });
        await this.webPhone.reply(ackMessage);
      }
    };
    this.webPhone.on('inboundMessage', answerHandler);
  }

  public async cancel() {
    const requestMessage = new RequestMessage(`CANCEL ${extractAddress(this.remotePeer)} SIP/2.0`, {
      'Call-ID': this.callId,
      From: this.localPeer,
      To: withoutTag(this.remotePeer),
      Via: this.sipMessage.headers.Via,
      CSeq: this.sipMessage.headers.CSeq.replace(' INVITE', ' CANCEL'),
    });
    await this.webPhone.request(requestMessage);
  }
}

export default OutboundCallSession;
