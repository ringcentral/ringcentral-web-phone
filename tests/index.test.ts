import { Page } from 'puppeteer';
import { delay, login, screenshot } from './utils';
import { SDK } from '@ringcentral/sdk';
import waitFor from 'wait-for-async';

let receiverPage: Page;
let callerPage: Page;

jest.setTimeout(120000);

let loginPromise = Promise.resolve();

const ensureLoggedIn = async () => {
    const sdk1 = new SDK({
        server: process.env.RC_WP_RECEIVER_SERVER,
        clientId: process.env.RC_WP_RECEIVER_CLIENT_ID,
        clientSecret: process.env.RC_WP_RECEIVER_CLIENT_SECRET
    });
    await sdk1.platform().login({
        username: process.env.RC_WP_RECEIVER_USERNAME,
        extension: process.env.RC_WP_RECEIVER_EXTENSION,
        password: process.env.RC_WP_RECEIVER_PASSWORD
    });
    const extInfo1 = await (await sdk1.platform().get('/restapi/v1.0/account/~/extension/~')).json();
    const receiverName = extInfo1.name;
    const sdk2 = new SDK({
        server: process.env.RC_WP_CALLER_SERVER,
        clientId: process.env.RC_WP_CALLER_CLIENT_ID,
        clientSecret: process.env.RC_WP_CALLER_CLIENT_SECRET
    });
    await sdk2.platform().login({
        username: process.env.RC_WP_CALLER_USERNAME,
        extension: process.env.RC_WP_CALLER_EXTENSION,
        password: process.env.RC_WP_CALLER_PASSWORD
    });
    const extInfo2 = await (await sdk2.platform().get('/restapi/v1.0/account/~/extension/~')).json();
    const callerName = extInfo2.name;

    callerPage = await browser.newPage();
    receiverPage = await browser.newPage();
    await login(receiverPage, 'RECEIVER', {
        server: process.env.RC_WP_RECEIVER_SERVER,
        clientId: process.env.RC_WP_RECEIVER_CLIENT_ID,
        clientSecret: process.env.RC_WP_RECEIVER_CLIENT_SECRET,
        username: process.env.RC_WP_RECEIVER_USERNAME,
        extension: process.env.RC_WP_RECEIVER_EXTENSION,
        password: process.env.RC_WP_RECEIVER_PASSWORD
    });
    await login(callerPage, 'CALLER', {
        server: process.env.RC_WP_CALLER_SERVER,
        clientId: process.env.RC_WP_CALLER_CLIENT_ID,
        clientSecret: process.env.RC_WP_CALLER_CLIENT_SECRET,
        username: process.env.RC_WP_CALLER_USERNAME,
        extension: process.env.RC_WP_CALLER_EXTENSION,
        password: process.env.RC_WP_CALLER_PASSWORD
    });
    await expect(receiverPage).toMatch(receiverName, { timeout: 30000 });
    await expect(callerPage).toMatch(callerName, { timeout: 30000 });
    await screenshot(receiverPage, 'init');
    await screenshot(callerPage, 'init');
    await delay(3000);
};

describe('Basic integration', () => {
    beforeAll(async () => {
        loginPromise = ensureLoggedIn();
        await loginPromise;
    });

    it('makes the call', async () => {
        await loginPromise;

        console.log('call test');

        // call
        let receiverPhoneNumber = process.env.RC_WP_RECEIVER_USERNAME;
        if (process.env.RC_WP_RECEIVER_EXTENSION !== undefined && process.env.RC_WP_RECEIVER_EXTENSION.length > 0) {
            receiverPhoneNumber += '*' + process.env.RC_WP_RECEIVER_EXTENSION;
        }
        await expect(callerPage).toFillForm('form[name="call"]', {
            number: receiverPhoneNumber
        });
        await expect(callerPage).toClick('button', { text: 'Call' });
        await waitFor({ interval: 1000 });
        await screenshot(callerPage, 'calling');
        await waitFor({ interval: 1000 });
        await screenshot(receiverPage, 'waiting');

        // answer
        await expect(receiverPage).toClick('button', { text: 'Answer', timeout: 30000 });
        await waitFor({ interval: 1000 });
        await screenshot(receiverPage, 'answered');

        // // hang up
        await expect(receiverPage).toClick('button', { text: 'Hang Up', timeout: 30000 });
        await waitFor({ interval: 1000 });
        await screenshot(receiverPage, 'hangup');
    });
});
