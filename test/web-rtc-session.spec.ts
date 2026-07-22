import { expect, test } from "@playwright/test";

import WebPhone from "../src";
import InboundCallSession from "../src/call-session/inbound";
import CallSession from "../src/call-session/index";
import EventEmitter from "../src/event-emitter";
import RcMessage from "../src/rc-message/rc-message";
import InboundMessage from "../src/sip-message/inbound";
import type OutboundMessage from "../src/sip-message/outbound";
import type RequestMessage from "../src/sip-message/outbound/request";
import type ResponseMessage from "../src/sip-message/outbound/response";
import type {
  SipClient,
  SipInfo,
  WebRtcSession,
  WebRtcSessionFactory,
} from "../src/types";

const LOCAL_SDP = [
  "v=0",
  "o=- 1 1 IN IP4 127.0.0.1",
  "s=-",
  "t=0 0",
  "m=audio 9 RTP/AVP 0",
  "c=IN IP4 0.0.0.0",
  "a=sendrecv",
].join("\r\n");
const REMOTE_OFFER = "remote offer";
const REMOTE_ANSWER = "remote answer";
const NORMALIZED_REMOTE_ANSWER = `${REMOTE_ANSWER}\r\n`;

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
  public requestHandler = async (message: RequestMessage) =>
    new InboundMessage(
      "SIP/2.0 200 OK",
      {
        Via: message.headers.Via,
        CSeq: message.headers.CSeq,
        From: message.headers.From,
        To: message.headers.To,
        "Call-Id": message.headers["Call-Id"],
      },
      REMOTE_ANSWER,
    );

  public async start() {}
  public async request(message: RequestMessage) {
    this.requests.push(message);
    return await this.requestHandler(message);
  }
  public async reply(message: ResponseMessage) {
    this.replies.push(message);
  }
  public async dispose() {}
}

class FakeWebRtcSession implements WebRtcSession {
  public offers: Array<{ iceRestart?: boolean } | undefined> = [];
  public offerAnswers: string[] = [];
  public appliedAnswers: string[] = [];
  public inputDevices: string[] = [];
  public outputDevices: string[] = [];
  public muted: boolean[] = [];
  public dtmf: Array<[string, number | undefined, number | undefined]> = [];
  public disposed = false;

  public async createOffer(options?: { iceRestart?: boolean }) {
    this.offers.push(options);
    return LOCAL_SDP;
  }
  public async createAnswer(offer: string) {
    this.offerAnswers.push(offer);
    return LOCAL_SDP;
  }
  public async applyAnswer(answer: string) {
    this.appliedAnswers.push(answer);
  }
  public async changeInputDevice(deviceId: string) {
    this.inputDevices.push(deviceId);
  }
  public async changeOutputDevice(deviceId: string) {
    this.outputDevices.push(deviceId);
  }
  public setMuted(muted: boolean) {
    this.muted.push(muted);
  }
  public sendDtmf(tones: string, duration?: number, interToneGap?: number) {
    this.dtmf.push([tones, duration, interToneGap]);
  }
  public dispose() {
    this.disposed = true;
  }
}

const inboundInvite = (body = REMOTE_OFFER) =>
  new InboundMessage(
    "INVITE sip:100@example.com SIP/2.0",
    {
      Via: "SIP/2.0/WSS example.com;branch=branch",
      CSeq: "1 INVITE",
      From: "<sip:101@example.com>;tag=remote",
      To: "<sip:100@example.com>;tag=local",
      "Call-Id": "call-id",
    },
    body,
  );

const alreadyProcessedMessage = () =>
  new InboundMessage(
    "MESSAGE sip:100@example.com SIP/2.0",
    { CSeq: "2 MESSAGE" },
    new RcMessage({ Cmd: "7" }, {}).toXml(),
  );

const completeInboundAnswer = async (
  sipClient: FakeSipClient,
  answer: Promise<void>,
) => {
  await expect.poll(() => sipClient.replies.length).toBe(1);
  sipClient.emit("inboundMessage", alreadyProcessedMessage());
  await answer;
};

