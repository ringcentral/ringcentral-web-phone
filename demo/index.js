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

    function login(server, appKey, appSecret, login, ext, password) {

        sdk = new RingCentral.SDK({
            appKey: appKey,
            appSecret: appSecret,
            server: server
        });

        platform = sdk.platform();

        platform
            .login({
                username: login,
                password: password
            })
            .then(function() {

                localStorage.setItem('webPhoneAppKey', appKey || '');
                localStorage.setItem('webPhoneAppSecret', appSecret || '');
                localStorage.setItem('webPhoneLogin', login || '');
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
                console.error(e);
            });

    }

    function register(data) {

        sipInfo = data.sipInfo[0] || data.sipInfo;

        webPhone = new WebPhone(data);

        webPhone.userAgent.on('invite', onInvite);
        webPhone.userAgent.on('connected', function() { console.log('UA Connected'); });
        webPhone.userAgent.on('registered', function() { console.log('UA Registered'); });

        return webPhone;

    }

    function onInvite(session) {

        console.log('EVENT: Invite', session.request);
        console.log('To', session.request.to.displayName, session.request.to.friendlyName);
        console.log('From', session.request.from.displayName, session.request.from.friendlyName);

        var $modal = $('<div class="modal fade" tabindex="-1" role="dialog">' +
                       '    <div class="modal-dialog">' +
                       '        <div class="modal-content">' +
                       '            <div class="modal-header">' +
                       '                <h4 class="modal-title">Incoming Call</h4>' +
                       '            </div>' +
                       '        <div class="modal-body">' +
                       '            <form class="form-inline forward-form">' +
                       '                <div class="form-group">' +
                       '                    <label>Forward To:</label>' +
                       '                    <input type="text" class="form-control" name="forward" placeholder="">' +
                       '                </div>' +
                       '                <button class="btn btn-primary" type="submit">Forward</button>' +
                       '            </form>' +
                       '        </div>' +
                       '        <div class="modal-footer">' +
                       '            <button class="btn btn-success answer">Answer</button>' +
                       '            <button class="btn btn-danger decline">Decline</button>' +
                       '        </div>' +
                       '    </div>' +
                       '</div>').modal({backdrop: 'static'});

        var acceptOptions = {
            media: {
                render: {
                    remote: document.getElementById('remoteVideo'),
                    local: document.getElementById('localVideo')
                }
            }
        };

        $modal.find('.answer').on('click', function() {
            session.on('accepted', function() {
                $modal.modal('hide');
                onAccepted(session);
            });
            session.accept(acceptOptions);
        });

        $modal.find('.decline').on('click', function() {
            session.reject();
        });

        $modal.find('.forward-form').on('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            webPhone.forward(session, $modal.find('input[name=forward]').val().trim(), acceptOptions)
                .then(function() {
                    console.log('Forwarded');
                    $modal.modal('hide');
                })
                .catch(function(e) { console.error('Forward failed', e); });
        });

        session.on('rejected', function() {
            $modal.modal('hide');
        });

    }

    function onAccepted(session) {

        console.log('EVENT: Accepted', session.request);
        console.log('To', session.request.to.displayName, session.request.to.friendlyName);
        console.log('From', session.request.from.displayName, session.request.from.friendlyName);

        var $modal = $('<div class="modal fade" tabindex="-1" role="dialog">' +
                       '    <div class="modal-dialog modal-lg">' +
                       '        <div class="modal-content">' +
                       '            <div class="modal-header">' +
                       '                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                       '                <h4 class="modal-title">Call In Progress</h4>' +
                       '            </div>' +
                       '        <div class="modal-body">' +
                       '            <div class="btn-toolbar">' +
                       '                <span class="btn-group">' +
                       '                    <button class="btn btn-default mute">Mute</button>' +
                       '                    <button class="btn btn-default unmute">UnMute</button>' +
                       '                </span>' +
                       '                <span class="btn-group">' +
                       '                     <button class="btn btn-default hold">Hold</button>' +
                       '                     <button class="btn btn-default unhold">UnHold</button>' +
                       '                </span>' +
                       '                <span class="btn-group">' +
                       '                     <button class="btn btn-default startRecord">Start Recording</button>' +
                       '                     <button class="btn btn-default stopRecord">Stop Recording</button>' +
                       '                </span>' +
                       '                <span class="btn-group">' +
                       '                     <button class="btn btn-default park">Park</button>' +
                       '                </span>' +
                       '            </div>' +
                       '            <hr/>' +
                       '            <form class="form-inline flip-form">' +
                       '                <div class="form-group">' +
                       '                    <label>Flip:</label>' +
                       '                    <input type="text" class="form-control" name="flip" placeholder="1 ... 8">' +
                       '                </div>' +
                       '                <button class="btn btn-primary" type="submit">Flip</button>' +
                       '            </form>' +
                       '            <hr/>' +
                       '            <form class="form-inline transfer-form">' +
                       '                <div class="form-group">' +
                       '                    <label>Transfer:</label>' +
                       '                    <input type="text" class="form-control" name="transfer" placeholder="+1 234 567-8900">' +
                       '                </div>' +
                       '                <button class="btn btn-primary" type="submit">Transfer</button>' +
                       '            </form>' +
                       '            <hr/>' +
                       '            <form class="form-inline dtmf-form">' +
                       '                <div class="form-group">' +
                       '                    <label>DTMF:</label>' +
                       '                    <input type="text" class="form-control" name="dtmf" placeholder="">' +
                       '                </div>' +
                       '                <button class="btn btn-primary" type="submit">Send</button>' +
                       '            </form>' +
                       '            <hr/>' +
                       '            <pre class="info"></pre>' +
                       '        </div>' +
                       '        <div class="modal-footer">' +
                       '            <button class="btn btn-danger hangup">Hang Up</button>' +
                       '        </div>' +
                       '    </div>' +
                       '</div>').modal();

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
            webPhone.setHold(session, true).then(function() { console.log('Holding'); }).catch(function(e) { console.error('Holding failed', e); });
        });

        $modal.find('.unhold').on('click', function() {
            webPhone.setHold(session, false).then(function() { console.log('Holding'); }).catch(function(e) { console.error('Holding failed', e); });
        });
        $modal.find('.startRecord').on('click', function() {
            webPhone.record(session, true).then(function() { console.log('Recording Started'); }).catch(function(e) { console.error('Recording Start failed', e); });
        });

        $modal.find('.stopRecord').on('click', function() {
            webPhone.record(session, false).then(function() { console.log('Recording Stopped'); }).catch(function(e) { console.error('Recording Stop failed', e); });
        });

        $modal.find('.park').on('click', function() {
            webPhone.park(session).then(function() { console.log('Parked'); }).catch(function(e) { console.error('Park failed', e); });
        });

        $modal.find('.transfer-form').on('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            webPhone.transfer(session, $transfer.val().trim()).then(function() { console.log('Transferred'); }).catch(function(e) { console.error('Transfer failed', e); });
            $transfer.val('');
        });

        $modal.find('.flip-form').on('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            webPhone.flip(session, $flip.val().trim()).then(function() { console.log('Flipped'); }).catch(function(e) { console.error('Flip failed', e); });
            $flip.val('');
        });

        $modal.find('.dtmf-form').on('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            webPhone.dtmf(session, $dtmf.val().trim());
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
        session.on('dtmf', function() { log('Event: DTMF'); });
        session.on('muted', function() { log('Event: Muted'); });
        session.on('unmuted', function() { log('Event: Unmuted'); });
        session.on('bye', function() {
            console.log('Event: Bye');
            close();
        });

    }

    function makeCall(number) {

        var homeCountry = (extension && extension.regionalSettings && extension.regionalSettings.homeCountry)
            ? extension.regionalSettings.homeCountry.id
            : null;

        var headers = [];

        headers.push('P-Asserted-Identity: sip:18559978182@' + sipInfo.domain);
        if (homeCountry) {
            headers.push('P-rc-country-id: ' + homeCountry);
        }

        var session = webPhone.userAgent.invite(number, {
            media: {
                constraints: {
                    audio: true,
                    video: false
                },
                render: {
                    remote: document.getElementById('remoteVideo'),
                    local: document.getElementById('localVideo')
                }
            },
            RTCConstraints: {
                "optional": [
                    {'DtlsSrtpKeyAgreement': 'true'}
                ]
            },
            extraHeaders: headers
        });

        onAccepted(session);

    }

    function makeCallForm() {

        var $form = $('<form class="panel panel-default">' +
                      '    <div class="panel-heading"><h3 class="panel-title">Make A Call</h3></div>' +
                      '    <div class="panel-body">' +
                      '        <div class="form-inline">' +
                      '            <div class="form-group">' +
                      '                <label>Phone Number:</label>' +
                      '                <input type="text" class="form-control" name="number" placeholder="+1 (234) 567-8901">' +
                      '            </div>' +
                      '            <button class="btn btn-primary" type="submit">Call</button>' +
                      '        </div>' +
                      '    </div>' +
                      '</form>');

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

        var $form = $('<form class="panel panel-default">' +
                      '    <div class="panel-heading"><h3 class="panel-title">Login</h3></div>' +
                      '    <div class="panel-body">' +
                      '        <div class="form-group">' +
                      '            <label>Server:</label>' +
                      '            <input type="text" class="form-control" name="server">' +
                      '        </div>' +
                      '        <div class="form-group">' +
                      '            <label>App Key:</label>' +
                      '            <input type="text" class="form-control" name="appKey">' +
                      '        </div>' +
                      '        <div class="form-group">' +
                      '            <label>App Secret:</label>' +
                      '            <input type="text" class="form-control" name="appSecret">' +
                      '        </div>' +
                      '        <div class="form-group">' +
                      '            <label>Login:</label>' +
                      '            <input type="text" class="form-control" name="login" placeholder="18881234567">' +
                      '        </div>' +
                      '        <div class="form-group">' +
                      '            <label>Extension:</label>' +
                      '            <input type="text" class="form-control" name="username" placeholder="101">' +
                      '        </div>' +
                      '        <div class="form-group">' +
                      '            <label>Password:</label>' +
                      '            <input type="password" class="form-control" name="password">' +
                      '        </div>' +
                      '    </div>' +
                      '    <div class="panel-footer">' +
                      '        <button class="btn btn-primary" type="submit">Login</button>' +
                      '    </div>' +
                      '</form>');

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