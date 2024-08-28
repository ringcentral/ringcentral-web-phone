import { expect } from '@playwright/test';
import { anotherNumber, assertCallCount, callAndAnswer, testTwoPages } from '../common';

testTwoPages('cold transfer', async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await callAndAnswer(
    callerResource,
    calleeResource,
  );
  await calleePage.evaluate(async (anotherNumber) => {
    await window.inboundCalls[0].transfer(anotherNumber);
  }, anotherNumber);
  await calleePage.waitForTimeout(3000);

  expect(callerMessages).toHaveLength(0);
  expect(calleeMessages).toHaveLength(8);
  expect(calleeMessages.map((m) => m.direction)).toEqual([
    'outbound',
    'inbound',
    'inbound',
    'outbound',
    'inbound',
    'outbound',
    'inbound',
    'outbound',
  ]);
  const subjects = calleeMessages.map((m) => m.subject);
  expect(subjects[0]).toMatch(/^REFER sip:/);
  expect(subjects[1]).toMatch(/^SIP\/2.0 202 Accepted$/);
  expect(subjects[2]).toMatch(/^NOTIFY sip:/);
  expect(subjects[3]).toMatch(/^SIP\/2.0 200 OK$/);
  expect(subjects[4]).toMatch(/^NOTIFY sip:/);
  expect(subjects[5]).toMatch(/^SIP\/2.0 200 OK$/);
  expect(subjects[6]).toMatch(/^BYE sip:/);
  expect(subjects[7]).toMatch(/^SIP\/2.0 200 OK$/);
  await assertCallCount({ callerPage, callerCount: 1, calleePage, calleeCount: 0 });
});
