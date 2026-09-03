import { expect, test } from "@playwright/test";
import InboundCallSession, {
  type ReplyOptions,
} from "../src/call-session/inbound.js";
import EventEmitter from "../src/event-emitter.js";
import WebPhone from "../src/index.js";
import RcMessage from "../src/rc-message/rc-message.js";
import InboundMessage from "../src/sip-message/inbound.js";
import type RequestMessage from "../src/sip-message/outbound/request.js";
import ResponseMessage from "../src/sip-message/outbound/response.js";
import type { SipClient, SipInfo } from "../src/types.js";

const sipInfo: SipInfo = {
  authorizationId: "id",
  domain: "example.com",
  outboundProxy: "example.com",
  outboundProxyBackup: "example.com",
  username: "100",
  password: "password",
  stunServers: [],
};

const sessionCloseMessage = (callId: string, sid: string, status: string) =>
  new InboundMessage(
    "MESSAGE sip:100@example.com SIP/2.0",
    { CSeq: "2 MESSAGE", "Call-Id": callId },
    new RcMessage({ SID: sid, Cmd: "9" }, { Sts: status }).toXml(),
  );

class FakeSipClient extends EventEmitter implements SipClient {
  public requests: RequestMessage[] = [];

  public async start() {}
  public async request(message: RequestMessage) {
    this.requests.push(message);
    setTimeout(() => {
      this.emit(
        "inboundMessage",
        sessionCloseMessage("call-id", "other-sid", "wrong"),
      );
      this.emit(
        "inboundMessage",
        sessionCloseMessage("other-call", "sid", "complete"),
      );
    });
    return new InboundMessage("SIP/2.0 200 OK", { CSeq: "1 MESSAGE" });
  }
  public async reply(_message: ResponseMessage) {}
  public async dispose() {}
}

const createSession = () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const invite = new InboundMessage("INVITE sip:100@example.com SIP/2.0", {
    Via: "SIP/2.0/WSS example.com;branch=branch",
    CSeq: "1 INVITE",
    From: "<sip:101@example.com>;tag=remote",
    To: "<sip:100@example.com>;tag=local",
    "Call-Id": "call-id",
    "P-rc": new RcMessage(
      { SID: "sid", Req: "req", From: "101", To: "100" },
      {},
    ).toXml(),
  });
  const session = new InboundCallSession(webPhone, invite);
  webPhone.callSessions.push(session);
  return { session, sipClient };
};

const sendReply = async (arg: string | ReplyOptions) => {
  const { session, sipClient } = createSession();
  const response = await session.reply(arg);
  return {
    body: RcMessage.fromXml(sipClient.requests[0].body).body,
    response,
  };
};

test("reply translates developer options to RC wire fields", async () => {
  const cases: Array<[string | ReplyOptions, Record<string, string>]> = [
    ["Custom reply", { Cln: "id", RepTp: "0", Bdy: "Custom reply" }],
    [
      {
        type: "callYouBack",
        direction: "toCaller",
        delay: 4,
        unit: "days",
      },
      { Cln: "id", RepTp: "1", Dir: "0", Vl: "4", Units: "2" },
    ],
    [{ type: "onMyWay" }, { Cln: "id", RepTp: "2" }],
    [{ type: "onOtherLine" }, { Cln: "id", RepTp: "3" }],
    [
      { type: "callYouBackLater", direction: "fromCaller" },
      { Cln: "id", RepTp: "4", Dir: "1" },
    ],
    [{ type: "inAMeeting" }, { Cln: "id", RepTp: "5" }],
    [{ type: "onOtherLineNoCall" }, { Cln: "id", RepTp: "6" }],
  ];

  for (const [options, expectedBody] of cases) {
    const { body, response } = await sendReply(options);
    expect(body).toEqual(expectedBody);
    expect(response.headers.Cmd).toBe("9");
    expect(response.body.Sts).toBe("complete");
  }
});

test("reply rejects invalid options before sending", async () => {
  for (const options of [
    { type: "unknown" },
    { type: "callYouBack" },
    {
      type: "callYouBack",
      direction: "sideways",
      delay: 4,
      unit: "days",
    },
  ]) {
    const { session, sipClient } = createSession();
    await expect(session.reply(options as never)).rejects.toThrow(
      "Invalid reply options",
    );
    expect(sipClient.requests).toHaveLength(0);
  }
});

test("decline observes a CANCEL reply sent before the reject response", async () => {
  const { session, sipClient } = createSession();
  sipClient.request = async (message) => {
    sipClient.requests.push(message);
    const cancel = new InboundMessage("CANCEL sip:100@example.com SIP/2.0", {
      CSeq: "2 CANCEL",
      "Call-Id": "call-id",
    });
    sipClient.emit(
      "outboundMessage",
      new ResponseMessage(cancel, { responseCode: 200 }),
    );
    return new InboundMessage("SIP/2.0 200 OK", {
      CSeq: message.headers.CSeq,
    });
  };

  const result = await Promise.race([
    session.decline().then(() => "resolved"),
    new Promise((resolve) => setTimeout(() => resolve("timeout"), 50)),
  ]);

  expect(result).toBe("resolved");
});

test("reply observes a SessionClose sent before the reply response", async () => {
  const { session, sipClient } = createSession();
  sipClient.request = async (message) => {
    sipClient.requests.push(message);
    sipClient.emit(
      "inboundMessage",
      sessionCloseMessage("other-call", "other-sid", "complete"),
    );
    sipClient.emit(
      "inboundMessage",
      sessionCloseMessage("call-id", "sid", "complete"),
    );
    return new InboundMessage("SIP/2.0 200 OK", {
      CSeq: message.headers.CSeq,
    });
  };

  let replyResult: RcMessage | undefined;
  const result = await Promise.race([
    session.reply("Custom reply").then((rcMessage) => {
      replyResult = rcMessage;
      return "resolved";
    }),
    new Promise((resolve) => setTimeout(() => resolve("timeout"), 50)),
  ]);

  expect(result).toBe("resolved");
  expect(replyResult?.headers.Cmd).toBe("9");
  expect(replyResult?.body.Sts).toBe("complete");
});

const checkReplyTypes = (session: InboundCallSession) => {
  session.reply("Custom reply");
  session.reply({
    type: "callYouBack",
    direction: "toCaller",
    delay: 4,
    unit: "days",
  });
  session.reply({ type: "callYouBackLater", direction: "fromCaller" });
  session.reply({ type: "onMyWay" });

  // @ts-expect-error callYouBack requires direction, delay, and unit
  session.reply({ type: "callYouBack" });
  // @ts-expect-error callYouBackLater requires direction
  session.reply({ type: "callYouBackLater" });
  session.reply({
    type: "callYouBack",
    direction: "toCaller",
    delay: 4,
    // @ts-expect-error unit must be a supported duration
    unit: "weeks",
  });
  // @ts-expect-error onMyWay accepts no callback timing
  session.reply({ type: "onMyWay", delay: 4, unit: "days" });
};

void checkReplyTypes;
