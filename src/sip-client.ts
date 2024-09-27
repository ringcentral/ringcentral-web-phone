import EventEmitter from './event-emitter';
import RcMessage from './rc-message/rc-message';
import InboundMessage from './sip-message/inbound';
import type OutboundMessage from './sip-message/outbound';
import RequestMessage from './sip-message/outbound/request';
import ResponseMessage from './sip-message/outbound/response';
import type { ISipClient, SipInfo, SipClientOptions } from './types';
import { branch, fakeDomain, fakeEmail, generateAuthorization, uuid } from './utils';

class SipClient extends EventEmitter implements ISipClient {
  public wsc: WebSocket;
  public sipInfo: SipInfo;
  public instanceId: string;
  private debug: boolean;

  private intervalHandle: NodeJS.Timeout;

  public constructor(options: SipClientOptions) {
    super();
    this.sipInfo = options.sipInfo;
    this.instanceId = options.instanceId ?? this.sipInfo.authorizationId!;
    this.debug = options.debug ?? false;
  }

  public async start() {
    await this.connect();
    await this.register();
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
    }
    this.intervalHandle = setInterval(
      () => {
        this.register();
      },
      1 * 55 * 1000, // refresh registration every 55 seconds, otherwise WS will disconnect
    );
  }

  public async connect() {
    if (this.wsc && this.wsc.readyState === WebSocket.OPEN) {
      return;
    }
    this.wsc = new WebSocket('wss://' + this.sipInfo.outboundProxy, 'sip');
    if (this.debug) {
      const wscSend = this.wsc.send.bind(this.wsc);
      this.wsc.send = (message) => {
        console.log(`Sending...(${new Date()})\n` + message);
        return wscSend(message);
      };
    }

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
    };

    return new Promise<void>((resolve) => {
      this.wsc.onopen = () => {
        resolve();
      };
    });
  }

  public async dispose() {
    clearInterval(this.intervalHandle);
    this.removeAllListeners();
    // in case dispose() is called twice
    if (this.wsc.readyState === WebSocket.OPEN) {
      await this.unregister();
    }
    this.wsc.close();
  }

  public async register(expires = 60) {
    if (this.wsc.readyState === WebSocket.CLOSED) {
      await this.connect();
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
  public async unregister() {
    await this.register(0);
  }

  public async request(message: RequestMessage): Promise<InboundMessage> {
    return this._send(message, true);
  }
  public async reply(message: ResponseMessage): Promise<void> {
    await this._send(message, false);
  }
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
}

// this is for multiple instances with shared worker, dummy phones do not talk to SIP server at all
export class DummySipClient extends EventEmitter implements ISipClient {
  private static inboundMessage: InboundMessage = new InboundMessage();
  public constructor() {
    super();
  }
  public async start() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async request(message: RequestMessage) {
    return DummySipClient.inboundMessage;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async reply(message: ResponseMessage) {}
  public async dispose() {}
}

export default SipClient;
