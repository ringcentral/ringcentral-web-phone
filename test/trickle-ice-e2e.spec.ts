import { expect, type Page } from "@playwright/test";

import type SipMessage from "../src/sip-message";
import { call, testTwoPages } from "./common";

type Direction = "outbound" | "inbound";

const getIceTransportPolicy = async (page: Page, direction: Direction) =>
  page.evaluate((direction) => {
    const callSession =
      direction === "outbound"
        ? globalThis.outboundCalls[0]
        : globalThis.inboundCalls[0];
    return callSession.rtcPeerConnection.getConfiguration().iceTransportPolicy;
  }, direction);

const hasSipProvidedIceServersHeader = (messages: SipMessage[]) =>
  messages.some(
    (message) =>
      message.direction === "inbound" &&
      message.getHeader("p-rc-ice-servers") !== undefined,
  );

const hasTurnIceServer = async (page: Page, direction: Direction) =>
  page.evaluate((direction) => {
    const callSession =
      direction === "outbound"
        ? globalThis.outboundCalls[0]
        : globalThis.inboundCalls[0];
    const iceServers =
      callSession.rtcPeerConnection.getConfiguration().iceServers ?? [];
    return iceServers.some((server) => {
      const urls =
        typeof server.urls === "string" ? [server.urls] : (server.urls ?? []);
      return urls.some((url) => url.toLowerCase().startsWith("turn"));
    });
  }, direction);

const getSelectedLocalCandidateType = async (
  page: Page,
  direction: Direction,
) =>
  page.evaluate(async (direction) => {
    const callSession =
      direction === "outbound"
        ? globalThis.outboundCalls[0]
        : globalThis.inboundCalls[0];
    const stats = await callSession.rtcPeerConnection.getStats();
    let selectedCandidatePairId: string | undefined;
    stats.forEach((report) => {
      if (report.type === "transport") {
        selectedCandidatePairId ??= (report as RTCTransportStats)
          .selectedCandidatePairId;
      }
    });
    let selectedCandidatePair: RTCIceCandidatePairStats | undefined;
    stats.forEach((report) => {
      if (report.type !== "candidate-pair" || selectedCandidatePair) return;
      const candidatePair = report as RTCIceCandidatePairStats & {
        selected?: boolean;
      };
      if (
        report.id === selectedCandidatePairId ||
        candidatePair.selected === true
      ) {
        selectedCandidatePair = candidatePair;
      }
    });
    if (!selectedCandidatePair) return undefined;
    const localCandidate = stats.get(selectedCandidatePair.localCandidateId) as
      | { candidateType?: RTCIceCandidateType }
      | undefined;
    return localCandidate?.candidateType;
  }, direction);

const forceRelayIceTransportPolicy = async (page: Page) => {
  await page.evaluate(() => {
    const originalRTCPeerConnection = globalThis.RTCPeerConnection;
    class RelayOnlyRTCPeerConnection extends originalRTCPeerConnection {
      constructor(options?: RTCConfiguration) {
        super({ ...options, iceTransportPolicy: "relay" });
      }
    }
    globalThis.RTCPeerConnection = RelayOnlyRTCPeerConnection;
  });
};

const trickleInfoRequests = (messages: SipMessage[]) =>
  messages.filter(
    (message) =>
      message.direction === "outbound" &&
      message.subject.startsWith("INFO ") &&
      message.getHeader("Content-Type") === "application/trickle-ice-sdpfrag",
  );

const allInfoRequestsSucceeded = (messages: SipMessage[]) => {
  const requests = trickleInfoRequests(messages);
  return (
    requests.length > 0 &&
    requests.every((request) =>
      messages.some(
        (message) =>
          message.direction === "inbound" &&
          message.subject === "SIP/2.0 200 OK" &&
          message.getHeader("CSeq") === request.getHeader("CSeq"),
      ),
    )
  );
};

const expectConnected = async (state: () => Promise<string>) => {
  await expect.poll(state, { timeout: 10_000 }).toBe("connected");
};

