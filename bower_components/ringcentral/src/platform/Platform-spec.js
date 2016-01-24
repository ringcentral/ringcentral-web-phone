import {expect, getSdk, getMock, getRegistry, asyncTest, spy} from '../test/test';
import SDK from '../SDK';

describe('RingCentral.platform.Platform', function() {

    describe('setCredentials', function() {

        it('should have predefined apiKey', function() {

            expect(getSdk().platform()['_apiKey']()).to.equal('d2hhdGV2ZXI6d2hhdGV2ZXI='); // whatever:whatever

        });

    });

    describe('setServer', function() {

        it('should have predefined server', function() {

            expect(getSdk().platform()['_server']).to.equal('http://whatever');

        });

    });

    describe('isTokenValid', function() {

        it('is not authenticated when token has expired', function() {

            var sdk = getSdk(),
                platform = sdk.platform();

            platform.auth().cancelAccessToken();

            expect(platform.auth().accessTokenValid()).to.equal(false);

        });

        it('is not authenticated after logout', asyncTest(async function(sdk) {

            getRegistry().logout();

            var platform = sdk.platform();

            await platform.logout();

            expect(platform.auth().accessTokenValid()).to.equal(false);

        }));

        it('is not authenticated if paused', function() {

            var sdk = getSdk(),
                platform = sdk.platform(),
                queue = platform['_queue'];

            queue.pause();
            expect(platform.auth().accessTokenValid()).to.equal(false);
            queue.resume();

        });

    });

    describe('authorized', function() {

        it('initiates refresh if not authorized', asyncTest(async function(sdk) {

            getRegistry().tokenRefresh();

            var platform = sdk.platform();

            expect(platform.auth().accessToken()).to.not.equal('ACCESS_TOKEN_FROM_REFRESH');

            platform.auth().cancelAccessToken();

            await platform.loggedIn();

            expect(platform.auth().accessToken()).to.equal('ACCESS_TOKEN_FROM_REFRESH');

        }));

        it('waits for refresh to resolve from other tab', function() {

            return getMock((sdk)=> {

                var queue = sdk.platform()['_queue'],
                    platform = sdk.platform(),
                    token = 'ACCESS_TOKEN_FROM_OTHER_TAB';

                expect(platform.auth().accessToken()).to.not.equal(token);

                queue.pause();

                setTimeout(function() {

                    platform.auth().setData({
                        access_token: token,
                        expires_in: 60 * 60 // 1 hour
                    });

                    queue.resume();

                }, 10);

                platform.auth().cancelAccessToken();

                return platform
                    .loggedIn()
                    .then(function() {
                        expect(platform.auth().accessToken()).to.equal(token);
                    });

            });

        });

        it('produces error if refresh did not happen', asyncTest(async function(sdk) {

            var queue = sdk.platform()['_queue'], // accessing private member
                platform = sdk.platform();

            queue.pause();

            platform.auth().cancelAccessToken();

            var res = await platform.loggedIn();
            expect(res).to.equal(false);

        }));

    });

    describe('sendRequest', function() {

        it('refreshes token when token was expired', function() {

            return getMock((sdk)=> {

                var platform = sdk.platform(),
                    path = '/restapi/xxx',
                    refreshSpy = spy(function() {});

                getRegistry()
                    .tokenRefresh()
                    .apiCall('GET', path, {});

                expect(platform.auth().accessToken()).to.not.equal('ACCESS_TOKEN_FROM_REFRESH');

                platform.auth().cancelAccessToken();

                return platform
                    .on(platform.events.refreshSuccess, refreshSpy)
                    .get(path)
                    .then(function(ajax) {
                        expect(refreshSpy).to.be.calledOnce;
                        expect(platform.auth().accessToken()).to.equal('ACCESS_TOKEN_FROM_REFRESH');
                    });

            });

        });

        it('tries to refresh the token if Platform returns 401 Unauthorized and re-executes the request', asyncTest(async function(sdk) {

            var platform = sdk.platform(),
                path = '/restapi/xxx',
                refreshSpy = spy(function() {}),
                response = {foo: 'bar'};

            getRegistry()
                .apiCall('GET', path, {message: 'time not in sync'}, 401, 'Time Not In Sync')
                .tokenRefresh()
                .apiCall('GET', path, response, 200);

            platform.on(platform.events.refreshSuccess, refreshSpy);

            var res = await platform.get(path);

            expect(refreshSpy).to.be.calledOnce;
            expect(res.json()).to.deep.equal(response);
            expect(platform.auth().accessToken()).to.equal('ACCESS_TOKEN_FROM_REFRESH');

        }));

        it('fails if ajax has status other than 2xx', function() {

            return getMock((sdk)=> {

                var platform = sdk.platform(),
                    path = '/restapi/xxx';

                getRegistry()
                    .apiCall('GET', path, {description: 'Fail'}, 400, 'Bad Request');

                return platform
                    .get(path)
                    .then(function() {
                        throw new Error('This should not be reached');
                    })
                    .catch(function(e) {
                        expect(e.message).to.equal('Fail');
                    });

            });

        });

    });

    describe('refresh', function() {

        it('handles error in queued AJAX after unsuccessful refresh when token is killed', function() {

            return getMock((sdk)=> {

                var platform = sdk.platform(),
                    path = '/restapi/xxx',
                    successSpy = spy(function() {}),
                    errorSpy = spy(function() {});

                getRegistry()
                    .tokenRefresh(true)
                    .apiCall('GET', path, {});

                platform.auth().cancelAccessToken();

                return platform
                    .on(platform.events.refreshSuccess, successSpy)
                    .on(platform.events.refreshError, errorSpy)
                    .get(path)
                    .then(function() {
                        throw new Error('This should never be called');
                    })
                    .catch(function(e) {
                        expect(e.message).to.equal('Wrong token');
                        expect(errorSpy).to.be.calledOnce;
                        expect(successSpy).not.to.calledOnce;
                    });

            });

        });

        it('sits and waits for the queue to be released, no matter how many pending refreshes there are', function() {

            return getMock((sdk)=> {

                var queue = sdk.platform()['_queue'],
                    platform = sdk.platform();

                queue.pause();

                setTimeout(() => {
                    queue.resume();
                }, 5);

                return Promise.all([
                    platform.refresh(),
                    platform.refresh(),
                    platform.refresh()
                ]);

            });

        });

        it('handles subsequent refreshes', function() {

            return getMock((sdk)=> {

                var platform = sdk.platform();

                getRegistry()
                    .tokenRefresh()
                    .tokenRefresh()
                    .tokenRefresh();

                return platform
                    .refresh() // first
                    .then(function() {
                        return platform.refresh();  // second
                    })
                    .then(function() {
                        return Promise.all([
                            platform.refresh(),  // third combined for two
                            platform.refresh()
                        ]);
                    });

            });

        });

        it('returns error if response is malformed', function() {

            return getMock((sdk)=> {

                var platform = sdk.platform();

                getRegistry()
                    .apiCall('POST', '/restapi/oauth/token', {
                        'message': 'Wrong token',
                        'error_description': 'Wrong token',
                        'description': 'Wrong token'
                    }, 240); // This weird status was caught on client's machine

                platform.auth().cancelAccessToken();

                return platform
                    .refresh()
                    .then(function() {
                        throw new Error('This should not be reached');
                    })
                    .catch(function(e) {
                        expect(e.originalMessage).to.equal('Malformed OAuth response');
                        expect(e.message).to.equal('Wrong token');
                    });

            });

        });

        it('issues only one refresh request', function() {

            return getMock((sdk)=> {

                getRegistry()
                    .tokenRefresh()
                    .apiCall('GET', '/restapi/v1.0/foo', {increment: 1})
                    .apiCall('GET', '/restapi/v1.0/foo', {increment: 2})
                    .apiCall('GET', '/restapi/v1.0/foo', {increment: 3});

                var platform = sdk.platform();

                platform.auth().cancelAccessToken();

                return Promise
                    .all([
                        platform.get('/foo'),
                        platform.get('/foo'),
                        platform.get('/foo')
                    ])
                    .then(function(res) {
                        return res.map(r => r.json());
                    })
                    .then(function(res) {
                        expect(platform.auth().accessToken()).to.equal('ACCESS_TOKEN_FROM_REFRESH');
                        expect(res[0].increment).to.equal(1);
                        expect(res[1].increment).to.equal(2);
                        expect(res[2].increment).to.equal(3);
                    });

            });

        });

        it('immediately (synchronously) pauses', function() {

            return getMock((sdk)=> {

                var queue = sdk.platform()['_queue'],
                    platform = sdk.platform();

                getRegistry().tokenRefresh();

                var refresh = platform.refresh();

                expect(queue.isPaused()).to.equal(true);

                return refresh;

            });

        });


        it('throws error if queue was unpaused before refresh call', function() {

            return getMock((sdk)=> {

                var queue = sdk.platform()['_queue'],
                    platform = sdk.platform();

                getRegistry().tokenRefresh();

                var refresh = platform.refresh();

                queue.resume();

                return refresh
                    .then(function() {
                        throw new Error('This should not be reached');
                    })
                    .catch(function(e) {
                        expect(e.message).to.equal('Queue was resumed before refresh call');
                    });

            });

        });

    });

    describe('refreshPolling', function() {

        it('polls the status of semaphor and resumes operation', function() {

            return getMock((sdk)=> {

                var queue = sdk.platform()['_queue'],
                    platform = sdk.platform();

                queue.pause();

                setTimeout(() => {
                    queue.resume();
                }, 10);

                return platform.refresh();

            });

        });

        it('resolves with error if token is not valid after releaseTimeout', function() {

            return getMock((sdk)=> {

                var queue = sdk.platform()['_queue'],
                    platform = sdk.platform();

                queue.pause(); // resume() will not be called in this test

                platform.auth().cancelAccessToken();

                return platform
                    .refresh()
                    .then(function() {
                        throw new Error('This should not be reached');
                    })
                    .catch(function(e) {
                        expect(e.message).to.equal('Automatic authentification timeout');
                    });

            });

        });

    });

    describe('get, post, put, delete', function() {

        it('sends request using appropriate method', function() {

            return getMock((sdk)=> {

                var platform = sdk.platform();

                function test(method) {

                    var path = '/foo/' + method;

                    getRegistry().apiCall(method, path, {foo: 'bar'});

                    return platform[method](path)
                        .then(function(res) {
                            expect(res.request().method).to.equal(method.toUpperCase());
                            expect(res.json().foo).to.equal('bar');
                            return res;
                        });

                }

                return Promise.all([
                    test('get'),
                    test('post'),
                    test('put'),
                    test('delete')
                ]);

            });

        });

    });

    describe('apiUrl', function() {

        it('builds the URL', function() {

            var platform = getSdk().platform();

            expect(platform.createUrl('/foo')).to.equal('/restapi/v1.0/foo');

            expect(platform.createUrl('/foo', {addServer: true})).to.equal('http://whatever/restapi/v1.0/foo');

            expect(platform.createUrl('/foo', {
                addServer: true,
                addToken: true
            })).to.equal('http://whatever/restapi/v1.0/foo?access_token=');

            expect(platform.createUrl('/foo?bar', {
                addServer: true,
                addToken: true
            })).to.equal('http://whatever/restapi/v1.0/foo?bar&access_token=');

            expect(platform.createUrl('/foo?bar', {
                addServer: true,
                addToken: true,
                addMethod: 'POST'
            })).to.equal('http://whatever/restapi/v1.0/foo?bar&_method=POST&access_token=');

        });

    });

    //TODO Add tests for this
    describe.skip('parseAuthRedirectUrl', function() {});
    describe.skip('getAuthURL', function() {});

});
