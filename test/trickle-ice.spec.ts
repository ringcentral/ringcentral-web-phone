import { expect, test } from "@playwright/test";

import WebPhone from "../src";
import InboundCallSession from "../src/call-session/inbound";
import OutboundCallSession from "../src/call-session/outbound";
import EventEmitter from "../src/event-emitter";
import { DefaultSipClient } from "../src/sip-client";
import InboundMessage from "../src/sip-message/inbound";
import type RequestMessage from "../src/sip-message/outbound/request";
import type ResponseMessage from "../src/sip-message/outbound/response";
import type { SipClient, SipInfo } from "../src/types";

const LOCAL_SDP = `${[
  "v=0",
  "o=- 1 1 IN IP4 127.0.0.1",
  "s=-",
  "t=0 0",
  "a=ice-ufrag:local-ufrag",
  "a=ice-pwd:local-password",
  "m=audio 9 UDP/TLS/RTP/SAVPF 111",
  "c=IN IP4 0.0.0.0",
  "a=mid:audio",
  "a=sendrecv",
  "a=candidate:present 1 udp 1 192.0.2.1 5000 typ host",
].join("\r\n")}\r\n`;

const REMOTE_SDP = LOCAL_SDP.replaceAll("local-", "remote-");

const sipInfo: SipInfo = {
  authorizationId: "id",
  domain: "example.com",
  outboundProxy: "example.com",
  outboundProxyBackup: "example.com",
  username: "100",
  password: "password",
  stunServers: [],
};

class FakeSipClient extends EventEmitter implements SipClient {
  public requests: RequestMessage[] = [];
  public replies: ResponseMessage[] = [];
  public deferInfo = false;
  public infoFailure?: "reject" | "non-2xx";
  public deferInviteAnswer = false;
  public pendingInvite?: RequestMessage;
  public pendingInfoReplies: Array<(message: InboundMessage) => void> = [];

  public async start() {}
  public async request(message: RequestMessage) {
    this.requests.push(message);
    if (message.subject.startsWith("INFO ")) {
      if (this.infoFailure === "reject") throw new Error("INFO failed");
      if (this.infoFailure === "non-2xx") {
        return new InboundMessage("SIP/2.0 488 Not Acceptable Here");
      }
      if (this.deferInfo) {
        return await new Promise<InboundMessage>((resolve) => {
          this.pendingInfoReplies.push(resolve);
        });
      }
    }
    const inviteCount = this.requests.filter((request) =>
      request.subject.startsWith("INVITE "),
    ).length;
    if (
      message.subject.startsWith("INVITE ") &&
      inviteCount === 1 &&
      !message.headers["Proxy-Authorization"]
    ) {
      return new InboundMessage("SIP/2.0 407 Proxy Authentication Required", {
        "Proxy-Authenticate": 'Digest, nonce="nonce"',
      });
    }
    if (message.subject.startsWith("INVITE ") && this.deferInviteAnswer) {
      this.pendingInvite = message;
      return new InboundMessage("SIP/2.0 100 Trying", {
        Via: message.headers.Via,
        CSeq: message.headers.CSeq,
        From: message.headers.From,
        To: `${message.headers.To};tag=remote`,
        "Call-Id": message.headers["Call-Id"],
      });
    }
    return new InboundMessage(
      "SIP/2.0 200 OK",
      {
        Via: message.headers.Via,
        CSeq: message.headers.CSeq,
        From: message.headers.From,
        To: `${message.headers.To};tag=remote`,
        "Call-Id": message.headers["Call-Id"],
      },
      REMOTE_SDP,
    );
  }
  public async reply(message: ResponseMessage) {
    this.replies.push(message);
  }
  public async dispose() {}

  public replyToNextInfo(subject = "SIP/2.0 200 OK") {
    this.pendingInfoReplies.shift()?.(new InboundMessage(subject));
  }

  public answerInvite() {
    if (!this.pendingInvite) throw new Error("No pending INVITE");
    this.emit(
      "inboundMessage",
      new InboundMessage(
        "SIP/2.0 200 OK",
        {
          Via: this.pendingInvite.headers.Via,
          CSeq: this.pendingInvite.headers.CSeq,
          From: this.pendingInvite.headers.From,
          To: `${this.pendingInvite.headers.To};tag=remote`,
          "Call-Id": this.pendingInvite.headers["Call-Id"],
        },
        REMOTE_SDP,
      ),
    );
  }
}

