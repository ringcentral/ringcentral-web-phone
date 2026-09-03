import { expect, test } from "@playwright/test";

import WebPhone from "../src";
import type InboundCallSession from "../src/call-session/inbound";
import EventEmitter from "../src/event-emitter";
import callControlCommands from "../src/rc-message/call-control-commands";
import RcMessage from "../src/rc-message/rc-message";
import InboundMessage from "../src/sip-message/inbound";
import type OutboundMessage from "../src/sip-message/outbound";
import type RequestMessage from "../src/sip-message/outbound/request";
import ResponseMessage from "../src/sip-message/outbound/response";
import type { SipClient, SipInfo, WebRtcSession } from "../src/types";

const LOCAL_SDP = [
  "v=0",
  "o=- 1 1 IN IP4 127.0.0.1",
  "s=-",
  "t=0 0",
  "m=audio 9 RTP/AVP 0",
  "c=IN IP4 0.0.0.0",
  "a=sendrecv",
].join("\r\n");

const sipInfo: SipInfo = {
  authorizationId: "id",
  domain: "example.com",
  outboundProxy: "example.com",
  outboundProxyBackup: "example.com",
  username: "100",
  password: "password",
  stunServers: ["stun.example.com"],
};

class FakeSipClient extends EventEmitter implements SipClient {
  public requests: RequestMessage[] = [];
  public replies: OutboundMessage[] = [];
  public teardown: string[] = [];
  public disposed = false;

  public async start() {}

  public async request(message: RequestMessage) {
    this.requests.push(message);
    this.emit("outboundMessage", message);

    if (message.subject.startsWith("INVITE ")) {
      if (!message.headers["Proxy-Authorization"]) {
        return new InboundMessage("SIP/2.0 407 Proxy Authentication Required", {
          "Proxy-Authenticate": 'Digest, nonce="nonce"',
        });
      }
      return this.finalResponse(message, "SIP/2.0 183 Session Progress");
    }

    if (
      message.subject.startsWith("MESSAGE ") &&
      RcMessage.fromXml(message.body).headers.Cmd ===
        callControlCommands.ClientReject.toString()
    ) {
      this.teardown.push(`decline:${message.headers["Call-Id"]}`);
      // the SIP server cancels the inbound ringing call in response to the
      // decline, and the client auto-replies 200 OK to the inbound CANCEL
      setTimeout(async () => {
        const cancel = new InboundMessage(
          "CANCEL sip:100@example.com SIP/2.0",
          {
            CSeq: "2 CANCEL",
            "Call-Id": message.headers["Call-Id"],
          },
        );
        this.emit("inboundMessage", cancel);
        await this.reply(new ResponseMessage(cancel, { responseCode: 200 }));
      });
      return this.finalResponse(message, "SIP/2.0 200 OK");
    }

    if (message.subject.startsWith("BYE ")) {
      this.teardown.push(`hangup:${message.headers["Call-Id"]}`);
      const response = this.finalResponse(message, "SIP/2.0 200 OK");
      this.emit("inboundMessage", response);
      return response;
    }

    if (message.subject.startsWith("CANCEL ")) {
      this.teardown.push(`cancel:${message.headers["Call-Id"]}`);
      const response = this.finalResponse(message, "SIP/2.0 200 OK");
      this.emit("inboundMessage", response);
      return response;
    }

    return this.finalResponse(message, "SIP/2.0 200 OK");
  }

  public async reply(message: ResponseMessage) {
    this.replies.push(message);
    this.emit("outboundMessage", message);
  }

  public async dispose() {
    this.disposed = true;
    this.teardown.push("sip-client:disposed");
  }

  private finalResponse(message: RequestMessage, subject: string) {
    return new InboundMessage(subject, {
      Via: message.headers.Via,
      CSeq: message.headers.CSeq,
      From: message.headers.From,
      To: message.headers.To,
      "Call-Id": message.headers["Call-Id"],
    });
  }
}

