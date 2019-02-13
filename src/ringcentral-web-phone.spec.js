const TEST_TIMEOUT = 60000;
const DB_DELAY = 5000; // 5 sec delay to allow records to propagate in DB so that phone will be able to be called
const REGISTRATION_TIMEOUT = 15000;

describe('RingCentral.WebPhone', () => {

    const env = __karma__.config.env; //TODO Autocomplete

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

    beforeAll(async () => {
        callerSdk = await createSdk(caller);
        callerExtension = await getExtension(callerSdk);
        callerPhone = await createWebPhone(callerSdk, caller, 'caller');
        receiverSdk = await createSdk(receiver);
        receiverExtension = await getExtension(receiverSdk);
        receiverPhone = await createWebPhone(receiverSdk, receiver, 'receiver');
    });

    beforeEach(() => {
        session = null;
    });

    it('initiates and receives a call', async () => {

        const callerPhone = await createWebPhone(callerSdk, caller, 'caller');
        const receiverPhone = await createWebPhone(receiverSdk, receiver, 'receiver');

        // Call first phone
        session = callerPhone.userAgent.invite(
            receiver.username,
            getAcceptOptions(caller.username, callerExtension.regionalSettings.homeCountry.id)
        );

        return new Promise(resolve => {
            // Second phone should just accept the call
            receiverPhone.userAgent.once('invite', session => resolve(session.accept()));
        });

    });

    afterEach(() => {
        checkSessionStatus(session) && session.bye();
    });

    afterAll(async () => {
        await callerPhone.userAgent.unregister();
        await receiverPhone.userAgent.unregister();
    })

});

const getAcceptOptions = (fromNumber, homeCountryId) => ({
    fromNumber: fromNumber,
    homeCountryId: homeCountryId
});

const checkSessionStatus = session => (
    session &&
    session.status !== SIP.Session.C.STATUS_NULL &&
    session.status !== SIP.Session.C.STATUS_TERMINATED &&
    session.status !== SIP.Session.C.STATUS_CANCELED
);

const createSdk = async credentials => {

    const sdk = new RingCentral.SDK({
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

const getExtension = async sdk => (await sdk.platform().get('/restapi/v1.0/account/~/extension/~')).json();

const createWebPhone = async (sdk, credentials, id) => {

    const uaId = 'UserAgent [' + id + '] event:';

    const remote = document.createElement('video');
    remote.hidden = true;

    const local = document.createElement('video');
    local.hidden = true;
    local.muted = true;

    document.body.appendChild(remote);
    document.body.appendChild(local);

    const data = await (await sdk.platform().post('/client-info/sip-provision', {
        sipInfo: [{
            transport: 'WSS'
        }]
    })).json();

    const webPhone = new RingCentral.WebPhone(data, {
        appKey: credentials.appKey,
        uuid: RingCentral.WebPhone.uuid(),
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
            session.on('refer', () => console.log(sessionId, 'Refer'));
            session.on('replaced', newSession => console.log(sessionId, 'Replaced', 'old session', session, 'has been replaced with', newSession));
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

    return new Promise((resolve, reject) => {

        console.log(uaId, 'Registering', webPhone.userAgent.defaultHeaders[0]);

        webPhone.userAgent.on('connecting', () => console.log(uaId, 'Connecting'));
        webPhone.userAgent.on('connected', () => console.log(uaId, 'Connected'));
        webPhone.userAgent.on('disconnected', () => console.log(uaId, 'Disconnected'));
        webPhone.userAgent.on('unregistered', () => console.log(uaId, 'Unregistered'));
        webPhone.userAgent.on('message', (...args) => console.log(uaId, 'Message', args));
        webPhone.userAgent.on('invite', () => console.log(uaId, 'Invite'));

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