class FakePeerConnection extends EventTarget {
  public iceGatheringState: RTCIceGatheringState = "gathering";
  public localDescription: RTCSessionDescription | null = null;
  public remoteDescription: RTCSessionDescription | null = null;
  public candidatesOnSetLocalDescription: Array<RTCIceCandidate | null> = [];
  public remoteCandidates: Array<RTCIceCandidateInit | null> = [];
  public deferRemoteCandidates = false;
  public failedRemoteCandidate?: string;
  public pendingRemoteCandidates: Array<() => void> = [];

  public async createOffer() {
    return { type: "offer", sdp: LOCAL_SDP } as RTCSessionDescriptionInit;
  }
  public async createAnswer() {
    return { type: "answer", sdp: LOCAL_SDP } as RTCSessionDescriptionInit;
  }
  public async setLocalDescription(description: RTCSessionDescriptionInit) {
    this.localDescription = description as RTCSessionDescription;
    for (const iceCandidate of this.candidatesOnSetLocalDescription) {
      this.emitCandidate(iceCandidate);
    }
    this.candidatesOnSetLocalDescription = [];
  }
  public async setRemoteDescription(description: RTCSessionDescriptionInit) {
    this.remoteDescription = description as RTCSessionDescription;
  }
  public async addIceCandidate(candidate: RTCIceCandidateInit | null) {
    this.remoteCandidates.push(candidate);
    if (candidate?.candidate === this.failedRemoteCandidate) {
      throw new Error("Candidate failed");
    }
    if (this.deferRemoteCandidates) {
      await new Promise<void>((resolve) => {
        this.pendingRemoteCandidates.push(resolve);
      });
    }
  }
  public emitCandidate(candidate: RTCIceCandidate | null) {
    this.dispatchEvent(Object.assign(new Event("icecandidate"), { candidate }));
  }
  public close() {}
}

class SdkManagedInboundCallSession extends InboundCallSession {
  public override async init() {}
}

const inboundInvite = () =>
  new InboundMessage(
    "INVITE sip:100@example.com SIP/2.0",
    {
      Via: "SIP/2.0/WSS example.com;branch=branch",
      CSeq: "1 INVITE",
      From: "<sip:101@example.com>;tag=remote",
      To: "<sip:100@example.com>;tag=local",
      "Call-Id": "inbound-call",
    },
    "remote offer",
  );

const candidate = (value: string) =>
  ({
    candidate: `candidate:${value}`,
    sdpMid: "audio",
    sdpMLineIndex: 0,
  }) as RTCIceCandidate;

const remoteCandidateInfo = (
  callId: string,
  value: string | null,
  {
    iceUfrag = "remote-ufrag",
    icePwd = "remote-password",
    media = "audio 9 UDP/TLS/RTP/SAVPF 111",
    mid = "audio",
  }: {
    iceUfrag?: string;
    icePwd?: string;
    media?: string;
    mid?: string;
  } = {},
) =>
  new InboundMessage(
    "INFO sip:100@example.com SIP/2.0",
    {
      "Call-Id": callId,
      "Info-Package": "trickle-ice",
      "Content-Type": "application/trickle-ice-sdpfrag",
    },
    [
      `a=ice-ufrag:${iceUfrag}`,
      `a=ice-pwd:${icePwd}`,
      `m=${media}`,
      `a=mid:${mid}`,
      value === null ? "a=end-of-candidates" : `a=candidate:${value}`,
    ].join("\r\n"),
  );

test("routes and queues remote candidates until the matching description is ready", async () => {
  const sipClient = new FakeSipClient();
  sipClient.deferInviteAnswer = true;
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new OutboundCallSession(webPhone, "101");
  const peerConnection = new FakePeerConnection();
  session.rtcPeerConnection = peerConnection as unknown as RTCPeerConnection;
  webPhone.callSessions.push(session);

  const call = session.call();
  await expect.poll(() => session.state).toBe("ringing");
  sipClient.emit("inboundMessage", remoteCandidateInfo("other-call", "other"));
  sipClient.emit(
    "inboundMessage",
    remoteCandidateInfo(session.callId, "first"),
  );
  sipClient.emit(
    "inboundMessage",
    remoteCandidateInfo(session.callId, "second"),
  );
  sipClient.emit("inboundMessage", remoteCandidateInfo(session.callId, null));

  expect(peerConnection.remoteCandidates).toEqual([]);
  sipClient.answerInvite();
  await call;
  await expect.poll(() => peerConnection.remoteCandidates).toHaveLength(3);
  expect(peerConnection.remoteCandidates).toEqual([
    {
      candidate: "candidate:first",
      sdpMid: "audio",
      usernameFragment: "remote-ufrag",
    },
    {
      candidate: "candidate:second",
      sdpMid: "audio",
      usernameFragment: "remote-ufrag",
    },
    null,
  ]);
});