test("delegates an outbound call without browser WebRTC globals", async () => {
  const sipClient = new FakeSipClient();
  const webRtcSession = new FakeWebRtcSession();
  let factoryCalls = 0;
  let factoryContext: Parameters<WebRtcSessionFactory>[0] | undefined;
  sipClient.requestHandler = async (message) => {
    if (!message.headers["Proxy-Authorization"]) {
      return new InboundMessage("SIP/2.0 407 Proxy Authentication Required", {
        "Proxy-Authenticate": 'Digest, nonce="nonce"',
      });
    }
    const progress = new InboundMessage("SIP/2.0 100 Trying", {
      Via: message.headers.Via,
      CSeq: message.headers.CSeq,
      From: message.headers.From,
      To: `${message.headers.To};tag=remote`,
      "Call-Id": message.headers["Call-Id"],
    });
    setTimeout(() => {
      sipClient.emit(
        "inboundMessage",
        new InboundMessage(
          "SIP/2.0 200 OK",
          { CSeq: progress.headers.CSeq },
          REMOTE_ANSWER,
        ),
      );
    });
    return progress;
  };
  const webPhone = new WebPhone({
    sipInfo,
    sipClient,
    webRtcSessionFactory: (context) => {
      factoryCalls += 1;
      factoryContext = context;
      return webRtcSession;
    },
  });

  const session = await webPhone.call("101");
  await session.init();

  expect(factoryCalls).toBe(1);
  expect(factoryContext).toEqual({
    callId: session.callId,
    direction: "outbound",
    stunServers: sipInfo.stunServers,
  });
  expect(webRtcSession.offers).toEqual([{ iceRestart: true }]);
  expect(webRtcSession.appliedAnswers).toEqual([NORMALIZED_REMOTE_ANSWER]);
  expect(sipClient.requests[0].body).toBe(`${LOCAL_SDP}\r\n`);
  expect(
    sipClient.replies.some((message) => message.headers.CSeq.endsWith(" ACK")),
  ).toBe(true);
  expect(session.rtcPeerConnection).toBeUndefined();
  expect(session.mediaStream).toBeUndefined();
  expect(session.audioElement).toBeUndefined();

  await session.changeInputDevice("input");
  await session.changeOutputDevice("output");
  session.mute();
  session.unmute();
  session.sendDtmf("12#", 100, 50);
  session.dispose();

  expect(webRtcSession.inputDevices).toEqual(["input"]);
  expect(webRtcSession.outputDevices).toEqual(["output"]);
  expect(webRtcSession.muted).toEqual([true, false]);
  expect(webRtcSession.dtmf).toEqual([["12#", 100, 50]]);
  expect(webRtcSession.disposed).toBe(true);
  expect(session.state).toBe("disposed");
});

test("delegates inbound offer and offerless call negotiation", async () => {
  const sipClient = new FakeSipClient();
  const offeredWebRtc = new FakeWebRtcSession();
  const offerlessWebRtc = new FakeWebRtcSession();
  const sessions = [offeredWebRtc, offerlessWebRtc];
  const webPhone = new WebPhone({
    sipInfo,
    sipClient,
    webRtcSessionFactory: () => sessions.shift() as WebRtcSession,
  });
  const offered = new InboundCallSession(webPhone, inboundInvite());
  const offeredAnswer = offered.answer();

  await completeInboundAnswer(sipClient, offeredAnswer);

  expect(offeredWebRtc.offerAnswers).toEqual([offered.sipMessage.body]);
  expect(sipClient.replies[0].body).toBe(`${LOCAL_SDP}\r\n`);

  sipClient.replies = [];
  sipClient.requestHandler = async (message) =>
    new InboundMessage(
      "ACK sip:100@example.com SIP/2.0",
      {
        Via: message.headers.Via,
        CSeq: message.headers.CSeq.replace(" INVITE", " ACK"),
      },
      REMOTE_ANSWER,
    );
  const offerless = new InboundCallSession(webPhone, inboundInvite(""));
  const offerlessAnswer = offerless.answer();

  await expect.poll(() => offerless.state).toBe("answered");
  expect(offerlessWebRtc.offers).toEqual([{ iceRestart: true }]);
  expect(offerlessWebRtc.appliedAnswers).toEqual([NORMALIZED_REMOTE_ANSWER]);
  sipClient.emit("inboundMessage", alreadyProcessedMessage());
  await offerlessAnswer;
});

