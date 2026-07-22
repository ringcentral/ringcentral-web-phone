import { expect, test } from "@playwright/test";

import InboundCallSession from "../src/call-session/inbound";
import WebPhone from "../src";
import EventEmitter from "../src/event-emitter";
import InboundMessage from "../src/sip-message/inbound";
import type { MediaProvider, MediaSession, SipClient, SipInfo } from "../src/types";
import type RequestMessage from "../src/sip-message/outbound/request";
import type ResponseMessage from "../src/sip-message/outbound/response";

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
  public async request(_message: RequestMessage) { return new InboundMessage(); }
  public async reply(_message: ResponseMessage) {}
  public async dispose() {}
}

const sipInfo: SipInfo = {
  authorizationId: "id", domain: "example.com", outboundProxy: "example.com",
  outboundProxyBackup: "example.com", username: "100", password: "password", stunServers: [],
};

test("uses provider-defined media without browser objects", async () => {
  const mediaSession: MediaSession<FakeMedia> = {
    media: { marker: "remote" }, init: async () => {}, createOffer: async () => "",
    answerOffer: async () => "", applyAnswer: async () => {}, changeInputDevice: async () => {},
    changeOutputDevice: async () => {}, setMuted: async () => {}, sendDtmf: async () => {}, dispose: async () => {},
  };
  const mediaProvider: MediaProvider<FakeMedia> = { create: async () => mediaSession };
  const webPhone = new WebPhone<FakeMedia>({ sipInfo, sipClient: new FakeSipClient(), mediaProvider });
  const session = new InboundCallSession(webPhone, new InboundMessage("INVITE"));

  await session.init();

  expect(session.media).toEqual({ marker: "remote" });
  expect(session.rtcPeerConnection).toBeUndefined();
  expect(session.audioElement).toBeUndefined();
});

test("keeps legacy media fields writable", async () => {
  const mediaSession: MediaSession<FakeMedia> = {
    media: { marker: "remote" }, init: async () => {}, createOffer: async () => "",
    answerOffer: async () => "", applyAnswer: async () => {}, changeInputDevice: async () => {},
    changeOutputDevice: async () => {}, setMuted: async () => {}, sendDtmf: async () => {}, dispose: async () => {},
  };
  const webPhone = new WebPhone<FakeMedia>({
    sipInfo, sipClient: new FakeSipClient(), mediaProvider: { create: async () => mediaSession },
  });
  const session = new InboundCallSession(webPhone, new InboundMessage("INVITE"));
  const stream = {} as MediaStream;
  let emitted: MediaStream | undefined;
  session.on("mediaStreamSet", (value) => { emitted = value; });
  session.mediaStream = stream;
  session.inputDeviceId = "input";

  await session.init();

  expect(emitted).toBe(stream);
  expect(session.mediaStream).toBe(stream);
  expect(session.inputDeviceId).toBe("input");
});
