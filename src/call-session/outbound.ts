import { RequestMessage, type InboundMessage } from '../sip-message';
import type WebPhone from '../web-phone';
import CallSession from '.';
import { extractAddress, withoutTag, branch, generateAuthorization, uuid } from '../utils';

class OutboundCallSession extends CallSession {
  public constructor(softphone: WebPhone) {
    super(softphone);
    this.direction = 'outbound';
  }

  public async call(callee: number, callerId?: number) {
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
      `INVITE sip:${callee}@${this.softphone.sipInfo.domain} SIP/2.0`,
      {
        'Call-Id': uuid(),
        Contact: `<sip:${this.softphone.fakeEmail};transport=wss>;expires=600`,
        From: `<sip:${this.softphone.sipInfo.username}@${this.softphone.sipInfo.domain}>;tag=${uuid()}`,
        To: `<sip:${callee}@${this.softphone.sipInfo.domain}>`,
        Via: `SIP/2.0/WSS ${this.softphone.fakeDomain};branch=${branch()}`,
        'Content-Type': 'application/sdp',
      },
      this.rtcPeerConnection.localDescription!.sdp!,
    );
    if (callerId) {
      inviteMessage.headers['P-Asserted-Identity'] = `sip:${callerId}@${this.softphone.sipInfo.domain}`;
    }
    const inboundMessage = await this.softphone.send(inviteMessage, true);
    const proxyAuthenticate = inboundMessage.headers['Proxy-Authenticate'];
    const nonce = proxyAuthenticate.match(/, nonce="(.+?)"/)![1];
    const newMessage = inviteMessage.fork();
    newMessage.headers['Proxy-Authorization'] = generateAuthorization(this.softphone.sipInfo, nonce, 'INVITE');
    const progressMessage = await this.softphone.send(newMessage, true);
    this.sipMessage = progressMessage;
    this.localPeer = progressMessage.headers.From;
    this.remotePeer = progressMessage.headers.To;
    this.state = 'ringing';
    this.emit('ringing');

    // when the call is answered
    const answerHandler = (message: InboundMessage) => {
      if (message.headers.CSeq === this.sipMessage.headers.CSeq) {
        this.softphone.off('message', answerHandler);
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
        this.softphone.send(ackMessage);
      }
    };
    this.softphone.on('message', answerHandler);

    // when the call is terminated
    this.once('answered', async () => {
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
    this.softphone.send(requestMessage);
  }
}

export default OutboundCallSession;
