import { expect } from '@playwright/test';

import { assertCallCount, callAndAnswer, testTwoPages } from '../common';
import RcMessage from '../../src/rc-message/rc-message';
import callControlCommands from '../../src/rc-message/call-control-commands';

testTwoPages('caller hang up', async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await callAndAnswer(
    callerResource,
    calleeResource,
  );

  await callerPage.evaluate(async () => {
    await window.outboundCalls[0].hangup();
  });
  await callerPage.waitForTimeout(1000);

  // caller
  expect(callerMessages.length).toBe(2);
  expect(callerMessages.map((m) => m.direction)).toEqual(['outbound', 'inbound']);
  expect(callerMessages[0].subject.startsWith('BYE sip:')).toBeTruthy();
  expect(callerMessages[1].subject).toBe('SIP/2.0 200 OK');

  // callee
  expect(calleeMessages.length).toBe(4);
  expect(calleeMessages.map((m) => m.direction)).toEqual(['inbound', 'outbound', 'inbound', 'outbound']);
  expect(calleeMessages[0].subject.startsWith('BYE sip:')).toBeTruthy();
  expect(calleeMessages[1].subject).toBe('SIP/2.0 200 OK');
  expect(calleeMessages[2].subject.startsWith('MESSAGE sip:')).toBeTruthy();
  expect(calleeMessages[3].subject).toBe('SIP/2.0 200 OK');
  const rcMessage = await RcMessage.fromXml(calleeMessages[2].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.ServerFreeResources.toString());

  await assertCallCount({ callerPage, callerCount: 0, calleePage, calleeCount: 0 });
});
