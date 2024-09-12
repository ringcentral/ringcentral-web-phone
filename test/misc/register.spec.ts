import { expect } from '@playwright/test';

import { testOnePage } from '../common';

testOnePage('register', async ({ pageResource }) => {
  const { page, messages: sipMessages } = pageResource;
  await page.evaluate(async () => {
    // register AGAIN, because in setup code there is already a register
    // in case of network outage or recover from sleep, we may need to register again
    await window.webPhone.register();
  });
  const messages = sipMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(2); // register again immediately, only trigger 2 messages
  expect(messages[0]).toMatch(/^outbound - REGISTER sip:/);
  expect(messages[1]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
  expect(sipMessages[0].headers.Contact.endsWith(';expires=60')).toBeTruthy();
});
