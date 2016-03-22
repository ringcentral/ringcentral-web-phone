describe('RingCentral.WebPhone', function() {

    var accounts = testCredentials.accounts;

    function bindToSession(session, id) {

        var sessionId = 'Session #' + id + ' event:';

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

        session.mediaHandler.on('iceConnection', function() { console.log(sessionId, 'ICE: iceConnection'); });
        session.mediaHandler.on('iceConnectionChecking', function() { console.log(sessionId, 'ICE: iceConnectionChecking'); });
        session.mediaHandler.on('iceConnectionConnected', function() { console.log(sessionId, 'ICE: iceConnectionConnected'); });
        session.mediaHandler.on('iceConnectionCompleted', function() { console.log(sessionId, 'ICE: iceConnectionCompleted'); });
        session.mediaHandler.on('iceConnectionFailed', function() { console.log(sessionId, 'ICE: iceConnectionFailed'); });
        session.mediaHandler.on('iceConnectionDisconnected', function() { console.log(sessionId, 'ICE: iceConnectionDisconnected'); });
        session.mediaHandler.on('iceConnectionClosed', function() { console.log(sessionId, 'ICE: iceConnectionClosed'); });
        session.mediaHandler.on('iceGatheringComplete', function() { console.log(sessionId, 'ICE: iceGatheringComplete'); });
        session.mediaHandler.on('iceGathering', function() { console.log(sessionId, 'ICE: iceGathering'); });
        session.mediaHandler.on('iceCandidate', function() { console.log(sessionId, 'ICE: iceCandidate'); });
        session.mediaHandler.on('userMedia', function() { console.log(sessionId, 'ICE: userMedia'); });
        session.mediaHandler.on('userMediaRequest', function() { console.log(sessionId, 'ICE: userMediaRequest'); });
        session.mediaHandler.on('userMediaFailed', function() { console.log(sessionId, 'ICE: userMediaFailed'); });

        return session;

    }

    function getAcceptOptions() {

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
            }
        };
    }

    function createWebPhone(credentials) {

        console.log('Creating Web Phone', credentials);

        var sdk = new RingCentral.SDK({
            appKey: credentials.appKey,
            appSecret: credentials.appSecret,
            server: credentials.server
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
                    uuid: RingCentral.WebPhone.uuid()
                });

                return new Promise(function(resolve, reject) {
                    console.log('Registering...');
                    webPhone.userAgent.on('registered', function() {
                        console.log('Registered');
                        resolve({
                            sdk: sdk,
                            extension: extension,
                            webPhone: webPhone
                        });
                    });
                });

            });

    }


    it('calls', function() {

        this.timeout(30000);

        return Promise.all([
            createWebPhone(accounts[0]),
            createWebPhone(accounts[1])
        ]).then(function(packs) {

            return new Promise(function(resolve, reject) {

                // Second phone should just accept the call
                packs[0].webPhone.userAgent.on('invite', function(session) {
                    console.info('Invite received');
                    bindToSession(session, 'accepting');
                    resolve(session.accept(getAcceptOptions()).then(function(){
                        // session.terminate();
                    }));
                });

                // Call first phone
                bindToSession(packs[1].webPhone.userAgent.invite(accounts[0].username, getAcceptOptions()), 'calling');

                //TODO Cleanup
                //TODO Error handling

            });

        });

    });

});
