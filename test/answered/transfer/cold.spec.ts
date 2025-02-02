import { expect } from "@playwright/test";

import {
  anotherNumber,
  assertCallCount,
  callAndAnswer,
  testTwoPages,
} from "../../common";

testTwoPages("cold transfer", async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } =
    await callAndAnswer(
      callerResource,
      calleeResource,
    );
  await calleePage.evaluate(async (anotherNumber) => {
    await globalThis.inboundCalls[0].transfer(anotherNumber);
  }, anotherNumber);

  // caller
  expect(callerMessages).toHaveLength(0);
  await assertCallCount(callerPage, 1);

  // callee
  const messages = calleeMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(8);
  expect(messages[0]).toMatch(/^outbound - REFER sip:/);
  expect(messages[1]).toMatch(/^inbound - SIP\/2.0 202 Accepted$/);
  expect(messages[2]).toMatch(/^inbound - NOTIFY sip:/);
  expect(messages[3]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  expect(messages[4]).toMatch(/^inbound - NOTIFY sip:/);
  expect(messages[5]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  expect(messages[6]).toMatch(/^inbound - BYE sip:/);
  expect(messages[7]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  await assertCallCount(calleePage, 0);
});
