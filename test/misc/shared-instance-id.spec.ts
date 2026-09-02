import { expect, type Page } from "@playwright/test";
import waitFor from "wait-for-async";
import { calleeNumber, callerNumber, testThreePages } from "../common";

const declineInboundCall = async (page: Page) => {
  await page.evaluate(async () => {
    await globalThis.inboundCalls[0].decline();
  });
};

// after the callee declines, the SIP server does not terminate the caller's
// outbound Call Session, so the caller hangs it up to clean it up
const hangUpOutboundCall = async (page: Page) => {
  await page.evaluate(async () => {
    await globalThis.outboundCalls[0].hangup();
  });
};

// wait until all call sessions on the page are removed
const waitForCleanup = async (page: Page) => {
  while (
    !(await page.evaluate(() => globalThis.webPhone.callSessions.length === 0))
  ) {
    await waitFor({ interval: 1000 });
  }
};

testThreePages(
  "shared instance ID routing",
  async ({ phoneAResource, phoneBResource, phoneCResource }) => {
    testThreePages.setTimeout(45_000);
    const pageA = phoneAResource.page;
    const pageB = phoneBResource.page;
    const pageC = phoneCResource.page;

    // leg 1: C calls the shared callee number, B (most recently registered)
    // receives the call, A (superseded) does not
    await pageC.evaluate(
      async ({ calleeNumber, callerNumber }) => {
        await globalThis.webPhone.call(calleeNumber, callerNumber);
      },
      { calleeNumber, callerNumber },
    );
    while (true) {
      if (
        !(await pageA.evaluate(
          () => globalThis.webPhone.callSessions.length === 0,
        ))
      ) {
        throw new Error("Superseded Web Phone A received the inbound call");
      }
      if (await pageB.evaluate(() => globalThis.inboundCalls?.length > 0)) {
        break;
      }
      // poll A tightly so that any unexpected inbound call fails the test
      // immediately instead of waiting for the next one-second tick
      await waitFor({ interval: 100 });
    }
    // wait one second, the superseded Web Phone A must remain without an
    // inbound call session
    await waitFor({ interval: 1000 });
    expect(
      await pageA.evaluate(() => globalThis.webPhone.callSessions.length),
    ).toBe(0);
    expect(
      await pageB.evaluate(() => globalThis.webPhone.callSessions.length),
    ).toBe(1);
    await declineInboundCall(pageB);
    await hangUpOutboundCall(pageC);
    await waitForCleanup(pageB);
    await waitForCleanup(pageC);

    // leg 2: the superseded Web Phone A remains able to make outbound calls
    await pageA.evaluate(
      async ({ calleeNumber, callerNumber }) => {
        await globalThis.webPhone.call(callerNumber, calleeNumber);
      },
      { calleeNumber, callerNumber },
    );
    while (!(await pageC.evaluate(() => globalThis.inboundCalls?.length > 0))) {
      await waitFor({ interval: 1000 });
    }
    await declineInboundCall(pageC);
    await hangUpOutboundCall(pageA);
    await waitForCleanup(pageA);
    await waitForCleanup(pageC);

    // leg 3: the active Web Phone B remains able to make outbound calls
    await pageB.evaluate(
      async ({ calleeNumber, callerNumber }) => {
        await globalThis.webPhone.call(callerNumber, calleeNumber);
      },
      { calleeNumber, callerNumber },
    );
    while (!(await pageC.evaluate(() => globalThis.inboundCalls?.length > 0))) {
      await waitFor({ interval: 1000 });
    }
    await declineInboundCall(pageC);
    await hangUpOutboundCall(pageB);
    await waitForCleanup(pageB);
    await waitForCleanup(pageC);
  },
);
