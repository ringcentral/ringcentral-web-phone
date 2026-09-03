import { expect } from "@playwright/test";
import callControlCommands from "../../src/rc-message/call-control-commands";
import RcMessage from "../../src/rc-message/rc-message";
import { anotherNumber, assertCallCount, call, testTwoPages } from "../common";

testTwoPages(
  "forward inbound call",
  async ({ callerResource, calleeResource }) => {
    const { callerPage, calleePage, callerMessages, calleeMessages } =
      await call(callerResource, calleeResource);

    await calleePage.evaluate(async (anotherNumber) => {
      await globalThis.inboundCalls[0].forward(anotherNumber);
    }, anotherNumber);

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

    const forwardMessage = calleeMessages.find((message) =>
      /^outbound - MESSAGE sip:/.test(message.shortString),
    );
    if (!forwardMessage) throw new Error("ClientForward MESSAGE not found");
    const forwardRcMessage = await RcMessage.fromXml(forwardMessage.body);
    expect(forwardRcMessage.headers.Cmd).toBe(
      callControlCommands.ClientForward.toString(),
    );
    const closeMessage = calleeMessages.find((message) =>
      /^inbound - MESSAGE sip:/.test(message.shortString),
    );
    if (!closeMessage) throw new Error("SessionClose MESSAGE not found");
    const closeRcMessage = await RcMessage.fromXml(closeMessage.body);
    expect(closeRcMessage.headers.Cmd).toBe(
      callControlCommands.SessionClose.toString(),
    );

    await assertCallCount(callerPage, 1);
    await assertCallCount(calleePage, 0);
  },
);
