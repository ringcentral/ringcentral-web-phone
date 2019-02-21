import WebPhone from './index';
import SDK from 'ringcentral';
import SIP from 'sip.js';
import {WebPhoneSession} from './session';

const TEST_TIMEOUT = 60000;
const DB_DELAY = 5000; // 5 sec delay to allow records to propagate in DB so that phone will be able to be called
const REGISTRATION_TIMEOUT = 15000;

describe('RingCentral.WebPhone', () => {
    const env = window['__karma__'].config.env; //TODO Autocomplete

    [
        'RC_WP_RECEIVER_USERNAME',
        'RC_WP_RECEIVER_PASSWORD',
        'RC_WP_RECEIVER_APPKEY',
        'RC_WP_RECEIVER_APPSECRET',
        'RC_WP_RECEIVER_SERVER',
        'RC_WP_CALLER_USERNAME',
        'RC_WP_CALLER_PASSWORD',
        'RC_WP_CALLER_APPKEY',
        'RC_WP_CALLER_APPSECRET',
        'RC_WP_CALLER_SERVER'
    ].forEach(key => {
        if (!env[key]) throw new Error('Environment variable ' + key + 'was not set');
    });

    jasmine.DEFAULT_TIMEOUT_INTERVAL = TEST_TIMEOUT;

    const receiver = {
        username: env.RC_WP_RECEIVER_USERNAME,
        password: env.RC_WP_RECEIVER_PASSWORD,
        appKey: env.RC_WP_RECEIVER_APPKEY,
        appSecret: env.RC_WP_RECEIVER_APPSECRET,
        server: env.RC_WP_RECEIVER_SERVER
    };

    const caller = {
        username: env.RC_WP_CALLER_USERNAME,
        password: env.RC_WP_CALLER_PASSWORD,
        appKey: env.RC_WP_CALLER_APPKEY,
        appSecret: env.RC_WP_CALLER_APPSECRET,
        server: env.RC_WP_CALLER_SERVER
    };

    let session; // each test should use this for storing session object for proper cleanup
    let callerSdk;
    let callerExtension;
    let callerPhone;
    let receiverSdk;
    let receiverExtension;
    let receiverPhone;
    let acceptOptions;

    beforeAll(async () => {
        [callerSdk, receiverSdk] = await Promise.all([createSdk(caller), createSdk(receiver)]);
        [callerExtension, receiverExtension] = await Promise.all([getExtension(callerSdk), getExtension(receiverSdk)]);
        [callerPhone, receiverPhone] = await Promise.all([
            createWebPhone(callerSdk, caller, 'caller'),
            createWebPhone(receiverSdk, receiver, 'receiver')
        ]);
        acceptOptions = getAcceptOptions(caller.username, callerExtension.regionalSettings.homeCountry.id);
    });

    beforeEach(() => {
        session = null;
    });

    it('starts and stops recording', async () => {
        session = callerPhone.userAgent.invite(receiver.username, acceptOptions);
        const receiverSession = await onInvite(receiverPhone);
        await receiverSession.accept();
        await session.mute();
        await receiverSession.mute();
        await WebPhone.delay(1000); //FIXME No idea why we can't record the call right away
        await session.startRecord();
        await session.stopRecord();
    });

    afterEach(() => {
        checkSessionStatus(session) && session.bye();
    });

    afterAll(async () => {
        callerPhone && (await callerPhone.userAgent.unregister());
        receiverPhone && (await receiverPhone.userAgent.unregister());
    });
});

const onInvite = (receverPhone: WebPhone): Promise<WebPhoneSession> =>
    new Promise(resolve => receverPhone.userAgent.once('invite', async receoverSession => resolve(receoverSession)));

const getAcceptOptions = (fromNumber: string, homeCountryId: string): any => ({
    fromNumber: fromNumber,
    homeCountryId: homeCountryId
});

