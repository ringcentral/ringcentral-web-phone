import { expect } from '@playwright/test';

import { calleeNumber, callerNumber, call, testTwoPages, assertCallCount } from './common';
import RcMessage from '../src/rc-message/rc-message';
import callControlCommands from '../src/rc-message/call-control-commands';

testTwoPages('call', async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await call(callerResource, calleeResource, true);

  // caller
  expect(callerMessages.length).toBe(8);
  expect(callerMessages.map((m) => m.subject)).toEqual([
    `INVITE sip:${calleeNumber}@sip.ringcentral.com SIP/2.0`,
    'SIP/2.0 100 Trying',
    'SIP/2.0 407 Proxy Authentication Required',
    `INVITE sip:${calleeNumber}@sip.ringcentral.com SIP/2.0`,
    'SIP/2.0 100 Trying',
    'SIP/2.0 183 Session Progress',
    'SIP/2.0 200 OK',
    `ACK sip:${calleeNumber}@sip.ringcentral.com SIP/2.0`,
  ]);
  expect(callerMessages.map((m) => m.direction)).toEqual([
    'outbound',
    'inbound',
    'inbound',
    'outbound',
    'inbound',
    'inbound',
    'inbound',
    'outbound',
  ]);

  // callee
  expect(calleeMessages.length).toBe(6);
  expect(calleeMessages[0].subject.startsWith('INVITE sip:')).toBeTruthy();
  expect(calleeMessages[1].subject).toBe('SIP/2.0 100 Trying');
  expect(calleeMessages[2].subject).toBe('SIP/2.0 180 Ringing');
  expect(calleeMessages[3].subject.startsWith('MESSAGE sip:')).toBeTruthy();
  expect(calleeMessages[4].subject).toBe('SIP/2.0 100 Trying');
  expect(calleeMessages[5].subject).toBe('SIP/2.0 200 OK');
  expect(calleeMessages.map((m) => m.direction)).toEqual([
    'inbound',
    'outbound',
    'outbound',
    'outbound',
    'inbound',
    'inbound',
  ]);
  let rcMessage = await RcMessage.fromXml(calleeMessages[0].headers['P-rc']);
  expect(rcMessage.body.Phn?.substring(1)).toBe(callerNumber); // rcMessage.body.Phn starts with '+'
  expect(rcMessage.body.ToPhn?.substring(1)).toBe(calleeNumber); // rcMessage.body.ToPhn starts with '+'
  rcMessage = await RcMessage.fromXml(calleeMessages[3].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.ClientReceiveConfirm.toString());

  await assertCallCount({ callerPage, callerCount: 1, calleePage, calleeCount: 1 });
});
