describe('SIP.JS', function() {

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

    if (!window.navigator.getUserMedia) window.navigator.getUserMedia = window.navigator.webkitGetUserMedia;

    // it('gets local steams', function(done){
    //
    //     window.navigator.getUserMedia({audio: true, video: false}, function(res) {
    //         console.log('success', arguments);
    //         console.log(res.getAudioTracks()[0]);
    //         done();
    //     }, function() {
    //         console.log('fail', arguments);
    //         done(new Error('Failed'));
    //     });
    //
    // });
    //
    // return;

    it('makes a call using bare SIP.JS', function() {

        if (env.CI || env.TRAVIS) {
            console.log('REAL CALLS ARE NOT SUPPORTED BY CHROME IN TRAVIS.CI');
            return;
        }

        var timeout = 60000;
        var callerPhone;

        this.timeout(timeout);

        return createSIP(caller, 'caller')
            .then(function(phone) {
                callerPhone = phone;
                return createSIP(receiver, 'receiver');
            })
            .then(function(receiverPhone) {

                return new Promise(function(resolve, reject) {

                    var options = getAcceptOptions(receiver.username, callerPhone.extension.regionalSettings.homeCountry.id);

                    options.extraHeaders = [
                        'P-Asserted-Identity: sip:' + (options.fromNumber || callerPhone.sipInfo.username) + '@' + callerPhone.sipInfo.domain,
                        'P-rc-country-id: ' + callerPhone.extension.regionalSettings.homeCountry.id
                    ];

                    // Second phone should just accept the call
                    receiverPhone.userAgent.on('invite', function(session) {
                        console.log('INVITE');

                        session.once('accepted', function() {
                            setTimeout(function() {
                                session.bye();
                                resolve();
                            }, 1000);
                        });

                        console.log('ACCEPTING');

                        session.accept(getAcceptOptions());

                    });

                    // Call first phone
                    var session = callerPhone.userAgent.invite(receiver.username, options);

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
            constraints: {
                audio: true,
                video: false
            },
            render: {
                remote: remote,
                local: local
            }
        },
        RTCConstraints: {
            optional: [
                {DtlsSrtpKeyAgreement: 'true'}
            ]
        },
        fromNumber: fromNumber,
        homeCountryId: homeCountryId
    };
}

function createSIP(credentials, id) {

    var sdk = new RingCentral.SDK({
        appKey: credentials.appKey,
        appSecret: credentials.appSecret,
        server: credentials.server,
        cachePrefix: credentials.username
    });

    var uaId = 'UserAgent [' + id + '] event:';

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

            var sipInfo = data.sipInfo[0] || data.sipInfo;
            var sipFlags = data.sipFlags;

            var configuration = {
                uri: 'sip:' + sipInfo.username + '@' + sipInfo.domain,
                wsServers: sipInfo.outboundProxy && sipInfo.transport
                    ? sipInfo.transport.toLowerCase() + '://' + sipInfo.outboundProxy
                    : sipInfo.wsServers,
                authorizationUser: sipInfo.authorizationId,
                password: sipInfo.password,
                traceSip: true,
                stunServers: sipInfo.stunServers || ['stun:74.125.194.127:19302'],
                turnServers: [],
                log: {
                    level: 1
                },
                domain: sipInfo.domain,
                autostart: true,
                register: true,
                iceCheckingTimeout: sipInfo.iceCheckingTimeout || sipInfo.iceGatheringTimeout || 500
            };

            var userAgent = new SIP.UA(configuration).register({
                extraHeaders: [
                    'Client-id:' + credentials.appKey
                ]
            });

            return new Promise(function(resolve, reject) {

                console.log(uaId, 'Registering');

                userAgent.on('connecting', function() { console.log(uaId, 'Connecting'); });
                userAgent.on('connected', function() { console.log(uaId, 'Connected'); });
                userAgent.on('disconnected', function() { console.log(uaId, 'Disconnected'); });
                userAgent.on('unregistered', function() { console.log(uaId, 'Unregistered'); });
                userAgent.on('message', function() { console.log(uaId, 'Message', arguments); });
                userAgent.on('invite', function() { console.log(uaId, 'Invite'); });

                userAgent.once('registered', function() {
                    console.log(uaId, 'Registered event delayed');
                    setTimeout(function() {
                        console.log(uaId, 'Registered');
                        resolve({
                            sdk: sdk,
                            extension: extension,
                            userAgent: userAgent,
                            sipInfo: sipInfo,
                            sipFlags: sipFlags
                        });
                    }, 5000); // 5 sec delay to allow records to propagate in DB
                });

                userAgent.once('registrationFailed', function(e) {
                    console.error(uaId, 'UA RegistrationFailed', arguments);
                    reject(e);
                });

            });

        });

}