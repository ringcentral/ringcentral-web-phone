import { expect } from "@playwright/test";
import waitFor from "wait-for-async";
import callControlCommands from "../../src/rc-message/call-control-commands";
import RcMessage from "../../src/rc-message/rc-message";
import { assertCallCount, callAndAnswer, testTwoPages } from "../common";

testTwoPages("caller hang up", async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } =
    await callAndAnswer(callerResource, calleeResource);

  await callerPage.evaluate(async () => {
    await globalThis.outboundCalls[0].hangup();
  });

  // caller
  let messages = callerMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(2);
  expect(messages[0]).toMatch(/^outbound - BYE sip:/);
  expect(messages[1]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
  await assertCallCount(callerPage, 0);

  // callee
  await waitFor({ condition: () => calleeMessages.length >= 4 });
  messages = calleeMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(4);

  const byeIndex = messages.findIndex((message) =>
    /^inbound - BYE sip:/.test(message),
  );
  const messageIndex = messages.findIndex((message) =>
    /^inbound - MESSAGE sip:/.test(message),
  );
  expect(byeIndex).toBeGreaterThanOrEqual(0);
  expect(messageIndex).toBeGreaterThanOrEqual(0);
  expect(messages[byeIndex + 1]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  expect(messages[messageIndex + 1]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  const rcMessage = await RcMessage.fromXml(calleeMessages[messageIndex].body);
  expect(rcMessage.headers.Cmd).toBe(
    callControlCommands.ServerFreeResources.toString(),
  );

  await assertCallCount(calleePage, 0);
});
