import { expect } from "@playwright/test";
import waitFor from "wait-for-async";

import { assertCallCount, callAndAnswer, testTwoPages } from "../common";
import RcMessage from "../../src/rc-message/rc-message";
import callControlCommands from "../../src/rc-message/call-control-commands";

testTwoPages("caller hang up", async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } =
    await callAndAnswer(
      callerResource,
      calleeResource,
    );

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

  // pay attention: sometimes we receive BYE first, sometimes we receive MESSAGE first
  // especially, if you enable call recording, you may receive MESSAGE first
  expect(messages[0]).toMatch(/^inbound - BYE sip:/);
  expect(messages[1]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  expect(messages[2]).toMatch(/^inbound - MESSAGE sip:/);
  expect(messages[3]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  const rcMessage = await RcMessage.fromXml(calleeMessages[2].body);
  expect(rcMessage.headers.Cmd).toBe(
    callControlCommands.ServerFreeResources.toString(),
  );

  await assertCallCount(calleePage, 0);
});
