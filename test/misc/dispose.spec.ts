import { expect } from "@playwright/test";

import { testOnePage } from "../common";

testOnePage("dispose", async ({ pageResource }) => {
  const { page, messages: sipMessages } = pageResource;
  await page.evaluate(async () => {
    await window.webPhone.dispose();
  });
  const messages = sipMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(6);
  expect(messages).toHaveLength(6);
  expect(messages[0]).toMatch(/^outbound - REGISTER sip:/);
  expect(messages[1]).toMatch(/^inbound - SIP\/2.0 100 Trying$/);
  expect(messages[2]).toMatch(/^inbound - SIP\/2.0 401 Unauthorized$/);
  expect(messages[3]).toMatch(/^outbound - REGISTER sip:/);
  expect(messages[4]).toMatch(/^inbound - SIP\/2.0 100 Trying$/);
  expect(messages[5]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
  expect(sipMessages[0].headers.Contact.endsWith(";expires=0")).toBeTruthy();
});
