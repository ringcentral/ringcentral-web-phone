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
  public localSdp = LOCAL_SDP;
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
    return this.localSdp;
  }
  public async createAnswer(offer: string) {
    this.offerAnswers.push(offer);
    return this.localSdp;
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

const inboundInvite = (body = REMOTE_OFFER, callId = "call-id") =>
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
    body,
  );

test("projects inbound SIP messages onto the matching live Call Session", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient, autoAnswer: false });
  const globalMessages: InboundMessage[] = [];
  sipClient.on("inboundMessage", (message) => globalMessages.push(message));

  const invite = inboundInvite();
  const callId = invite.headers["Call-Id"];
  invite.headers["Call-ID"] = callId;
  delete invite.headers["Call-Id"];
  sipClient.emit("inboundMessage", invite);
  const session = webPhone.callSessions[0];
  expect(session.callId).toBe(callId);
  const scopedMessages: InboundMessage[] = [];
  session.on("inboundMessage", (message) => scopedMessages.push(message));

  await expect.poll(() => sipClient.replies).toHaveLength(2);
  expect(scopedMessages).toEqual([]);

  for (const [index, header] of ["Call-Id", "Call-ID", "call-id"].entries()) {
    const message = new InboundMessage("INFO sip:100@example.com SIP/2.0", {
      CSeq: `${index + 2} INFO`,
      From: `<sip:101@example.com>;tag=other-${index}`,
      To: `<sip:100@example.com>;tag=different-${index}`,
      [header]: callId,
    });
    sipClient.emit("inboundMessage", message);
    expect(scopedMessages.at(-1)).toBe(message);
  }

  for (const headers of [
    { "Call-Id": callId.toUpperCase() },
    { CSeq: "5 INFO" },
    { i: callId },
  ]) {
    sipClient.emit(
      "inboundMessage",
      new InboundMessage("INFO sip:100@example.com SIP/2.0", {
        CSeq: "5 INFO",
        ...headers,
      }),
    );
  }
  expect(scopedMessages).toHaveLength(3);

  const bye = new InboundMessage("BYE sip:100@example.com SIP/2.0", {
    CSeq: "6 BYE",
    "Call-ID": callId,
  });
  sipClient.emit("inboundMessage", bye);
  expect(scopedMessages.at(-1)).toBe(bye);
  expect(scopedMessages).toHaveLength(4);
  expect(webPhone.callSessions).toHaveLength(0);

  sipClient.emit(
    "inboundMessage",
    new InboundMessage("INFO sip:100@example.com SIP/2.0", {
      CSeq: "7 INFO",
      "Call-Id": callId,
    }),
  );
  expect(scopedMessages).toHaveLength(4);
  expect(globalMessages[0]).toBe(invite);
  expect(globalMessages).toHaveLength(9);
});

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
        new InboundMessage("SIP/2.0 486 Busy Here", {
          CSeq: progress.headers.CSeq,
          "Call-Id": "other-call",
        }),
      );
      sipClient.emit(
        "inboundMessage",
        new InboundMessage(
          "SIP/2.0 200 OK",
          {
            CSeq: progress.headers.CSeq,
            "Call-Id": message.headers["Call-Id"],
          },
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
  webPhone.callSessions.push(offered);
  const offeredAnswer = offered.answer();

  await expect(offeredAnswer).resolves.toBeUndefined();

  expect(offeredWebRtc.offerAnswers).toEqual([offered.sipMessage.body]);
  expect(sipClient.replies[0].body).toBe(`${LOCAL_SDP}\r\n`);

  sipClient.replies = [];
  sipClient.requestHandler = async (message) =>
    new InboundMessage(
      "ACK sip:100@example.com SIP/2.0",
      {
        Via: message.headers.Via,
        CSeq: message.headers.CSeq.replace(" INVITE", " ACK"),
        "Call-Id": message.headers["Call-Id"],
      },
      REMOTE_ANSWER,
    );
  webPhone.callSessions.length = 0;
  const offerless = new InboundCallSession(
    webPhone,
    inboundInvite("", "offerless-call"),
  );
  webPhone.callSessions.push(offerless);
  const offerlessAnswer = offerless.answer();

  await expect.poll(() => offerless.state).toBe("answered");
  expect(offerlessWebRtc.offers).toEqual([{ iceRestart: true }]);
  expect(offerlessWebRtc.appliedAnswers).toEqual([NORMALIZED_REMOTE_ANSWER]);
  await offerlessAnswer;
});

