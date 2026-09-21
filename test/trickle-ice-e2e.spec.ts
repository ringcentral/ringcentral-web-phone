import { expect } from "@playwright/test";

import type SipMessage from "../src/sip-message";
import { call, testTwoPages } from "./common";

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

    await calleePage.evaluate(async () => {
      await globalThis.inboundCalls[0].answer();
    });
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
