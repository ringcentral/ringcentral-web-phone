import { expect } from "@playwright/test";

import { assertCallCount, callAndAnswer, testTwoPages } from "../../common";

testTwoPages(
  "caller hold/unhold",
  async ({ callerResource, calleeResource }) => {
    const { callerPage, calleePage, callerMessages, calleeMessages } =
      await callAndAnswer(
        callerResource,
        calleeResource,
      );

    await callerPage.evaluate(async () => {
      await window.outboundCalls[0].hold();
    });

    // caller
    let messages = callerMessages.map((m) => m.shortString);
    expect(messages).toHaveLength(4);
    expect(messages[0]).toMatch(/^outbound - INVITE sip:/);
    expect(messages[1]).toMatch(/^inbound - SIP\/2.0 100 Trying$/);
    expect(messages[2]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
    expect(messages[3]).toMatch(/^outbound - ACK sip:/);
    expect(callerMessages[0].body).toContain("a=sendonly");

    // callee
    expect(calleeMessages).toHaveLength(0);

    await assertCallCount(callerPage, 1);
    await assertCallCount(calleePage, 1);

    callerMessages.length = 0;
    calleeMessages.length = 0;
    await callerPage.evaluate(async () => {
      await window.outboundCalls[0].unhold();
    });

    // caller
    messages = callerMessages.map((m) => m.shortString);
    expect(messages).toHaveLength(4);
    expect(messages[0]).toMatch(/^outbound - INVITE sip:/);
    expect(messages[1]).toMatch(/^inbound - SIP\/2.0 100 Trying$/);
    expect(messages[2]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
    expect(messages[3]).toMatch(/^outbound - ACK sip:/);
    expect(callerMessages[0].body).toContain("a=sendrecv");
    await assertCallCount(callerPage, 1);

    // callee
    expect(calleeMessages).toHaveLength(0);
    await assertCallCount(calleePage, 1);
  },
);
