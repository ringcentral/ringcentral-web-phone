import { expect, test } from '@playwright/test';
import { InboundMessage, type SipMessage } from '../src/sip-message';

test('registration', async ({ context }) => {
  const page = await context.newPage();
  const messages: SipMessage[] = [];
  page.once('websocket', (ws) => {
    ws.on('framesent', (frame) => messages.push(InboundMessage.fromString(frame.payload as string)));
    ws.on('framereceived', (frame) => messages.push(InboundMessage.fromString(frame.payload as string)));
  });
  await page.goto('/');
  await page.waitForTimeout(1000);
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
