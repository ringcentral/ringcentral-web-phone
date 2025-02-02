import type { BrowserContext, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import waitFor from "wait-for-async";

import type SipMessage from "../src/sip-message";
import OutboundMessage from "../src/sip-message/outbound";
import InboundMessage from "../src/sip-message/inbound";
import type WebPhone from "../src";
import type OutboundCallSession from "../src/call-session/outbound";
import type InboundCallSession from "../src/call-session/inbound";
import RcMessage from "../src/rc-message/rc-message";

declare global {
  interface Window {
    webPhone: WebPhone;
    setup: (jwt: string) => Promise<void>;
    teardown: () => Promise<void>;
    outboundCalls: OutboundCallSession[];
    inboundCalls: InboundCallSession[];
    transferActions: {
      complete: () => Promise<void>;
      cancel: () => Promise<void>;
    };
  }
}

const callerSipInfo = process.env.CALLER_SIP_INFO!;
const calleeSipInfo = process.env.CALLEE_SIP_INFO!;
export const callerNumber = process.env.CALLER_NUMBER!;
export const calleeNumber = process.env.CALLEE_NUMBER!;
export const anotherNumber = process.env.ANOTHER_NUMBER!;

interface PageResource {
  page: Page;
  messages: SipMessage[];
}

const setupPage = async ({
  context,
  sipInfo,
  name,
  debug,
}: {
  context: BrowserContext;
  sipInfo: string;
  name: string;
  debug?: boolean;
}) => {
  const page = await context.newPage();
  await page.goto("/");
  const messages: SipMessage[] = [];
  // we do not use page.once here, because client side may call register() multiple times
  page.on("websocket", (ws) => {
    ws.on("framereceived", async (frame) => {
      const inboundMessage = InboundMessage.fromString(frame.payload as string);
      if (inboundMessage.subject.startsWith("MESSAGE ")) {
        const rcMessage = await RcMessage.fromXml(inboundMessage.body);
        if (
          rcMessage.body.Cln &&
          rcMessage.body.Cln !== JSON.parse(sipInfo).authorizationId
        ) {
          return; // the message is not for this instance
        }
      }
      messages.push(inboundMessage);
    });
    ws.on("framesent", (frame) => {
      const outboundMessage = OutboundMessage.fromString(
        frame.payload as string,
      );
      messages.push(outboundMessage);
    });
  });
  if (debug) {
    page.on("console", (msg) => {
      console.log(`\n[${name}] ${msg.text()}`);
    });
  }
  await page.evaluate(async (sipInfo) => {
    await window.setup(sipInfo);
  }, sipInfo);
  messages.length = 0;
  return { page, messages };
};

const teardownPage = async (page: Page) => {
  await page.evaluate(async () => {
    await window.teardown();
  });

  // very important, wait for teardown to complete
  // othwerwise, after lots of tests, some exiting instances running in browser may stop working
  await page.waitForTimeout(1000);
};

export const testOnePage = test.extend<{ pageResource: PageResource }>({
  pageResource: async ({ context }, use) => {
    const { page, messages } = await setupPage({
      context,
      sipInfo: callerSipInfo,
      name: "user",
      debug: false,
    });
    await use({ page, messages });
    await teardownPage(page);
  },
});

export const testTwoPages = test.extend<{
  callerResource: PageResource;
  calleeResource: PageResource;
}>({
  callerResource: async ({ context }, use) => {
    const { page, messages } = await setupPage({
      context,
      sipInfo: callerSipInfo,
      name: "caller",
      debug: false,
    });
    await use({ page, messages });
    await teardownPage(page);
  },
  calleeResource: async ({ context }, use) => {
    const { page, messages } = await setupPage({
      context,
      sipInfo: calleeSipInfo,
      name: "callee",
      debug: false,
    });
    await use({ page, messages });
    await teardownPage(page);
  },
});

export const call = async (
  callerResource: PageResource,
  calleeResource: PageResource,
  keepMessages = false,
) => {
  const { page: callerPage, messages: callerMessages } = callerResource;
  const { page: calleePage, messages: calleeMessages } = calleeResource;
  await callerPage.evaluate(
    async ({ calleeNumber, callerNumber }) => {
      await window.webPhone.call(calleeNumber, callerNumber);
    },
    { calleeNumber, callerNumber },
  );

  // wait for the call to reach the callee
  // by SIP server design, caller will receive 200 OK immediately, even if the callee has not received the INVITE
  // So we need to wait for the callee to receive the INVITE
  await waitFor({ interval: 1000 });

  if (!keepMessages) {
    callerMessages.length = 0;
    calleeMessages.length = 0;
  }
  return { callerPage, calleePage, callerMessages, calleeMessages };
};

export const callAndAnswer = async (
  callerResource: PageResource,
  calleeResource: PageResource,
) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await call(
    callerResource,
    calleeResource,
  );
  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].answer();
  });
  callerMessages.length = 0;
  calleeMessages.length = 0;
  return { callerPage, calleePage, callerMessages, calleeMessages };
};

export const assertCallCount = async (page: Page, count: number) => {
  const callsCount = await page.evaluate(() =>
    window.webPhone.callSessions.length
  );
  expect(callsCount).toBe(count);
};
