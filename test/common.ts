import type { BrowserContext } from '@playwright/test';

import type SipMessage from '../src/sip-message';
import OutboundMessage from '../src/sip-message/outbound';
import InboundMessage from '../src/sip-message/inbound';
import type WebPhone from '../src';
import type OutboundCallSession from '../src/call-session/outbound';
import type InboundCallSession from '../src/call-session/inbound';

declare global {
  interface Window {
    webPhone: WebPhone;
    initWebPhone: (jwt: string) => Promise<void>;
    outboundCalls: OutboundCallSession[];
    inboundCalls: InboundCallSession[];
  }
}

export const callerJwt = process.env.CALLER_JWT_TOKEN!;
export const calleeJwt = process.env.CALLEE_JWT_TOKEN!;
export const callerNumber = process.env.CALLER_NUMBER!;
export const calleeNumber = process.env.CALLEE_NUMBER!;
export const anotherNumber = process.env.ANOTHER_NUMBER!;

export const register = async ({ context, jwt }: { context: BrowserContext; jwt: string }) => {
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

export const call = async ({ context }: { context: BrowserContext }) => {
  const { page: callerPage, messages: callerMessages } = await register({ context, jwt: callerJwt });
  const { page: calleePage, messages: calleeMessages } = await register({ context, jwt: calleeJwt });
  callerMessages.length = 0;
  calleeMessages.length = 0;
  await callerPage.evaluate(
    async ({ calleeNumber, callerNumber }) => {
      await window.webPhone.call(calleeNumber, callerNumber);
    },
    { calleeNumber, callerNumber },
  );
  await callerPage.waitForTimeout(1000);
  return { callerPage, calleePage, callerMessages, calleeMessages };
};
