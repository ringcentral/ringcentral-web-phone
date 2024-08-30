import { expect } from '@playwright/test';
import waitFor from 'wait-for-async';

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

  // caller
  expect(callerMessages).toHaveLength(2);
  expect(callerMessages.map((m) => m.direction)).toEqual(['outbound', 'inbound']);
  expect(callerMessages[0].subject.startsWith('BYE sip:')).toBeTruthy();
  expect(callerMessages[1].subject).toBe('SIP/2.0 200 OK');
  await assertCallCount(callerPage, 0);

  // callee
  await waitFor({
    interval: 100,
    condition: () => {
      const lastMessage = calleeMessages[calleeMessages.length - 1];
      return lastMessage && lastMessage.subject === 'SIP/2.0 200 OK' && lastMessage.headers.CSeq.endsWith(' MESSAGE');
    },
  });
  const messages = calleeMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(4);
  expect(messages[0]).toMatch(/^inbound - BYE sip:/);
  expect(messages[1]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  expect(messages[2]).toMatch(/^inbound - MESSAGE sip:/);
  expect(messages[3]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  const rcMessage = await RcMessage.fromXml(calleeMessages[2].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.ServerFreeResources.toString());
  await assertCallCount(calleePage, 0);
});