test("correlates JSON command results on the Call Session", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new InboundCallSession(webPhone, inboundInvite());
  webPhone.callSessions.push(session);

  const resultPromise = session.startRecording();
  await expect.poll(() => sipClient.requests).toHaveLength(1);
  const request = JSON.parse(sipClient.requests[0].body).request;
  const emitResult = (
    callId: string,
    reqid: number,
    command: string,
    code: number,
  ) => {
    sipClient.emit(
      "inboundMessage",
      new InboundMessage(
        "INFO sip:100@example.com SIP/2.0",
        { CSeq: "2 INFO", "Call-Id": callId },
        JSON.stringify({
          response: {
            reqid,
            command,
            result: { code, description: String(code) },
          },
        }),
      ),
    );
  };
  emitResult("other-call", request.reqid, request.command, 1);
  emitResult(session.callId, request.reqid + 1, request.command, 2);
  emitResult(session.callId, request.reqid, "stopcallrecord", 3);
  emitResult(session.callId, request.reqid, request.command, 0);

  await expect(resultPromise).resolves.toEqual({ code: 0, description: "0" });
});

test("completes and times out transfers on the Call Session", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new InboundCallSession(webPhone, inboundInvite());
  webPhone.callSessions.push(session);
  let completed = false;
  const transfer = session.transfer("102", 100).then(() => {
    completed = true;
  });
  await expect.poll(() => sipClient.requests).toHaveLength(1);
  sipClient.emit(
    "inboundMessage",
    new InboundMessage("BYE sip:100@example.com SIP/2.0", {
      CSeq: "2 BYE",
      "Call-Id": "other-call",
    }),
  );
  await new Promise((resolve) => setTimeout(resolve));
  expect(completed).toBe(false);
  sipClient.emit(
    "inboundMessage",
    new InboundMessage("BYE sip:100@example.com SIP/2.0", {
      CSeq: "3 BYE",
      "Call-Id": session.callId,
    }),
  );
  await transfer;
  expect(session.state).toBe("disposed");
  expect(webPhone.callSessions).toEqual([]);

  const timedOut = new InboundCallSession(
    webPhone,
    inboundInvite(REMOTE_OFFER, "timeout-call"),
  );
  webPhone.callSessions.push(timedOut);
  await expect(timedOut.transfer("102", 1)).rejects.toThrow("timed out");
});

test("completes inbound forward on the Call Session CANCEL", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new InboundCallSession(webPhone, inboundInvite());
  webPhone.callSessions.push(session);
  let completed = false;
  const forward = session.forward("102").then(() => {
    completed = true;
  });
  await expect.poll(() => sipClient.requests).toHaveLength(1);
  sipClient.emit(
    "inboundMessage",
    new InboundMessage("CANCEL sip:100@example.com SIP/2.0", {
      CSeq: "2 CANCEL",
      "Call-Id": "other-call",
    }),
  );
  await new Promise((resolve) => setTimeout(resolve));
  expect(completed).toBe(false);
  sipClient.emit(
    "inboundMessage",
    new InboundMessage("CANCEL sip:100@example.com SIP/2.0", {
      CSeq: "3 CANCEL",
      "Call-Id": session.callId,
    }),
  );
  await forward;
  expect(session.state).toBe("disposed");
  expect(webPhone.callSessions).toEqual([]);
});

test("reports an outbound final-response failure on the Call Session", async () => {
  const sipClient = new FakeSipClient();
  sipClient.requestHandler = async (message) => {
    if (!message.headers["Proxy-Authorization"]) {
      return new InboundMessage("SIP/2.0 407 Proxy Authentication Required", {
        "Proxy-Authenticate": 'Digest, nonce="nonce"',
      });
    }
    const progress = new InboundMessage("SIP/2.0 183 Session Progress", {
      Via: message.headers.Via,
      CSeq: message.headers.CSeq,
      From: message.headers.From,
      To: `${message.headers.To};tag=remote`,
      "Call-Id": message.headers["Call-Id"],
    });
    setTimeout(() => {
      sipClient.emit(
        "inboundMessage",
        new InboundMessage("SIP/2.0 486 Busy Here", {
          CSeq: progress.headers.CSeq,
          "call-id": message.headers["Call-Id"],
        }),
      );
    });
    return progress;
  };
  const webPhone = new WebPhone({
    sipInfo,
    sipClient,
    webRtcSessionFactory: () => new FakeWebRtcSession(),
  });

  const session = await webPhone.call("invalid");

  expect(session.state).toBe("disposed");
  expect(webPhone.callSessions).toHaveLength(0);
});

test("handles an outbound failure returned as the authenticated INVITE response", async () => {
  const sipClient = new FakeSipClient();
  sipClient.requestHandler = async (message) => {
    if (!message.headers["Proxy-Authorization"]) {
      return new InboundMessage("SIP/2.0 407 Proxy Authentication Required", {
        "Proxy-Authenticate": 'Digest, nonce="nonce"',
      });
    }
    return new InboundMessage("SIP/2.0 486 Busy Here", {
      Via: message.headers.Via,
      CSeq: message.headers.CSeq,
      From: message.headers.From,
      To: `${message.headers.To};tag=remote`,
      "Call-Id": message.headers["Call-Id"],
    });
  };
  const webPhone = new WebPhone({
    sipInfo,
    sipClient,
    webRtcSessionFactory: () => new FakeWebRtcSession(),
  });

  const session = await Promise.race([
    webPhone.call("invalid"),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("call did not resolve")), 50),
    ),
  ]);

  expect(session.state).toBe("disposed");
  expect(webPhone.callSessions).toHaveLength(0);
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

