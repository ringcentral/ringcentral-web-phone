import type WebPhone from "../index.js";
import callControlCommands from "../rc-message/call-control-commands.js";
import RcMessage from "../rc-message/rc-message.js";
import type InboundMessage from "../sip-message/inbound.js";
import type OutboundMessage from "../sip-message/outbound/index.js";
import RequestMessage from "../sip-message/outbound/request.js";
import ResponseMessage from "../sip-message/outbound/response.js";
import type { DefaultMediaObjects } from "../types.js";
import { branch, fakeDomain, uuid } from "../utils.js";
import CallSession from "./index.js";

class InboundCallSession<
  M extends object = DefaultMediaObjects,
> extends CallSession<M> {
  public constructor(webPhone: WebPhone<M>, inviteMessage: InboundMessage) {
    super(webPhone);
    this.sipMessage = inviteMessage;
    this.localPeer = inviteMessage.headers.To;
    this.remotePeer = inviteMessage.headers.From;
    this.direction = "inbound";
    this.state = "ringing";
    this.emit("ringing");
  }

  // for inbound calls from call queue, there might be p-rc-api-call-info header:
  // p-rc-api-call-info: callAttributes=queue-call,reject;callerIdName=WIRELESS CALLER;displayInfo=queueName;displayInfoSub=callerIdName;queueName=Tyler's call queue
  // when there is no such a header, the method returns undefined
  public get rcApiCallInfo() {
    if (!this.sipMessage.headers["p-rc-api-call-info"]) {
      return undefined;
    }
    return Object.fromEntries(
      this.sipMessage.headers["p-rc-api-call-info"]
        .split(";")
        .map((pair) => pair.trim())
        .filter(Boolean)
        .map((pair) => {
          const [key, ...rest] = pair.split("=");
          return [key, rest.join("=")]; // Handles '=' in value
        }),
    ) as { callerIdName?: string; queueName?: string };
  }

  public async confirmReceive() {
    await this.sendRcMessage(callControlCommands.ClientReceiveConfirm);
  }

  public async toVoicemail() {
    await this.sendAndWaitForCancel(callControlCommands.ClientVoicemail);
  }

  public async decline() {
    await this.sendAndWaitForCancel(callControlCommands.ClientReject);
  }

  private async sendAndWaitForCancel(cmd: number) {
    await this.sendRcMessage(cmd);
    // wait for outbound reply to CANCEL
    return new Promise<void>((resolve) => {
      const handler = (outboundMessage: OutboundMessage) => {
        if (
          outboundMessage.headers["Call-Id"] === this.callId &&
          outboundMessage.headers.CSeq.endsWith(" CANCEL")
        ) {
          this.webPhone.sipClient.off("outboundMessage", handler);
          resolve();
        }
      };
      this.webPhone.sipClient.on("outboundMessage", handler);
    });
  }

  public async forward(target: string) {
    await this.sendRcMessage(callControlCommands.ClientForward, {
      FwdDly: "0",
      Phn: target,
      PhnTp: "3",
    });
    // wait for the final SIP message
    return new Promise<void>((resolve) => {
      const handler = (inboundMessage: InboundMessage) => {
        if (inboundMessage.subject.startsWith("CANCEL sip:")) {
          this.webPhone.sipClient.off("inboundMessage", handler);
          resolve();
        }
      };
      this.webPhone.sipClient.on("inboundMessage", handler);
    });
  }

  public async startReply() {
    await this.sendRcMessage(callControlCommands.ClientStartReply);
  }
  public async reply(text: string): Promise<RcMessage> {
    await this.sendRcMessage(callControlCommands.ClientReply, {
      RepTp: "0",
      Bdy: text,
    });
    return new Promise((resolve) => {
      const sessionCloseHandler = async (inboundMessage: InboundMessage) => {
        if (inboundMessage.subject.startsWith("MESSAGE sip:")) {
          const rcMessage = await RcMessage.fromXml(inboundMessage.body);
          if (
            rcMessage.headers.Cmd ===
            callControlCommands.SessionClose.toString()
          ) {
            this.webPhone.sipClient.off("inboundMessage", sessionCloseHandler);
            resolve(rcMessage);
            // no need to dispose session here, session will dispose unpon CANCEL or BYE
          }
        }
      };
      this.webPhone.sipClient.on("inboundMessage", sessionCloseHandler);
    });
  }

  public async answer() {
    await this.init();

    // most INVITE message will have a body with SDP offer.
    if (this.sipMessage.body.length > 0) {
      const sdp = await this.answerOffer(this.sipMessage.body);

      const newMessage = new ResponseMessage(this.sipMessage, {
        responseCode: 200,
        headers: {
          "Content-Type": "application/sdp",
        },
        body: sdp,
      });
      await this.webPhone.sipClient.reply(newMessage);
    } else {
      // some INVITE message has an empty body. For example, when you invoke RESTful API /pickup to answer a call from a call queue
      const sdp = await this.createOffer({
        iceRestart: true,
      });

      const newMessage = new ResponseMessage(this.sipMessage, {
        responseCode: 200,
        headers: {
          "Content-Type": "application/sdp",
        },
        body: sdp,
      });
      const ackMessage = await this.webPhone.sipClient.request(
        newMessage as RequestMessage,
      );
      this.sipMessage = ackMessage;
      void Promise.resolve()
        .then(() => this.requireMediaSession().applyAnswer(ackMessage.body))
        .catch(() => {});
    }

    this.state = "answered";
    this.emit("answered");

    // wait for the final SIP message
    return new Promise<void>((resolve) => {
      const handler = async (inboundMessage: InboundMessage) => {
        if (inboundMessage.subject.startsWith("MESSAGE sip:")) {
          const rcMessage = await RcMessage.fromXml(inboundMessage.body);
          if (
            rcMessage.headers.Cmd ===
            callControlCommands.AlreadyProcessed.toString()
          ) {
            this.webPhone.sipClient.off("inboundMessage", handler);
            resolve();
          }
        }
      };
      this.webPhone.sipClient.on("inboundMessage", handler);
    });
  }

  protected async sendRcMessage(
    cmd: number,
    body:
      | Record<string | number | symbol, never>
      | {
          RepTp: string;
          Bdy: string;
        }
      | {
          FwdDly: string;
          Phn: string;
          PhnTp: string;
        } = {},
  ) {
    if (!this.sipMessage.headers["P-rc"]) {
      return;
    }
    const rcMessage = await RcMessage.fromXml(this.sipMessage.headers["P-rc"]);
    const newRcMessage = new RcMessage(
      {
        SID: rcMessage.headers.SID,
        Req: rcMessage.headers.Req,
        From: rcMessage.headers.To,
        To: rcMessage.headers.From,
        Cmd: cmd.toString(),
      },
      {
        Cln: this.webPhone.sipInfo.authorizationId,
        ...body,
      },
    );
    const requestSipMessage = new RequestMessage(
      `MESSAGE sip:${newRcMessage.headers.To} SIP/2.0`,
      {
        Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
        To: `<sip:${newRcMessage.headers.To}>`,
        From: `<sip:${this.webPhone.sipInfo.username}@${this.webPhone.sipInfo.domain}>;tag=${uuid()}`,
        "Call-Id": this.callId,
        "Content-Type": "x-rc/agent",
      },
      newRcMessage.toXml(),
    );
    await this.webPhone.sipClient.request(requestSipMessage);
  }
}

export default InboundCallSession;
