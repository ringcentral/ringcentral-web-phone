import type { BrowserContext } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { InboundMessage, type SipMessage } from '../src/sip-message';
import type WebPhone from '../src';

declare global {
  interface Window {
    webPhone: WebPhone;
  }
}

const register = async ({ context }: { context: BrowserContext }) => {
  const page = await context.newPage();
  const messages: SipMessage[] = [];
  page.once('websocket', (ws) => {
    ws.on('framesent', (frame) => messages.push(InboundMessage.fromString(frame.payload as string)));
    ws.on('framereceived', (frame) => messages.push(InboundMessage.fromString(frame.payload as string)));
  });
  await page.goto('/');
  await page.waitForTimeout(1000);
  await page.evaluate(async () => {
    await window.webPhone.register();
  });
  await page.waitForTimeout(1000);
  return { page, messages };
};

test('registration', async ({ context }) => {
  const { messages } = await register({ context });
  expect(messages.length).toBe(6);
  expect(messages.map((m) => m.subject)).toEqual([
    'REGISTER sip:sip.ringcentral.com SIP/2.0',
    'SIP/2.0 100 Trying',
    'SIP/2.0 401 Unauthorized',
    'REGISTER sip:sip.ringcentral.com SIP/2.0',
    'SIP/2.0 100 Trying',
    'SIP/2.0 200 OK',
  ]);
});

test('call', async ({ context }) => {
  const { page: callerPage, messages: callerMessages } = await register({ context });
  callerMessages.length = 0;
  const callee = process.env.PHONE_NUMBER_2!;
  await callerPage.evaluate(async (callee) => {
    await window.webPhone.call(callee);
  }, callee);
  await callerPage.waitForTimeout(1000);
  expect(callerMessages.length).toBeGreaterThan(6);
  expect(callerMessages.map((m) => m.subject)).toEqual([
    `INVITE sip:${callee}@sip.ringcentral.com SIP/2.0`,
    'SIP/2.0 100 Trying',
    'SIP/2.0 407 Proxy Authentication Required',
    `INVITE sip:${callee}@sip.ringcentral.com SIP/2.0`,
    'SIP/2.0 100 Trying',
    'SIP/2.0 183 Session Progress',
    'SIP/2.0 200 OK',
    `ACK sip:${callee}@sip.ringcentral.com SIP/2.0`,
  ]);
});
