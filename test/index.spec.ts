import type { BrowserContext } from '@playwright/test';
import { expect, test } from '@playwright/test';
import RingCentral from '@rc-ex/core';
const sip = require('fix-esm').require('sip.js'); // eslint-disable-line
const log = new sip.Core.LoggerFactory();
const logger = log.getLogger('test.parser');

const waitFor = async (condition, pollInterval = 1000, timeout = 10000) => {
  const startTime = Date.now();

  while (true) {
    if (Date.now() > startTime + timeout) {
      throw 'timeout';
    }

    const result = await condition();

    if (result) {
      return result;
    }

    await new Promise((r) => setTimeout(r, pollInterval)); // eslint-disable-line
  }
};

/* eslint-disable max-params */
const login = async (
  context: BrowserContext,
  jwtToken: string,
  ws: any,
  options: { customHeader?: boolean; skipClientId?: boolean; refreshFrequency?: number } = {},
) => {
  const page = await context.newPage();

  let path = '/';

  const queryParams: string[] = [];
  if (options && options.customHeader) {
    queryParams.push('customHeader=true');
  }

  if (options && options.skipClientId) {
    queryParams.push('skipClientId=true');
  }

  if (options && options.refreshFrequency) {
    queryParams.push('refreshFrequency=' + options.refreshFrequency);
  }
  if (queryParams.length > 0) {
    path += '?' + queryParams.join('&');
  }

  await page.goto(path);
  const title = page.locator('h1');
  await expect(title).toHaveText('RingCentral WebPhone Demo');
  await page.screenshot({ path: 'screenshots/before-login.png' });

  page.on('websocket', ws);

  await page.fill('input[name="server"]', process.env.RC_WP_SERVER!);
  await page.fill('input[name="clientId"]', process.env.RC_WP_CLIENT_ID!);
  await page.fill('input[name="clientSecret"]', process.env.RC_WP_CLIENT_SECRET!);
  await page.click('text=Personal JWT Flow');
  await page.fill('input[name="jwtToken"]', jwtToken);
  await page.screenshot({ path: 'screenshots/credentials-filled.png' });

  await page.click('#jwt-login');

  await page.waitForTimeout(3000);

  await expect(page.locator('text = Logout')).toBeVisible();

  return page;
};
/* eslint-enable max-params */

test('home page', async ({ context }) => {
  // login
  const callerPage = await login(context, process.env.RC_WP_CALLER_JWT_TOKEN!, () => {});
  await callerPage.screenshot({ path: 'screenshots/caller-logged-in.png' });
  const receiverPage = await login(context, process.env.RC_WP_RECEIVER_JWT_TOKEN!, () => {});
  await receiverPage.screenshot({ path: 'screenshots/receiver-logged-in.png' });

  // make the call
  const rc = new RingCentral({
    server: process.env.RC_WP_SERVER!,
    clientId: process.env.RC_WP_CLIENT_ID!,
    clientSecret: process.env.RC_WP_CLIENT_SECRET!,
  });
  await rc.authorize({
    jwt: process.env.RC_WP_RECEIVER_JWT_TOKEN!,
  });
  const r = await rc.restapi().account().extension().phoneNumber().get();
  const receiverPhoneNumber = r.records!.filter((p) => p.primary === true)[0]!.phoneNumber!;
  await rc.revoke();
  await callerPage.fill('input[name="number"]', receiverPhoneNumber);
  await callerPage.click('#btn-call');
  await callerPage.waitForTimeout(3000);
  await callerPage.screenshot({ path: 'screenshots/caller-calling.png' });
  await expect(callerPage.locator('text=Call In Progress')).toBeVisible();

  // answer the call
  await receiverPage.screenshot({ path: 'screenshots/receiver-ringing.png' });
  await expect(receiverPage.locator('text=Answer')).toBeVisible();
  await receiverPage.click('#btn-answer');
  await receiverPage.waitForTimeout(3000);
  await expect(receiverPage.locator('text=Call In Progress')).toBeVisible();
  await receiverPage.screenshot({ path: 'screenshots/receiver-answered.png' });

  // hang up the call
  await receiverPage.click('#btn-hang-up');
  await receiverPage.waitForTimeout(1000);
  await expect(receiverPage.locator('text=Call In Progress')).toBeHidden();
  await receiverPage.screenshot({ path: 'screenshots/receiver-hung-up.png' });
});

test('allow to configure default headers', async ({ context }) => {
  let wsHandled = false;
  await login(
    context,
    process.env.RC_WP_CALLER_JWT_TOKEN!,
    (ws) => {
      ws.on('framesent', async (frame) => {
        const parsed = sip.Core.Parser.parseMessage(frame.payload, logger);

        if (parsed!.method === 'REGISTER') {
          expect(parsed!.headers['P-Custom-Header'].length).toEqual(1);
          expect(parsed!.headers['P-Custom-Header'][0].raw).toEqual('CustomValue');
          wsHandled = true;
        }
      });
    },
    {
      customHeader: true,
    },
  );

  await waitFor(() => wsHandled);
});

test('send client id during register if set', async ({ context }) => {
  let wsHandled = false;
  await login(context, process.env.RC_WP_CALLER_JWT_TOKEN!, (ws) => {
    ws.on('framesent', async (frame) => {
      const parsed = sip.Core.Parser.parseMessage(frame.payload, logger);

      if (parsed!.method === 'REGISTER') {
        expect(parsed!.headers['Client-Id'].length).toEqual(1);
        expect(parsed!.headers['Client-Id'][0].raw).toEqual(process.env.RC_WP_CLIENT_ID!);
        wsHandled = true;
      }
    });
  });

  await waitFor(() => wsHandled);
});

test('skip client id during register if not set', async ({ context }) => {
  let wsHandled = false;
  await login(
    context,
    process.env.RC_WP_CALLER_JWT_TOKEN!,
    (ws) => {
      ws.on('framesent', async (frame) => {
        const parsed = sip.Core.Parser.parseMessage(frame.payload, logger);

        if (parsed!.method === 'REGISTER') {
          expect(parsed!.headers['Client-Id']).toBeUndefined();
          wsHandled = true;
        }
      });
    },
    { skipClientId: true },
  );

  await waitFor(() => wsHandled);
});

test('refresh frequency setting', async ({ context }) => {
  test.setTimeout(70000);
  let firstRegisterAt;
  let wsHandled = false;
  await login(
    context,
    process.env.RC_WP_CALLER_JWT_TOKEN!,
    (ws) => {
      ws.on('framesent', async (frame) => {
        const parsed = sip.Core.Parser.parseMessage(frame.payload, logger);

        if (parsed.method === 'REGISTER' && typeof firstRegisterAt !== 'undefined') {
          expect(Date.now() - firstRegisterAt).toBeLessThan(30000);
          wsHandled = true;
        }
      });
      ws.on('framereceived', async (frame) => {
        const parsed = sip.Core.Parser.parseMessage(frame.payload, logger);

        if (parsed.method === 'REGISTER' && parsed.reasonPhrase === 'OK') {
          firstRegisterAt = Date.now();
        }
      });
    },
    {
      refreshFrequency: 50,
    },
  );

  await waitFor(() => wsHandled, 1000, 65000);
});
