import WebPhone from "../src/index.js";
import type { MediaProvider, SipInfo } from "../src/types.js";

type RemoteMedia = { hostingTabId: string };

declare const sipInfo: SipInfo;
declare const mediaProvider: MediaProvider<RemoteMedia>;

new WebPhone({ sipInfo });
new WebPhone<RemoteMedia>({ sipInfo, mediaProvider });

// @ts-expect-error Custom media requires a matching provider.
new WebPhone<RemoteMedia>({ sipInfo });
