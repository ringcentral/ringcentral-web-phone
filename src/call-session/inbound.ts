import RequestMessage from '../sip-message/outbound/request';
import ResponseMessage from '../sip-message/outbound/response';
import type InboundMessage from '../sip-message/inbound';
import type WebPhone from '..';
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

  public async confirmReceive() {
    this.sendRcMessage(callControlCommands.ClientReceiveConfirm);
  }

  public async toVoicemail() {
    this.sendRcMessage(callControlCommands.ClientVoicemail);
  }

  public async decline() {
    this.sendRcMessage(callControlCommands.ClientReject);
  }

  public async forward(target: string) {
    this.sendRcMessage(callControlCommands.ClientForward, { FwdDly: '0', Phn: target, PhnTp: '3' });
  }

  public async startReply() {
    this.sendRcMessage(callControlCommands.ClientStartReply);
  }
  public async reply(text: string): Promise<RcMessage> {
    this.sendRcMessage(callControlCommands.ClientReply, { RepTp: '0', Bdy: text });
    return new Promise((resolve) => {
      const sessionCloseHandler = async (inboundMessage: InboundMessage) => {
        if (inboundMessage.subject.startsWith('MESSAGE sip:')) {
          const rcMessage = await RcMessage.fromXml(inboundMessage.body);
          if (rcMessage.headers.Cmd === callControlCommands.SessionClose.toString()) {
            this.webPhone.off('message', sessionCloseHandler);
            resolve(rcMessage);
            // no need to dispose session here, session will dispose unpon CANCEL or BYE
          }
        }
      };
      this.webPhone.on('message', sessionCloseHandler);
    });
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

    const newMessage = new ResponseMessage(this.sipMessage, {
      responseCode: 200,
      headers: {
        'Content-Type': 'application/sdp',
      },
      body: answer.sdp,
    });
    this.webPhone.send(newMessage);

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

  protected async sendRcMessage(
    cmd: number,
    body: {} | { RepTp: string; Bdy: string } | { FwdDly: string; Phn: string; PhnTp: string } = {},
  ) {
    if (!this.sipMessage.headers['P-rc']) {
      return;
    }
    const rcMessage = await RcMessage.fromXml(this.sipMessage.headers['P-rc']);
    const newRcMessage = new RcMessage(
      {
        SID: rcMessage.headers.SID,
        Req: rcMessage.headers.Req,
        From: rcMessage.headers.To,
        To: rcMessage.headers.From,
        Cmd: cmd.toString(),
      },
      {
        Cln: this.webPhone.sipInfo.authorizationId,
        ...body,
      },
    );
    const requestSipMessage = new RequestMessage(
      `MESSAGE sip:${newRcMessage.headers.To} SIP/2.0`,
      {
        Via: `SIP/2.0/WSS ${this.webPhone.fakeDomain};branch=${branch()}`,
        To: `<sip:${newRcMessage.headers.To}>`,
        From: `<sip:${this.webPhone.sipInfo.username}@${this.webPhone.sipInfo.domain}>;tag=${uuid()}`,
        'Call-ID': this.callId,
        'Content-Type': 'x-rc/agent',
      },
      newRcMessage.toXml(),
    );
    await this.webPhone.send(requestSipMessage);
  }
}

export default InboundCallSession;