test("keeps hold SDP policy in CallSession", async () => {
  const sipClient = new FakeSipClient();
  const webRtcSession = new FakeWebRtcSession();
  const webPhone = new WebPhone({
    sipInfo,
    sipClient,
    webRtcSessionFactory: () => webRtcSession,
  });
  const session = new InboundCallSession(webPhone, inboundInvite());
  await session.init();
  const reInvite = inboundInvite();
  await session.handleReInvite(reInvite);
  expect(webRtcSession.offerAnswers).toEqual([reInvite.body]);
  sipClient.requests = [];

  await session.hold();
  await session.unhold();

  expect(webRtcSession.offers).toHaveLength(0);
  expect(sipClient.requests[0].body).toContain("a=sendonly");
  expect(sipClient.requests[1].body).toContain("a=sendrecv");

  await session.reInvite(false);
  await session.unhold();

  expect(webRtcSession.offers).toEqual([{ iceRestart: true }]);
  expect(sipClient.requests[2].body).toContain("a=sendonly");
  expect(sipClient.requests[3].body).toContain("a=sendrecv");
  expect(webRtcSession.appliedAnswers).toEqual([NORMALIZED_REMOTE_ANSWER]);
});

test("retries the factory after initialization failure", async () => {
  const sipClient = new FakeSipClient();
  const webRtcSession = new FakeWebRtcSession();
  let calls = 0;
  const webPhone = new WebPhone({
    sipInfo,
    sipClient,
    webRtcSessionFactory: () => {
      calls += 1;
      if (calls === 1) throw new Error("tab unavailable");
      return webRtcSession;
    },
  });
  const session = new InboundCallSession(webPhone, inboundInvite());

  await expect(session.init()).rejects.toThrow("tab unavailable");
  await session.init();
  await session.init();

  expect(calls).toBe(2);
});

test("preserves synchronous browser media behavior without a factory", () => {
  const webPhone = new WebPhone({ sipInfo, sipClient: new FakeSipClient() });
  const session = new CallSession(webPhone);
  const dtmf: unknown[][] = [];
  const sender = {
    track: { enabled: true },
    dtmf: {
      canInsertDTMF: true,
      insertDTMF: (...args: unknown[]) => dtmf.push(args),
    },
  };
  let closed = false;
  let stopped = false;
  const peerConnection = {
    close: () => {
      closed = true;
    },
    getSenders: () => [sender],
  } as unknown as RTCPeerConnection;
  const mediaStream = {
    getTracks: () => [
      {
        stop: () => {
          stopped = true;
        },
      },
    ],
  } as unknown as MediaStream;
  const audioElement = { srcObject: {} } as HTMLAudioElement;
  let emittedStream: MediaStream | undefined;
  let disposedWithCleanMedia = false;
  session.on("mediaStreamSet", (stream) => {
    emittedStream = stream;
  });
  session.on("disposed", () => {
    disposedWithCleanMedia =
      closed && stopped && audioElement.srcObject === null;
  });
  session.rtcPeerConnection = peerConnection;
  session.mediaStream = mediaStream;
  session.audioElement = audioElement;

  expect(session.mute()).toBeUndefined();
  expect(sender.track.enabled).toBe(false);
  expect(session.unmute()).toBeUndefined();
  expect(sender.track.enabled).toBe(true);
  expect(session.sendDtmf("12#", 100, 50)).toBeUndefined();
  expect(session.dispose()).toBeUndefined();

  expect(dtmf).toEqual([["12#", 100, 50]]);
  expect(emittedStream).toBe(mediaStream);
  expect(session._mediaStream).toBe(mediaStream);
  expect(disposedWithCleanMedia).toBe(true);
  expect(session.state).toBe("disposed");
});