test("retains inbound remote candidates received before answer", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new SdkManagedInboundCallSession(
    webPhone,
    new InboundMessage(
      "INVITE sip:100@example.com SIP/2.0",
      inboundInvite().headers,
      REMOTE_SDP,
    ),
  );
  const peerConnection = new FakePeerConnection();
  session.rtcPeerConnection = peerConnection as unknown as RTCPeerConnection;
  webPhone.callSessions.push(session);

  sipClient.emit(
    "inboundMessage",
    remoteCandidateInfo(session.callId, "before-answer"),
  );
  expect(peerConnection.remoteCandidates).toEqual([]);

  await session.answer();
  await expect
    .poll(() => peerConnection.remoteCandidates)
    .toEqual([
      {
        candidate: "candidate:before-answer",
        sdpMid: "audio",
        usernameFragment: "remote-ufrag",
      },
    ]);
});

test("ignores unusable fragments and continues after candidate failure", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new OutboundCallSession(webPhone, "101");
  const peerConnection = new FakePeerConnection();
  peerConnection.failedRemoteCandidate = "candidate:rejected";
  session.rtcPeerConnection = peerConnection as unknown as RTCPeerConnection;
  webPhone.callSessions.push(session);
  await session.call();

  const trickleInfo = (body: string) =>
    new InboundMessage(
      "INFO sip:100@example.com SIP/2.0",
      {
        "Call-Id": session.callId,
        "Info-Package": "trickle-ice",
        "Content-Type": "application/trickle-ice-sdpfrag",
      },
      body,
    );
  sipClient.emit("inboundMessage", trickleInfo("not an SDP fragment"));
  sipClient.emit(
    "inboundMessage",
    trickleInfo(
      "a=ice-pwd:remote-password\r\na=candidate:no-username-fragment",
    ),
  );
  sipClient.emit(
    "inboundMessage",
    trickleInfo(
      "a=ice-ufrag:remote-ufrag\r\na=ice-pwd:remote-password\r\na=candidate:no-mid",
    ),
  );
  sipClient.emit(
    "inboundMessage",
    remoteCandidateInfo(session.callId, "stale-generation", {
      iceUfrag: "stale-ufrag",
    }),
  );
  sipClient.emit(
    "inboundMessage",
    remoteCandidateInfo(session.callId, "rejected"),
  );
  sipClient.emit(
    "inboundMessage",
    remoteCandidateInfo(session.callId, "accepted"),
  );
  sipClient.emit(
    "inboundMessage",
    remoteCandidateInfo(session.callId, null, { iceUfrag: "stale-ufrag" }),
  );
  sipClient.emit("inboundMessage", remoteCandidateInfo(session.callId, null));

  await expect.poll(() => peerConnection.remoteCandidates).toHaveLength(4);
  expect(peerConnection.remoteCandidates).toEqual([
    {
      candidate: "candidate:stale-generation",
      sdpMid: "audio",
      usernameFragment: "stale-ufrag",
    },
    {
      candidate: "candidate:rejected",
      sdpMid: "audio",
      usernameFragment: "remote-ufrag",
    },
    {
      candidate: "candidate:accepted",
      sdpMid: "audio",
      usernameFragment: "remote-ufrag",
    },
    null,
  ]);
  expect(session.state).toBe("answered");
});

test("delivers multiple candidates from one fragment in wire order before its end marker", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new OutboundCallSession(webPhone, "101");
  const peerConnection = new FakePeerConnection();
  session.rtcPeerConnection = peerConnection as unknown as RTCPeerConnection;
  webPhone.callSessions.push(session);
  await session.call();

  sipClient.emit(
    "inboundMessage",
    new InboundMessage(
      "INFO sip:100@example.com SIP/2.0",
      {
        "Call-Id": session.callId,
        "Info-Package": "trickle-ice",
        "Content-Type": "application/trickle-ice-sdpfrag",
      },
      [
        "a=ice-ufrag:remote-ufrag",
        "a=ice-pwd:remote-password",
        "m=audio 9 UDP/TLS/RTP/SAVPF 111",
        "a=mid:audio",
        "a=candidate:first",
        "a=candidate:second",
        "a=end-of-candidates",
      ].join("\r\n"),
    ),
  );

  await expect
    .poll(() => peerConnection.remoteCandidates)
    .toEqual([
      {
        candidate: "candidate:first",
        sdpMid: "audio",
        usernameFragment: "remote-ufrag",
      },
      {
        candidate: "candidate:second",
        sdpMid: "audio",
        usernameFragment: "remote-ufrag",
      },
      null,
    ]);
});

