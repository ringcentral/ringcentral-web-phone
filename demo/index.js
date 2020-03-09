const SIP = require('sip.js');
const getStats = require('getstats');
const $ = require('jquery');

window.jQuery = $;
window.getStats = getStats;
window.SIP = SIP;

$(function() {
    const bootstrap = require('bootstrap');
    const SDK = require('ringcentral');
    const WebPhone = require('ringcentral-web-phone') || window.RingCentral.WebPhone;

    /** @type {SDK} */
    var sdk = null;
    var platform = null;
    /** @type {WebPhone} */
    var webPhone = null;

    var logLevel = 0;
    var username = null;
    var extension = null;
    var sipInfo = null;
    var $app = $('#app');

    var $loginTemplate = $('#template-login');
    var $authFlowTemplate = $('#template-auth-flow');
    var $callTemplate = $('#template-call');
    var $incomingTemplate = $('#template-incoming');
    var $acceptedTemplate = $('#template-accepted');

    var remoteVideoElement = document.getElementById('remoteVideo');
    var localVideoElement = document.getElementById('localVideo');

    /**
     * @param {jQuery|HTMLElement} $tpl
     * @return {jQuery|HTMLElement}
     */
    function cloneTemplate($tpl) {
        return $($tpl.html());
    }

    function login(server, appKey, appSecret, login, ext, password, ll) {
        sdk = new SDK({
            appKey,
            appSecret,
            server
        });

        platform = sdk.platform();

        // TODO: Improve later to support international phone number country codes better
        if (login) {
            login = login.match(/^[+1]/) ? login : '1' + login;
            login = login.replace(/\W/g, '');
        }

        platform
            .login({
                username: login,
                extension: ext || null,
                password
            })
            .then(function() {
                return postLogin(server, appKey, appSecret, login, ext, password, ll);
            })
            .catch(function(e) {
                console.error(e.stack || e);
            });
    }

    // Redirect function
    function show3LeggedLogin(server, appKey, appSecret, ll) {
        var $redirectUri = decodeURIComponent(window.location.href.split('login', 1) + 'callback.html');

        console.log('The redirect uri value :', $redirectUri);

        sdk = new SDK({
            appKey,
            appSecret,
            server,
            redirectUri: $redirectUri
        });

        platform = sdk.platform();

        var loginUrl = platform.loginUrl();

        platform
            .loginWindow({url: loginUrl}) // this method also allows to supply more options to control window position
            .then(platform.login.bind(platform))
            .then(function() {
                return postLogin(server, appKey, appSecret, '', '', '', ll);
            })
            .catch(function(e) {
                console.error(e.stack || e);
            });
    }

    function postLogin(server, appKey, appSecret, login, ext, password, ll) {
        logLevel = ll;
        username = login;

        localStorage.setItem('webPhoneServer', server || '');
        localStorage.setItem('webPhoneAppKey', appKey || '');
        localStorage.setItem('webPhoneAppSecret', appSecret || '');
        localStorage.setItem('webPhoneLogin', login || '');
        localStorage.setItem('webPhoneExtension', ext || '');
        localStorage.setItem('webPhonePassword', password || '');
        localStorage.setItem('webPhoneLogLevel', logLevel || 0);

        return platform
            .get('/restapi/v1.0/account/~/extension/~')
            .then(function(res) {
                extension = res.json();

                console.log('Extension info', extension);

                return platform.post('/client-info/sip-provision', {
                    sipInfo: [
                        {
                            transport: 'WSS'
                        }
                    ]
                });
            })
            .then(function(res) {
                return res.json();
            })
            .then(register)
            .then(makeCallForm)
            .catch(function(e) {
                console.error('Error in main promise chain');
                console.error(e.stack || e);
            });
    }

    function register(data) {
        sipInfo = data.sipInfo[0] || data.sipInfo;

        webPhone = new WebPhone(data, {
            appKey: localStorage.getItem('webPhoneAppKey'),
            audioHelper: {
                enabled: true
            },
            logLevel: parseInt(logLevel, 10),
            appName: 'WebPhoneDemo',
            appVersion: '1.0.0',
            media: {
                remote: remoteVideoElement,
                local: localVideoElement
            },
            enableQos: true,
            enableMediaReportLogging: true
        });

        webPhone.userAgent.audioHelper.loadAudio({
            incoming: 'audio/incoming.ogg',
            outgoing: 'audio/outgoing.ogg'
        });

        webPhone.userAgent.audioHelper.setVolume(0.3);
        webPhone.userAgent.on('invite', onInvite);
        webPhone.userAgent.on('connecting', function() {
            console.log('UA connecting');
        });
        webPhone.userAgent.on('connected', function() {
            console.log('UA Connected');
        });
        webPhone.userAgent.on('disconnected', function() {
            console.log('UA Disconnected');
        });
        webPhone.userAgent.on('registered', function() {
            console.log('UA Registered');
        });
        webPhone.userAgent.on('unregistered', function() {
            console.log('UA Unregistered');
        });
        webPhone.userAgent.on('registrationFailed', function() {
            console.log('UA RegistrationFailed', arguments);
        });
        webPhone.userAgent.on('message', function() {
            console.log('UA Message', arguments);
        });
        webPhone.userAgent.transport.on('switchBackProxy', function() {
            console.log('switching back to primary outbound proxy');
            webPhone.userAgent.transport.reconnect(true);
        });
        webPhone.userAgent.transport.on('closed', function() {
            console.log('WebSocket closed.');
        });
        webPhone.userAgent.transport.on('transportError', function() {
            console.log('WebSocket transportError occured');
        });
        webPhone.userAgent.transport.on('wsConnectionError', function() {
            console.log('WebSocket wsConnectionError occured');
        });
        return webPhone;
    }

    function onInvite(session) {
        console.log('EVENT: Invite', session.request);
        console.log('To', session.request.to.displayName, session.request.to.friendlyName);
        console.log('From', session.request.from.displayName, session.request.from.friendlyName);

        if (session.request.headers['Alert-Info'] && session.request.headers['Alert-Info'][0].raw === 'Auto Answer') {
            session
                .accept()
                .then(function() {
                    onAccepted(session);
                })
                .catch(function(e) {
                    console.error('Accept failed', e.stack || e);
                });
        } else {
            var $modal = cloneTemplate($incomingTemplate).modal({
                backdrop: 'static'
            });

            $modal.find('.answer').on('click', function() {
                $modal.find('.before-answer').css('display', 'none');
                $modal.find('.answered').css('display', '');
                session
                    .accept()
                    .then(function() {
                        $modal.modal('hide');
                        onAccepted(session);
                    })
                    .catch(function(e) {
                        console.error('Accept failed', e.stack || e);
                    });
            });

            $modal.find('.decline').on('click', function() {
                session.reject();
            });

            $modal.find('.toVoicemail').on('click', function() {
                session.toVoicemail();
            });

            $modal.find('.forward-form').on('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                session
                    .forward(
                        $modal
                            .find('input[name=forward]')
                            .val()
                            .trim()
                    )
                    .then(function() {
                        console.log('Forwarded');
                        $modal.modal('hide');
                    })
                    .catch(function(e) {
                        console.error('Forward failed', e.stack || e);
                    });
            });

            $modal.find('.reply-form').on('submit', function(e) {
                e.preventDefault();
                e.stopPropagation();
                session
                    .replyWithMessage({
                        replyType: 0,
                        replyText: $modal.find('input[name=reply]').val()
                    })
                    .then(function() {
                        console.log('Replied');
                        $modal.modal('hide');
                    })
                    .catch(function(e) {
                        console.error('Reply failed', e.stack || e);
                    });
            });

            session.on('rejected', function() {
                $modal.modal('hide');
            });
        }
    }

    function onAccepted(session) {
        console.log('EVENT: Accepted', session.request);
        console.log('To', session.request.to.displayName, session.request.to.friendlyName);
        console.log('From', session.request.from.displayName, session.request.from.friendlyName);

        var $modal = cloneTemplate($acceptedTemplate).modal();

        var $info = $modal.find('.info').eq(0);
        var $dtmf = $modal.find('input[name=dtmf]').eq(0);
        var $transfer = $modal.find('input[name=transfer]').eq(0);
        var $flip = $modal.find('input[name=flip]').eq(0);

        var interval = setInterval(function() {
            var time = session.startTime ? Math.round((Date.now() - session.startTime) / 1000) + 's' : 'Ringing';

            $info.text('time: ' + time + '\n' + 'startTime: ' + JSON.stringify(session.startTime, null, 2) + '\n');
        }, 1000);

        function close() {
            clearInterval(interval);
            $modal.modal('hide');
        }

        $modal.find('.increase-volume').on('click', function() {
            session.ua.audioHelper.setVolume(
                (session.ua.audioHelper.volume !== null ? session.ua.audioHelper.volume : 0.5) + 0.1
            );
        });

        $modal.find('.decrease-volume').on('click', function() {
            session.ua.audioHelper.setVolume(
                (session.ua.audioHelper.volume !== null ? session.ua.audioHelper.volume : 0.5) - 0.1
            );
        });

        $modal.find('.mute').on('click', function() {
            session.mute();
        });

        $modal.find('.unmute').on('click', function() {
            session.unmute();
        });

        $modal.find('.hold').on('click', function() {
            session
                .hold()
                .then(function() {
                    console.log('Holding');
                })
                .catch(function(e) {
                    console.error('Holding failed', e.stack || e);
                });
        });

        $modal.find('.unhold').on('click', function() {
            session
                .unhold()
                .then(function() {
                    console.log('UnHolding');
                })
                .catch(function(e) {
                    console.error('UnHolding failed', e.stack || e);
                });
        });
        $modal.find('.startRecord').on('click', function() {
            session
                .startRecord()
                .then(function() {
                    console.log('Recording Started');
                })
                .catch(function(e) {
                    console.error('Recording Start failed', e.stack || e);
                });
        });

        $modal.find('.stopRecord').on('click', function() {
            session
                .stopRecord()
                .then(function() {
                    console.log('Recording Stopped');
                })
                .catch(function(e) {
                    console.error('Recording Stop failed', e.stack || e);
                });
        });

        $modal.find('.park').on('click', function() {
            session
                .park()
                .then(function() {
                    console.log('Parked');
                })
                .catch(function(e) {
                    console.error('Park failed', e.stack || e);
                });
        });

        $modal.find('.transfer-form').on('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            session
                .transfer($transfer.val().trim())
                .then(function() {
                    console.log('Transferred');
                })
                .catch(function(e) {
                    console.error('Transfer failed', e.stack || e);
                });
        });

        $modal.find('.transfer-form button.warm').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            session.hold().then(function() {
                console.log('Placing the call on hold, initiating attended transfer');
                var newSession = session.ua.invite($transfer.val().trim());
                newSession.once('accepted', function() {
                    console.log('New call initated. Click Complete to complete the transfer');
                    $modal.find('.transfer-form button.complete').on('click', function(e) {
                        session
                            .warmTransfer(newSession)
                            .then(function() {
                                console.log('Warm transfer completed');
                            })
                            .catch(function(e) {
                                console.error('Transfer failed', e.stack || e);
                            });
                    });
                });
            });
        });

        $modal.find('.flip-form').on('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            session
                .flip($flip.val().trim())
                .then(function() {
                    console.log('Flipped');
                })
                .catch(function(e) {
                    console.error('Flip failed', e.stack || e);
                });
            $flip.val('');
        });

        $modal.find('.dtmf-form').on('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            session.dtmf($dtmf.val().trim());
            $dtmf.val('');
        });

        $modal.find('.hangup').on('click', function() {
            session.terminate();
        });

        session.on('accepted', function() {
            console.log('Event: Accepted');
        });
        session.on('progress', function() {
            console.log('Event: Progress');
        });
        session.on('rejected', function() {
            console.log('Event: Rejected');
            close();
        });
        session.on('failed', function() {
            console.log('Event: Failed', arguments);
            close();
        });
        session.on('terminated', function() {
            console.log('Event: Terminated');
            close();
        });
        session.on('cancel', function() {
            console.log('Event: Cancel');
            close();
        });
        session.on('refer', function() {
            console.log('Event: Refer');
            close();
        });
        session.on('replaced', function(newSession) {
            console.log('Event: Replaced: old session', session, 'has been replaced with', newSession);
            close();
            onAccepted(newSession);
        });
        session.on('dtmf', function() {
            console.log('Event: DTMF');
        });
        session.on('muted', function() {
            console.log('Event: Muted');
        });
        session.on('unmuted', function() {
            console.log('Event: Unmuted');
        });
        session.on('connecting', function() {
            console.log('Event: Connecting');
        });
        session.on('bye', function() {
            console.log('Event: Bye');
            close();
        });
    }

    function makeCall(number, homeCountryId) {
        homeCountryId =
            homeCountryId ||
            (extension &&
                extension.regionalSettings &&
                extension.regionalSettings.homeCountry &&
                extension.regionalSettings.homeCountry.id) ||
            null;

        var session = webPhone.userAgent.invite(number, {
            fromNumber: username,
            homeCountryId
        });

        onAccepted(session);
    }

    function makeCallForm() {
        var $form = cloneTemplate($callTemplate);

        var $number = $form.find('input[name=number]').eq(0);
        var $homeCountry = $form.find('input[name=homeCountry]').eq(0);
        var $username = $form.find('.username').eq(0);
        var $logout = $form.find('.logout').eq(0);

        $username.html(
            '<dl>' +
                '<dt>Contact</dt><dd>' +
                extension.contact.firstName +
                ' ' +
                extension.contact.lastName +
                '</dd>' +
                '<dt>Company</dt><dd>' +
                (extension.contact.company || '?') +
                '</dd>' +
                '<dt>Phone Number</dt><dd>' +
                username +
                '</dd>' +
                '</dl>'
        );

        $logout.on('click', function(e) {
            webPhone.userAgent.unregister();
            e.preventDefault();
            location.reload();
        });

        $number.val(localStorage.getItem('webPhoneLastNumber') || '');

        $form.on('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();

            localStorage.setItem('webPhoneLastNumber', $number.val() || '');

            makeCall($number.val(), $homeCountry.val());
        });

        $app.empty().append($form);
    }

    function makeLoginForm() {
        var $form = cloneTemplate($loginTemplate);
        var $authForm = cloneTemplate($authFlowTemplate);

        var $server = $authForm.find('input[name=server]').eq(0);
        var $appKey = $authForm.find('input[name=appKey]').eq(0);
        var $appSecret = $authForm.find('input[name=appSecret]').eq(0);
        var $login = $form.find('input[name=login]').eq(0);
        var $ext = $form.find('input[name=extension]').eq(0);
        var $password = $form.find('input[name=password]').eq(0);
        var $logLevel = $authForm.find('select[name=logLevel]').eq(0);

        $server.val(localStorage.getItem('webPhoneServer') || SDK.server.sandbox);
        $appKey.val(localStorage.getItem('webPhoneAppKey') || '');
        $appSecret.val(localStorage.getItem('webPhoneAppSecret') || '');
        $login.val(localStorage.getItem('webPhoneLogin') || '');
        $ext.val(localStorage.getItem('webPhoneExtension') || '');
        $password.val(localStorage.getItem('webPhonePassword') || '');
        $logLevel.val(localStorage.getItem('webPhoneLogLevel') || logLevel);

        $form.on('submit', function(e) {
            console.log('Normal Flow');

            e.preventDefault();
            e.stopPropagation();

            login(
                $server.val(),
                $appKey.val(),
                $appSecret.val(),
                $login.val(),
                $ext.val(),
                $password.val(),
                $logLevel.val()
            );
        });
        //
        $authForm.on('submit', function(e) {
            console.log('Authorized Flow');

            e.preventDefault();
            e.stopPropagation();

            show3LeggedLogin($server.val(), $appKey.val(), $appSecret.val(), $logLevel.val());
        });

        $app.empty()
            .append($authForm)
            .append($form);
    }

    makeLoginForm();
});