class FakeWebRtcSession implements WebRtcSession {
  public disposed = false;
  public async createOffer() {
    return LOCAL_SDP;
  }
  public async createAnswer() {
    return LOCAL_SDP;
  }
  public async applyAnswer() {}
  public async changeInputDevice() {}
  public async changeOutputDevice() {}
  public setMuted() {}
  public sendDtmf() {}
  public dispose() {
    this.disposed = true;
  }
}

const inboundInvite = (callId: string) =>
  new InboundMessage(
    "INVITE sip:100@example.com SIP/2.0",
    {
      Via: "SIP/2.0/WSS example.com;branch=branch",
      CSeq: "1 INVITE",
      From: "<sip:101@example.com>;tag=remote",
      To: "<sip:100@example.com>;tag=local",
      "Call-Id": callId,
      "P-rc": new RcMessage(
        { SID: "sid", Req: "req", From: "101", To: "100" },
        {},
      ).toXml(),
    },
    "remote offer",
  );

test("disposes all three Call Sessions when the Web Phone is disposed while termination removes Call Sessions from the collection", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({
    sipInfo,
    sipClient,
    autoAnswer: false,
    webRtcSessionFactory: () => new FakeWebRtcSession(),
  });
  const teardown: string[] = [];

  sipClient.emit("inboundMessage", inboundInvite("answered-call"));
  await expect.poll(() => sipClient.requests).toHaveLength(1);
  const answered = webPhone.callSessions[0] as InboundCallSession;
  await answered.answer();
  expect(answered.state).toBe("answered");

  sipClient.emit("inboundMessage", inboundInvite("inbound-ringing-call"));
  await expect.poll(() => sipClient.requests).toHaveLength(2);
  const inboundRinging = webPhone.callSessions[1];

  void webPhone.call("103");
  const outboundRinging = webPhone.callSessions[2];
  await expect.poll(() => outboundRinging.state).toBe("ringing");

  expect(webPhone.callSessions).toEqual([
    answered,
    inboundRinging,
    outboundRinging,
  ]);

  answered.on("disposed", () => teardown.push("answered:disposed"));
  inboundRinging.on("disposed", () =>
    teardown.push("inbound-ringing:disposed"),
  );
  outboundRinging.on("disposed", () =>
    teardown.push("outbound-ringing:disposed"),
  );

  await webPhone.dispose();

  expect(
    sipClient.requests.filter(
      (request) =>
        request.subject.startsWith("BYE ") &&
        request.headers["Call-Id"] === answered.callId,
    ),
  ).toHaveLength(1);
  expect(
    sipClient.requests.filter(
      (request) =>
        request.subject.startsWith("MESSAGE ") &&
        RcMessage.fromXml(request.body).headers.Cmd ===
          callControlCommands.ClientReject.toString(),
    ),
  ).toHaveLength(1);
  expect(
    sipClient.requests.filter(
      (request) =>
        request.subject.startsWith("CANCEL ") &&
        request.headers["Call-Id"] === outboundRinging.callId,
    ),
  ).toHaveLength(1);

  expect(answered.state).toBe("disposed");
  expect(inboundRinging.state).toBe("disposed");
  expect(outboundRinging.state).toBe("disposed");
  expect(webPhone.callSessions).toEqual([]);

  const sipClientDisposal = teardown.indexOf("sip-client:disposed");
  expect(sipClientDisposal).toBeGreaterThanOrEqual(0);
  for (const marker of [
    `hangup:${answered.callId}`,
    `decline:${inboundRinging.callId}`,
    `cancel:${outboundRinging.callId}`,
    "answered:disposed",
    "inbound-ringing:disposed",
    "outbound-ringing:disposed",
  ]) {
    expect(teardown.indexOf(marker)).toBeGreaterThanOrEqual(0);
    expect(teardown.indexOf(marker)).toBeLessThan(sipClientDisposal);
  }
  expect(sipClient.disposed).toBe(true);
});
