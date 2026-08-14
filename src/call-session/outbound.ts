import type WebPhone from "../index.js";
import type InboundMessage from "../sip-message/inbound.js";
import RequestMessage from "../sip-message/outbound/request.js";
import {
  branch,
  extractAddress,
  fakeDomain,
  fakeEmail,
  generateAuthorization,
  uuid,
  withoutTag,
} from "../utils.js";
import CallSession from "./index.js";

class OutboundCallSession extends CallSession {
  public constructor(webPhone: WebPhone, callee: string) {
    super(webPhone);
    this.callee = callee;
    this.direction = "outbound";
  }

  private callee: string;
  public get remoteNumber(): string {
    return this.remotePeer ? super.remoteNumber : this.callee;
  }

  public async call(
    callerId?: string,
    options?: { headers?: Record<string, string> },
  ) {
    const sdp = await this.createOffer();

    const inviteMessage = new RequestMessage(
      `INVITE sip:${this.callee}@${this.webPhone.sipInfo.domain} SIP/2.0`,
      {
        "Call-Id": this.callId,
        Contact: `<sip:${fakeEmail};transport=wss>;expires=60`,
        From: `<sip:${this.webPhone.sipInfo.username}@${this.webPhone.sipInfo.domain}>;tag=${uuid()}`,
        To: `<sip:${this.callee}@${this.webPhone.sipInfo.domain}>`,
        Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
        "Content-Type": "application/sdp",
      },
      sdp,
    );
    if (callerId) {
      inviteMessage.headers["P-Asserted-Identity"] =
        `sip:${callerId}@${this.webPhone.sipInfo.domain}`;
    }

    if (options?.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        inviteMessage.headers[key] = value;
      }
    }

    const inboundMessage = await this.webPhone.sipClient.request(inviteMessage);
    if (inboundMessage.subject.startsWith("SIP/2.0 403 ")) {
      // for exmaple, webPhone.sipRegister(0) has been called
      return;
    }
    const proxyAuthenticate = inboundMessage.getHeader("Proxy-Authenticate")!;
    const nonce = proxyAuthenticate.match(/, nonce="(.+?)"/)![1];
    const newMessage = inviteMessage.fork();
    newMessage.headers["Proxy-Authorization"] = generateAuthorization(
      this.webPhone.sipInfo,
      nonce,
      "INVITE",
    );
    const progressMessage = await this.webPhone.sipClient.request(newMessage);
    this.sipMessage = progressMessage;
    this.state = "ringing";
    this.emit("ringing");
    this.localPeer = progressMessage.getHeader("From")!;
    this.remotePeer = progressMessage.getHeader("To")!;

    // wait for the call to be answered
    // by SIP server design, this happens immediately, even if the callee has not received the INVITE
    return new Promise<boolean>((resolve) => {
      const answerHandler = async (message: InboundMessage) => {
        if (message.getHeader("CSeq") === this.sipMessage.getHeader("CSeq")) {
          this.off("inboundMessage", answerHandler);

          // outbound call failed, for example, invalid number
          // or emergency address is not configured properly
          if (message.subject !== "SIP/2.0 200 OK") {
            this.state = "failed";
            this.emit("failed", message.subject);
            const index = this.webPhone.callSessions.indexOf(this);
            if (index !== -1) {
              this.webPhone.callSessions.splice(index, 1);
            }
            this.dispose();
            resolve(false);
            return;
          }

          this.state = "answered";
          this.emit("answered");
          this.applyAnswer(message.body);
          const ackMessage = new RequestMessage(
            `ACK ${extractAddress(this.remotePeer)} SIP/2.0`,
            {
              "Call-Id": this.callId,
              From: this.localPeer,
              To: this.remotePeer,
              Via: this.sipMessage.getHeader("Via")!,
              CSeq: this.sipMessage
                .getHeader("CSeq")!
                .replace(" INVITE", " ACK"),
            },
          );
          await this.webPhone.sipClient.reply(ackMessage);
          resolve(true);
        }
      };
      this.on("inboundMessage", answerHandler);
    });
  }

  public async cancel() {
    const requestMessage = new RequestMessage(
      `CANCEL ${extractAddress(this.remotePeer)} SIP/2.0`,
      {
        "Call-Id": this.callId,
        From: this.localPeer,
        To: withoutTag(this.remotePeer),
        Via: this.sipMessage.getHeader("Via")!,
        CSeq: this.sipMessage.getHeader("CSeq")!.replace(" INVITE", " CANCEL"),
      },
    );
    await this.webPhone.sipClient.request(requestMessage);
  }
}

export default OutboundCallSession;
