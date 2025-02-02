import { expect } from "@playwright/test";

import {
  anotherNumber,
  assertCallCount,
  callAndAnswer,
  testTwoPages,
} from "../common";

testTwoPages("flip", async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } =
    await callAndAnswer(
      callerResource,
      calleeResource,
    );
  const flipResult = await calleePage.evaluate(async (anotherNumber) => {
    return await window.inboundCalls[0].flip(anotherNumber);
  }, anotherNumber);
  expect(flipResult.code).toBe(0);

  // callee needs to hang up in order for caller to talk to the flip target
  await calleePage.evaluate(async () => await window.inboundCalls[0].hangup());

  // caller
  expect(callerMessages).toHaveLength(0);
  await assertCallCount(callerPage, 1); // caller still talk to the flip target

  // callee
  const messages = calleeMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(6);
  expect(messages[0]).toMatch(/^outbound - INFO sip:/);
  expect(messages[1]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
  expect(messages[2]).toMatch(/^inbound - INFO sip:/);
  expect(messages[3]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  expect(messages[4]).toMatch(/^outbound - BYE sip:/); // callee hang up
  expect(messages[5]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
  await assertCallCount(calleePage, 0);
});
