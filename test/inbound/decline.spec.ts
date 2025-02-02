import { expect } from "@playwright/test";

import { assertCallCount, call, testTwoPages } from "../common";
import RcMessage from "../../src/rc-message/rc-message";
import callControlCommands from "../../src/rc-message/call-control-commands";

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
    const messages = calleeMessages.map((m) => m.shortString);
    expect(messages).toHaveLength(7);
    expect(messages[0]).toMatch(/^outbound - MESSAGE sip:/);
    expect(messages[1]).toMatch(/^inbound - SIP\/2.0 100 Trying$/);
    expect(messages[2]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
    expect(messages[3]).toMatch(/^inbound - MESSAGE sip:/);
    expect(messages[4]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
    expect(messages[5]).toMatch(/^inbound - CANCEL sip:/);
    expect(messages[6]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
    let rcMessage = await RcMessage.fromXml(calleeMessages[0].body);
    expect(rcMessage.headers.Cmd).toBe(
      callControlCommands.ClientReject.toString(),
    );
    rcMessage = await RcMessage.fromXml(calleeMessages[3].body);
    expect(rcMessage.headers.Cmd).toBe(
      callControlCommands.SessionClose.toString(),
    );
    await assertCallCount(calleePage, 0);
  },
);