test("drops queued remote candidates when their generation is superseded", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new OutboundCallSession(webPhone, "101");
  const peerConnection = new FakePeerConnection();
  session.rtcPeerConnection = peerConnection as unknown as RTCPeerConnection;
  webPhone.callSessions.push(session);
  await session.call();
  peerConnection.deferRemoteCandidates = true;

  sipClient.emit(
    "inboundMessage",
    remoteCandidateInfo(session.callId, "pending-old"),
  );
  sipClient.emit(
    "inboundMessage",
    remoteCandidateInfo(session.callId, "queued-old"),
  );
  await expect
    .poll(() => peerConnection.pendingRemoteCandidates)
    .toHaveLength(1);

  await session.reInvite();
  peerConnection.pendingRemoteCandidates.shift()?.();
  sipClient.emit(
    "inboundMessage",
    remoteCandidateInfo(session.callId, "new-generation"),
  );
  await expect
    .poll(() => peerConnection.pendingRemoteCandidates)
    .toHaveLength(1);
  peerConnection.pendingRemoteCandidates.shift()?.();

  await expect.poll(() => peerConnection.remoteCandidates).toHaveLength(2);
  expect(
    peerConnection.remoteCandidates.map((item) => item?.candidate),
  ).toEqual(["candidate:pending-old", "candidate:new-generation"]);
});

test("drops queued remote candidates when the Call Session is disposed", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new OutboundCallSession(webPhone, "101");
  const peerConnection = new FakePeerConnection();
  session.rtcPeerConnection = peerConnection as unknown as RTCPeerConnection;
  webPhone.callSessions.push(session);
  await session.call();
  peerConnection.deferRemoteCandidates = true;

  sipClient.emit(
    "inboundMessage",
    remoteCandidateInfo(session.callId, "pending"),
  );
  sipClient.emit(
    "inboundMessage",
    remoteCandidateInfo(session.callId, "queued"),
  );
  await expect
    .poll(() => peerConnection.pendingRemoteCandidates)
    .toHaveLength(1);
  session.dispose();
  peerConnection.pendingRemoteCandidates.shift()?.();
  await new Promise((resolve) => setTimeout(resolve));

  expect(
    peerConnection.remoteCandidates.map((item) => item?.candidate),
  ).toEqual(["candidate:pending"]);
});

test("the default SIP client replies before remote candidate application settles", async () => {
  class FakeWebSocket extends EventTarget {
    public static instance?: FakeWebSocket;
    public sent: string[] = [];
    public onSend?: () => void;

    public constructor() {
      super();
      FakeWebSocket.instance = this;
    }
    public send(message: string) {
      this.onSend?.();
      this.sent.push(message);
    }
    public close() {}
  }

  const OriginalWebSocket = globalThis.WebSocket;
  globalThis.WebSocket = FakeWebSocket as unknown as typeof WebSocket;
  try {
    const sipClient = new DefaultSipClient({ sipInfo });
    const webPhone = new WebPhone({ sipInfo, sipClient });
    const connecting = sipClient.connect();
    const socket = FakeWebSocket.instance;
    if (!socket) throw new Error("WebSocket was not created");
    socket.dispatchEvent(new Event("open"));
    await connecting;

    const session = new SdkManagedInboundCallSession(
      webPhone,
      new InboundMessage(
        "INVITE sip:100@example.com SIP/2.0",
        inboundInvite().headers,
        REMOTE_SDP,
      ),
    );
    const peerConnection = new FakePeerConnection();
    peerConnection.deferRemoteCandidates = true;
    session.rtcPeerConnection = peerConnection as unknown as RTCPeerConnection;
    webPhone.callSessions.push(session);
    await session.answer();
    socket.sent.length = 0;
    let candidatesAtResponse = -1;
    socket.onSend = () => {
      candidatesAtResponse = peerConnection.remoteCandidates.length;
    };

    const info = remoteCandidateInfo(session.callId, "pending");
    Object.assign(info.headers, {
      Via: "SIP/2.0/WSS example.com;branch=branch",
      CSeq: "2 INFO",
      From: session.remotePeer,
      To: session.localPeer,
    });
    socket.dispatchEvent(
      new MessageEvent("message", { data: info.toString() }),
    );

    await expect
      .poll(() => peerConnection.pendingRemoteCandidates)
      .toHaveLength(1);
    expect(socket.sent).toHaveLength(1);
    expect(socket.sent[0]).toMatch(/^SIP\/2\.0 200 OK/);
    expect(candidatesAtResponse).toBe(0);
    peerConnection.pendingRemoteCandidates.shift()?.();
  } finally {
    globalThis.WebSocket = OriginalWebSocket;
  }
});

