import { expect, test } from "@playwright/test";
import WebPhone from "../src";
import InboundCallSession from "../src/call-session/inbound";
import OutboundCallSession from "../src/call-session/outbound";
import EventEmitter from "../src/event-emitter";
import InboundMessage from "../src/sip-message/inbound";
import type RequestMessage from "../src/sip-message/outbound/request";
import type ResponseMessage from "../src/sip-message/outbound/response";
import type {
  MediaProvider,
  MediaSession,
  SipClient,
  SipInfo,
} from "../src/types";

type FakeMedia = {
  marker: string;
  mediaStream?: MediaStream;
  audioElement?: HTMLAudioElement;
  rtcPeerConnection?: RTCPeerConnection;
  inputDeviceId?: string;
  outputDeviceId?: string;
};

class FakeSipClient extends EventEmitter implements SipClient {
  public async start() {}
  public async request(_message: RequestMessage) {
    return new InboundMessage();
  }
  public async reply(_message: ResponseMessage) {}
  public async dispose() {}
}

const sipInfo: SipInfo = {
  authorizationId: "id",
  domain: "example.com",
  outboundProxy: "example.com",
  outboundProxyBackup: "example.com",
  username: "100",
  password: "password",
  stunServers: [],
};

test("uses provider-defined media without browser objects", async () => {
  const mediaSession: MediaSession<FakeMedia> = {
    media: { marker: "remote" },
    init: async () => {},
    createOffer: async () => "",
    answerOffer: async () => "",
    applyAnswer: async () => {},
    changeInputDevice: async () => {},
    changeOutputDevice: async () => {},
    setMuted: async () => {},
    sendDtmf: async () => {},
    dispose: async () => {},
  };
  const mediaProvider: MediaProvider<FakeMedia> = {
    create: async () => mediaSession,
  };
  const webPhone = new WebPhone<FakeMedia>({
    sipInfo,
    sipClient: new FakeSipClient(),
    mediaProvider,
  });
  const session = new InboundCallSession(
    webPhone,
    new InboundMessage("INVITE"),
  );

  await session.init();

  expect(session.media).toEqual({ marker: "remote" });
  expect(session.rtcPeerConnection).toBeUndefined();
  expect(session.audioElement).toBeUndefined();
});

test("keeps legacy media fields writable", async () => {
  const mediaSession: MediaSession<FakeMedia> = {
    media: { marker: "remote" },
    init: async () => {},
    createOffer: async () => "",
    answerOffer: async () => "",
    applyAnswer: async () => {},
    changeInputDevice: async () => {},
    changeOutputDevice: async () => {},
    setMuted: async () => {},
    sendDtmf: async () => {},
    dispose: async () => {},
  };
  const webPhone = new WebPhone<FakeMedia>({
    sipInfo,
    sipClient: new FakeSipClient(),
    mediaProvider: { create: async () => mediaSession },
  });
  const session = new InboundCallSession(
    webPhone,
    new InboundMessage("INVITE"),
  );
  const stream = {} as MediaStream;
  let emitted: MediaStream | undefined;
  session.on("mediaStreamSet", (value) => {
    emitted = value;
  });
  session.mediaStream = stream;
  session.inputDeviceId = "input";

  expect(session.mediaStream).toBe(stream);
  expect(session.inputDeviceId).toBe("input");

  await session.init();

  expect(emitted).toBe(stream);
  expect(session.mediaStream).toBeUndefined();
  expect(session.inputDeviceId).toBeUndefined();
  mediaSession.media.mediaStream = stream;
  expect(session.mediaStream).toBe(stream);
  mediaSession.media.mediaStream = undefined;
  expect(session.mediaStream).toBeUndefined();
});

