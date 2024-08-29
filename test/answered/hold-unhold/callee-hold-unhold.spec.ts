import { expect } from '@playwright/test';

import { assertCallCount, callAndAnswer, testTwoPages } from '../../common';

testTwoPages('callee hold/unhold', async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await callAndAnswer(
    callerResource,
    calleeResource,
  );

  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].hold();
  });
  await calleePage.waitForTimeout(500);

  // callee
  let messages = calleeMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(4);
  expect(messages[0]).toMatch(/^outbound - INVITE sip:/);
  expect(messages[1]).toMatch(/^inbound - SIP\/2.0 100 Trying$/);
  expect(messages[2]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
  expect(messages[3]).toMatch(/^outbound - ACK sip:/);
  expect(calleeMessages[0].body).toContain('a=sendonly');

  // caller
  expect(callerMessages).toHaveLength(0);

  await assertCallCount(callerPage, 1);
  await assertCallCount(calleePage, 1);

  callerMessages.length = 0;
  calleeMessages.length = 0;
  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].unhold();
  });
  await calleePage.waitForTimeout(500);

  // callee
  messages = calleeMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(4);
  expect(messages[0]).toMatch(/^outbound - INVITE sip:/);
  expect(messages[1]).toMatch(/^inbound - SIP\/2.0 100 Trying$/);
  expect(messages[2]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
  expect(messages[3]).toMatch(/^outbound - ACK sip:/);
  expect(calleeMessages[0].body).toContain('a=sendrecv');

  // caller
  expect(callerMessages).toHaveLength(0);

  await assertCallCount(callerPage, 1);
  await assertCallCount(calleePage, 1);
});
