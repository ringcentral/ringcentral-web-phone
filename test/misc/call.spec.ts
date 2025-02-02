import { expect } from "@playwright/test";

import {
  assertCallCount,
  call,
  calleeNumber,
  callerNumber,
  testTwoPages,
} from "../common";
import RcMessage from "../../src/rc-message/rc-message";
import callControlCommands from "../../src/rc-message/call-control-commands";

testTwoPages("call", async ({ callerResource, calleeResource }) => {
  const { callerPage, calleePage, callerMessages, calleeMessages } = await call(
    callerResource,
    calleeResource,
    true,
  );

  // caller
  let messages = callerMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(8);
  expect(messages).toEqual([
    `outbound - INVITE sip:${calleeNumber}@sip.ringcentral.com SIP/2.0`,
    "inbound - SIP/2.0 100 Trying",
    "inbound - SIP/2.0 407 Proxy Authentication Required",
    `outbound - INVITE sip:${calleeNumber}@sip.ringcentral.com SIP/2.0`,
    "inbound - SIP/2.0 100 Trying",
    "inbound - SIP/2.0 183 Session Progress",
    "inbound - SIP/2.0 200 OK",
    `outbound - ACK sip:${calleeNumber}@sip.ringcentral.com SIP/2.0`,
  ]);
  await assertCallCount(callerPage, 1);
  expect(new Set(callerMessages.map((m) => m.headers["Call-Id"])).size).toBe(1);

  // callee
  messages = calleeMessages.map((m) => m.shortString);
  expect(messages).toHaveLength(6);
  expect(messages[0]).toMatch(/^inbound - INVITE sip:/);
  expect(messages[1]).toMatch(/^outbound - SIP\/2.0 100 Trying$/);
  expect(messages[2]).toMatch(/^outbound - SIP\/2.0 180 Ringing$/);
  expect(messages[3]).toMatch(/^outbound - MESSAGE sip:/);
  expect(messages[4]).toMatch(/^inbound - SIP\/2.0 100 Trying$/);
  expect(messages[5]).toMatch(/^inbound - SIP\/2.0 200 OK$/);
  let rcMessage = await RcMessage.fromXml(calleeMessages[0].headers["P-rc"]);
  expect(rcMessage.body.Phn?.substring(1)).toBe(callerNumber); // rcMessage.body.Phn starts with '+'
  expect(rcMessage.body.ToPhn?.substring(1)).toBe(calleeNumber); // rcMessage.body.ToPhn starts with '+'
  rcMessage = await RcMessage.fromXml(calleeMessages[3].body);
  expect(rcMessage.headers.Cmd).toBe(
    callControlCommands.ClientReceiveConfirm.toString(),
  );
  await assertCallCount(calleePage, 1);
  expect(new Set(calleeMessages.map((m) => m.headers["Call-Id"])).size).toBe(1);
});
