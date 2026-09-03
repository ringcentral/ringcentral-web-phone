import { expect } from "@playwright/test";
import waitFor from "wait-for-async";
import callControlCommands from "../../../src/rc-message/call-control-commands";
import RcMessage from "../../../src/rc-message/rc-message";
import { assertCallCount, call, testTwoPages } from "../../common";

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
  expect(
    messages.filter((message) => /^outbound - MESSAGE sip:/.test(message)),
  ).toHaveLength(1);
  expect(
    messages.filter((message) => message === "inbound - SIP/2.0 100 Trying"),
  ).toHaveLength(1);
  expect(
    messages.filter((message) => message === "inbound - SIP/2.0 200 OK"),
  ).toHaveLength(1);
  expect(
    messages.filter((message) => /^inbound - CANCEL sip:/.test(message)),
  ).toHaveLength(1);
  expect(
    messages.filter((message) => /^inbound - MESSAGE sip:/.test(message)),
  ).toHaveLength(1);
  expect(
    messages.filter((message) => message === "outbound - SIP/2.0 200 OK"),
  ).toHaveLength(2);

  const replyMessage = calleeMessages.find((message) =>
    /^outbound - MESSAGE sip:/.test(message.shortString),
  );
  if (!replyMessage) throw new Error("ClientReply MESSAGE not found");
  let rcMessage = await RcMessage.fromXml(replyMessage.body);
  expect(rcMessage.headers.Cmd).toBe(
    callControlCommands.ClientReply.toString(),
  );
  const closeMessage = calleeMessages.find((message) =>
    /^inbound - MESSAGE sip:/.test(message.shortString),
  );
  if (!closeMessage) throw new Error("SessionClose MESSAGE not found");
  rcMessage = await RcMessage.fromXml(closeMessage.body);
  expect(rcMessage.headers.Cmd).toBe(
    callControlCommands.SessionClose.toString(),
  );
  expect(rcMessage.body.Sts).toBe("0");
  expect(rcMessage.body.Resp).toBe("1");

  await assertCallCount(callerPage, 1);
  await assertCallCount(calleePage, 0);
});
