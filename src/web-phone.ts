import type SipInfoResponse from '@rc-ex/core/lib/definitions/SipInfoResponse';
import waitFor from 'wait-for-async';
import { manage } from 'manate';

import type { OutboundMessage } from './sip-message';
import { InboundMessage, RequestMessage, ResponseMessage } from './sip-message';
import { branch, generateAuthorization, uuid } from './utils';
import InboundCallSession from './call-session/inbound';
import OutboundCallSession from './call-session/outbound';
import EventEmitter from './event-emitter';

interface WebPhoneOptions {
  sipInfo: SipInfoResponse;
  instanceId?: string; // ref: https://docs.oracle.com/cd/E95618_01/html/sbc_scz810_acliconfiguration/GUID-B2A15693-DA4A-4E24-86D4-58B19435F4DA.htm
}

class WebPhone extends EventEmitter {
  public sipInfo: SipInfoResponse;
  public wsc: WebSocket;

  public fakeDomain = uuid() + '.invalid';
  public fakeEmail = uuid() + '@' + this.fakeDomain;
  public instanceId;

  private intervalHandle: NodeJS.Timeout;
  private connected = false;

  public constructor(options: WebPhoneOptions) {
    super();
    this.sipInfo = options.sipInfo;
    this.instanceId = options.instanceId ?? uuid();
    this.wsc = new WebSocket('wss://' + this.sipInfo.outboundProxy, 'sip');
    this.wsc.onopen = () => {
      this.connected = true;
    };
    this.wsc.onmessage = (event) => {
      this.emit('message', InboundMessage.fromString(event.data));
    };
  }

  public async register() {
    if (!this.connected) {
      await waitFor({ interval: 100, condition: () => this.connected });
    }
    const sipRegister = async () => {
      const requestMessage = new RequestMessage(`REGISTER sip:${this.sipInfo.domain} SIP/2.0`, {
        'Call-Id': uuid(),
        Contact: `<sip:${this.fakeEmail};transport=wss>;+sip.instance="<urn:uuid:${this.instanceId}>";expires=600`,
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
    };
    await sipRegister();
    this.intervalHandle = setInterval(
      () => {
        sipRegister();
      },
      1 * 60 * 1000, // refresh registration every 1 minute, otherwise WS will disconnect
    );
    this.on('message', (inboundMessage) => {
      if (!inboundMessage.subject.startsWith('INVITE sip:')) {
        return;
      }
      const inboundCallSession = manage(new InboundCallSession(this, inboundMessage));
      this.emit('inboundCall', inboundCallSession);

      // tell SIP server that we are ringing
      let tempMesage = new ResponseMessage(inboundMessage, 100);
      this.send(tempMesage);
      tempMesage = new ResponseMessage(inboundMessage, 180);
      this.send(tempMesage);

      // if we don't send this, toVoiceMail() will not work
      inboundCallSession.confirmReceive();
    });
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

  public async revoke() {
    clearInterval(this.intervalHandle);
    this.removeAllListeners();
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
  public async call(callee: number, callerId?: number) {
    const outboundCallSession = manage(new OutboundCallSession(this));
    await outboundCallSession.init();
    await outboundCallSession.call(callee, callerId);
    this.emit('outboundCall', outboundCallSession);
    return outboundCallSession;
  }
}

export default WebPhone;
