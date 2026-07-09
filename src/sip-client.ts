import EventEmitter from "./event-emitter.js";
import RcMessage from "./rc-message/rc-message.js";
import InboundMessage from "./sip-message/inbound.js";
import type OutboundMessage from "./sip-message/outbound/index.js";
import RequestMessage from "./sip-message/outbound/request.js";
import ResponseMessage from "./sip-message/outbound/response.js";
import type { SipClient, SipClientOptions, SipInfo } from "./types.js";
import {
  branch,
  fakeDomain,
  fakeEmail,
  generateAuthorization,
  uuid,
} from "./utils.js";

const maxExpires = 60;
const getHeader = (headers: Record<string, string>, name: string) =>
  Object.entries(headers).find(
    ([key]) => key.toLowerCase() === name.toLowerCase(),
  )?.[1];
const autoReplyPattern = /^(MESSAGE|BYE|CANCEL|INFO|NOTIFY|UPDATE) sip:/;

export class DefaultSipClient extends EventEmitter implements SipClient {
  public disposed = false;
  public wsc!: WebSocket;
  public sipInfo: SipInfo;
  public instanceId: string;
  private debug: boolean;

  private timeoutHandle!: ReturnType<typeof setTimeout>;

  public constructor(options: SipClientOptions) {
    super();
    this.sipInfo = options.sipInfo;
    this.instanceId = options.instanceId ?? this.sipInfo.authorizationId;
    this.debug = options.debug ?? false;
  }

  public async start() {
    await this.connect();
    if (this.timeoutHandle) {
      clearInterval(this.timeoutHandle);
    }
    await this.register(maxExpires);
  }

  private useBackupOutboundProxy = false;
  public toggleBackupOutboundProxy(enabled = true) {
    this.useBackupOutboundProxy = enabled;
  }

  public connect(): Promise<void> {
    this.wsc = new WebSocket(
      "wss://" +
        (this.useBackupOutboundProxy
          ? this.sipInfo.outboundProxyBackup
          : this.sipInfo.outboundProxy),
      "sip",
    );
    if (this.debug) {
      const wscSend = this.wsc.send.bind(this.wsc);
      this.wsc.send = (message) => {
        console.log(`Sending...(${new Date()})\n` + message);
        return wscSend(message);
      };
    }

    this.wsc.addEventListener("message", async (event) => {
      const inboundMessage = InboundMessage.fromString(event.data);
      if (inboundMessage.subject.startsWith("MESSAGE sip:")) {
        const rcMessage = await RcMessage.fromXml(inboundMessage.body);
        if (
          rcMessage.body.Cln &&
          rcMessage.body.Cln !== this.sipInfo.authorizationId
        ) {
          return; // the message is not for this instance
        }
      }
      if (this.debug) {
        console.log(`Receiving...(${new Date()})\n` + event.data);
      }
      this.emit("inboundMessage", inboundMessage);
      if (autoReplyPattern.test(inboundMessage.subject)) {
        // Auto reply 200 OK to MESSAGE, BYE, CANCEL, INFO, NOTIFY
        await this.reply(
          new ResponseMessage(inboundMessage, { responseCode: 200 }),
        );
      }
    });

    return new Promise<void>((resolve, reject) => {
      const openEventHandler = () => {
        resolve();
      };
      this.wsc.addEventListener("open", openEventHandler, { once: true });
      const errorEventHandler = (e: Event) => {
        reject(e);
      };
      this.wsc.addEventListener("error", errorEventHandler, { once: true });
    });
  }

  public async dispose() {
    this.disposed = true;
    clearInterval(this.timeoutHandle);
    this.removeAllListeners();
    await this.unregister();
    this.wsc.close();
  }

  public async register(expires: number) {
    const requestMessage = new RequestMessage(
      `REGISTER sip:${this.sipInfo.domain} SIP/2.0`,
      {
        "Call-Id": uuid(),
        Contact: `<sip:${fakeEmail};transport=wss>;+sip.instance="<urn:uuid:${this.instanceId}>";expires=${expires}`,
        From: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>;tag=${uuid()}`,
        To: `<sip:${this.sipInfo.username}@${this.sipInfo.domain}>`,
        Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
      },
    );
    // if cannot get response in 5 seconds, we close the connection
    const closeHandle = setTimeout(() => this.wsc.close(), 5000);
    let inboundMessage = await this.request(requestMessage);
    const fail = (reason = inboundMessage.subject): never => {
      throw new Error(`Registration failed: ${reason}`);
    };
    clearTimeout(closeHandle);
    if (!inboundMessage.subject.startsWith("SIP/2.0 200 ")) {
      const wwwAuth = getHeader(inboundMessage.headers, "Www-Authenticate");
      if (wwwAuth) {
        const nonce =
          wwwAuth.match(/\bnonce="([^"]+)"/)?.[1] ??
          fail(`${inboundMessage.subject} (missing nonce)`);
        const newMessage = requestMessage.fork();
        newMessage.headers.Authorization = generateAuthorization(
          this.sipInfo,
          nonce,
          "REGISTER",
        );
        inboundMessage = await this.request(newMessage);
      }
    }
    if (!inboundMessage.subject.startsWith("SIP/2.0 200 ")) {
      fail();
    }
    if (expires > 0) {
      // not for unregister
      const serverExpiresText = getHeader(
        inboundMessage.headers,
        "Contact",
      )?.match(/;expires=(\d+)/)?.[1];
      if (!serverExpiresText) {
        fail(`${inboundMessage.subject} (missing Contact expires)`);
      }
      const serverExpires = Number(serverExpiresText);
      this.timeoutHandle = setTimeout(
        () => {
          this.register(expires);
        },
        (serverExpires - 3) * 1000, // 3 seconds before server expires
      );
    }
  }
  public async unregister() {
    await this.register(0);
  }

  public async request(message: RequestMessage): Promise<InboundMessage> {
    return this.send(message, true);
  }
  public async reply(message: ResponseMessage): Promise<void> {
    await this.send(message, false);
  }
  public send(
    message: OutboundMessage,
    waitForReply = false,
  ): Promise<InboundMessage> {
    this.wsc.send(message.toString());
    this.emit("outboundMessage", message);
    if (!waitForReply) {
      return Promise.resolve(new InboundMessage());
    }
    return new Promise<InboundMessage>((resolve) => {
      const messageListerner = (inboundMessage: InboundMessage) => {
        if (
          inboundMessage.headers.CSeq.trim().split(/\s+/)[0] !==
          message.headers.CSeq.trim().split(/\s+/)[0]
        ) {
          return;
        }
        if (inboundMessage.subject.startsWith("SIP/2.0 100 ")) {
          return; // ignore
        }
        this.off("inboundMessage", messageListerner);
        resolve(inboundMessage);
      };
      this.on("inboundMessage", messageListerner);
    });
  }
}

// this is for multiple instances with shared worker, dummy phones do not talk to SIP server at all
export class DummySipClient extends EventEmitter implements SipClient {
  private static inboundMessage: InboundMessage = new InboundMessage();
  public disposed = false;
  public wsc!: WebSocket;
  public async start() {}
  public request() {
    return Promise.resolve(DummySipClient.inboundMessage);
  }
  public async reply() {}
  public dispose() {
    this.disposed = true;
    return Promise.resolve();
  }
}
