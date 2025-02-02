import { expect } from "@playwright/test";
import waitFor from "wait-for-async";

import { assertCallCount, call, testTwoPages } from "../../common";
import RcMessage from "../../../src/rc-message/rc-message";
import callControlCommands from "../../../src/rc-message/call-control-commands";

testTwoPages("reply with yes", async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await call(
    callerResource,
    calleeResource,
  );

  // start reply
  await calleePage.evaluate(async () => {
    await globalThis.inboundCalls[0].startReply();
  });

  // reply
  callerMessages.length = 0;
  calleeMessages.length = 0;
  // do not await here, because we need to let the caller to send the reply message first
  // otherwise it will be a deadlock
  calleePage.evaluate(async () => {
    await globalThis.inboundCalls[0].reply("Hello world!");
  });

  // wait for audio to play to caller
  await waitFor({ interval: 1000 });
  // caller press '3': Yes
  await callerPage.evaluate(async () => {
    await globalThis.outboundCalls[0].sendDtmf("3");
  });

  // caller
  expect(callerMessages).toHaveLength(0);

  // callee
  await waitFor({ condition: () => calleeMessages.length >= 7 });
  const messages = calleeMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(7);
  expect(messages[0]).toMatch(/^outbound - MESSAGE sip:/);
  expect(messages[1]).toMatch(/^inbound - SIP\/2.0 100 Trying$/);
  expect(messages[2]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
  expect(messages[3]).toMatch(/^inbound - CANCEL sip:/);
  expect(messages[4]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  expect(messages[5]).toMatch(/^inbound - MESSAGE sip:/);
  expect(messages[6]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
  let rcMessage = await RcMessage.fromXml(calleeMessages[0].body);
  expect(rcMessage.headers.Cmd).toBe(
    callControlCommands.ClientReply.toString(),
  );
  rcMessage = await RcMessage.fromXml(calleeMessages[5].body);
  expect(rcMessage.headers.Cmd).toBe(
    callControlCommands.SessionClose.toString(),
  );
  expect(rcMessage.body.Sts).toBe("0");
  expect(rcMessage.body.Resp).toBe("1");

  await assertCallCount(callerPage, 1);
  await assertCallCount(calleePage, 0);
});
