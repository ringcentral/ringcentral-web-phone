import { expect, test } from "@playwright/test";
import SipMessage from "../src/sip-message/index.js";

test("getHeader resolves a header case-insensitively and returns undefined when absent", () => {
  // Deliberately mixed wire casing, as a peer might send it.
  const raw = [
    "INVITE sip:callee@example.com SIP/2.0",
    "call-id: abc123@example.com",
    "ALERT-INFO: <http://example.com/ring.wav>;delay=0",
    "p-RC-api-call-info: p1;n=1",
    "to: <sip:callee@example.com>;tag=9876",
    "from: <sip:caller@example.com>;tag=1234",
    "Content-Length: 0",
    "",
    "",
  ].join("\r\n");

  const message = SipMessage.fromString(raw);

  // Exact wire casing still works.
  expect(message.getHeader("call-id")).toBe("abc123@example.com");
  expect(message.getHeader("ALERT-INFO")).toBe(
    "<http://example.com/ring.wav>;delay=0",
  );

  // Any other casing resolves to the same header.
  expect(message.getHeader("Call-Id")).toBe("abc123@example.com");
  expect(message.getHeader("CALL-ID")).toBe("abc123@example.com");
  expect(message.getHeader("alert-info")).toBe(
    "<http://example.com/ring.wav>;delay=0",
  );
  expect(message.getHeader("To")).toBe("<sip:callee@example.com>;tag=9876");
  expect(message.getHeader("TO")).toBe("<sip:callee@example.com>;tag=9876");
  expect(message.getHeader("From")).toBe("<sip:caller@example.com>;tag=1234");
  expect(message.getHeader("p-rc-api-call-info")).toBe("p1;n=1");
  expect(message.getHeader("P-RC-API-CALL-INFO")).toBe("p1;n=1");

  // Absent headers resolve to undefined.
  expect(message.getHeader("CSeq")).toBeUndefined();
  expect(message.getHeader("Content-Type")).toBeUndefined();
  expect(message.getHeader("vIA")).toBeUndefined();
  expect(message.getHeader("not-a-header")).toBeUndefined();
});

test("fromString preserves exact wire casing in the public headers field", () => {
  const raw = [
    "MESSAGE sip:bob@example.com SIP/2.0",
    "call-id: wire-case-1@example.com",
    "To: <sip:bob@example.com>",
    "ALERT-INFO: <http://example.com/beep.wav>",
    "",
    "",
  ].join("\r\n");

  const message = SipMessage.fromString(raw);

  // The raw record keeps the exact keys as received (non-breaking).
  expect(Object.keys(message.headers)).toEqual(["call-id", "To", "ALERT-INFO"]);
  expect(message.headers["call-id"]).toBe("wire-case-1@example.com");
  expect(message.headers.To).toMatch(/^<sip:bob@example\.com>;tag=/);
  expect(message.headers["ALERT-INFO"]).toBe("<http://example.com/beep.wav>");
});