test("sends an SDK-managed offer immediately and preserves its SDP", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new OutboundCallSession(webPhone, "101");
  const peerConnection = new FakePeerConnection();
  session.rtcPeerConnection = peerConnection as unknown as RTCPeerConnection;

  const call = session.call();
  const settledPromptly = await Promise.race([
    call.then(() => true),
    new Promise<false>((resolve) => setTimeout(() => resolve(false), 50)),
  ]);
  peerConnection.emitCandidate(null);
  await call;

  expect(settledPromptly).toBe(true);
  expect(sipClient.requests[0].body).toBe(LOCAL_SDP);
  expect(sipClient.requests[0].headers.Supported).toBe("trickle-ice");
});

test("preserves custom Supported tokens while advertising Trickle ICE", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new OutboundCallSession(webPhone, "101");
  session.rtcPeerConnection =
    new FakePeerConnection() as unknown as RTCPeerConnection;

  await session.call(undefined, { headers: { supported: "timer, 100rel" } });

  const supportedHeaders = Object.entries(sipClient.requests[0].headers).filter(
    ([name]) => name.toLowerCase() === "supported",
  );
  expect(supportedHeaders).toEqual([
    ["supported", "timer, 100rel, trickle-ice"],
  ]);
});

test("sends an SDK-managed answer immediately and advertises Trickle ICE", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new SdkManagedInboundCallSession(webPhone, inboundInvite());
  const peerConnection = new FakePeerConnection();
  session.rtcPeerConnection = peerConnection as unknown as RTCPeerConnection;

  await session.answer();

  expect(session.state).toBe("answered");
  expect(peerConnection.remoteDescription?.sdp).toBe("remote offer\r\n");
  expect(sipClient.replies[0].body).toBe(LOCAL_SDP);
  expect(sipClient.replies[0].headers.Supported).toBe("trickle-ice");
});

test("serializes local candidate INFO requests and ends the generation", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new OutboundCallSession(webPhone, "101");
  const peerConnection = new FakePeerConnection();
  session.rtcPeerConnection = peerConnection as unknown as RTCPeerConnection;
  sipClient.deferInfo = true;
  peerConnection.candidatesOnSetLocalDescription = [candidate("first")];
  await session.call();

  peerConnection.emitCandidate(candidate("second"));
  peerConnection.emitCandidate(null);
  peerConnection.emitCandidate(null);

  const infoRequests = () =>
    sipClient.requests.filter((request) => request.subject.startsWith("INFO "));
  await expect.poll(() => infoRequests()).toHaveLength(1);
  expect(sipClient.pendingInfoReplies).toHaveLength(1);
  expect(infoRequests()[0].headers).toMatchObject({
    "Call-Id": session.callId,
    "Info-Package": "trickle-ice",
    "Content-Type": "application/trickle-ice-sdpfrag",
    "Content-Disposition": "Info-Package",
  });
  expect(infoRequests()[0].body).toContain(
    "a=ice-ufrag:local-ufrag\r\na=ice-pwd:local-password\r\n" +
      "m=audio 9 UDP/TLS/RTP/SAVPF 111\r\na=mid:audio\r\n" +
      "a=candidate:first\r\n",
  );

  sipClient.replyToNextInfo();
  await expect.poll(() => infoRequests()).toHaveLength(2);
  expect(sipClient.pendingInfoReplies).toHaveLength(1);
  expect(infoRequests()[1].body).toContain("a=candidate:second\r\n");

  sipClient.replyToNextInfo();
  await expect.poll(() => infoRequests()).toHaveLength(3);
  expect(sipClient.pendingInfoReplies).toHaveLength(1);
  expect(infoRequests()[2].body).toContain("a=end-of-candidates\r\n");
  sipClient.replyToNextInfo();
  await expect.poll(() => sipClient.pendingInfoReplies).toHaveLength(0);
});

