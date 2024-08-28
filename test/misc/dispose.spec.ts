import { expect } from '@playwright/test';

import { testOnePage } from '../common';

testOnePage('dispose', async ({ pageResource }) => {
  const { page, messages } = pageResource;
  await page.evaluate(async () => {
    await window.webPhone.register();
  });
  messages.length = 0;
  await page.evaluate(async () => {
    await window.webPhone.dispose();
  });
  await page.waitForTimeout(500);
  expect(messages).toHaveLength(6);
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
  expect(messages[0].headers.Contact.endsWith(';expires=0')).toBeTruthy();
});
