import { expect } from "@playwright/test";

import { assertCallCount, call, testTwoPages } from "../../common";
import RcMessage from "../../../src/rc-message/rc-message";
import callControlCommands from "../../../src/rc-message/call-control-commands";

testTwoPages("start reply", async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await call(
    callerResource,
    calleeResource,
  );

  // start reply
  await calleePage.evaluate(async () => {
    await globalThis.inboundCalls[0].startReply();
  });

  // caller
  expect(callerMessages).toHaveLength(0);

  // callee
  const messages = calleeMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(3);
  expect(messages[0]).toMatch(/^outbound - MESSAGE sip:/);
  expect(messages[1]).toMatch(/^inbound - SIP\/2.0 100 Trying$/);
  expect(messages[2]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
  const rcMessage = await RcMessage.fromXml(calleeMessages[0].body);
  expect(rcMessage.headers.Cmd).toBe(
    callControlCommands.ClientStartReply.toString(),
  );

  await assertCallCount(callerPage, 1);
  await assertCallCount(calleePage, 1);
});
