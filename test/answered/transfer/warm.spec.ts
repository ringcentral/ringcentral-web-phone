import { expect } from "@playwright/test";
import waitFor from "wait-for-async";

import {
  anotherNumber,
  assertCallCount,
  callAndAnswer,
  testTwoPages,
} from "../../common";

testTwoPages("warm transfer", async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } =
    await callAndAnswer(callerResource, calleeResource);
  await calleePage.evaluate(async (anotherNumber) => {
    const { complete, cancel } =
      await globalThis.inboundCalls[0].warmTransfer(anotherNumber);
    globalThis.transferActions = { complete, cancel };
  }, anotherNumber);

  // wait for the transferee to answer the call
  await waitFor({ interval: 1000 });

  await calleePage.evaluate(
    async () => await globalThis.transferActions.complete(),
  );

  // caller
  expect(callerMessages).toHaveLength(0);
  await assertCallCount(callerPage, 1);

  // callee
  const referIndex = calleeMessages.findIndex((message) =>
    /^outbound - REFER sip:/.test(message.shortString),
  );
  expect(referIndex).toBeGreaterThanOrEqual(0);
  const messages = calleeMessages
    .slice(referIndex)
    .map((message) => message.shortString);
  expect(messages).toHaveLength(10);
  expect(messages[0]).toMatch(/^outbound - REFER sip:/);
  expect(messages[1]).toMatch(/^inbound - SIP\/2.0 202 Accepted$/);
  expect(messages[2]).toMatch(/^inbound - NOTIFY sip:/);
  expect(messages[3]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  expect(messages[4]).toMatch(/^inbound - BYE sip:/); // BYE from the transferee
  expect(messages[5]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  expect(messages[6]).toMatch(/^inbound - NOTIFY sip:/);
  expect(messages[7]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  expect(messages[8]).toMatch(/^inbound - BYE sip:/); // BYE from the caller
  expect(messages[9]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  await assertCallCount(calleePage, 0);
});
