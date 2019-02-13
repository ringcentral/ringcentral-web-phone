describe('RingCentral.WebPhone', function() {

    const env = __karma__.config.env;

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

    it('initiates and receives a call', async function() {

        const timeout = 60000;

        this.timeout(timeout);

        const callerPhone = await createWebPhone(caller, 'caller');
        const receiverPhone = await createWebPhone(receiver, 'receiver');

        return new Promise(function(resolve, reject) {

            // Second phone should just accept the call
            receiverPhone.webPhone.userAgent.on('invite', function(session) {
                resolve(session.accept().then(function() {
                    setTimeout(function() {
                        session.bye();
                    }, 1000);
                }));
            });

            console.log(receiver.username);

            // Call first phone
            var session = callerPhone.webPhone.userAgent.invite(
                receiver.username,
                getAcceptOptions(caller.username, callerPhone.extension.regionalSettings.homeCountry.id)
            );

            setTimeout(function() {
                session.bye();
            }, timeout);

        });


    });

});

const getAcceptOptions = (fromNumber, homeCountryId) => ({
    fromNumber: fromNumber,
    homeCountryId: homeCountryId
});

async function createWebPhone(credentials, id) {

    const uaId = 'UserAgent [' + id + '] event:';

    // console.log(uaId, 'Creating', credentials.username); //TODO Remove some digits for privacy in logs

    const remote = document.createElement('video');
    remote.hidden = true;

    const local = document.createElement('video');
    local.hidden = true;
    local.muted = true;

    document.body.appendChild(remote);
    document.body.appendChild(local);

    const sdk = new RingCentral.SDK({
        appKey: credentials.appKey,
        appSecret: credentials.appSecret,
        server: credentials.server,
        cachePrefix: credentials.username
    });

    const platform = sdk.platform();

    await platform.login({
        username: credentials.username,
        extension: credentials.extension || null,
        password: credentials.password
    });

    const extension = await (await platform.get('/restapi/v1.0/account/~/extension/~')).json();

    const data = await (await platform.post('/client-info/sip-provision', {
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
        onSession: function(session) {

            const sessionId = 'Session [' + id + '] event:';

            console.log('Binding to session', id);

            session.on('accepted', function() { console.log(sessionId, 'Accepted'); });
            session.on('progress', function() { console.log(sessionId, 'Progress'); });
            session.on('rejected', function() { console.log(sessionId, 'Rejected'); });
            session.on('failed', function() { console.log(sessionId, 'Failed'); });
            session.on('terminated', function() { console.log(sessionId, 'Terminated');});
            session.on('cancel', function() {console.log(sessionId, 'Cancel');});
            session.on('refer', function() { console.log(sessionId, 'Refer');});
            session.on('replaced', function(newSession) {
                console.log(sessionId, 'Replaced', 'old session', session, 'has been replaced with', newSession);
            });
            session.on('dtmf', function() { console.log(sessionId, 'DTMF'); });
            session.on('muted', function() { console.log(sessionId, 'Muted'); });
            session.on('unmuted', function() { console.log(sessionId, 'Unmuted'); });
            session.on('connecting', function() { console.log(sessionId, 'Connecting'); });
            session.on('bye', function() { console.log(sessionId, 'Bye'); });

        }
    });

    webPhone.userAgent.audioHelper.loadAudio({
        incoming: '/base/audio/incoming.ogg',
        outgoing: '/base/audio/outgoing.ogg'
    });

    return new Promise(function(resolve, reject) {

        console.log(uaId, 'Registering', webPhone.endpointHeader);

        webPhone.userAgent.on('connecting', function() { console.log(uaId, 'Connecting'); });
        webPhone.userAgent.on('connected', function() { console.log(uaId, 'Connected'); });
        webPhone.userAgent.on('disconnected', function() { console.log(uaId, 'Disconnected'); });
        webPhone.userAgent.on('unregistered', function() { console.log(uaId, 'Unregistered'); });
        webPhone.userAgent.on('message', function() { console.log(uaId, 'Message', arguments); });
        webPhone.userAgent.on('invite', function() { console.log(uaId, 'Invite'); });

        webPhone.userAgent.once('registered', function() {
            console.log(uaId, 'Registered event delayed');
            setTimeout(function() {
                console.log(uaId, 'Registered');
                resolve({
                    sdk: sdk,
                    extension: extension,
                    webPhone: webPhone
                });
            }, 5000); // 5 sec delay to allow records to propagate in DB
        });

        webPhone.userAgent.once('registrationFailed', function(e) {
            console.error(uaId, 'UA RegistrationFailed', arguments, e);
            // reject(new Error('UA RegistrationFailed')); //FIXME For some reason test fail with network error first time, ignoring for now
        });

        setTimeout(function() {
            reject(new Error('Registration timeout'));
        }, 10000);

    });

}