const checkSessionStatus = (session: WebPhoneSession): boolean =>
    session &&
    session.status !== SIP.Session.C.STATUS_NULL &&
    session.status !== SIP.Session.C.STATUS_TERMINATED &&
    session.status !== SIP.Session.C.STATUS_CANCELED;

const createSdk = async (credentials: any): Promise<SDK> => {
    const sdk = new SDK({
        appKey: credentials.appKey,
        appSecret: credentials.appSecret,
        server: credentials.server,
        cachePrefix: credentials.username
    });

    await sdk.platform().login({
        username: credentials.username,
        extension: credentials.extension || null,
        password: credentials.password
    });

    return sdk;
};

const getExtension = async (sdk: SDK): Promise<any> =>
    (await sdk.platform().get('/restapi/v1.0/account/~/extension/~')).json();

const createWebPhone = async (sdk: SDK, credentials: any, id: string): Promise<WebPhone> => {
    const uaId = 'UserAgent [' + id + '] event:';

    const remote = document.createElement('video');
    remote.hidden = true;

    const local = document.createElement('video');
    local.hidden = true;
    local.muted = true;

    document.body.appendChild(remote);
    document.body.appendChild(local);

    const data = await (await sdk.platform().post('/client-info/sip-provision', {
        sipInfo: [
            {
                transport: 'WSS'
            }
        ]
    })).json();

    const webPhone = new WebPhone(data, {
        appKey: credentials.appKey,
        uuid: WebPhone.uuid(),
        audioHelper: {
            enabled: true
        },
        logLevel: 1,
        media: {
            remote: remote,
            local: local
        },
        enableQos: true,
        onSession: session => {
            const sessionId = 'Session [' + id + '] event:';

            console.log('Binding to session', id);

            session.on('accepted', () => console.log(sessionId, 'Accepted'));
            session.on('progress', () => console.log(sessionId, 'Progress'));
            session.on('rejected', () => console.log(sessionId, 'Rejected'));
            session.on('failed', () => console.log(sessionId, 'Failed'));
            session.on('terminated', () => console.log(sessionId, 'Terminated'));
            session.on('cancel', () => console.log(sessionId, 'Cancel'));
            session.on('replaced', newSession =>
                console.log(sessionId, 'Replaced', 'old session', session, 'has been replaced with', newSession)
            );
            session.on('dtmf', () => console.log(sessionId, 'DTMF'));
            session.on('muted', () => console.log(sessionId, 'Muted'));
            session.on('unmuted', () => console.log(sessionId, 'Unmuted'));
            session.on('connecting', () => console.log(sessionId, 'Connecting'));
            session.on('bye', () => console.log(sessionId, 'Bye'));
        }
    });

    webPhone.userAgent.audioHelper.loadAudio({
        incoming: '/base/audio/incoming.ogg',
        outgoing: '/base/audio/outgoing.ogg'
    });

    webPhone.userAgent.on('unregistered', () => console.log(uaId, 'Unregistered'));
    webPhone.userAgent.on('message', (...args) => console.log(uaId, 'Message', args));
    webPhone.userAgent.on('invite', () => console.log(uaId, 'Invite'));

    return new Promise((resolve, reject) => {
        console.log(uaId, 'Registering', webPhone.userAgent.defaultHeaders[0]);

        webPhone.userAgent.once('registered', () => {
            console.log(uaId, 'Registered event delayed');
            setTimeout(() => {
                console.log(uaId, 'Registered');
                resolve(webPhone);
            }, DB_DELAY);
        });

        webPhone.userAgent.once('registrationFailed', (e, ...args) => {
            console.error(uaId, 'UA RegistrationFailed', e, args);
            //FIXME For some reason test fail with network error first time, ignoring once
            webPhone.userAgent.once('registrationFailed', (e, ...args) => {
                console.error(uaId, 'UA RegistrationFailed', e, args);
                reject(new Error('UA RegistrationFailed'));
            });
        });

        setTimeout(() => reject(new Error('Registration timeout')), REGISTRATION_TIMEOUT);
    });
};
