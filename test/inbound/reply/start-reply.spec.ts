import { expect } from '@playwright/test';

import { assertCallCount, call, testTwoPages } from '../../common';
import RcMessage from '../../../src/rc-message/rc-message';
import callControlCommands from '../../../src/rc-message/call-control-commands';

testTwoPages('start reply', async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await call(callerResource, calleeResource);

  // start reply
  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].startReply();
  });
  await calleePage.waitForTimeout(500);

  // caller
  expect(callerMessages).toHaveLength(0);

  // callee
  expect(calleeMessages).toHaveLength(3);
  expect(calleeMessages.map((m) => m.direction)).toEqual(['outbound', 'inbound', 'inbound']);
  expect(calleeMessages[0].subject.startsWith('MESSAGE sip:')).toBeTruthy();
  expect(calleeMessages[1].subject).toBe('SIP/2.0 100 Trying');
  expect(calleeMessages[2].subject).toBe('SIP/2.0 200 OK');
  const rcMessage = await RcMessage.fromXml(calleeMessages[0].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.ClientStartReply.toString());

  await assertCallCount(callerPage, 1);
  await assertCallCount(calleePage, 1);
});
