import type InboundMessage from './sip-message/inbound';
import ResponseMessage from './sip-message/outbound/response';
import InboundCallSession from './call-session/inbound';
import OutboundCallSession from './call-session/outbound';
import EventEmitter from './event-emitter';
import type CallSession from './call-session';
import SipClient from './sip-client';
import type { ISipClient, SipInfo, WebPhoneOptions } from './types';

class WebPhone extends EventEmitter {
  public sipInfo: SipInfo;
  public sipClient: ISipClient;
  public callSessions: CallSession[] = [];

  public constructor(options: WebPhoneOptions) {
    super();
    this.sipInfo = options.sipInfo;
    this.sipClient = options.sipClient ?? new SipClient(options);

    this.sipClient.on('inboundMessage', async (inboundMessage: InboundMessage) => {
      // either inbound BYE/CANCEL or server reply to outbound BYE/CANCEL
      if (inboundMessage.headers.CSeq.endsWith(' BYE') || inboundMessage.headers.CSeq.endsWith(' CANCEL')) {
        const index = this.callSessions.findIndex(
          (callSession) => callSession.callId === inboundMessage.headers['Call-Id'],
        );
        if (index !== -1) {
          this.callSessions[index].dispose();
          this.callSessions.splice(index, 1);
        }
      }

      // listen for incoming calls
      if (!inboundMessage.subject.startsWith('INVITE sip:')) {
        return;
      }
      this.callSessions.push(new InboundCallSession(this, inboundMessage));
      // write it this way so that it will be compatible with manate, inboundCallSession will be managed
      const inboundCallSession = this.callSessions[this.callSessions.length - 1] as InboundCallSession;
      this.emit('inboundCall', inboundCallSession);

      // tell SIP server that we are ringing
      let tempMesage = new ResponseMessage(inboundMessage, { responseCode: 100 });
      await this.sipClient.reply(tempMesage);
      tempMesage = new ResponseMessage(inboundMessage, { responseCode: 180 });
      await this.sipClient.reply(tempMesage);

      // if we don't send this, toVoicemail() will not work
      inboundCallSession.confirmReceive();
    });
  }

  public async start() {
    await this.sipClient.start();
  }

  public async dispose() {
    this.removeAllListeners();
    await this.sipClient.dispose();
  }

  // make an outbound call
  public async call(callee: string, callerId?: string) {
    this.callSessions.push(new OutboundCallSession(this));
    // write it this way so that it will be compatible with manate, outboundCallSession will be managed
    const outboundCallSession = this.callSessions[this.callSessions.length - 1] as OutboundCallSession;
    this.emit('outboundCall', outboundCallSession);
    await outboundCallSession.init();
    await outboundCallSession.call(callee, callerId);
    return outboundCallSession;
  }
}

export default WebPhone;
