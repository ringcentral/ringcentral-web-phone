import { ResponseMessage, type InboundMessage } from '../sip-message';
import type WebPhone from '../web-phone';
import CallSession from '.';

class InboundCallSession extends CallSession {
  public constructor(softphone: WebPhone, inviteMessage: InboundMessage) {
    super(softphone);
    this.sipMessage = inviteMessage;
    this.localPeer = inviteMessage.headers.To;
    this.remotePeer = inviteMessage.headers.From;
  }

  public async answer() {
    await this.rtcPeerConnection.setRemoteDescription({ type: 'offer', sdp: this.sipMessage.body });
    const answer = await this.rtcPeerConnection.createAnswer();
    await this.rtcPeerConnection.setLocalDescription(answer);

    // wait for ICE gathering to complete
    await new Promise((resolve) => {
      this.rtcPeerConnection.onicecandidate = (event) => {
        console.log(event.candidate);
        if (event.candidate === null) {
          resolve(true);
        }
      };
      setTimeout(() => resolve(false), 3000);
    });

    const newMessage = new ResponseMessage(
      this.sipMessage,
      200,
      {
        'Content-Type': 'application/sdp',
      },
      answer.sdp,
    );
    this.softphone.send(newMessage);

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
}

export default InboundCallSession;
