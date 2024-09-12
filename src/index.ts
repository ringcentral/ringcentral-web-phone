import type InboundMessage from './sip-message/inbound';
import ResponseMessage from './sip-message/outbound/response';
import type { SipInfo } from './utils';
import InboundCallSession from './call-session/inbound';
import OutboundCallSession from './call-session/outbound';
import EventEmitter from './event-emitter';
import type CallSession from './call-session';
import SIPClient from './sip-client';
import type OutboundMessage from './sip-message/outbound';

interface WebPhoneOptions {
  sipInfo: SipInfo;
  instanceId?: string; // ref: https://docs.oracle.com/cd/E95618_01/html/sbc_scz810_acliconfiguration/GUID-B2A15693-DA4A-4E24-86D4-58B19435F4DA.htm
  debug?: boolean;
}

class WebPhone extends EventEmitter {
  public sipInfo: SipInfo;
  public sipClient: SIPClient;
  public callSessions: CallSession[] = [];

  private intervalHandle: NodeJS.Timeout;

  public constructor(options: WebPhoneOptions) {
    super();
    this.sipInfo = options.sipInfo;
    this.sipClient = new SIPClient(options);

    this.sipClient.on('outboundMessage', (message: OutboundMessage) => {
      this.emit('outboundMessage', message);
    });
    this.sipClient.on('inboundMessage', async (inboundMessage: InboundMessage) => {
      this.emit('inboundMessage', inboundMessage);
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
      await this.reply(tempMesage);
      tempMesage = new ResponseMessage(inboundMessage, { responseCode: 180 });
      await this.reply(tempMesage);

      // if we don't send this, toVoicemail() will not work
      inboundCallSession.confirmReceive();
    });
  }

  public async reply(message: ResponseMessage) {
    await this.sipClient.reply(message);
  }
  public async request(message: ResponseMessage) {
    return await this.sipClient.request(message);
  }

  public async register() {
    await this.sipClient.connect();
    await this.sipClient.register();
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
    }
    this.intervalHandle = setInterval(
      () => {
        this.sipClient.register();
      },
      1 * 55 * 1000, // refresh registration every 55 seconds, otherwise WS will disconnect
    );
  }

  public async dispose() {
    clearInterval(this.intervalHandle);
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
