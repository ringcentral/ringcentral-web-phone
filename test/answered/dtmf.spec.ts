import { expect } from "@playwright/test";

import { assertCallCount, callAndAnswer, testTwoPages } from "../common";

testTwoPages("dtmf", async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } =
    await callAndAnswer(
      callerResource,
      calleeResource,
    );

  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].sendDtmf("123#");
  });
  expect(callerMessages).toHaveLength(0);
  expect(calleeMessages).toHaveLength(0);
  await assertCallCount(callerPage, 1);
  await assertCallCount(calleePage, 1);
});
