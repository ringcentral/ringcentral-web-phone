import { expect } from "@playwright/test";
import callControlCommands from "../../src/rc-message/call-control-commands";
import RcMessage from "../../src/rc-message/rc-message";
import { assertCallCount, call, testTwoPages } from "../common";

testTwoPages(
  "decline inbound call",
  async ({ callerResource, calleeResource }) => {
    const { callerPage, calleePage, callerMessages, calleeMessages } =
      await call(callerResource, calleeResource);

    await calleePage.evaluate(async () => {
      await globalThis.inboundCalls[0].decline();
    });

    // caller
    expect(callerMessages).toHaveLength(0);
    await assertCallCount(callerPage, 1);

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

    const rejectMessage = calleeMessages.find((message) =>
      /^outbound - MESSAGE sip:/.test(message.shortString),
    );
    if (!rejectMessage) throw new Error("ClientReject MESSAGE not found");
    const rejectRcMessage = await RcMessage.fromXml(rejectMessage.body);
    expect(rejectRcMessage.headers.Cmd).toBe(
      callControlCommands.ClientReject.toString(),
    );
    const releaseMessage = calleeMessages.find((message) =>
      /^inbound - MESSAGE sip:/.test(message.shortString),
    );
    if (!releaseMessage) throw new Error("SessionClose MESSAGE not found");
    const closeRcMessage = await RcMessage.fromXml(releaseMessage.body);
    expect(closeRcMessage.headers.Cmd).toBe(
      callControlCommands.SessionClose.toString(),
    );
    await assertCallCount(calleePage, 0);
  },
);
