import {Page} from 'puppeteer';
import {login, screenshot} from './utils';

let receiverPage: Page = page;
let callerPage: Page;

jest.setTimeout(120000);

describe('Basic integration', () => {
    beforeAll(async () => {
        callerPage = await browser.newPage();
        await login(receiverPage, 'RECEIVER', {
            server: process.env.RC_WP_RECEIVER_SERVER,
            appKey: process.env.RC_WP_RECEIVER_APPKEY,
            appSecret: process.env.RC_WP_RECEIVER_APPSECRET,
            login: process.env.RC_WP_RECEIVER_USERNAME,
            password: process.env.RC_WP_RECEIVER_PASSWORD
        });
        await login(callerPage, 'CALLER', {
            server: process.env.RC_WP_CALLER_SERVER,
            appKey: process.env.RC_WP_CALLER_APPKEY,
            appSecret: process.env.RC_WP_CALLER_APPSECRET,
            login: process.env.RC_WP_CALLER_USERNAME,
            password: process.env.RC_WP_CALLER_PASSWORD
        });
    });

    it('shows the page', async () => {
        await screenshot(receiverPage, 'init');
        await expect(receiverPage).toMatch('WebPhone Receiver');
        await screenshot(receiverPage, 'after login receiver');
        await expect(callerPage).toMatch('WebPhone Caller');
        await screenshot(callerPage, 'after login caller');
    });

    it('makes the call', async () => {
        await screenshot(receiverPage, 'init');

        // call
        await expect(callerPage).toFillForm('form[name="call"]', {
            number: process.env.RC_WP_RECEIVER_USERNAME
        });
        await expect(callerPage).toClick('button', {text: 'Call'});
        await screenshot(callerPage, 'calling');
        await screenshot(receiverPage, 'waiting');

        // answer
        await expect(receiverPage).toClick('button', {text: 'Answer', timeout: 30000});
        await screenshot(receiverPage, 'answered');

        // // hang up
        await expect(receiverPage).toClick('button', {text: 'Hang Up', timeout: 30000});
        await screenshot(receiverPage, 'hangup');
    });
});
