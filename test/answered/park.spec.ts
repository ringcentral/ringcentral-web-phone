import { expect } from "@playwright/test";

import { assertCallCount, callAndAnswer, testTwoPages } from "../common";

testTwoPages("park", async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } =
    await callAndAnswer(
      callerResource,
      calleeResource,
    );

  const parkResult = await calleePage.evaluate(async () => {
    return await globalThis.inboundCalls[0].park();
  });
  expect(parkResult.code).toBe(0);

  // caller
  expect(callerMessages).toHaveLength(0);

  // callee
  const messages = calleeMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(6);
  expect(messages[0]).toMatch(/^outbound - INFO sip:/);
  expect(messages[1]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
  expect(messages[2]).toMatch(/^inbound - INFO sip:/); // result
  expect(messages[3]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  expect(messages[4]).toMatch(/^outbound - BYE sip:/); // hang up after parking
  expect(messages[5]).toMatch(/^inbound - SIP\/2.0 200 OK$/);

  await assertCallCount(callerPage, 1);
  await assertCallCount(calleePage, 0);
});
