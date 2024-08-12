import { RequestMessage, ResponseMessage, type InboundMessage } from '../sip-message';
import type WebPhone from '../web-phone';
import CallSession from '.';
import { branch, uuid } from '../utils';
import RcMessage from '../rc-message/rc-message';
import callControlCommands from '../rc-message/call-control-commands';

class InboundCallSession extends CallSession {
  public constructor(webPhone: WebPhone, inviteMessage: InboundMessage) {
    super(webPhone);
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
        this.webPhone.off('message', cancelHandler);
        this.dispose();
      }
    };
    this.webPhone.on('message', cancelHandler);
  }

  public async sendRcMessage(
    cmd: number,
    body: {} | { RepTp: string; Bdy: string } | { FwdDly: string; Phn: string; PhnTp: string } = {},
  ) {
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
        Cln: this.webPhone.sipInfo.authorizationId,
        ...body,
      },
    );
    const requestSipMessage = new RequestMessage(
      `MESSAGE sip:${newRcMessage.Hdr.To} SIP/2.0`,
      {
        Via: `SIP/2.0/WSS ${this.webPhone.fakeDomain};branch=${branch()}`,
        To: `<sip:${newRcMessage.Hdr.To}>`,
        From: `<sip:${this.webPhone.sipInfo.username}@${this.webPhone.sipInfo.domain}>;tag=${uuid()}`,
        'Call-ID': this.callId,
        'Content-Type': 'x-rc/agent',
      },
      newRcMessage.toXml(),
    );
    await this.webPhone.send(requestSipMessage);
  }

  public async confirmReceive() {
    this.sendRcMessage(callControlCommands.ClientReceiveConfirm);
  }

  public async toVoiceMail() {
    this.sendRcMessage(callControlCommands.ClientVoiceMail);
  }

  public async decline() {
    this.sendRcMessage(callControlCommands.ClientReject);
  }

  public async forward(target: string) {
    this.sendRcMessage(callControlCommands.ClientForward, { FwdDly: '0', Phn: target, PhnTp: '3' });
  }

  public async reply(text: string) {
    this.sendRcMessage(callControlCommands.ClientReply, { RepTp: '0', Bdy: text });
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
    this.webPhone.send(newMessage);

    // reply 200 to <Msg> Cmd=7, and there are two of them
    let count = 0;
    const messageHandler = (inboundMessage: InboundMessage) => {
      if (inboundMessage.subject.startsWith('MESSAGE sip:')) {
        const responsMessage = new ResponseMessage(inboundMessage, 200);
        this.webPhone.send(responsMessage);
        count += 1;
        if (count >= 2) {
          this.webPhone.off('message', messageHandler);
        }
      }
    };
    this.webPhone.on('message', messageHandler);

    this.state = 'answered';
    this.emit('answered');

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
  }
}

export default InboundCallSession;
