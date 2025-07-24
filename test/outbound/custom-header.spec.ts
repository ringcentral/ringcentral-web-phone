import { expect } from "@playwright/test";

import { testOnePage } from "../common";

testOnePage("custmer header", async ({ pageResource }) => {
  const { page, messages: sipMessages } = pageResource;
  await page.evaluate(async () => {
    await globalThis.webPhone.call("78654", undefined, {
      headers: {
        "X-Custom-Header": "test",
      },
    });
  });
  expect(sipMessages.length).toBeGreaterThanOrEqual(1);
  let customHeader = sipMessages[0].headers["X-Custom-Header"]; // first invite
  expect(customHeader).toBe("test");
  customHeader = sipMessages[3].headers["X-Custom-Header"]; // second invite
  expect(customHeader).toBe("test");
});
