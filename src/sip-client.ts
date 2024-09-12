import EventEmitter from './event-emitter';
import type { SipInfo } from './utils';

interface SIPClientOptions {
  sipInfo: SipInfo;
  debug?: boolean;
}

class SIPClient extends EventEmitter {
  public wsc: WebSocket;
  public sipInfo: SipInfo;
  private debug: boolean;

  private intervalHandle: NodeJS.Timeout;

  public constructor(options: SIPClientOptions) {
    super();
    this.sipInfo = options.sipInfo;
    this.debug = options.debug ?? false;
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
    return new Promise<void>((resolve) => {
      this.wsc.onopen = () => {
        resolve();
      };
    });
  }
}

export default SIPClient;
