import fs from 'fs';
import path from 'path';
import {Page, Response, ScreenshotOptions} from 'puppeteer';
import config from '../jest-puppeteer.config';

export const openPage = async (page: Page, url = '/'): Promise<Response> =>
    page.goto(`http://localhost:${config.server.port}${url}`);

const screenshotPath = path.resolve(process.cwd(), '.screenshots');

export const type = async (page: Page, selector, text): Promise<void> => {
    await page.focus('input[name=server]');
    await page.keyboard.type(text);
};

let screenshotSequence = 0;

const addZero = (n: number): string => (n < 10 ? `0${n}` : n.toString());
const makeScreenshotFilename = (str: string): string => str.toLowerCase().replace(/[^0-9a-z-._]/gi, '-');

export const screenshot = async (page: Page, name: string, options: ScreenshotOptions = {}): Promise<void> => {
    await page.screenshot({
        path: path.join(
            screenshotPath,
            makeScreenshotFilename(`${addZero(++screenshotSequence)}-${await page.title()}-${name}.png`)
        ),
        type: 'png',
        fullPage: true,
        ...options
    });
};

export const delay = async (ms: number): Promise<any> => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (page: Page, name, credentials: any): Promise<void> => {
    await openPage(page, '/');
    await page.evaluate(`document.title = '${name}'`);
    await page.waitForSelector('a.accordion-toggle');
    await page.click('a.accordion-toggle'); //FIXME TS does not recognize toClick

    await expect(page).toFillForm('form[name="authorize-code"]', {
        server: credentials.server,
        appKey: credentials.appKey,
        appSecret: credentials.appSecret,
        logLevel: '1'
    });

    await expect(page).toFillForm('form[name="login-form"]', {
        login: credentials.login,
        password: credentials.password
    });

    await expect(page).toClick('button', {text: 'Login'});
};

if (!fs.existsSync(screenshotPath)) fs.mkdirSync(screenshotPath);
console.log('Screenshot path: ', screenshotPath);
