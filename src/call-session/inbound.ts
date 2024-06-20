import { ResponseMessage, type InboundMessage } from '../sip-message';
import type WebPhone from '../web-phone';
import CallSession from '.';

class InboundCallSession extends CallSession {
  public constructor(softphone: WebPhone, inviteMessage: InboundMessage) {
    super(softphone, inviteMessage);
    this.localPeer = inviteMessage.headers.To;
    this.remotePeer = inviteMessage.headers.From;
  }

  public async answer() {
    const answerSDP = ''.trim(); // todo: generate answer SDP
    const newMessage = new ResponseMessage(
      this.sipMessage,
      200,
      {
        'Content-Type': 'application/sdp',
      },
      answerSDP,
    );
    this.softphone.send(newMessage);

    this.startLocalServices();
  }
}

export default InboundCallSession;