test("updates only the SDP origin version and direction", async () => {
  const sipClient = new FakeSipClient();
  const webRtcSession = new FakeWebRtcSession();
  webRtcSession.localSdp = `${[
    "v=0",
    "o=- 100 7 IN IP4 127.0.0.1",
    "s=-",
    "t=0 0",
    "m=audio 9 RTP/AVP 0",
    "c=IN IP4 0.0.0.0",
    "a=x-before:keep",
    "a=sendrecv",
    "a=x-after:keep",
  ].join("\r\n")}\r\n`;
  const webPhone = new WebPhone({
    sipInfo,
    sipClient,
    webRtcSessionFactory: () => webRtcSession,
  });
  const session = new InboundCallSession(webPhone, inboundInvite());
  await session.init();
  await session.handleReInvite(inboundInvite());

  await session.hold();
  await session.unhold();

  expect(sipClient.requests.map((request) => request.body)).toEqual([
    webRtcSession.localSdp
      .replace("o=- 100 7", "o=- 100 8")
      .replace("a=sendrecv", "a=sendonly"),
    webRtcSession.localSdp.replace("o=- 100 7", "o=- 100 9"),
  ]);
});

test("rejects SDP with a missing or malformed origin", async () => {
  for (const origin of [undefined, "o=invalid"]) {
    const sipClient = new FakeSipClient();
    const webRtcSession = new FakeWebRtcSession();
    webRtcSession.localSdp = ["v=0", origin, "s=-", "t=0 0"]
      .filter((line) => line !== undefined)
      .join("\r\n");
    const webPhone = new WebPhone({
      sipInfo,
      sipClient,
      webRtcSessionFactory: () => webRtcSession,
    });
    const session = new InboundCallSession(webPhone, inboundInvite());
    await session.init();
    await session.handleReInvite(inboundInvite());

    await expect(session.hold()).rejects.toThrow("Invalid SDP origin");
    expect(sipClient.requests).toHaveLength(0);
  }
});

test("retries a failed factory and initializes once", async () => {
  const sipClient = new FakeSipClient();
  const webRtcSession = new FakeWebRtcSession();
  const factoryError = new Error("tab unavailable");
  let calls = 0;
  const webPhone = new WebPhone({
    sipInfo,
    sipClient,
    webRtcSessionFactory: () => {
      calls += 1;
      if (calls === 1) throw factoryError;
      return webRtcSession;
    },
  });
  const session = new InboundCallSession(webPhone, inboundInvite());

  await expect(session.init()).rejects.toBe(factoryError);
  await Promise.all([session.init(), session.init()]);

  expect(calls).toBe(2);
});

test("routes a same-Call-ID inbound INVITE to a live Call Session by Call-ID alone", async () => {
  const sipClient = new FakeSipClient();
  const webRtcSession = new FakeWebRtcSession();
  const webPhone = new WebPhone({
    sipInfo,
    sipClient,
    webRtcSessionFactory: () => webRtcSession,
  });
  let inboundCalls = 0;
  webPhone.on("inboundCall", () => {
    inboundCalls += 1;
  });

  const firstInvite = inboundInvite();
  const callId = firstInvite.headers["Call-Id"];
  firstInvite.headers["Call-ID"] = callId;
  delete firstInvite.headers["Call-Id"];
  sipClient.emit("inboundMessage", firstInvite);

  await expect.poll(() => webPhone.callSessions).toHaveLength(1);
  await expect.poll(() => sipClient.replies).toHaveLength(2);
  expect(inboundCalls).toBe(1);
  expect(webPhone.callSessions[0].localPeer).toBe(firstInvite.headers.To);
  expect(webPhone.callSessions[0].remotePeer).toBe(firstInvite.headers.From);
  await webPhone.callSessions[0].init();

  const sessionCount = webPhone.callSessions.length;
  const differentTagInvite = inboundInvite(`v=${callId}`, callId);
  differentTagInvite.headers.To = "<sip:100@example.com>;tag=other-local";
  differentTagInvite.headers.From = "<sip:101@example.com>;tag=other-remote";
  differentTagInvite.headers["Call-ID"] = callId;
  sipClient.emit("inboundMessage", differentTagInvite);

  await expect
    .poll(() => webRtcSession.offerAnswers)
    .toContain(differentTagInvite.body);
  expect(webPhone.callSessions).toHaveLength(sessionCount);
  expect(inboundCalls).toBe(1);
  expect(webPhone.callSessions[0].callId).toBe(callId);
  expect(webPhone.callSessions[0].localPeer).toBe(firstInvite.headers.To);
  expect(webPhone.callSessions[0].remotePeer).toBe(firstInvite.headers.From);
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
