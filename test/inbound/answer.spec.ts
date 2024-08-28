import { expect } from '@playwright/test';

import RcMessage from '../../src/rc-message/rc-message';
import callControlCommands from '../../src/rc-message/call-control-commands';
import { call, testTwoPages, assertCallCount } from '../common';

testTwoPages('answer inbound call', async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await call(callerResource, calleeResource);

  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].answer();
  });
  await calleePage.waitForTimeout(1000);

  // caller
  expect(callerMessages.length).toBe(0);

  // callee
  expect(calleeMessages.length).toBe(4);
  expect(calleeMessages.map((m) => m.direction)).toEqual(['outbound', 'inbound', 'inbound', 'outbound']);
  expect(calleeMessages[0].subject).toBe('SIP/2.0 200 OK');
  expect(calleeMessages[1].subject.startsWith('ACK sip:')).toBeTruthy();
  expect(calleeMessages[2].subject.startsWith('MESSAGE sip:')).toBeTruthy();
  expect(calleeMessages[3].subject).toBe('SIP/2.0 200 OK');
  const rcMessage = await RcMessage.fromXml(calleeMessages[2].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.AlreadyProcessed.toString());

  await assertCallCount({ callerPage, callerCount: 1, calleePage, calleeCount: 1 });
});
