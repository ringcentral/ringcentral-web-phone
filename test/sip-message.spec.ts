import { expect, test } from "@playwright/test";
import InboundMessage from "../src/sip-message/inbound.js";
import SipMessage from "../src/sip-message/index.js";
import ResponseMessage from "../src/sip-message/outbound/response.js";

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

test("provisional reply echoes each echoed header under the exact wire casing the peer sent", () => {
  // Deliberately mixed wire casing for the echoed Via/From/To/Call-Id/CSeq.
  const raw = [
    "INVITE sip:callee@example.com SIP/2.0",
    "vIA: SIP/2.0/UDP 192.0.2.1:5060;branch=z9hG4bK-123",
    "fRom: <sip:caller@example.com>;tag=abcd1234",
    "to: <sip:callee@example.com>",
    "call-iD: abc123@example.com",
    "cSeQ: 1 INVITE",
    "Content-Length: 0",
    "",
    "",
  ].join("\r\n");

  const inbound = InboundMessage.fromString(raw);
  const reply = new ResponseMessage(inbound, { responseCode: 180 });

  // Every echoed header keeps the peer's exact casing (key + value verbatim).
  expect(reply.headers["vIA"]).toBe(
    "SIP/2.0/UDP 192.0.2.1:5060;branch=z9hG4bK-123",
  );
  expect(reply.headers["fRom"]).toBe("<sip:caller@example.com>;tag=abcd1234");
  expect(reply.headers["to"]).toBe("<sip:callee@example.com>");
  expect(reply.headers["call-iD"]).toBe("abc123@example.com");
  expect(reply.headers["cSeQ"]).toBe("1 INVITE");

  // The canonical-cased keys are NOT introduced.
  expect(reply.headers["Via"]).toBeUndefined();
  expect(reply.headers["From"]).toBeUndefined();
  expect(reply.headers["To"]).toBeUndefined();
  expect(reply.headers["Call-Id"]).toBeUndefined();
  expect(reply.headers["CSeq"]).toBeUndefined();
});

test("provisional reply still omits headers that are absent from the inbound message", () => {
  // Inbound message has no Via/From/CSeq at all; To/Call-Id present.
  const raw = [
    "INVITE sip:callee@example.com SIP/2.0",
    "to: <sip:callee@example.com>",
    "call-id: abc123@example.com",
    "",
    "",
  ].join("\r\n");

  const inbound = InboundMessage.fromString(raw);
  const reply = new ResponseMessage(inbound, { responseCode: 180 });

  expect(Object.keys(reply.headers)).not.toContain("Via");
  expect(Object.keys(reply.headers)).not.toContain("From");
  expect(Object.keys(reply.headers)).not.toContain("CSeq");
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
