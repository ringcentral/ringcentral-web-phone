import type SipInfoResponse from '@rc-ex/core/lib/definitions/SipInfoResponse';
import waitFor from 'wait-for-async';

import type { OutboundMessage } from './sip-message';
import { InboundMessage, RequestMessage, ResponseMessage } from './sip-message';
import { branch, generateAuthorization, uuid } from './utils';
import InboundCallSession from './call-session/inbound';
import OutboundCallSession from './call-session/outbound';
import EventEmitter from './event-emitter';

class WebPhone extends EventEmitter {
  public sipInfo: SipInfoResponse;
  public wsc: WebSocket;

  public fakeDomain = uuid() + '.invalid';
  public fakeEmail = uuid() + '@' + this.fakeDomain;

  private intervalHandle: NodeJS.Timeout;
  private connected = false;

  public constructor(sipInfo: SipInfoResponse) {
    super();
    this.sipInfo = sipInfo;
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
        Contact: `<sip:${this.fakeEmail};transport=wss>;expires=600`,
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
      // todo: change to 1 minute
      10 * 60 * 1000, // refresh registration every 1 minute, otherwise WS will disconnect
    );
    this.on('message', (inboundMessage) => {
      if (!inboundMessage.subject.startsWith('INVITE sip:')) {
        return;
      }
      const inboundCallSession = new InboundCallSession(this, inboundMessage);
      this.emit('incomingCall', inboundCallSession);
    });
  }

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

  public async answer(inboundCallSession: InboundCallSession) {
    await inboundCallSession.init();
    await inboundCallSession.answer();
    return inboundCallSession;
  }

  // decline an inbound call
  public async decline(inviteMessage: InboundMessage) {
    const newMessage = new ResponseMessage(inviteMessage, 603);
    this.send(newMessage);
  }

  public async call(callee: number, callerId?: number) {
    const outboundCallSession = new OutboundCallSession(this);
    await outboundCallSession.init();
    await outboundCallSession.call(callee, callerId);
    return outboundCallSession;
  }
}

export default WebPhone;