for (const failure of ["reject", "non-2xx"] as const) {
  test(`stops only the failed ICE generation after an INFO ${failure}`, async () => {
    const sipClient = new FakeSipClient();
    const webPhone = new WebPhone({ sipInfo, sipClient });
    const session = new OutboundCallSession(webPhone, "101");
    const peerConnection = new FakePeerConnection();
    session.rtcPeerConnection = peerConnection as unknown as RTCPeerConnection;
    await session.call();
    sipClient.infoFailure = failure;

    peerConnection.emitCandidate(candidate("failed"));
    peerConnection.emitCandidate(candidate("must-not-send"));
    peerConnection.emitCandidate(null);
    await expect
      .poll(() =>
        sipClient.requests.filter((request) =>
          request.subject.startsWith("INFO "),
        ),
      )
      .toHaveLength(1);
    await new Promise((resolve) => setTimeout(resolve));
    peerConnection.emitCandidate(candidate("also-must-not-send"));
    await new Promise((resolve) => setTimeout(resolve));

    expect(
      sipClient.requests.filter((request) =>
        request.subject.startsWith("INFO "),
      ),
    ).toHaveLength(1);
    expect(
      sipClient.requests.filter((request) =>
        request.subject.startsWith("INVITE "),
      ),
    ).toHaveLength(2);
    expect(session.state).toBe("answered");
  });
}

test("drops queued candidates when the Call Session is disposed", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new OutboundCallSession(webPhone, "101");
  const peerConnection = new FakePeerConnection();
  session.rtcPeerConnection = peerConnection as unknown as RTCPeerConnection;
  await session.call();
  sipClient.deferInfo = true;

  peerConnection.emitCandidate(candidate("pending"));
  peerConnection.emitCandidate(candidate("queued"));
  await expect.poll(() => sipClient.pendingInfoReplies).toHaveLength(1);
  session.dispose();
  sipClient.replyToNextInfo();
  await new Promise((resolve) => setTimeout(resolve));

  expect(
    sipClient.requests.filter((request) => request.subject.startsWith("INFO ")),
  ).toHaveLength(1);
  expect(session.state).toBe("disposed");
});

test("replaces stale candidate work with a re-INVITE ICE generation", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new OutboundCallSession(webPhone, "101");
  const peerConnection = new FakePeerConnection();
  session.rtcPeerConnection = peerConnection as unknown as RTCPeerConnection;
  await session.call();
  sipClient.deferInfo = true;

  peerConnection.emitCandidate(candidate("pending-old-generation"));
  peerConnection.emitCandidate(candidate("queued-old-generation"));
  await expect.poll(() => sipClient.pendingInfoReplies).toHaveLength(1);

  await session.reInvite();
  peerConnection.emitCandidate(candidate("new-generation"));
  peerConnection.emitCandidate(null);
  sipClient.replyToNextInfo();

  const infoRequests = () =>
    sipClient.requests.filter((request) => request.subject.startsWith("INFO "));
  await expect.poll(() => infoRequests()).toHaveLength(2);
  expect(infoRequests()[1].body).toContain("a=candidate:new-generation\r\n");
  expect(
    infoRequests()
      .map((request) => request.body)
      .join("\n"),
  ).not.toContain("queued-old-generation");

  sipClient.replyToNextInfo();
  await expect.poll(() => infoRequests()).toHaveLength(3);
  expect(infoRequests()[2].body).toContain("a=end-of-candidates\r\n");
  sipClient.replyToNextInfo();
  const invites = sipClient.requests.filter((request) =>
    request.subject.startsWith("INVITE "),
  );
  expect(invites).toHaveLength(3);
  expect(invites[2].headers.Supported).toBe("trickle-ice");
});

test("omits candidates already present in the sent SDP from INFO requests", async () => {
  const sipClient = new FakeSipClient();
  const webPhone = new WebPhone({ sipInfo, sipClient });
  const session = new OutboundCallSession(webPhone, "101");
  const peerConnection = new FakePeerConnection();
  session.rtcPeerConnection = peerConnection as unknown as RTCPeerConnection;
  peerConnection.candidatesOnSetLocalDescription = [candidate("present")];
  await session.call();

  const infoRequests = () =>
    sipClient.requests.filter((request) => request.subject.startsWith("INFO "));
  expect(infoRequests()).toHaveLength(0);

  peerConnection.emitCandidate(candidate("later"));
  peerConnection.emitCandidate(null);
  await expect.poll(() => infoRequests()).toHaveLength(2);
  expect(
    infoRequests().map((request) => request.body.trim().split("\r\n").at(-1)),
  ).toEqual(["a=candidate:later", "a=end-of-candidates"]);
});
