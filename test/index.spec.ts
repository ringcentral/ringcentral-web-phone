import type { BrowserContext } from '@playwright/test';
import { expect, test } from '@playwright/test';
import RingCentral from '@rc-ex/core';

const login = async (context: BrowserContext, jwtToken: string) => {
  const page = await context.newPage();
  await page.goto('/');
  const title = page.locator('h1');
  await expect(title).toHaveText('RingCentral WebPhone Demo');
  await page.screenshot({ path: 'screenshots/before-login.png' });

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

test('home page', async ({ context }) => {
  // login
  const callerPage = await login(context, process.env.RC_WP_CALLER_JWT_TOKEN!);
  await callerPage.screenshot({ path: 'screenshots/caller-logged-in.png' });
  const receiverPage = await login(context, process.env.RC_WP_RECEIVER_JWT_TOKEN!);
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
  await receiverPage.screenshot({ path: 'screenshots/receiver-hang-up.png' });
});
