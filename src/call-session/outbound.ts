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
        'Call-Id': uuid(),
        Contact: `<sip:${this.webPhone.fakeEmail};transport=wss>;expires=600`,
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

    const inboundMessage = await this.webPhone.send(inviteMessage, true);
    const proxyAuthenticate = inboundMessage.headers['Proxy-Authenticate'];
    const nonce = proxyAuthenticate.match(/, nonce="(.+?)"/)![1];
    const newMessage = inviteMessage.fork();
    newMessage.headers['Proxy-Authorization'] = generateAuthorization(this.webPhone.sipInfo, nonce, 'INVITE');
    const progressMessage = await this.webPhone.send(newMessage, true);
    this.sipMessage = progressMessage;
    this.state = 'ringing';
    this.emit('ringing');
    this.localPeer = progressMessage.headers.From;
    this.remotePeer = progressMessage.headers.To;

    // when the call is answered
    const answerHandler = (message: InboundMessage) => {
      if (message.headers.CSeq === this.sipMessage.headers.CSeq) {
        this.webPhone.off('message', answerHandler);
        this.state = 'answered';
        this.emit('answered');
        this.rtcPeerConnection.setRemoteDescription({ type: 'answer', sdp: message.body });
        const ackMessage = new RequestMessage(`ACK ${extractAddress(this.remotePeer)} SIP/2.0`, {
          'Call-Id': this.callId,
          From: this.localPeer,
          To: this.remotePeer,
          Via: this.sipMessage.headers.Via,
          CSeq: this.sipMessage.headers.CSeq.replace(' INVITE', ' ACK'),
        });
        this.webPhone.send(ackMessage);
      }
    };
    this.webPhone.on('message', answerHandler);

    // when the call is terminated
    this.once('answered', async () => {
      const byeHandler = (inboundMessage: InboundMessage) => {
        if (inboundMessage.headers['Call-Id'] !== this.callId) {
          return;
        }
        if (inboundMessage.headers.CSeq.endsWith(' BYE')) {
          this.webPhone.off('message', byeHandler);
          this.dispose();
        }
      };
      this.webPhone.on('message', byeHandler);
    });
  }

  public async cancel() {
    const requestMessage = new RequestMessage(`CANCEL ${extractAddress(this.remotePeer)} SIP/2.0`, {
      'Call-Id': this.callId,
      From: this.localPeer,
      To: withoutTag(this.remotePeer),
      Via: this.sipMessage.headers.Via,
      CSeq: this.sipMessage.headers.CSeq.replace(' INVITE', ' CANCEL'),
    });
    this.webPhone.send(requestMessage);
  }
}

export default OutboundCallSession;
