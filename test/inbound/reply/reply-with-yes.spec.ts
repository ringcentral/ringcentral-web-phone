import { expect } from '@playwright/test';

import { assertCallCount, call, testTwoPages } from '../../common';
import RcMessage from '../../../src/rc-message/rc-message';
import callControlCommands from '../../../src/rc-message/call-control-commands';

testTwoPages('reply with yes', async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await call(callerResource, calleeResource);

  // start reply
  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].startReply();
  });
  await calleePage.waitForTimeout(500);

  // reply
  callerMessages.length = 0;
  calleeMessages.length = 0;
  // do not await here, because we need to let the caller to send the reply message first
  // otherwise it will be a deadlock
  calleePage.evaluate(async () => {
    await window.inboundCalls[0].reply('Hello world!');
  });
  await calleePage.waitForTimeout(500);

  // caller press '3': Yes
  await callerPage.evaluate(async () => {
    await window.outboundCalls[0].sendDtmf('3');
  });
  await callerPage.waitForTimeout(1000);

  // caller
  expect(callerMessages).toHaveLength(0);

  // callee
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
  expect(calleeMessages[3].subject.startsWith('CANCEL sip:')).toBeTruthy();
  expect(calleeMessages[4].subject).toBe('SIP/2.0 200 OK');
  expect(calleeMessages[5].subject.startsWith('MESSAGE sip:')).toBeTruthy();
  expect(calleeMessages[6].subject).toBe('SIP/2.0 200 OK');
  let rcMessage = await RcMessage.fromXml(calleeMessages[0].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.ClientReply.toString());
  rcMessage = await RcMessage.fromXml(calleeMessages[5].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.SessionClose.toString());
  expect(rcMessage.body.Sts).toBe('0');
  expect(rcMessage.body.Resp).toBe('1');

  await assertCallCount(callerPage, 1);
  await assertCallCount(calleePage, 0);
});