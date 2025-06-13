import { expect } from "@playwright/test";

import { testOnePage } from "../common";

testOnePage("register", async ({ pageResource }) => {
  const { page, messages: sipMessages } = pageResource;
  await page.evaluate(async () => {
    await globalThis.webPhone.call("78654");
  });
  const messages = sipMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(7);
  expect(messages[0]).toMatch(/^outbound - INVITE sip:/);
  expect(messages[1]).toMatch(/^inbound - SIP\/2.0 100 Trying$/);
  expect(messages[2]).toMatch(
    /^inbound - SIP\/2.0 407 Proxy Authentication Required$/,
  );
  expect(messages[3]).toMatch(/^outbound - INVITE sip:/);
  expect(messages[4]).toMatch(/^inbound - SIP\/2.0 100 Trying$/);
  expect(messages[5]).toMatch(/^inbound - SIP\/2.0 183 Session Progress$/);
  expect(messages[6]).toMatch(/^inbound - SIP\/2.0 486 Busy Here$/);

  const count = await page.evaluate(() => {
    return globalThis.webPhone.callSessions.length;
  });
  expect(count).toBe(0); // failed calls are automatically disposed
});
