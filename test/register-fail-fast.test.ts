import assert from "node:assert/strict";
import test from "node:test";

import { DefaultSipClient } from "../src/sip-client.js";
import InboundMessage from "../src/sip-message/inbound.js";
import type RequestMessage from "../src/sip-message/outbound/request.js";
import type { SipInfo } from "../src/types.js";

const sipInfo: SipInfo = {
  authorizationId: "101",
  domain: "example.com",
  outboundProxy: "sip.example.com",
  outboundProxyBackup: "sip-backup.example.com",
  password: "secret",
  stunServers: [],
  username: "101",
};

class TestSipClient extends DefaultSipClient {
  public requests: RequestMessage[] = [];

  public constructor(private responses: InboundMessage[]) {
    super({ sipInfo });
    this.wsc = { close() {} } as WebSocket;
  }

  public override request(message: RequestMessage) {
    this.requests.push(message);
    const response = this.responses.shift();
    if (!response) {
      throw new Error("Missing test response");
    }
    return Promise.resolve(response);
  }
}

const response = (subject: string, headers: Record<string, string> = {}) =>
  new InboundMessage(subject, headers);

test("throws when first registration response has no auth challenge", async () => {
  const client = new TestSipClient([
    response("SIP/2.0 488 Not Acceptable Here"),
  ]);

  await assert.rejects(
    () => client.register(0),
    /Registration failed: SIP\/2\.0 488 Not Acceptable Here/,
  );
  assert.equal(client.requests.length, 1);
});

for (const headerName of ["www-authenticate", "wWw-AuThEnTiCaTe"]) {
  test(`accepts ${headerName} registration auth header`, async () => {
    const client = new TestSipClient([
      response("SIP/2.0 401 Unauthorized", {
        [headerName]: 'Digest realm="example.com", nonce="abc123"',
      }),
      response("SIP/2.0 200 OK"),
    ]);

    await client.register(0);

    assert.equal(client.requests.length, 2);
    assert.match(client.requests[1].headers.Authorization, /nonce="abc123"/);
  });
}

test("throws clear error when registration auth challenge has no nonce", async () => {
  const client = new TestSipClient([
    response("SIP/2.0 401 Unauthorized", {
      "Www-Authenticate": 'Digest realm="example.com"',
    }),
  ]);

  await assert.rejects(
    () => client.register(0),
    /Registration failed: SIP\/2\.0 401 Unauthorized \(missing nonce\)/,
  );
  assert.equal(client.requests.length, 1);
});

test("throws when authenticated registration retry is not successful", async () => {
  const client = new TestSipClient([
    response("SIP/2.0 401 Unauthorized", {
      "Www-Authenticate": 'Digest realm="example.com", nonce="abc123"',
    }),
    response("SIP/2.0 403 Forbidden"),
  ]);

  await assert.rejects(
    () => client.register(0),
    /Registration failed: SIP\/2\.0 403 Forbidden/,
  );
  assert.equal(client.requests.length, 2);
});

test("throws clear error when successful registration has no Contact expires", async () => {
  for (const headers of [{}, { Contact: "<sip:101@example.com>" }]) {
    const client = new TestSipClient([response("SIP/2.0 200 OK", headers)]);

    await assert.rejects(
      () => client.register(60),
      /Registration failed: SIP\/2\.0 200 OK \(missing Contact expires\)/,
    );
  }
});

test("unregister does not require Contact expires after final success", async () => {
  const client = new TestSipClient([response("SIP/2.0 200 OK")]);

  await assert.doesNotReject(() => client.register(0));
  assert.equal(client.requests.length, 1);
});
