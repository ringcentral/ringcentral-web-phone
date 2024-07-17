import { RequestMessage, ResponseMessage, type InboundMessage } from '../sip-message';
import type WebPhone from '../web-phone';
import CallSession from '.';
import { branch, uuid } from '../utils';
import RcMessage from '../rc-message/rc-message';
import callControlCommands from '../rc-message/call-control-commands';

class InboundCallSession extends CallSession {
  public constructor(softphone: WebPhone, inviteMessage: InboundMessage) {
    super(softphone);
    this.sipMessage = inviteMessage;
    this.localPeer = inviteMessage.headers.To;
    this.remotePeer = inviteMessage.headers.From;
    this.direction = 'inbound';
    this.state = 'ringing';
    this.emit('ringing');

    // caller can cancel the call
    const cancelHandler = (inboundMessage: InboundMessage) => {
      if (inboundMessage.headers['Call-Id'] !== this.callId) {
        return;
      }
      if (inboundMessage.subject.startsWith('CANCEL sip:')) {
        this.softphone.off('message', cancelHandler);
        this.dispose();
      }
    };
    this.softphone.on('message', cancelHandler);
  }

  public async sendRcMessage(cmd: number) {
    if (!this.sipMessage.headers['P-rc']) {
      return;
    }
    const rcMessage = RcMessage.fromXml(this.sipMessage.headers['P-rc']);
    const newRcMessage = new RcMessage(
      {
        SID: rcMessage.Hdr.SID,
        Req: rcMessage.Hdr.Req,
        From: rcMessage.Hdr.To,
        To: rcMessage.Hdr.From,
        Cmd: cmd.toString(),
      },
      {
        Cln: this.softphone.sipInfo.authorizationId,
      },
    );
    const requestSipMessage = new RequestMessage(
      `MESSAGE sip:${newRcMessage.Hdr.To} SIP/2.0`,
      {
        Via: `SIP/2.0/WSS ${this.softphone.fakeDomain};branch=${branch()}`,
        To: `<sip:${newRcMessage.Hdr.To}>`,
        From: `<sip:${this.softphone.sipInfo.username}@${this.softphone.sipInfo.domain}>;tag=${uuid()}`,
        'Call-ID': this.callId,
        'Content-Type': 'x-rc/agent',
      },
      newRcMessage.toXml(),
    );
    await this.softphone.send(requestSipMessage);
  }

  public async confirmReceive() {
    this.sendRcMessage(callControlCommands.ClientReceiveConfirm);
  }

  public async toVoiceMail() {
    this.sendRcMessage(callControlCommands.ClientVoiceMail);
  }

  public async decline() {
    const newMessage = new ResponseMessage(this.sipMessage, 603);
    await this.softphone.send(newMessage);
    this.dispose();
  }

  public async answer() {
    await this.init();
    await this.rtcPeerConnection.setRemoteDescription({ type: 'offer', sdp: this.sipMessage.body });
    const answer = await this.rtcPeerConnection.createAnswer();
    await this.rtcPeerConnection.setLocalDescription(answer);

    // wait for ICE gathering to complete
    await new Promise((resolve) => {
      this.rtcPeerConnection.onicecandidate = (event) => {
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

    this.state = 'answered';
    this.emit('answered');

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
