import type { BrowserContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import InboundMessage from '../src/sip-message/inbound';
import OutboundMessage from '../src/sip-message/outbound';
import type SipMessage from '../src/sip-message';
import type WebPhone from '../src';
import RcMessage from '../src/rc-message/rc-message';
import callControlCommands from '../src/rc-message/call-control-commands';
import type OutboundCallSession from '../src/call-session/outbound';
import type InboundCallSession from '../src/call-session/inbound';

const callerJwt = process.env.RINGCENTRAL_JWT_TOKEN!;
const calleeJwt = process.env.RINGCENTRAL_JWT_TOKEN_2!;
// const callerNumber = process.env.PHONE_NUMBER!;
const calleeNumber = process.env.PHONE_NUMBER_2!;

declare global {
  interface Window {
    webPhone: WebPhone;
    initWebPhone: (jwt: string) => Promise<void>;
    outboundCalls: OutboundCallSession[];
    inboundCalls: InboundCallSession[];
  }
}

const register = async ({ context, jwt }: { context: BrowserContext; jwt: string }) => {
  const page = await context.newPage();
  await page.goto('/');
  await page.evaluate(async (jwt) => {
    await window.initWebPhone(jwt);
  }, jwt);
  const messages: SipMessage[] = [];
  page.once('websocket', (ws) => {
    ws.on('framesent', (frame) => messages.push(OutboundMessage.fromString(frame.payload as string)));
    ws.on('framereceived', (frame) => messages.push(InboundMessage.fromString(frame.payload as string)));
  });
  await page.evaluate(async () => {
    await window.webPhone.register();
  });
  return { page, messages };
};

test('registration', async ({ context }) => {
  const { messages } = await register({ context, jwt: callerJwt });
  expect(messages.length).toBe(6);
  expect(messages.map((m) => m.subject)).toEqual([
    'REGISTER sip:sip.ringcentral.com SIP/2.0',
    'SIP/2.0 100 Trying',
    'SIP/2.0 401 Unauthorized',
    'REGISTER sip:sip.ringcentral.com SIP/2.0',
    'SIP/2.0 100 Trying',
    'SIP/2.0 200 OK',
  ]);
  expect(messages.map((m) => m.direction)).toEqual([
    'outbound',
    'inbound',
    'inbound',
    'outbound',
    'inbound',
    'inbound',
  ]);
});

const call = async ({ context }: { context: BrowserContext }) => {
  const { page: callerPage, messages: callerMessages } = await register({ context, jwt: callerJwt });
  const { page: calleePage, messages: calleeMessages } = await register({ context, jwt: calleeJwt });
  callerMessages.length = 0;
  calleeMessages.length = 0;
  await callerPage.evaluate(async (calleeNumber) => {
    await window.webPhone.call(calleeNumber);
  }, calleeNumber);
  await callerPage.waitForTimeout(1000);
  return { callerPage, calleePage, callerMessages, calleeMessages };
};

test('call', async ({ context }) => {
  const { callerMessages, calleeMessages } = await call({ context });

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

  const rcMessage = RcMessage.fromXml(calleeMessages[3].body);
  expect(rcMessage.Hdr.Cmd).toBe(callControlCommands.ClientReceiveConfirm.toString());
});

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

  let rcMessage = RcMessage.fromXml(calleeMessages[0].body);
  expect(rcMessage.Hdr.Cmd).toBe(callControlCommands.ClientReject.toString());
  rcMessage = RcMessage.fromXml(calleeMessages[3].body);
  expect(rcMessage.Hdr.Cmd).toBe(callControlCommands.SessionClose.toString());
});
