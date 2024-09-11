import { expect } from '@playwright/test';

import { assertCallCount, callAndAnswer, testTwoPages } from '../common';

testTwoPages('mute/unmute', async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await callAndAnswer(
    callerResource,
    calleeResource,
  );

  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].mute();
  });
  expect(callerMessages).toHaveLength(0);
  expect(calleeMessages).toHaveLength(0);
  await assertCallCount(callerPage, 1);
  await assertCallCount(calleePage, 1);

  callerMessages.length = 0;
  calleeMessages.length = 0;
  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].unmute();
  });
  expect(callerMessages).toHaveLength(0);
  expect(calleeMessages).toHaveLength(0);
  await assertCallCount(callerPage, 1);
  await assertCallCount(calleePage, 1);
});
