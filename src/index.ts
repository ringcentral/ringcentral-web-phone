import waitFor from 'wait-for-async';

import type OutboundMessage from './sip-message/outbound';
import InboundMessage from './sip-message/inbound';
import RequestMessage from './sip-message/outbound/request';
import ResponseMessage from './sip-message/outbound/response';
import type { SipInfo } from './utils';
import { branch, generateAuthorization, uuid } from './utils';
import InboundCallSession from './call-session/inbound';
import OutboundCallSession from './call-session/outbound';
import EventEmitter from './event-emitter';
import type CallSession from './call-session';

interface WebPhoneOptions {
  sipInfo: SipInfo;
  instanceId?: string; // ref: https://docs.oracle.com/cd/E95618_01/html/sbc_scz810_acliconfiguration/GUID-B2A15693-DA4A-4E24-86D4-58B19435F4DA.htm
}

class WebPhone extends EventEmitter {
  public sipInfo: SipInfo;
  public wsc: WebSocket;

  public fakeDomain = uuid() + '.invalid';
  public fakeEmail = uuid() + '@' + this.fakeDomain;
  public instanceId: string;

  public callSessions: CallSession[] = [];

  private intervalHandle: NodeJS.Timeout;
  private state: 'init' | 'connected' | 'disposed' = 'init';

  public constructor(options: WebPhoneOptions) {
    super();
    this.sipInfo = options.sipInfo;
    this.instanceId = options.instanceId ?? this.sipInfo.authorizationId!;

    // listen for incoming calls
    this.on('message', async (inboundMessage: InboundMessage) => {
      if (!inboundMessage.subject.startsWith('INVITE sip:')) {
        return;
      }
      this.callSessions.push(new InboundCallSession(this, inboundMessage));
      // write it this way so that it will be compatible with manate, inboundCallSession will be managed
      const inboundCallSession = this.callSessions[this.callSessions.length - 1] as InboundCallSession;
      this.emit('inboundCall', inboundCallSession);

      // tell SIP server that we are ringing
      let tempMesage = new ResponseMessage(inboundMessage, { responseCode: 100 });
      await this.send(tempMesage);
      tempMesage = new ResponseMessage(inboundMessage, { responseCode: 180 });
      await this.send(tempMesage);

      // if we don't send this, toVoicemail() will not work
      inboundCallSession.confirmReceive();
    });
  }

  public async register() {
    this.state = 'init'; // in case register() is called again
    this.wsc = new WebSocket('wss://' + this.sipInfo.outboundProxy, 'sip');
    this.wsc.onopen = () => {
      this.state = 'connected';
    };
    this.wsc.onmessage = async (event) => {
      const inboundMessage = InboundMessage.fromString(event.data);
      this.emit('message', inboundMessage);
      if (
        inboundMessage.subject.startsWith('MESSAGE sip:') ||
        inboundMessage.subject.startsWith('BYE sip:') ||
        inboundMessage.subject.startsWith('CANCEL sip:') ||
        inboundMessage.subject.startsWith('INFO sip:') ||
        inboundMessage.subject.startsWith('NOTIFY sip:')
      ) {
        // Auto reply 200 OK to MESSAGE, BYE, CANCEL, INFO, NOTIFY
        const responsMessage = new ResponseMessage(inboundMessage, { responseCode: 200 });
        await this.send(responsMessage);
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

    await waitFor({ interval: 100, condition: () => this.state === 'connected' });
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

  // to print all SIP messages to console
  public async enableDebugMode() {
    this.on('message', (message) => console.log(`Receiving...(${new Date()})\n` + message.toString()));
    const wscSend = this.wsc.send.bind(this.wsc);
    this.wsc.send = (message) => {
      console.log(`Sending...(${new Date()})\n` + message);
      return wscSend(message);
    };
  }

  public async dispose() {
    if (this.state === 'disposed') {
      return;
    }
    this.state = 'disposed';
    clearInterval(this.intervalHandle);
    this.removeAllListeners();
    await this.sipRegister(0);
    this.wsc.close();
  }

  // send a SIP message to SIP server
  public send(message: OutboundMessage, waitForReply = false): Promise<InboundMessage> {
    this.wsc.send(message.toString());
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
        this.off('message', messageListerner);
        resolve(inboundMessage);
      };
      this.on('message', messageListerner);
    });
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

  private async sipRegister(expires = 60) {
    const requestMessage = new RequestMessage(`REGISTER sip:${this.sipInfo.domain} SIP/2.0`, {
      'Call-Id': uuid(),
      Contact: `<sip:${this.fakeEmail};transport=wss>;+sip.instance="<urn:uuid:${this.instanceId}>";expires=${expires}`,
      From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
      To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
      Via: `SIP/2.0/WSS ${this.fakeDomain};branch=${branch()}`,
    });
    const inboundMessage = await this.send(requestMessage, true);
    const wwwAuth = inboundMessage.headers['Www-Authenticate'] || inboundMessage!.headers['WWW-Authenticate'];
    if (wwwAuth) {
      const nonce = wwwAuth.match(/, nonce="(.+?)"/)![1];
      const newMessage = requestMessage.fork();
      newMessage.headers.Authorization = generateAuthorization(this.sipInfo, nonce, 'REGISTER');
      await this.send(newMessage, true);
    } else if (inboundMessage.subject.startsWith('SIP/2.0 603 ')) {
      throw new Error('Registration failed: ' + inboundMessage.subject);
    }
  }
}

export default WebPhone;
