import { expect } from '@playwright/test';

import RcMessage from '../../src/rc-message/rc-message';
import callControlCommands from '../../src/rc-message/call-control-commands';
import { call, testTwoPages, assertCallCount } from '../common';

testTwoPages('answer inbound call', async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await call(callerResource, calleeResource);

  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].answer();
  });

  // caller
  expect(callerMessages).toHaveLength(0);
  await assertCallCount(callerPage, 1);

  // callee
  const messages = calleeMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(4);
  expect(messages[0]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  expect(messages[1]).toMatch(/^inbound - ACK sip:/);
  expect(messages[2]).toMatch(/^inbound - MESSAGE sip:/);
  expect(messages[3]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  const rcMessage = await RcMessage.fromXml(calleeMessages[2].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.AlreadyProcessed.toString());
  await assertCallCount(calleePage, 1);
});
