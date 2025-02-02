import { autoRun, manage } from "manate";

import WebPhone from "../src";

globalThis.setup = async (sipInfo: string) => {
  const webPhone = new WebPhone({
    sipInfo: JSON.parse(sipInfo),
    instanceId: "rc-web-phone-test-uniq-id",
    debug: true,
  });
  globalThis.webPhone = manage(webPhone);
  const { start, stop } = autoRun(() => {
    globalThis.inboundCalls = webPhone.callSessions.filter((call) =>
      call.direction === "inbound"
    );
    globalThis.outboundCalls = webPhone.callSessions.filter((call) =>
      call.direction === "outbound"
    );
  });
  start();
  await webPhone.start();
  globalThis.stopAutoRun = stop;
};

globalThis.teardown = async () => {
  globalThis.stopAutoRun();
  globalThis.stopAutoRun = undefined;
  await globalThis.webPhone.dispose();
  globalThis.webPhone = undefined;
  globalThis.inboundCalls = undefined;
  globalThis.outboundCalls = undefined;
};
