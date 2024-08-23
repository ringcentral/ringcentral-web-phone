import test, { expect } from '@playwright/test';

import { anotherNumber, call } from '../common';
import RcMessage from '../../src/rc-message/rc-message';
import callControlCommands from '../../src/rc-message/call-control-commands';

test('start reply', async ({ context }) => {
  const { calleePage, callerMessages, calleeMessages } = await call({ context });
  callerMessages.length = 0;
  calleeMessages.length = 0;

  // start reply
  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].startReply();
  });
  await calleePage.waitForTimeout(1000);

  // caller
  expect(callerMessages.length).toBe(0);

  // callee
  expect(calleeMessages.length).toBe(3);
  expect(calleeMessages.map((m) => m.direction)).toEqual(['outbound', 'inbound', 'inbound']);
  expect(calleeMessages[0].subject.startsWith('MESSAGE sip:')).toBeTruthy();
  expect(calleeMessages[1].subject).toBe('SIP/2.0 100 Trying');
  expect(calleeMessages[2].subject).toBe('SIP/2.0 200 OK');
  const rcMessage = await RcMessage.fromXml(calleeMessages[0].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.ClientStartReply.toString());
});

test('reply with yes', async ({ context }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await call({ context });

  // start reply
  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].startReply();
  });
  await calleePage.waitForTimeout(1000);

  // reply
  callerMessages.length = 0;
  calleeMessages.length = 0;
  // do not await here, because we need to let the caller to send the reply message first
  // otherwise it will be a deadlock
  calleePage.evaluate(async () => {
    await window.inboundCalls[0].reply('Hello world!');
  });
  await calleePage.waitForTimeout(1000);

  // caller press '3': Yes
  await callerPage.evaluate(async () => {
    await window.outboundCalls[0].sendDtmf('3');
  });
  await callerPage.waitForTimeout(1000);

  // caller
  expect(callerMessages.length).toBe(0);

  // callee
  expect(calleeMessages.length).toBe(6);
  expect(calleeMessages.map((m) => m.direction)).toEqual([
    'outbound',
    'inbound',
    'inbound',
    'inbound',
    'inbound',
    'outbound',
  ]);
  expect(calleeMessages[0].subject.startsWith('MESSAGE sip:')).toBeTruthy();
  expect(calleeMessages[1].subject).toBe('SIP/2.0 100 Trying');
  expect(calleeMessages[2].subject).toBe('SIP/2.0 200 OK');
  expect(calleeMessages[3].subject.startsWith('CANCEL sip:')).toBeTruthy();
  expect(calleeMessages[4].subject.startsWith('MESSAGE sip:')).toBeTruthy();
  expect(calleeMessages[5].subject).toBe('SIP/2.0 200 OK');
  let rcMessage = await RcMessage.fromXml(calleeMessages[0].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.ClientReply.toString());
  rcMessage = await RcMessage.fromXml(calleeMessages[4].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.SessionClose.toString());
  expect(rcMessage.body.Sts).toBe('0');
  expect(rcMessage.body.Resp).toBe('1');
});

test('reply with urgent', async ({ context }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await call({ context });

  // start reply
  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].startReply();
  });
  await calleePage.waitForTimeout(1000);

  // reply
  callerMessages.length = 0;
  calleeMessages.length = 0;
  // do not await here, because we need to let the caller to send the reply message first
  // otherwise it will be a deadlock
  calleePage.evaluate(async () => {
    await window.inboundCalls[0].reply('Hello world!');
  });
  await calleePage.waitForTimeout(1000);

  // caller press '5': Urgent
  await callerPage.evaluate(async () => {
    window.outboundCalls[0].sendDtmf('5');
  });
  await callerPage.waitForTimeout(1000);
  // caller specify callback number
  await callerPage.evaluate(async (anotherNumber) => {
    window.outboundCalls[0].sendDtmf(`${anotherNumber}#`);
  }, anotherNumber);
  await callerPage.waitForTimeout(3000);
  // caller press '1' to confirm the callback number
  await callerPage.evaluate(async () => {
    window.outboundCalls[0].sendDtmf('1');
  });
  await callerPage.waitForTimeout(1000);

  // caller
  expect(callerMessages.length).toBe(0);

  // callee
  expect(calleeMessages.length).toBe(6);
  expect(calleeMessages.map((m) => m.direction)).toEqual([
    'outbound',
    'inbound',
    'inbound',
    'inbound',
    'inbound',
    'outbound',
  ]);
  expect(calleeMessages[0].subject.startsWith('MESSAGE sip:')).toBeTruthy();
  expect(calleeMessages[1].subject).toBe('SIP/2.0 100 Trying');
  expect(calleeMessages[2].subject).toBe('SIP/2.0 200 OK');
  expect(calleeMessages[3].subject.startsWith('CANCEL sip:')).toBeTruthy();
  expect(calleeMessages[4].subject.startsWith('MESSAGE sip:')).toBeTruthy();
  expect(calleeMessages[5].subject).toBe('SIP/2.0 200 OK');
  let rcMessage = await RcMessage.fromXml(calleeMessages[0].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.ClientReply.toString());
  rcMessage = await RcMessage.fromXml(calleeMessages[4].body);
  expect(rcMessage.headers.Cmd).toBe(callControlCommands.SessionClose.toString());
  expect(rcMessage.body.Sts).toBe('0');
  expect(rcMessage.body.Resp).toBe('3');
  expect(rcMessage.body.ExtNfo).toBe(anotherNumber);
});
