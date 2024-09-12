import type OutboundMessage from './sip-message/outbound';
import InboundMessage from './sip-message/inbound';
import RequestMessage from './sip-message/outbound/request';
import ResponseMessage from './sip-message/outbound/response';
import type { SipInfo } from './utils';
import { branch, fakeDomain, fakeEmail, generateAuthorization, uuid } from './utils';
import InboundCallSession from './call-session/inbound';
import OutboundCallSession from './call-session/outbound';
import EventEmitter from './event-emitter';
import type CallSession from './call-session';
import RcMessage from './rc-message/rc-message';

interface WebPhoneOptions {
  sipInfo: SipInfo;
  instanceId?: string; // ref: https://docs.oracle.com/cd/E95618_01/html/sbc_scz810_acliconfiguration/GUID-B2A15693-DA4A-4E24-86D4-58B19435F4DA.htm
  debug?: boolean;
}

class WebPhone extends EventEmitter {
  public sipInfo: SipInfo;
  public instanceId: string;
  public debug: boolean;

  public wsc: WebSocket;

  public callSessions: CallSession[] = [];

  private intervalHandle: NodeJS.Timeout;

  public constructor(options: WebPhoneOptions) {
    super();
    this.sipInfo = options.sipInfo;
    this.instanceId = options.instanceId ?? this.sipInfo.authorizationId!;
    this.debug = options.debug ?? false;

    // listen for incoming calls
    this.on('inboundMessage', async (inboundMessage: InboundMessage) => {
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

  public async register() {
    await this.connectWS();
    this.wsc.onmessage = async (event) => {
      const inboundMessage = InboundMessage.fromString(event.data);
      if (inboundMessage.subject.startsWith('MESSAGE sip:')) {
        const rcMessage = await RcMessage.fromXml(inboundMessage.body);
        if (rcMessage.body.Cln && rcMessage.body.Cln !== this.sipInfo.authorizationId) {
          return; // the message is not for this instance
        }
      }
      if (this.debug) {
        console.log(`Receiving...(${new Date()})\n` + event.data);
      }
      this.emit('inboundMessage', inboundMessage);
      if (
        inboundMessage.subject.startsWith('MESSAGE sip:') ||
        inboundMessage.subject.startsWith('BYE sip:') ||
        inboundMessage.subject.startsWith('CANCEL sip:') ||
        inboundMessage.subject.startsWith('INFO sip:') ||
        inboundMessage.subject.startsWith('NOTIFY sip:')
      ) {
        // Auto reply 200 OK to MESSAGE, BYE, CANCEL, INFO, NOTIFY
        await this.reply(new ResponseMessage(inboundMessage, { responseCode: 200 }));
      }
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
    };

    await this.sipRegister();
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
    }
    this.intervalHandle = setInterval(
      () => {
        this.sipRegister();
      },
      1 * 55 * 1000, // refresh registration every 55 seconds, otherwise WS will disconnect
    );
  }

  public async dispose() {
    clearInterval(this.intervalHandle);
    this.removeAllListeners();

    // in case dispose() is called twice
    if (this.wsc.readyState === WebSocket.OPEN) {
      await this.sipRegister(0);
    }

    this.wsc.close();
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

  public async request(message: OutboundMessage): Promise<InboundMessage> {
    return this._send(message, true);
  }
  public async reply(message: OutboundMessage): Promise<void> {
    await this._send(message, false);
  }

  // send a SIP message to SIP server
  private _send(message: OutboundMessage, waitForReply = false): Promise<InboundMessage> {
    this.wsc.send(message.toString());
    this.emit('outboundMessage', message);
    if (!waitForReply) {
      return new Promise<InboundMessage>((resolve) => {
        resolve(new InboundMessage());
      });
    }
    return new Promise<InboundMessage>((resolve) => {
      const messageListerner = (inboundMessage: InboundMessage) => {
        if (inboundMessage.headers.CSeq !== message.headers.CSeq) {
          return;
        }
        if (inboundMessage.subject.startsWith('SIP/2.0 100 ')) {
          return; // ignore
        }
        this.off('inboundMessage', messageListerner);
        resolve(inboundMessage);
      };
      this.on('inboundMessage', messageListerner);
    });
  }

  private async sipRegister(expires = 60) {
    if (this.wsc.readyState === WebSocket.CLOSED) {
      await this.connectWS();
    }
    const requestMessage = new RequestMessage(`REGISTER sip:${this.sipInfo.domain} SIP/2.0`, {
      'Call-Id': uuid(),
      Contact: `<sip:${fakeEmail};transport=wss>;+sip.instance="<urn:uuid:${this.instanceId}>";expires=${expires}`,
      From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
      To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
      Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
    });
    const inboundMessage = await this.request(requestMessage);
    const wwwAuth = inboundMessage.headers['Www-Authenticate'] || inboundMessage!.headers['WWW-Authenticate'];
    if (wwwAuth) {
      const nonce = wwwAuth.match(/, nonce="(.+?)"/)![1];
      const newMessage = requestMessage.fork();
      newMessage.headers.Authorization = generateAuthorization(this.sipInfo, nonce, 'REGISTER');
      await this.request(newMessage);
    } else if (inboundMessage.subject.startsWith('SIP/2.0 603 ')) {
      throw new Error('Registration failed: ' + inboundMessage.subject);
    }
  }

  private async connectWS() {
    // in case register() is called again
    if (this.wsc) {
      this.wsc.close();
    }
    this.wsc = new WebSocket('wss://' + this.sipInfo.outboundProxy, 'sip');
    if (this.debug) {
      const wscSend = this.wsc.send.bind(this.wsc);
      this.wsc.send = (message) => {
        console.log(`Sending...(${new Date()})\n` + message);
        return wscSend(message);
      };
    }
    return new Promise<void>((resolve) => {
      this.wsc.onopen = () => {
        resolve();
      };
    });
  }
}

export default WebPhone;
