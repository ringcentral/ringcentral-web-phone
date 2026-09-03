import { expect } from "@playwright/test";
import waitFor from "wait-for-async";
import callControlCommands from "../../../src/rc-message/call-control-commands";
import RcMessage from "../../../src/rc-message/rc-message";
import {
  anotherNumber,
  assertCallCount,
  call,
  testTwoPages,
} from "../../common";

testTwoPages(
  "reply with urgent",
  async ({ callerResource, calleeResource }) => {
    const { callerPage, calleePage, callerMessages, calleeMessages } =
      await call(callerResource, calleeResource);

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

    await waitFor({ interval: 3000 });

    // caller press '5': Urgent
    await callerPage.evaluate(() => {
      globalThis.outboundCalls[0].sendDtmf("5");
    });

    await waitFor({ interval: 3000 });

    // caller specify callback number
    await callerPage.evaluate((anotherNumber) => {
      globalThis.outboundCalls[0].sendDtmf(`${anotherNumber}#`);
    }, anotherNumber);

    await waitFor({ interval: 3000 });

    // caller press '1' to confirm the callback number
    await callerPage.evaluate(() => {
      globalThis.outboundCalls[0].sendDtmf("1");
    });

    // caller
    expect(callerMessages).toHaveLength(0);

    // callee
    await expect.poll(() => calleeMessages).toHaveLength(7);
    const messages = calleeMessages.map((m) => m.shortString);
    expect(messages).toHaveLength(7);
    expect(
      messages.filter((m) => /^outbound - MESSAGE sip:/.test(m)),
    ).toHaveLength(1);
    expect(
      messages.filter((m) => m === "inbound - SIP/2.0 100 Trying"),
    ).toHaveLength(1);
    expect(
      messages.filter((m) => m === "inbound - SIP/2.0 200 OK"),
    ).toHaveLength(1);
    expect(
      messages.filter((m) => /^inbound - CANCEL sip:/.test(m)),
    ).toHaveLength(1);
    expect(
      messages.filter((m) => /^inbound - MESSAGE sip:/.test(m)),
    ).toHaveLength(1);
    expect(
      messages.filter((m) => m === "outbound - SIP/2.0 200 OK"),
    ).toHaveLength(2);

    const replyMessage = calleeMessages.find((message) =>
      /^outbound - MESSAGE sip:/.test(message.shortString),
    );
    if (!replyMessage) throw new Error("ClientReply MESSAGE not found");
    const replyRcMessage = await RcMessage.fromXml(replyMessage.body);
    expect(replyRcMessage.headers.Cmd).toBe(
      callControlCommands.ClientReply.toString(),
    );
    const closeMessage = calleeMessages.find((message) =>
      /^inbound - MESSAGE sip:/.test(message.shortString),
    );
    if (!closeMessage) throw new Error("SessionClose MESSAGE not found");
    const closeRcMessage = await RcMessage.fromXml(closeMessage.body);
    expect(closeRcMessage.headers.Cmd).toBe(
      callControlCommands.SessionClose.toString(),
    );
    expect(closeRcMessage.body.Sts).toBe("0");
    expect(closeRcMessage.body.Resp).toBe("3");
    expect(closeRcMessage.body.ExtNfo).toBe(anotherNumber);

    await assertCallCount(callerPage, 1);
    await assertCallCount(calleePage, 0);
  },
);
