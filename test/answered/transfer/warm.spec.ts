import { expect } from '@playwright/test';

import { anotherNumber, assertCallCount, callAndAnswer, testTwoPages } from '../../common';

testTwoPages('warm transfer', async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await callAndAnswer(
    callerResource,
    calleeResource,
  );
  await calleePage.evaluate(async (anotherNumber) => {
    const { complete, cancel } = await window.inboundCalls[0].warmTransfer(anotherNumber);
    window.transferActions = { complete, cancel };
  }, anotherNumber);
  await calleePage.waitForTimeout(3000);
  await calleePage.evaluate(async () => await window.transferActions.complete());
  await calleePage.waitForTimeout(3000);

  expect(callerMessages).toHaveLength(0);
  calleeMessages.splice(0, 4); // 4 messages is for hold
  calleeMessages.splice(0, 8); // 8 message is for outbound call
  const messages = calleeMessages.map((m) => m.shortString);
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
  await assertCallCount(callerPage, 1);
  await assertCallCount(calleePage, 0);
});
