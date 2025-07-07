import RequestMessage from "../sip-message/outbound/request.js";
import type InboundMessage from "../sip-message/inbound.js";
import type WebPhone from "../index.js";
import CallSession from "./index.js";
import {
  branch,
  extractAddress,
  fakeDomain,
  fakeEmail,
  generateAuthorization,
  uuid,
  withoutTag,
} from "../utils.js";

class OutboundCallSession extends CallSession {
  public constructor(webPhone: WebPhone) {
    super(webPhone);
    this.direction = "outbound";
  }

  public async call(
    callee: string,
    callerId?: string,
    options?: { headers?: Record<string, string> },
  ) {
    const offer = await this.rtcPeerConnection.createOffer({
      iceRestart: true,
    });
    await this.rtcPeerConnection.setLocalDescription(offer);

    // wait for ICE gathering to complete
    await new Promise<void>((resolve) => {
      const timeout = setTimeout(resolve, 1500); // fallback safeguard
      const onIceCandidate = (event: RTCPeerConnectionIceEvent) => {
        if (!event.candidate) {
          cleanup();
          resolve();
        }
      };
      const onStateChange = () => {
        if (this.rtcPeerConnection.iceGatheringState === "complete") {
          cleanup();
          resolve();
        }
      };
      const cleanup = () => {
        clearTimeout(timeout);
        this.rtcPeerConnection.removeEventListener(
          "icecandidate",
          onIceCandidate,
        );
        this.rtcPeerConnection.removeEventListener(
          "icegatheringstatechange",
          onStateChange,
        );
      };
      this.rtcPeerConnection.addEventListener("icecandidate", onIceCandidate);
      this.rtcPeerConnection.addEventListener(
        "icegatheringstatechange",
        onStateChange,
      );
    });
    // await new Promise((resolve) => {
    //   this.rtcPeerConnection.onicecandidate = (event) => {
    //     if (event.candidate === null) {
    //       resolve(true);
    //     }
    //   };
    //   setTimeout(() => resolve(false), 3000);
    // });

    const inviteMessage = new RequestMessage(
      `INVITE sip:${callee}@${this.webPhone.sipInfo.domain} SIP/2.0`,
      {
        "Call-Id": uuid(),
        Contact: `<sip:${fakeEmail};transport=wss>;expires=60`,
        From:
          `<sip:${this.webPhone.sipInfo.username}@${this.webPhone.sipInfo.domain}>;tag=${uuid()}`,
        To: `<sip:${callee}@${this.webPhone.sipInfo.domain}>`,
        Via: `SIP/2.0/WSS ${fakeDomain};branch=${branch()}`,
        "Content-Type": "application/sdp",
      },
      this.rtcPeerConnection.localDescription!.sdp!,
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
    const proxyAuthenticate = inboundMessage.headers["Proxy-Authenticate"];
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
    this.localPeer = progressMessage.headers.From;
    this.remotePeer = progressMessage.headers.To;

    // wait for the call to be answered
    // by SIP server design, this happens immediately, even if the callee has not received the INVITE
    return new Promise<boolean>((resolve) => {
      const answerHandler = async (message: InboundMessage) => {
        if (message.headers.CSeq === this.sipMessage.headers.CSeq) {
          this.webPhone.sipClient.off("inboundMessage", answerHandler);

          // outbound call failed, for example, invalid number
          // or emergency address is not configured properly
          if (message.subject !== "SIP/2.0 200 OK") {
            this.state = "failed";
            this.emit("failed", message.subject);
            const index = this.webPhone.callSessions.findIndex(
              (callSession) =>
                callSession.callId === message.headers["Call-Id"],
            );
            if (index !== -1) {
              this.webPhone.callSessions.splice(index, 1);
            }
            this.dispose();
            resolve(false);
            return;
          }

          this.state = "answered";
          this.emit("answered");
          this.rtcPeerConnection.setRemoteDescription({
            type: "answer",
            sdp: message.body,
          });
          const ackMessage = new RequestMessage(
            `ACK ${extractAddress(this.remotePeer)} SIP/2.0`,
            {
              "Call-Id": this.callId,
              From: this.localPeer,
              To: this.remotePeer,
              Via: this.sipMessage.headers.Via,
              CSeq: this.sipMessage.headers.CSeq.replace(" INVITE", " ACK"),
            },
          );
          await this.webPhone.sipClient.reply(ackMessage);
          resolve(true);
        }
      };
      this.webPhone.sipClient.on("inboundMessage", answerHandler);
    });
  }

  public async cancel() {
    const requestMessage = new RequestMessage(
      `CANCEL ${extractAddress(this.remotePeer)} SIP/2.0`,
      {
        "Call-Id": this.callId,
        From: this.localPeer,
        To: withoutTag(this.remotePeer),
        Via: this.sipMessage.headers.Via,
        CSeq: this.sipMessage.headers.CSeq.replace(" INVITE", " CANCEL"),
      },
    );
    await this.webPhone.sipClient.request(requestMessage);
  }
}

export default OutboundCallSession;
