import { expect } from "@playwright/test";

import { anotherNumber, assertCallCount, call, testTwoPages } from "../common";
import RcMessage from "../../src/rc-message/rc-message";
import callControlCommands from "../../src/rc-message/call-control-commands";

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
    const messages = calleeMessages.map((m) => m.shortString);
    expect(messages.length >= 5).toBe(true);
    expect(messages[0]).toMatch(/^outbound - MESSAGE sip:/);
    expect(messages[1]).toMatch(/^inbound - SIP\/2.0 100 Trying$/);
    expect(messages[2]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
    // expect(messages[3]).toMatch(/^inbound - MESSAGE sip:/);
    // expect(messages[4]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
    // expect(messages[3]).toMatch(/^inbound - CANCEL sip:/);
    // expect(messages[4]).toMatch(/^outbound - SIP\/2.0 200 OK$/);
    const rcMessage = await RcMessage.fromXml(calleeMessages[0].body);
    expect(rcMessage.headers.Cmd).toBe(
      callControlCommands.ClientForward.toString(),
    );
    const hasCancel = messages.slice(3).some((msg) => {
      if (msg.match(/^inbound - CANCEL sip:/)) {
        return true;
      }
      return false;
    });
    expect(hasCancel).toBe(true);
    // rcMessage = await RcMessage.fromXml(calleeMessages[3].body);
    // expect(rcMessage.headers.Cmd).toBe(
    //   callControlCommands.SessionClose.toString(),
    // );

    await assertCallCount(callerPage, 1);
    await assertCallCount(calleePage, 0);
  },
);
