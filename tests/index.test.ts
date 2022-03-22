import puppeteer, { Browser, Page } from 'puppeteer';
import { delay, login, screenshot } from './utils';

let callerPage: Page;
let receiverPage: Page;
let browser: Browser;

jest.setTimeout(120000);

const ensureLoggedIn = async () => {
    browser = await puppeteer.launch();
    callerPage = await browser.newPage();
    receiverPage = await browser.newPage();
    await login(receiverPage, 'Receiver', {
        server: process.env.RC_WP_RECEIVER_SERVER,
        appKey: process.env.RC_WP_RECEIVER_APPKEY,
        appSecret: process.env.RC_WP_RECEIVER_APPSECRET,
        login: process.env.RC_WP_RECEIVER_USERNAME,
        password: process.env.RC_WP_RECEIVER_PASSWORD
    });
    await login(callerPage, 'Caller', {
        server: process.env.RC_WP_CALLER_SERVER,
        appKey: process.env.RC_WP_CALLER_APPKEY,
        appSecret: process.env.RC_WP_CALLER_APPSECRET,
        login: process.env.RC_WP_CALLER_USERNAME,
        password: process.env.RC_WP_CALLER_PASSWORD
    });
};

describe('Basic integration', () => {
    beforeAll(async () => {
        await ensureLoggedIn();
    });

    afterAll(() => {
        browser.close();
    });

    it('check if page is rendered', async () => {
        await expect(await receiverPage.title()).toMatch('WebPhone Receiver', { timeout: 30000 });
        await expect(await callerPage.title()).toMatch('WebPhone Caller', { timeout: 30000 });
        await screenshot(receiverPage, 'init');
        await screenshot(callerPage, 'init');
        await delay(5000);
        await screenshot(receiverPage, 'logged-in');
        await screenshot(callerPage, 'logged-in');
    });

    it('makes the call', async () => {
        // call
        await expect(callerPage).toFillForm('form[name="call"]', {
            number: process.env.RC_WP_RECEIVER_USERNAME
        });
        await expect(callerPage).toClick('button', { text: 'Call' });
        await delay(3000);
        await screenshot(callerPage, 'calling');
        await screenshot(receiverPage, 'waiting');
        // answer
        await expect(receiverPage).toClick('button', { text: 'Answer', timeout: 30000 });
        await screenshot(receiverPage, 'answered');
        // hang up
        await expect(receiverPage).toClick('button', { text: 'Hang Up', timeout: 30000 });
        await screenshot(receiverPage, 'hangup');
    });
});
