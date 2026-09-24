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
import { sipProvidedIceServers } from "./ice-servers.js";
import CallSession from "./index.js";

class OutboundCallSession extends CallSession {
  public constructor(webPhone: WebPhone, callee: string) {
    super(webPhone);
    this.callee = callee;
    this.direction = "outbound";
  }

  private callee: string;
  private localOfferSetup?: Promise<void>;
  public get remoteNumber(): string {
    return this.remotePeer ? super.remoteNumber : this.callee;
  }

  public async call(
    callerId?: string,
    options?: { headers?: Record<string, string> },
  ) {
    const sdkManaged = !this.webPhone.options.webRtcSessionFactory;
    const sdp = sdkManaged
      ? await this.createDeferredOutboundOffer()
      : await this.createOffer();

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
    this.addTrickleIceSupport(inviteMessage.headers);

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
    const authenticatedInviteResponse =
      await this.webPhone.sipClient.request(newMessage);
    this.sipMessage = authenticatedInviteResponse;
    this.localPeer = authenticatedInviteResponse.getHeader("From")!;
    this.remotePeer = authenticatedInviteResponse.getHeader("To")!;

    const acknowledge = async (
      message: InboundMessage,
      fallback: InboundMessage = this.sipMessage,
    ) => {
      await this.webPhone.sipClient.reply(
        new RequestMessage(`ACK ${extractAddress(this.remotePeer)} SIP/2.0`, {
          "Call-Id": this.callId,
          From: this.localPeer,
          To: this.remotePeer,
          Via: message.getHeader("Via") ?? fallback.getHeader("Via")!,
          CSeq: message.getHeader("CSeq")!.replace(" INVITE", " ACK"),
        }),
      );
    };

    const removeSession = () => {
      const index = this.webPhone.callSessions.indexOf(this);
      if (index !== -1) this.webPhone.callSessions.splice(index, 1);
    };

    const fail = (reason: unknown) => {
      this.state = "failed";
      this.emit("failed", reason instanceof Error ? reason.message : reason);
      removeSession();
      this.dispose();
    };

    const setupLocalOffer = (message: InboundMessage) => {
      if (!sdkManaged) return Promise.resolve();
      this.localOfferSetup ??= (async () => {
        await this.applyDeferredOutboundOffer(sipProvidedIceServers(message));
        this.startLocalIceCandidateSending();
      })();
      return this.localOfferSetup;
    };

    this.state = "ringing";
    this.emit("ringing");

    const handleFinalResponse = async (message: InboundMessage) => {
      // outbound call failed, for example, invalid number
      // or emergency address is not configured properly
      if (message.subject !== "SIP/2.0 200 OK") {
        fail(message.subject);
        return false;
      }
      const inviteResponse = this.sipMessage;
      this.sipMessage = message;
      this.localPeer = message.getHeader("From") ?? this.localPeer;
      this.remotePeer = message.getHeader("To") ?? this.remotePeer;
      try {
        await setupLocalOffer(message);
        await this.applyAnswer(message.body);
      } catch (error) {
        await acknowledge(message, inviteResponse).catch(() => {});
        await this.hangup().catch(() => {});
        fail(error);
        throw error;
      }
      await acknowledge(message);
      this.state = "answered";
      this.emit("answered");
      return true;
    };

    if (!/^SIP\/2\.0 1\d\d /.test(authenticatedInviteResponse.subject)) {
      return await handleFinalResponse(authenticatedInviteResponse);
    }

    let rejectSetup!: (error: unknown) => void;
    const setupFailed = new Promise<never>((_resolve, reject) => {
      rejectSetup = reject;
    });
    let finalReceived = false;
    let settled = false;
    const progressHandler = (message: InboundMessage) => {
      if (
        message.getHeader("CSeq") !== this.sipMessage.getHeader("CSeq") ||
        !/^SIP\/2\.0 1\d\d /.test(message.subject) ||
        message.subject.startsWith("SIP/2.0 100 ") ||
        message.getHeader("p-rc-ice-servers") === undefined
      )
        return;
      this.sipMessage = message;
      this.localPeer = message.getHeader("From")!;
      this.remotePeer = message.getHeader("To")!;
      void setupLocalOffer(message).catch(async (error) => {
        if (finalReceived || settled) return;
        settled = true;
        this.off("inboundMessage", progressHandler);
        await this.cancel().catch(() => {});
        fail(error);
        rejectSetup(error);
      });
    };

    const finalResponse = new Promise<boolean>((resolve, reject) => {
      const answerHandler = async (message: InboundMessage) => {
        if (message.getHeader("CSeq") !== this.sipMessage.getHeader("CSeq"))
          return;
        if (/^SIP\/2\.0 1\d\d /.test(message.subject)) return;
        finalReceived = true;
        settled = true;
        this.off("inboundMessage", progressHandler);
        this.off("inboundMessage", answerHandler);
        try {
          resolve(await handleFinalResponse(message));
        } catch (error) {
          reject(error);
        }
      };
      this.on("inboundMessage", progressHandler);
      this.on("inboundMessage", answerHandler);
    });
    if (
      /^SIP\/2\.0 1\d\d /.test(authenticatedInviteResponse.subject) &&
      authenticatedInviteResponse.subject !== "SIP/2.0 100 Trying" &&
      authenticatedInviteResponse.getHeader("p-rc-ice-servers") !== undefined
    ) {
      progressHandler(authenticatedInviteResponse);
    }
    return await Promise.race([finalResponse, setupFailed]);
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