testTwoPages(
  "trickles outbound candidates during call setup and connects media",
  async ({ callerResource, calleeResource }) => {
    const { callerPage, calleePage, callerMessages } = await call(
      callerResource,
      calleeResource,
      true,
    );

    expect(await getIceTransportPolicy(callerPage, "outbound")).toBe("all");

    await expect
      .poll(() => trickleInfoRequests(callerMessages).length)
      .toBeGreaterThan(0);
    const invite = callerMessages.find(
      (message) =>
        message.direction === "outbound" &&
        message.subject.startsWith("INVITE ") &&
        message.body.length > 0,
    );
    expect(invite?.headers.Supported).toBe("trickle-ice");
    expect(invite?.body).not.toContain("a=end-of-candidates");
    await expect
      .poll(() => allInfoRequestsSucceeded(callerMessages))
      .toBe(true);

    await calleePage.evaluate(async () => {
      await globalThis.inboundCalls[0].answer();
    });
    expect(await getIceTransportPolicy(calleePage, "inbound")).toBe("all");
    await expectConnected(() =>
      callerPage.evaluate(
        () => globalThis.outboundCalls[0].rtcPeerConnection.connectionState,
      ),
    );
    await expectConnected(() =>
      calleePage.evaluate(
        () => globalThis.inboundCalls[0].rtcPeerConnection.connectionState,
      ),
    );
  },
);

testTwoPages(
  "trickles inbound-answer candidates and connects media",
  async ({ callerResource, calleeResource }) => {
    const { callerPage, calleePage, calleeMessages } = await call(
      callerResource,
      calleeResource,
    );

    expect(await getIceTransportPolicy(callerPage, "outbound")).toBe("all");

    await calleePage.evaluate(async () => {
      await globalThis.inboundCalls[0].answer();
    });
    expect(await getIceTransportPolicy(calleePage, "inbound")).toBe("all");
    await expect
      .poll(() => trickleInfoRequests(calleeMessages).length)
      .toBeGreaterThan(0);
    const answer = calleeMessages.find(
      (message) =>
        message.direction === "outbound" &&
        message.subject === "SIP/2.0 200 OK" &&
        message.getHeader("Content-Type") === "application/sdp",
    );
    expect(answer?.headers.Supported).toBe("trickle-ice");
    expect(answer?.body).not.toContain("a=end-of-candidates");
    await expect
      .poll(() => allInfoRequestsSucceeded(calleeMessages))
      .toBe(true);
    await expectConnected(() =>
      callerPage.evaluate(
        () => globalThis.outboundCalls[0].rtcPeerConnection.connectionState,
      ),
    );
    await expectConnected(() =>
      calleePage.evaluate(
        () => globalThis.inboundCalls[0].rtcPeerConnection.connectionState,
      ),
    );
  },
);

testTwoPages(
  "answers a relay-only call and connects media via SIP-provided TURN servers",
  async ({ callerResource, calleeResource }) => {
    await forceRelayIceTransportPolicy(callerResource.page);
    await forceRelayIceTransportPolicy(calleeResource.page);

    const { callerPage, calleePage, callerMessages, calleeMessages } =
      await call(callerResource, calleeResource, true);

    expect(await getIceTransportPolicy(callerPage, "outbound")).toBe("relay");
    expect(hasSipProvidedIceServersHeader(callerMessages)).toBe(true);
    expect(await hasTurnIceServer(callerPage, "outbound")).toBe(true);

    await calleePage.evaluate(async () => {
      await globalThis.inboundCalls[0].answer();
    });
    expect(await getIceTransportPolicy(calleePage, "inbound")).toBe("relay");
    expect(hasSipProvidedIceServersHeader(calleeMessages)).toBe(true);
    expect(await hasTurnIceServer(calleePage, "inbound")).toBe(true);

    await expectConnected(() =>
      callerPage.evaluate(
        () => globalThis.outboundCalls[0].rtcPeerConnection.connectionState,
      ),
    );
    await expectConnected(() =>
      calleePage.evaluate(
        () => globalThis.inboundCalls[0].rtcPeerConnection.connectionState,
      ),
    );

    await expect
      .poll(() => getSelectedLocalCandidateType(callerPage, "outbound"), {
        timeout: 10_000,
      })
      .toBe("relay");
    await expect
      .poll(() => getSelectedLocalCandidateType(calleePage, "inbound"), {
        timeout: 10_000,
      })
      .toBe("relay");
  },
);
