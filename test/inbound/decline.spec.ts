import test, { expect } from '@playwright/test';

import { call } from '../common';
import RcMessage from '../../src/rc-message/rc-message';
import callControlCommands from '../../src/rc-message/call-control-commands';

test('decline inbound call', async ({ context }) => {
  const { calleePage, callerMessages, calleeMessages } = await call({ context });
  callerMessages.length = 0;
  calleeMessages.length = 0;
  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].decline();
  });
  await calleePage.waitForTimeout(1000);

  // caller
  expect(callerMessages.length).toBe(0);

  // callee
  expect(calleeMessages.length).toBe(6);
  expect(calleeMessages[0].subject.startsWith('MESSAGE sip:')).toBeTruthy();
  expect(calleeMessages[1].subject).toBe('SIP/2.0 100 Trying');
  expect(calleeMessages[2].subject).toBe('SIP/2.0 200 OK');
  expect(calleeMessages[3].subject.startsWith('MESSAGE sip:')).toBeTruthy();
  expect(calleeMessages[4].subject).toBe('SIP/2.0 200 OK');
  expect(calleeMessages[5].subject.startsWith('CANCEL sip:')).toBeTruthy();
  expect(calleeMessages.map((m) => m.direction)).toEqual([
    'outbound',
    'inbound',
    'inbound',
    'inbound',
    'outbound',
    'inbound',
  ]);
  let rcMessage = await RcMessage.fromXml(calleeMessages[0].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.ClientReject.toString());
  rcMessage = await RcMessage.fromXml(calleeMessages[3].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.SessionClose.toString());
});
