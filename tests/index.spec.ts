import * as fs from 'fs';
import { ElementHandle } from 'puppeteer';
import waitFor from 'wait-for-async';

const login = async (username: string, extension = '', password: string) => {
  const thePage = await browser.newPage();
  await thePage.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
  await thePage.goto('http://localhost:8888/');
  await thePage.click('input[name="server"]', {clickCount: 3}); // click 3 times to select all
  await thePage.type('input[name="server"]', process.env.RC_WP_SERVER!);
  await thePage.click('input[name="clientId"]', {clickCount: 3});
  await thePage.type('input[name="clientId"]', process.env.RC_WP_CLIENT_ID!);
  await thePage.click('input[name="clientSecret"]', {clickCount: 3});
  await thePage.select('select[name="logLevel"]', '3');
  await thePage.type(
    'input[name="clientSecret"]',
    process.env.RC_WP_CLIENT_SECRET!
  );
  const [a] = await thePage.$x("//a[contains(text(),'Simple Login')]");
  await (a as ElementHandle<HTMLElement>).click();
  await waitFor({interval: 1000});

  await thePage.click('input[name="username"]', {clickCount: 3});
  await thePage.type('input[name="username"]', username);
  await thePage.click('input[name="extension"]', {clickCount: 3});
  await thePage.type('input[name="extension"]', extension);
  await thePage.click('input[name="password"]', {clickCount: 3});
  await thePage.type('input[name="password"]', password);
  const [button] = await thePage.$x("//button[text()='Login']");
  await (button as ElementHandle<HTMLElement>).click();
  await waitFor({interval: 5000});
  return thePage;
};

describe('RingCentral Web Phone', () => {
  it('default', async () => {
    // login
    const callerPage = await login(
      process.env.RC_WP_CALLER_USERNAME!,
      process.env.RC_WP_CALLER_EXTENSION,
      process.env.RC_WP_CALLER_PASSWORD!
    );
    expect(await callerPage.$x("//button[text()='Logout']")).toHaveLength(1);
    const receiverPage = await login(
      process.env.RC_WP_RECEIVER_USERNAME!,
      process.env.RC_WP_RECEIVER_EXTENSION,
      process.env.RC_WP_RECEIVER_PASSWORD!
    );
    expect(await receiverPage.$x("//button[text()='Logout']")).toHaveLength(1);
    fs.writeFileSync(
      './screenshots/caller_logged_in.png',
      await callerPage.screenshot()
    );
    fs.writeFileSync(
      './screenshots/receiver_logged_in.png',
      await receiverPage.screenshot()
    );

    // make the call
    let receiverPhoneNumber = process.env.RC_WP_RECEIVER_USERNAME!;
    if (
      process.env.RC_WP_RECEIVER_EXTENSION !== undefined &&
      process.env.RC_WP_RECEIVER_EXTENSION.length > 0
    ) {
      receiverPhoneNumber += '*' + process.env.RC_WP_RECEIVER_EXTENSION;
    }
    await callerPage.click('input[name="number"]', {clickCount: 3});
    await callerPage.type('input[name="number"]', receiverPhoneNumber);
    const [callButton] = await callerPage.$x("//button[text()='Call']");
    await (callButton as ElementHandle<HTMLElement>).click();
    await waitFor({interval: 3000});
    expect(
      await callerPage.$x("//h4[contains(text(), 'Call In Progress')]")
    ).toHaveLength(1);
    fs.writeFileSync(
      './screenshots/caller_calling.png',
      await callerPage.screenshot()
    );

    // answer the call
    fs.writeFileSync(
      './screenshots/receiver_ringing.png',
      await receiverPage.screenshot()
    );
    expect(await receiverPage.$x("//button[text()='Answer']")).toHaveLength(1);
    const [answerButton] = await receiverPage.$x("//button[text()='Answer']");
    await (answerButton as ElementHandle<HTMLElement>).click();
    await waitFor({interval: 3000});
    expect(
      await receiverPage.$x("//h4[contains(text(), 'Call In Progress')]")
    ).toHaveLength(1);
    fs.writeFileSync(
      './screenshots/receiver_answered.png',
      await receiverPage.screenshot()
    );

    // hang up the call
    const [hangButton] = await receiverPage.$x("//button[text()='Hang Up']");
    await (hangButton as ElementHandle<HTMLElement>).click();
    await waitFor({interval: 1000});
    fs.writeFileSync(
      './screenshots/receiver_hang_up.png',
      await receiverPage.screenshot()
    );
  });
});
