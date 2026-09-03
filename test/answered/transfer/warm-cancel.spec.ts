import { expect } from "@playwright/test";
import waitFor from "wait-for-async";

import {
  anotherNumber,
  assertCallCount,
  callAndAnswer,
  testTwoPages,
} from "../../common";

testTwoPages(
  "warm transfer cancel",
  async ({ callerResource, calleeResource }) => {
    const { callerPage, calleePage, callerMessages, calleeMessages } =
      await callAndAnswer(callerResource, calleeResource);

    // capture the original call ids before the warm transfer starts
    const callerCallId = await callerPage.evaluate(
      () => globalThis.outboundCalls[0].callId,
    );
    const calleeCallId = await calleePage.evaluate(
      () => globalThis.inboundCalls[0].callId,
    );

    await calleePage.evaluate(async (anotherNumber) => {
      const { complete, cancel, newSession } =
        await globalThis.inboundCalls[0].warmTransfer(anotherNumber);
      globalThis.transferActions = { complete, cancel };
      globalThis.consultationSession = newSession;
    }, anotherNumber);
    const consultationCallId = await calleePage.evaluate(
      () => globalThis.consultationSession.callId,
    );

    // wait for the transferee to answer the consultation call
    await waitFor({ interval: 1000 });

    // cancel the warm transfer
    await calleePage.evaluate(async () => {
      await globalThis.transferActions.cancel();
    });

    // the consultation call session is disposed
    // and absent from the transferor's live call sessions
    expect(
      await calleePage.evaluate(() => globalThis.consultationSession.state),
    ).toBe("disposed");
    expect(
      await calleePage.evaluate(
        (consultationCallId) =>
          globalThis.webPhone.callSessions.some(
            (callSession) => callSession.callId === consultationCallId,
          ),
        consultationCallId,
      ),
    ).toBe(false);
    const consultationMessages = calleeMessages
      .filter((m) => m.headers["Call-Id"] === consultationCallId)
      .map((m) => m.shortString);
    expect(consultationMessages).toContain("inbound - SIP/2.0 200 OK"); // the transferee answered
    expect(consultationMessages[consultationMessages.length - 2]).toMatch(
      /^outbound - BYE sip:/,
    );
    expect(consultationMessages[consultationMessages.length - 1]).toMatch(
      /^inbound - SIP\/2.0 200 OK$/,
    );

    // caller: the exact original call session remains present and answered
    expect(callerMessages).toHaveLength(0);
    await assertCallCount(callerPage, 1);
    expect(
      await callerPage.evaluate(
        (callerCallId) =>
          globalThis.webPhone.callSessions
            .filter((callSession) => callSession.callId === callerCallId)
            .map((callSession) => callSession.state),
        callerCallId,
      ),
    ).toEqual(["answered"]);

    // callee: the exact original call session remains present and answered,
    // it is unheld by a re-INVITE whose SDP carries `a=sendrecv`
    await assertCallCount(calleePage, 1);
    expect(
      await calleePage.evaluate(
        (calleeCallId) =>
          globalThis.webPhone.callSessions
            .filter((callSession) => callSession.callId === calleeCallId)
            .map((callSession) => callSession.state),
        calleeCallId,
      ),
    ).toEqual(["answered"]);
    const reInvites = calleeMessages.filter(
      (m) =>
        m.shortString.startsWith("outbound - INVITE sip:") &&
        m.headers["Call-Id"] === calleeCallId,
    );
    expect(reInvites).toHaveLength(2); // hold and unhold
    expect(reInvites[0].body).toContain("a=sendonly"); // hold
    expect(reInvites[1].body).toContain("a=sendrecv"); // unhold

    // clean up the original call via the normal hangup flow
    await callerPage.evaluate(async () => {
      await globalThis.outboundCalls[0].hangup();
    });

    // caller
    const messages = callerMessages.map((m) => m.shortString);
    expect(messages).toHaveLength(2);
    expect(messages[0]).toMatch(/^outbound - BYE sip:/);
    expect(messages[1]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
    await assertCallCount(callerPage, 0);

    // callee
    await waitFor({
      condition: () =>
        calleeMessages.some((m) =>
          m.shortString.startsWith("inbound - BYE sip:"),
        ),
    });
    await assertCallCount(calleePage, 0);
  },
);
