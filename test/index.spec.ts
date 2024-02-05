import * as fs from 'fs';
import type { ElementHandle } from 'puppeteer';
import waitFor from 'wait-for-async';
import RingCentral from '@rc-ex/core';

const login = async (jwtToken: string) => {
  const thePage = await browser.newPage();
  await thePage.setViewport({ width: 800, height: 800, deviceScaleFactor: 2 });
  await thePage.goto('http://localhost:8888/');
  fs.writeFileSync('./screenshots/before-login.png', await thePage.screenshot());
  await thePage.click('input[name="server"]', { clickCount: 3 }); // click 3 times to select all
  await thePage.type('input[name="server"]', process.env.RC_WP_SERVER!);
  await thePage.click('input[name="clientId"]', { clickCount: 3 });
  await thePage.type('input[name="clientId"]', process.env.RC_WP_CLIENT_ID!);
  await thePage.click('input[name="clientSecret"]', { clickCount: 3 });
  await thePage.select('select[name="logLevel"]', '3');
  await thePage.type('input[name="clientSecret"]', process.env.RC_WP_CLIENT_SECRET!);
  const [a] = await thePage.$$("xpath/.//a[contains(text(),'Personal JWT Flow')]");
  await (a as ElementHandle<HTMLElement>).click();
  await waitFor({ interval: 1000 });

  await thePage.click('input[name="jwtToken"]', { clickCount: 3 });
  await thePage.type('input[name="jwtToken"]', jwtToken);
  const button = await thePage.$('#jwt-login');
  await button!.click();
  await waitFor({ interval: 5000 });
  return thePage;
};

describe('RingCentral Web Phone', () => {
  it('default', async () => {
    // login
    const callerPage = await login(process.env.RC_WP_CALLER_JWT_TOKEN!);
    expect(await callerPage.$$("xpath/.//button[text()='Logout']")).toHaveLength(1);
    const receiverPage = await login(process.env.RC_WP_RECEIVER_JWT_TOKEN!);
    expect(await receiverPage.$$("xpath/.//button[text()='Logout']")).toHaveLength(1);
    fs.writeFileSync('./screenshots/caller_logged_in.png', await callerPage.screenshot());
    fs.writeFileSync('./screenshots/receiver_logged_in.png', await receiverPage.screenshot());

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
    await callerPage.click('input[name="number"]', { clickCount: 3 });
    await callerPage.type('input[name="number"]', receiverPhoneNumber);
    const [callButton] = await callerPage.$$("xpath/.//button[text()='Call']");
    await (callButton as ElementHandle<HTMLElement>).click();
    await waitFor({ interval: 5000 });
    expect(await callerPage.$$("xpath/.//h4[contains(text(), 'Call In Progress')]")).toHaveLength(1);
    fs.writeFileSync('./screenshots/caller_calling.png', await callerPage.screenshot());

    // answer the call
    fs.writeFileSync('./screenshots/receiver_ringing.png', await receiverPage.screenshot());
    expect(await receiverPage.$$("xpath/.//button[text()='Answer']")).toHaveLength(1);
    const [answerButton] = await receiverPage.$$("xpath/.//button[text()='Answer']");
    await (answerButton as ElementHandle<HTMLElement>).click();
    await waitFor({ interval: 5000 });
    expect(await receiverPage.$$("xpath/.//h4[contains(text(), 'Call In Progress')]")).toHaveLength(1);
    fs.writeFileSync('./screenshots/receiver_answered.png', await receiverPage.screenshot());

    // hang up the call
    const [hangButton] = await receiverPage.$$("xpath/.//button[text()='Hang Up']");
    await (hangButton as ElementHandle<HTMLElement>).click();
    await waitFor({ interval: 1000 });
    fs.writeFileSync('./screenshots/receiver_hang_up.png', await receiverPage.screenshot());
  });
});