test("holds without delegating SDP-only negotiation to the media provider", async () => {
  let createOfferCalls = 0;
  const requests: RequestMessage[] = [];
  const sipClient = new FakeSipClient();
  sipClient.request = async (message: RequestMessage) => {
    requests.push(message);
    return new InboundMessage("SIP/2.0 200 OK", {
      Via: message.headers.Via,
      CSeq: message.headers.CSeq,
    });
  };
  const mediaSession: MediaSession<FakeMedia> = {
    media: { marker: "remote" },
    init: async () => {},
    createOffer: async () => {
      createOfferCalls += 1;
      return "";
    },
    answerOffer: async () =>
      "v=0\r\no=- 1 1 IN IP4 127.0.0.1\r\na=sendrecv\r\n",
    applyAnswer: async () => {},
    changeInputDevice: async () => {},
    changeOutputDevice: async () => {},
    setMuted: async () => {},
    sendDtmf: async () => {},
    dispose: async () => {},
  };
  const invite = new InboundMessage("INVITE", {
    "Call-Id": "call",
    CSeq: "1 INVITE",
    From: "<sip:remote@example.com>;tag=remote",
    To: "<sip:local@example.com>;tag=local",
  });
  const webPhone = new WebPhone<FakeMedia>({
    sipInfo,
    sipClient,
    mediaProvider: { create: async () => mediaSession },
  });
  const session = new InboundCallSession(webPhone, invite);

  await session.init();
  await session.handleReInvite(invite);
  await session.hold();

  expect(createOfferCalls).toBe(0);
  expect(requests).toHaveLength(1);
  expect(requests[0].body).toContain("a=sendonly");
});

test("disposes SDK state when provider cleanup fails", async () => {
  const mediaSession: MediaSession<FakeMedia> = {
    media: { marker: "remote" },
    init: async () => {},
    createOffer: async () => "",
    answerOffer: async () => "",
    applyAnswer: async () => {},
    changeInputDevice: async () => {},
    changeOutputDevice: async () => {},
    setMuted: async () => {},
    sendDtmf: async () => {},
    dispose: async () => {
      throw new Error("cleanup failed");
    },
  };
  const webPhone = new WebPhone<FakeMedia>({
    sipInfo,
    sipClient: new FakeSipClient(),
    mediaProvider: { create: async () => mediaSession },
  });
  const session = new InboundCallSession(
    webPhone,
    new InboundMessage("INVITE"),
  );
  let disposed = false;
  session.once("disposed", () => {
    disposed = true;
  });

  await session.init();
  await session.dispose();

  expect(session.state).toBe("disposed");
  expect(disposed).toBe(true);
});

test("ACKs an answered outbound call when applying media fails", async () => {
  let requestCount = 0;
  let acked = false;
  const sipClient = new FakeSipClient();
  sipClient.request = async (message: RequestMessage) => {
    requestCount += 1;
    if (requestCount === 1) {
      return new InboundMessage("SIP/2.0 407 Proxy Authentication Required", {
        "Proxy-Authenticate": 'Digest, nonce="nonce"',
      });
    }
    return new InboundMessage("SIP/2.0 100 Trying", {
      CSeq: message.headers.CSeq,
      From: message.headers.From,
      To: `${message.headers.To};tag=remote`,
      Via: message.headers.Via,
    });
  };
  sipClient.reply = async (message: ResponseMessage) => {
    acked = message.headers.CSeq.endsWith(" ACK");
  };
  const mediaSession: MediaSession<FakeMedia> = {
    media: { marker: "remote" },
    init: async () => {},
    createOffer: async () => "v=0\r\no=- 1 1 IN IP4 127.0.0.1\r\n",
    answerOffer: async () => "",
    applyAnswer: async () => {
      throw new Error("media failed");
    },
    changeInputDevice: async () => {},
    changeOutputDevice: async () => {},
    setMuted: async () => {},
    sendDtmf: async () => {},
    dispose: async () => {},
  };
  const webPhone = new WebPhone<FakeMedia>({
    sipInfo,
    sipClient,
    mediaProvider: { create: async () => mediaSession },
  });
  const session = new OutboundCallSession(webPhone, "101");

  await session.init();
  const result = session.call();
  await new Promise((resolve) => setTimeout(resolve));
  sipClient.emit(
    "inboundMessage",
    new InboundMessage("SIP/2.0 200 OK", {
      CSeq: session.sipMessage.headers.CSeq,
    }),
  );

  await expect(result).resolves.toBe(true);
  expect(acked).toBe(true);
});
