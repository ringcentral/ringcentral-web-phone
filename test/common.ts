import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import type SipMessage from '../src/sip-message';
import OutboundMessage from '../src/sip-message/outbound';
import InboundMessage from '../src/sip-message/inbound';
import type WebPhone from '../src';
import type OutboundCallSession from '../src/call-session/outbound';
import type InboundCallSession from '../src/call-session/inbound';

declare global {
  interface Window {
    webPhone: WebPhone;
    setup: (jwt: string) => Promise<void>;
    teardown: () => Promise<void>;
    outboundCalls: OutboundCallSession[];
    inboundCalls: InboundCallSession[];
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

export const testOnePage = test.extend<{ pageResource: PageResource }>({
  pageResource: async ({ context }, use) => {
    const page = await context.newPage();
    await page.goto('/');
    const messages: SipMessage[] = [];
    page.once('websocket', (ws) => {
      ws.on('framesent', (frame) => messages.push(OutboundMessage.fromString(frame.payload as string)));
      ws.on('framereceived', (frame) => messages.push(InboundMessage.fromString(frame.payload as string)));
    });
    await page.evaluate(async (sipInfo) => {
      await window.setup(sipInfo);
    }, callerSipInfo);
    await use({ page, messages });
    messages.length = 0;
    await page.evaluate(async () => {
      await window.teardown();
    });
    await page.waitForTimeout(500); // wait for the teardown to finish
  },
});

export const testTwoPages = test.extend<{
  callerResource: PageResource;
  calleeResource: PageResource;
}>({
  callerResource: async ({ context }, use) => {
    const page = await context.newPage();
    await page.goto('/');
    const messages: SipMessage[] = [];
    page.once('websocket', (ws) => {
      ws.on('framesent', (frame) => messages.push(OutboundMessage.fromString(frame.payload as string)));
      ws.on('framereceived', (frame) => messages.push(InboundMessage.fromString(frame.payload as string)));
    });
    await page.evaluate(async (callerSipInfo) => {
      await window.setup(callerSipInfo);
      await window.webPhone.register();
    }, callerSipInfo);
    messages.length = 0;
    await use({ page, messages });
    messages.length = 0;
    await page.evaluate(async () => {
      await window.teardown();
    });
    await page.waitForTimeout(500); // wait for the teardown to finish
  },
  calleeResource: async ({ context }, use) => {
    const page = await context.newPage();
    await page.goto('/');
    const messages: SipMessage[] = [];
    page.once('websocket', (ws) => {
      ws.on('framesent', (frame) => messages.push(OutboundMessage.fromString(frame.payload as string)));
      ws.on('framereceived', (frame) => messages.push(InboundMessage.fromString(frame.payload as string)));
    });
    await page.evaluate(async (calleeSipInfo) => {
      await window.setup(calleeSipInfo);
      await window.webPhone.register();
    }, calleeSipInfo);
    messages.length = 0;
    await use({ page, messages });
    messages.length = 0;
    await page.evaluate(async () => {
      await window.teardown();
    });
    await page.waitForTimeout(500); // wait for the teardown to finish
  },
});

export const call = async (callerResource: PageResource, calleeResource: PageResource, keepMessages = false) => {
  const { page: callerPage, messages: callerMessages } = callerResource;
  const { page: calleePage, messages: calleeMessages } = calleeResource;
  await callerPage.evaluate(
    async ({ calleeNumber, callerNumber }) => {
      await window.webPhone.call(calleeNumber, callerNumber);
    },
    { calleeNumber, callerNumber },
  );
  await callerPage.waitForTimeout(500);
  if (!keepMessages) {
    callerMessages.length = 0;
    calleeMessages.length = 0;
  }
  return { callerPage, calleePage, callerMessages, calleeMessages };
};

export const callAndAnswer = async (callerResource: PageResource, calleeResource: PageResource) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await call(callerResource, calleeResource);
  await calleePage.evaluate(async () => {
    await window.inboundCalls[0].answer();
  });
  await callerPage.waitForTimeout(500);
  callerMessages.length = 0;
  calleeMessages.length = 0;
  return { callerPage, calleePage, callerMessages, calleeMessages };
};

export const assertCallCount = async ({
  callerPage,
  callerCount,
  calleePage,
  calleeCount,
}: {
  callerPage: Page;
  callerCount: number;
  calleePage: Page;
  calleeCount: number;
}) => {
  const callerCalls = await callerPage.evaluate(() => window.outboundCalls);
  const calleeCalls = await calleePage.evaluate(() => window.inboundCalls);
  expect(callerCalls).toHaveLength(callerCount);
  expect(calleeCalls).toHaveLength(calleeCount);
};
