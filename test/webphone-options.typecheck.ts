import WebPhone from "../src/index.js";
import type InboundCallSession from "../src/call-session/inbound.js";
import type { MediaProvider, SipInfo } from "../src/types.js";

type RemoteMedia = { hostingTabId: string };

declare const sipInfo: SipInfo;
declare const mediaProvider: MediaProvider<RemoteMedia>;

new WebPhone({ sipInfo });
new WebPhone<RemoteMedia>({ sipInfo, mediaProvider });

declare const callSession: InboundCallSession<RemoteMedia>;

// @ts-expect-error Provider-owned media is read-only to consumers.
callSession.media!.hostingTabId = "another-tab";

// @ts-expect-error Custom media requires a matching provider.
new WebPhone<RemoteMedia>({ sipInfo });
