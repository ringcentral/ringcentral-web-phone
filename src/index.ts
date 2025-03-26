import type InboundMessage from "./sip-message/inbound.js";
import ResponseMessage from "./sip-message/outbound/response.js";
import InboundCallSession from "./call-session/inbound.js";
import OutboundCallSession from "./call-session/outbound.js";
import EventEmitter from "./event-emitter.js";
import type CallSession from "./call-session/index.js";
import { DefaultSipClient } from "./sip-client.js";
import type {
  DeviceManager,
  SipClient,
  SipInfo,
  WebPhoneOptions,
} from "./types.js";
import { DefaultDeviceManager } from "./device-manager.js";

class WebPhone extends EventEmitter {
  public sipInfo: SipInfo;
  public sipClient: SipClient;
  public deviceManager: DeviceManager;
  public callSessions: CallSession[] = [];
  public autoAnswer = false;

  public disposed = false;

  public constructor(options: WebPhoneOptions) {
    super();
    this.sipInfo = options.sipInfo;
    this.sipClient = options.sipClient ?? new DefaultSipClient(options);
    this.deviceManager = options.deviceManager ?? new DefaultDeviceManager();
    this.autoAnswer = options.autoAnswer ?? false;

    this.sipClient.on(
      "inboundMessage",
      async (inboundMessage: InboundMessage) => {
        // either inbound BYE/CANCEL or server reply to outbound BYE/CANCEL
        if (
          inboundMessage.headers.CSeq.endsWith(" BYE") ||
          inboundMessage.headers.CSeq.endsWith(" CANCEL")
        ) {
          const index = this.callSessions.findIndex(
            (callSession) =>
              callSession.callId === inboundMessage.headers["Call-Id"],
          );
          if (index !== -1) {
            this.callSessions[index].dispose();
            this.callSessions.splice(index, 1);
          }
        }

        // listen for incoming calls
        if (!inboundMessage.subject.startsWith("INVITE sip:")) {
          return;
        }

        // re-INVITE
        const callSession = this.callSessions.find(
          (callSession) => {
            const sipMessage = callSession.sipMessage;
            return sipMessage.headers["Call-Id"] ===
                inboundMessage.headers["Call-Id"] &&
              sipMessage.headers.To === inboundMessage.headers.To &&
              sipMessage.headers.From === inboundMessage.headers.From;
          },
        );
        if (callSession) {
          callSession.handleReInvite(inboundMessage);
          return;
        }

        this.callSessions.push(new InboundCallSession(this, inboundMessage));
        // write it this way so that it will be compatible with manate, inboundCallSession will be managed
        const inboundCallSession = this
          .callSessions[this.callSessions.length - 1] as InboundCallSession;
        this.emit("inboundCall", inboundCallSession);

        // tell SIP server that we are ringing
        let tempMesage = new ResponseMessage(inboundMessage, {
          responseCode: 100,
        });
        await this.sipClient.reply(tempMesage);
        tempMesage = new ResponseMessage(inboundMessage, { responseCode: 180 });
        await this.sipClient.reply(tempMesage);

        // if we don't send this, toVoicemail() will not work
        await inboundCallSession.confirmReceive();

        // auto answer
        if (!this.autoAnswer) {
          return;
        }
        if (
          inboundCallSession.sipMessage.headers["Alert-Info"] !== "Auto Answer"
        ) {
          return;
        }
        let delay = 0;
        const callInfoHeader =
          inboundCallSession.sipMessage.headers["Call-Info"];
        if (callInfoHeader) {
          const match = callInfoHeader.match(/Answer-After=(\d+)/);
          if (match) {
            delay = parseInt(match[1], 10); // Convert the captured value to an integer
          }
        }
        setTimeout(() => {
          inboundCallSession.answer();
        }, delay);
      },
    );
  }

  public async start() {
    await this.sipClient.start();
  }

  public async dispose() {
    this.disposed = true;
    // properly dispose all call sessions
    for (const callSession of this.callSessions) {
      if (callSession.state === "answered") {
        await callSession.hangup();
      } else if (callSession.direction === "inbound") {
        await (callSession as InboundCallSession).decline();
      } else {
        await (callSession as OutboundCallSession).cancel();
      }
      // callSession.dispose() will be auto triggered by the above methods
    }
    this.removeAllListeners();
    await this.sipClient.dispose();
  }

  // make an outbound call
  public async call(
    callee: string,
    callerId?: string,
    options?: { headers?: Record<string, string> },
  ) {
    this.callSessions.push(new OutboundCallSession(this));
    // write it this way so that it will be compatible with manate, outboundCallSession will be managed
    const outboundCallSession = this
      .callSessions[this.callSessions.length - 1] as OutboundCallSession;
    this.emit("outboundCall", outboundCallSession);
    await outboundCallSession.init();
    await outboundCallSession.call(callee, callerId, options);
    return outboundCallSession;
  }
}

export default WebPhone;
