$(function() {

    /** @type {RingCentral.SDK} */
    var sdk = null;
    /** @type {Platform} */
    var platform = null;
    /** @type {WebPhone} */
    var webPhone = null;

    var extension = null;
    var sipInfo = null;
    var $app = $('#app');

    var $loginTemplate = $('#template-login');
    var $callTemplate = $('#template-call');
    var $incomingTemplate = $('#template-incoming');
    var $acceptedTemplate = $('#template-accepted');

    /**
     * @param {jQuery|HTMLElement} $tpl
     * @return {jQuery|HTMLElement}
     */
    function cloneTemplate($tpl) {
        return $($tpl.html());
    }

    function login(server, appKey, appSecret, username, ext, password) {

        sdk = new RingCentral.SDK({
            appKey: appKey,
            appSecret: appSecret,
            server: server
        });

        platform = sdk.platform();

        platform
            .login({
                username: username,
                extension: ext || null,
                password: password
            })
            .then(function() {

                localStorage.setItem('webPhoneAppKey', appKey || '');
                localStorage.setItem('webPhoneAppSecret', appSecret || '');
                localStorage.setItem('webPhoneLogin', username || '');
                localStorage.setItem('webPhoneExtension', ext || '');
                localStorage.setItem('webPhonePassword', password || '');

                return platform.get('/restapi/v1.0/account/~/extension/~');

            })
            .then(function(res) {

                extension = res.json();

                console.log('Extension info', extension);

                return platform.post('/client-info/sip-provision', {
                    sipInfo: [{
                        transport: 'WSS'
                    }]
                });

            })
            .then(function(res) { return res.json(); })
            .then(register)
            .then(makeCallForm)
            .catch(function(e) {
                console.error('Error in main promise chain');
                console.error(e.stack || e);
            });

    }

    function register(data) {

        sipInfo = data.sipInfo[0] || data.sipInfo;

        webPhone = new WebPhone(data,{appKey : localStorage.getItem('webPhoneAppKey')});

        webPhone.userAgent.on('invite', onInvite);
        webPhone.userAgent.on('connected', function() { console.log('UA Connected'); });
        webPhone.userAgent.on('registered', function() { console.log('UA Registered'); });

        return webPhone;

    }

    function onInvite(session) {

        console.log('EVENT: Invite', session.request);
        console.log('To', session.request.to.displayName, session.request.to.friendlyName);
        console.log('From', session.request.from.displayName, session.request.from.friendlyName);

        var $modal = cloneTemplate($incomingTemplate).modal({backdrop: 'static'});

        var acceptOptions = {
            media: {
                render: {
                    remote: document.getElementById('remoteVideo'),
                    local: document.getElementById('localVideo')
                }
            }
        };

        $modal.find('.answer').on('click', function() {
            session.accept(acceptOptions)
                .then(function() {
                    $modal.modal('hide');
                    onAccepted(session);
                })
                .catch(function(e) { console.error('Accept failed', e.stack || e); });
        });

        $modal.find('.decline').on('click', function() {
            session.reject();
        });

        $modal.find('.forward-form').on('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            session.forward($modal.find('input[name=forward]').val().trim(), acceptOptions)
                .then(function() {
                    console.log('Forwarded');
                    $modal.modal('hide');
                })
                .catch(function(e) { console.error('Forward failed', e.stack || e); });
        });

        session.on('rejected', function() {
            $modal.modal('hide');
        });

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

            var time = session.startTime ? (Math.round((Date.now() - session.startTime) / 1000) + 's') : 'Ringing';

            $info.text(
                'time: ' + time + '\n' +
                'startTime: ' + JSON.stringify(session.startTime, null, 2) + '\n'
            );

        }, 1000);

        function close() {
            clearInterval(interval);
            $modal.modal('hide');
        }

        $modal.find('.mute').on('click', function() {
            session.mute();
        });

        $modal.find('.unmute').on('click', function() {
            session.unmute();
        });

        $modal.find('.hold').on('click', function() {
            session.hold().then(function() { console.log('Holding'); }).catch(function(e) { console.error('Holding failed', e.stack || e); });
        });

        $modal.find('.unhold').on('click', function() {
            session.unhold().then(function() { console.log('UnHolding'); }).catch(function(e) { console.error('UnHolding failed', e.stack || e); });
        });
        $modal.find('.startRecord').on('click', function() {
            session.startRecord().then(function() { console.log('Recording Started'); }).catch(function(e) { console.error('Recording Start failed', e.stack || e); });
        });

        $modal.find('.stopRecord').on('click', function() {
            session.stopRecord().then(function() { console.log('Recording Stopped'); }).catch(function(e) { console.error('Recording Stop failed', e.stack || e); });
        });

        $modal.find('.park').on('click', function() {
            session.park().then(function() { console.log('Parked'); }).catch(function(e) { console.error('Park failed', e.stack || e); });
        });

        $modal.find('.transfer-form').on('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            session.transfer($transfer.val().trim()).then(function() { console.log('Transferred'); }).catch(function(e) { console.error('Transfer failed', e.stack || e); });
            $transfer.val('');
        });

        $modal.find('.flip-form').on('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            session.flip($flip.val().trim()).then(function() { console.log('Flipped'); }).catch(function(e) { console.error('Flip failed', e.stack || e); });
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

        session.on('accepted', function() { console.log('Event: Accepted'); });
        session.on('progress', function() { console.log('Event: Progress'); });
        session.on('rejected', function() {
            console.log('Event: Rejected');
            close();
        });
        session.on('failed', function() {
            console.log('Event: Failed');
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
        session.on('dtmf', function() { console.log('Event: DTMF'); });
        session.on('muted', function() { console.log('Event: Muted'); });
        session.on('unmuted', function() { console.log('Event: Unmuted'); });
        session.on('bye', function() {
            console.log('Event: Bye');
            close();
        });

    }

    function makeCall(number) {

        var homeCountry = (extension && extension.regionalSettings && extension.regionalSettings.homeCountry)
            ? extension.regionalSettings.homeCountry.id
            : null;

        var session = webPhone.userAgent.invite(number, {
            media: {
                render: {
                    remote: document.getElementById('remoteVideo'),
                    local: document.getElementById('localVideo')
                }
            },
            homeCountryId: homeCountry
        });

        onAccepted(session);

    }

    function makeCallForm() {

        var $form = cloneTemplate($callTemplate);

        var $number = $form.find('input[name=number]').eq(0);

        $number.val(localStorage.getItem('webPhoneLastNumber') || '');

        $form.on('submit', function(e) {

            e.preventDefault();
            e.stopPropagation();

            localStorage.setItem('webPhoneLastNumber', $number.val() || '');

            makeCall($number.val());

        });

        $app.empty().append($form);

    }

    function makeLoginForm() {

        var $form = cloneTemplate($loginTemplate);

        var $server = $form.find('input[name=server]').eq(0);
        var $appKey = $form.find('input[name=appKey]').eq(0);
        var $appSecret = $form.find('input[name=appSecret]').eq(0);
        var $login = $form.find('input[name=login]').eq(0);
        var $ext = $form.find('input[name=extension]').eq(0);
        var $password = $form.find('input[name=password]').eq(0);

        $server.val(localStorage.getItem('webPhoneServer') || RingCentral.SDK.server.sandbox);
        $appKey.val(localStorage.getItem('webPhoneAppKey') || '');
        $appSecret.val(localStorage.getItem('webPhoneAppSecret') || '');
        $login.val(localStorage.getItem('webPhoneLogin') || '');
        $ext.val(localStorage.getItem('webPhoneExtension') || '');
        $password.val(localStorage.getItem('webPhonePassword') || '');

        $form.on('submit', function(e) {

            e.preventDefault();
            e.stopPropagation();

            login($server.val(), $appKey.val(), $appSecret.val(), $login.val(), $ext.val(), $password.val());

        });

        $app.empty().append($form);

    }

    makeLoginForm();

});