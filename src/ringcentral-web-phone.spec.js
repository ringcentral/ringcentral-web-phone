describe('RingCentral.WebPhone', function() {

    var env = __karma__.config.env;

    var receiver = {
        username: env.RC_WP_RECEIVER_USERNAME,
        password: env.RC_WP_RECEIVER_PASSWORD,
        appKey: env.RC_WP_RECEIVER_APPKEY,
        appSecret: env.RC_WP_RECEIVER_APPSECRET,
        server: env.RC_WP_RECEIVER_SERVER
    };

    var caller = {
        username: env.RC_WP_CALLER_USERNAME,
        password: env.RC_WP_CALLER_PASSWORD,
        appKey: env.RC_WP_CALLER_APPKEY,
        appSecret: env.RC_WP_CALLER_APPSECRET,
        server: env.RC_WP_CALLER_SERVER
    };

    console.log('xxx', env.RC_WP_RECEIVER_SERVER);

    it('initiates and receives a call', function() {

        if (env.CI || env.TRAVIS) {
            console.log('REAL CALLS ARE NOT SUPPORTED BY CHROME IN TRAVIS.CI');
            return;
        }

        var timeout = 60000;
        var callerPhone;

        this.timeout(timeout);

        return createWebPhone(caller, 'caller')
            .then(function(phone) {
                callerPhone = phone;
                return createWebPhone(receiver, 'receiver');
            })
            .then(function(receiverPhone) {

                return new Promise(function(resolve, reject) {

                    // Second phone should just accept the call
                    receiverPhone.webPhone.userAgent.on('invite', function(session) {
                        resolve(session.accept(getAcceptOptions()).then(function() {
                            setTimeout(function() {
                                session.bye();
                            }, 1000);
                        }));
                    });

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

});

function getAcceptOptions(fromNumber, homeCountryId) {

    var remote = document.createElement('video');
    remote.hidden = true;

    var local = document.createElement('video');
    local.hidden = true;
    local.muted = true;

    document.body.appendChild(remote);
    document.body.appendChild(local);

    return {
        media: {
            render: {
                remote: remote,
                local: local
            }
        },
        fromNumber: fromNumber,
        homeCountryId: homeCountryId
    };
}

function createWebPhone(credentials, id) {

    var uaId = 'UserAgent [' + id + '] event:';

    // console.log(uaId, 'Creating', credentials.username); //TODO Remove some digits for privacy in logs

    var sdk = new RingCentral.SDK({
        appKey: credentials.appKey,
        appSecret: credentials.appSecret,
        server: credentials.server,
        cachePrefix: credentials.username
    });

    var platform = sdk.platform();
    var extension;

    return platform
        .login({
            username: credentials.username,
            extension: credentials.extension || null,
            password: credentials.password
        })
        .then(function() {

            return platform.get('/restapi/v1.0/account/~/extension/~');

        })
        .then(function(res) {

            extension = res.json();

            return platform.post('/client-info/sip-provision', {
                sipInfo: [{
                    transport: 'WSS'
                }]
            });

        })
        .then(function(res) { return res.json(); })
        .then(function(data) {

            var webPhone = new RingCentral.WebPhone(data, {
                appKey: credentials.appKey,
                uuid: RingCentral.WebPhone.uuid(),
                audioHelper: {
                    enabled: true,
                    incoming: '/base/audio/incoming.ogg',
                    outgoing: '/base/audio/outgoing.ogg'
                },
                logLevel: 1,
                onSession: function(session) {

                    var sessionId = 'Session [' + id + '] event:';

                    console.log('Binding to session', id);
                    // console.log('From', session.request.from.displayName, session.request.from.friendlyName);
                    // console.log('To', session.request.to.displayName, session.request.to.friendlyName);

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

                    // session.mediaHandler.on('iceConnection', function() { console.log(sessionId, 'ICE: iceConnection'); });
                    // session.mediaHandler.on('iceConnectionChecking', function() { console.log(sessionId, 'ICE: iceConnectionChecking'); });
                    // session.mediaHandler.on('iceConnectionConnected', function() { console.log(sessionId, 'ICE: iceConnectionConnected'); });
                    // session.mediaHandler.on('iceConnectionCompleted', function() { console.log(sessionId, 'ICE: iceConnectionCompleted'); });
                    // session.mediaHandler.on('iceConnectionFailed', function() { console.log(sessionId, 'ICE: iceConnectionFailed'); });
                    // session.mediaHandler.on('iceConnectionDisconnected', function() { console.log(sessionId, 'ICE: iceConnectionDisconnected'); });
                    // session.mediaHandler.on('iceConnectionClosed', function() { console.log(sessionId, 'ICE: iceConnectionClosed'); });
                    // session.mediaHandler.on('iceGatheringComplete', function() { console.log(sessionId, 'ICE: iceGatheringComplete'); });
                    // session.mediaHandler.on('iceGathering', function() { console.log(sessionId, 'ICE: iceGathering'); });
                    // session.mediaHandler.on('iceCandidate', function() { console.log(sessionId, 'ICE: iceCandidate'); });
                    // session.mediaHandler.on('userMedia', function() { console.log(sessionId, 'ICE: userMedia'); });
                    // session.mediaHandler.on('userMediaRequest', function() { console.log(sessionId, 'ICE: userMediaRequest'); });
                    // session.mediaHandler.on('userMediaFailed', function() { console.log(sessionId, 'ICE: userMediaFailed'); });

                }
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
                    console.error(uaId, 'UA RegistrationFailed', arguments);
                    reject(e);
                });

            });

        });

}
