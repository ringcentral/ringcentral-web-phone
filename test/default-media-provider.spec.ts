import { expect, test } from "@playwright/test";

import { DefaultMediaProvider } from "../src/media-provider";

type FakeTrack = { kind: "audio"; stop: () => void; stopped: boolean };
const track = (): FakeTrack => {
  const value: FakeTrack = { kind: "audio", stopped: false, stop: () => { value.stopped = true; } };
  return value;
};
const stream = (audioTrack: FakeTrack) => ({
  getAudioTracks: () => [audioTrack],
  getTracks: () => [audioTrack],
}) as unknown as MediaStream;

const setup = async (replaceTrack: (track: FakeTrack) => Promise<void>) => {
  const tempTrack = track();
  const firstTrack = track();
  const nextTrack = track();
  const failedTrack = track();
  const streams = [stream(tempTrack), stream(firstTrack), stream(nextTrack), stream(failedTrack)];
  const sender = {
    track: firstTrack,
    replaceTrack: async (value: FakeTrack) => { await replaceTrack(value); sender.track = value; },
    getParameters: () => ({ encodings: [] }),
    setParameters: () => Promise.resolve(),
  };
  let addTrackCount = 0;
  class FakePeerConnection {
    public ontrack: unknown;
    public addTrack() { addTrackCount += 1; return sender; }
    public getSenders() { return [sender]; }
  }
  Object.defineProperty(globalThis, "RTCPeerConnection", { configurable: true, value: FakePeerConnection });
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: { mediaDevices: { getUserMedia: async () => streams.shift()! } },
  });
  const mediaSession = await new DefaultMediaProvider().create({
    callId: "call", direction: "inbound", iceServers: [],
    deviceManager: { getInputDeviceId: async () => "first", getOutputDeviceId: async () => undefined },
  });
  await mediaSession.init();
  return { mediaSession, firstTrack, nextTrack, failedTrack, addTrackCount: () => addTrackCount };
};

test("reuses one sender when changing input devices", async () => {
  const fixture = await setup(async () => {});
  await fixture.mediaSession.changeInputDevice("next");
  await fixture.mediaSession.changeInputDevice("next-again");

  expect(fixture.addTrackCount()).toBe(1);
  expect(fixture.firstTrack.stopped).toBe(true);
  expect(fixture.nextTrack.stopped).toBe(true);
  expect(fixture.failedTrack.stopped).toBe(false);
});

test("rolls back a failed input-device replacement", async () => {
  const fixture = await setup(async () => { throw new Error("replace failed"); });

  await expect(fixture.mediaSession.changeInputDevice("failed")).rejects.toThrow("replace failed");

  expect(fixture.mediaSession.media.inputDeviceId).toBe("first");
  expect(fixture.firstTrack.stopped).toBe(false);
  expect(fixture.nextTrack.stopped).toBe(true);
});
