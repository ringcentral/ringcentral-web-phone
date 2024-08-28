import { expect } from '@playwright/test';

import { assertCallCount, call, testTwoPages } from '../common';
import RcMessage from '../../src/rc-message/rc-message';
import callControlCommands from '../../src/rc-message/call-control-commands';

testTwoPages('inbound call to voicemail', async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await call(callerResource, calleeResource);

  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].toVoicemail();
  });
  await calleePage.waitForTimeout(500);

  // caller
  expect(callerMessages).toHaveLength(0);

  // callee
  await calleePage.waitForTimeout(500);
  expect(calleeMessages).toHaveLength(7);
  expect(calleeMessages.map((m) => m.direction)).toEqual([
    'outbound',
    'inbound',
    'inbound',
    'inbound',
    'outbound',
    'inbound',
    'outbound',
  ]);
  expect(calleeMessages[0].subject.startsWith('MESSAGE sip:')).toBeTruthy();
  expect(calleeMessages[1].subject).toBe('SIP/2.0 100 Trying');
  expect(calleeMessages[2].subject).toBe('SIP/2.0 200 OK');
  expect(calleeMessages[3].subject.startsWith('MESSAGE sip:')).toBeTruthy();
  expect(calleeMessages[4].subject).toBe('SIP/2.0 200 OK');
  expect(calleeMessages[5].subject.startsWith('CANCEL sip:')).toBeTruthy();
  expect(calleeMessages[6].subject).toBe('SIP/2.0 200 OK');
  let rcMessage = await RcMessage.fromXml(calleeMessages[0].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.ClientVoicemail.toString());
  rcMessage = await RcMessage.fromXml(calleeMessages[3].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.SessionClose.toString());

  await assertCallCount(callerPage, 1);
  await assertCallCount(calleePage, 0);
});
