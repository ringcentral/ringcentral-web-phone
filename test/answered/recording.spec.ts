import { expect } from "@playwright/test";

import { assertCallCount, callAndAnswer, testTwoPages } from "../common";

testTwoPages(
  "start/stop recording",
  async ({ callerResource, calleeResource }) => {
    const { callerPage, calleePage, callerMessages, calleeMessages } =
      await callAndAnswer(
        callerResource,
        calleeResource,
      );

    const startResult = await callerPage.evaluate(async () => {
      return await window.outboundCalls[0].startRecording();
    });
    expect(startResult.code).toBe(0);

    const stopResult = await callerPage.evaluate(async () => {
      return await window.outboundCalls[0].stopRecording();
    });
    expect(stopResult.code).toBe(0);

    // caller
    const messages = callerMessages.map((m) => m.shortString);
    expect(messages).toHaveLength(8);
    // start recording
    expect(messages[0]).toMatch(/^outbound - INFO sip:/);
    expect(messages[1]).toMatch(/^inbound - SIP\/2.0 200 OK/);
    expect(messages[2]).toMatch(/^inbound - INFO sip:/); // result
    expect(messages[3]).toMatch(/^outbound - SIP\/2.0 200 OK/);

    // stop recording
    expect(messages[4]).toMatch(/^outbound - INFO sip:/);
    expect(messages[5]).toMatch(/^inbound - SIP\/2.0 200 OK/);
    expect(messages[6]).toMatch(/^inbound - INFO sip:/); // result
    expect(messages[7]).toMatch(/^outbound - SIP\/2.0 200 OK/);

    // callee
    expect(calleeMessages).toHaveLength(0);

    await assertCallCount(callerPage, 1);
    await assertCallCount(calleePage, 1);
  },
);
