/* eslint-disable max-params */
/* eslint-disable max-nested-callbacks */
import $ from 'jquery';
import { SDK } from '@ringcentral/sdk';
import WebPhone from '../src/index';
import incomingAudio from 'url:./audio/incoming.ogg';
import outgoingAudio from 'url:./audio/outgoing.ogg';

import 'bootstrap/dist/css/bootstrap.min.css';
import type Platform from '@ringcentral/sdk/lib/platform/Platform';
global.jQuery = $;
import('bootstrap');

$(() => {
  let sdk: SDK;
  let platform: Platform;
  let webPhone: WebPhone;

  let logLevel: 0 | 1 | 2 | 3 = 0;
  let extension: any;
  let primaryNumber: string;
  const $app = $('#app');

  const $loginTemplate = $('#template-login');
  const $authFlowTemplate = $('#template-auth-flow');
  const $callTemplate = $('#template-call');
  const $incomingTemplate = $('#template-incoming');
  const $acceptedTemplate = $('#template-accepted');

  const remoteVideoElement = document.getElementById('remoteVideo') as HTMLMediaElement;
  const localVideoElement = document.getElementById('localVideo') as HTMLMediaElement;
  let outboundCall = true;
  let confSessionId = '';

  /**
   * @param {jQuery|HTMLElement} $tpl
   * @return {jQuery|HTMLElement}
   */
  function cloneTemplate($tpl) {
    return $($tpl.html());
  }

  function login(server, clientId, clientSecret, jwtToken, ll) {
    sdk = new SDK({
      clientId,
      clientSecret,
      server,
    });

    platform = sdk.platform();

    platform
      .login({
        jwt: jwtToken,
      })
      .then(() => {
        return postLogin(server, clientId, clientSecret, jwtToken, ll);
      })
      .catch((e) => {
        console.error(e.stack || e);
      });
  }

  // Redirect function
  function show3LeggedLogin(server, clientId, clientSecret, ll) {
    const $redirectUri = decodeURIComponent(window.location.href.split('login', 1) + 'callback.html');

    console.log('The redirect uri value :', $redirectUri);

    sdk = new SDK({
      clientId,
      clientSecret,
      server,
      redirectUri: $redirectUri,
    });

    platform = sdk.platform();

    const loginUrl = platform.loginUrl();

    platform
      .loginWindow({ url: loginUrl }) // this method also allows to supply more options to control window position
      .then(platform.login.bind(platform))
      .then(() => {
        return postLogin(server, clientId, clientSecret, '', ll);
      })
      .catch((e) => {
        console.error(e.stack || e);
      });
  }

  function postLogin(server, clientId, clientSecret, jwtToken, ll) {
    logLevel = ll;

    localStorage.setItem('webPhoneServer', server || '');
    localStorage.setItem('webPhoneclientId', clientId || '');
    localStorage.setItem('webPhoneclientSecret', clientSecret || '');
    if (jwtToken && jwtToken.length > 0) {
      localStorage.setItem('webPhoneJwtToken', jwtToken);
    }
    localStorage.setItem('webPhoneLogLevel', (logLevel || 0).toString());

    return platform
      .get('/restapi/v1.0/account/~/extension/~')
      .then((res) => res.json())
      .then((res) => {
        extension = res;
        console.log('Extension info', extension);
        return platform.get('/restapi/v1.0/account/~/extension/~/phone-number');
      })
      .then((res) => res.json())
      .then((r) => {
        primaryNumber = r.records.filter((r) => r.primary === true)[0].phoneNumber;
      })
      .then(() => {
        return platform.post('/restapi/v1.0/client-info/sip-provision', {
          sipInfo: [
            {
              transport: 'WSS',
            },
          ],
        });
      })
      .then((res) => res.json())
      .then(register)
      .then(makeCallForm)
      .catch((e) => {
        console.error('Error in main promise chain');
        console.error(e.stack || e);
      });
  }

  function register(data) {
    webPhone = new WebPhone(data, {
      enableDscp: true,
      clientId: localStorage.getItem('webPhoneclientId')!,
      audioHelper: {
        enabled: true,
        incoming: incomingAudio,
        outgoing: outgoingAudio,
      },
      logLevel,
      appName: 'WebPhoneDemo',
      appVersion: '1.0.0',
      media: {
        remote: remoteVideoElement,
        local: localVideoElement,
      },
      enableQos: true,
      enableMediaReportLogging: true,
    });
    global.webPhone = webPhone; // for debugging

    webPhone.userAgent.audioHelper.setVolume(0.3);
    webPhone.userAgent.on('invite', onInvite);
    webPhone.userAgent.on('connecting', () => {
      console.log('UA connecting');
    });
    webPhone.userAgent.on('connected', () => {
      console.log('UA Connected');
    });
    webPhone.userAgent.on('disconnected', () => {
      console.log('UA Disconnected');
    });
    webPhone.userAgent.on('registered', () => {
      console.log('UA Registered');
    });
    webPhone.userAgent.on('unregistered', () => {
      console.log('UA Unregistered');
    });
    webPhone.userAgent.on('registrationFailed', function () {
      console.log('UA RegistrationFailed', arguments);
    });
    webPhone.userAgent.on('message', function () {
      console.log('UA Message', arguments);
    });
    webPhone.userAgent.transport.on('switchBackProxy', () => {
      console.log('switching back to primary outbound proxy');
      webPhone.userAgent.transport.reconnect();
    });
    webPhone.userAgent.transport.on('closed', () => {
      console.log('WebSocket closed.');
    });
    webPhone.userAgent.transport.on('transportError', () => {
      console.log('WebSocket transportError occured');
    });
    webPhone.userAgent.transport.on('wsConnectionError', () => {
      console.log('WebSocket wsConnectionError occured');
    });
    return webPhone;
  }

  function onInvite(session) {
    outboundCall = false;
    console.log('EVENT: Invite', session.request);
    console.log('To', session.request.to.displayName, session.request.to.friendlyName);
    console.log('From', session.request.from.displayName, session.request.from.friendlyName);

    if (session.request.headers['Alert-Info'] && session.request.headers['Alert-Info'][0].raw === 'Auto Answer') {
      session
        .accept()
        .then(() => {
          onAccepted(session);
        })
        .catch((e) => {
          console.error('Accept failed', e.stack || e);
        });
    } else {
      const $modal = cloneTemplate($incomingTemplate).modal({
        backdrop: 'static',
      });

      $modal.find('.answer').on('click', () => {
        $modal.find('.before-answer').css('display', 'none');
        $modal.find('.answered').css('display', '');
        session
          .accept()
          .then(() => {
            $modal.modal('hide');
            onAccepted(session);
          })
          .catch((e) => {
            console.error('Accept failed', e.stack || e);
          });
      });

      $modal.find('.decline').on('click', () => {
        session.reject();
        $modal.modal('hide');
      });

      $modal.find('.toVoicemail').on('click', () => {
        session.toVoicemail();
        $modal.modal('hide');
      });

      $modal.find('.forward-form').on('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        session
          .forward($modal.find('input[name=forward]').val().trim())
          .then(() => {
            console.log('Forwarded');
            $modal.modal('hide');
          })
          .catch((e2) => {
            console.error('Forward failed', e2.stack || e2);
          });
      });

      $modal.find('.reply-form').on('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        session
          .replyWithMessage({
            replyType: 0,
            replyText: $modal.find('input[name=reply]').val(),
          })
          .then(() => {
            console.log('Replied');
            $modal.modal('hide');
          })
          .catch((e2) => {
            console.error('Reply failed', e2.stack || e2);
          });
      });

      session.on('rejected', () => {
        $modal.modal('hide');
      });
    }
  }

  const activeCallInfoTemplate = () => ({
    id: '',
    from: '',
    to: '',
    direction: '',
    sipData: {
      toTag: '',
      fromTag: '',
    },
  });

  function captureActiveCallInfo(session) {
    const direction = outboundCall ? 'Outbound' : 'Inbound';
    const activeCallInfo = activeCallInfoTemplate();
    activeCallInfo.from = session.request.from.uri.user;
    activeCallInfo.to = session.request.to.uri.user;
    activeCallInfo.direction = direction;
    activeCallInfo.id = session.dialog.id.callId;
    activeCallInfo.sipData.fromTag = session.dialog.remoteTag;
    activeCallInfo.sipData.toTag = session.dialog.localTag;
    if (!localStorage.getItem('activeCallInfo')) {
      localStorage.setItem('activeCallInfo', JSON.stringify(activeCallInfo));
    }
  }

  function onAccepted(session) {
    console.log('EVENT: Accepted', session.request);
    console.log('To', session.request.to.displayName, session.request.to.friendlyName);
    console.log('From', session.request.from.displayName, session.request.from.friendlyName);

    const $modal = cloneTemplate($acceptedTemplate).modal();

    const $info = $modal.find('.info').eq(0);
    const $dtmf = $modal.find('input[name=dtmf]').eq(0);
    const $transfer = $modal.find('input[name=transfer]').eq(0);
    const $flip = $modal.find('input[name=flip]').eq(0);

    const interval = setInterval(() => {
      const time = session.startTime ? Math.round((Date.now() - session.startTime) / 1000) + 's' : 'Ringing';
      $info.text('time: ' + time + '\nstartTime: ' + JSON.stringify(session.startTime, null, 2) + '\n');
    }, 1000);

    function close() {
      clearInterval(interval);
      $modal.modal('hide');
    }

    $modal.find('.increase-volume').on('click', () => {
      session.userAgent.audioHelper.setVolume(
        (session.userAgent.audioHelper.volume !== null ? session.userAgent.audioHelper.volume : 0.5) + 0.1,
      );
    });

    $modal.find('.decrease-volume').on('click', () => {
      session.userAgent.audioHelper.setVolume(
        (session.userAgent.audioHelper.volume !== null ? session.userAgent.audioHelper.volume : 0.5) - 0.1,
      );
    });

    $modal.find('.mute').on('click', () => {
      session.mute();
    });

    $modal.find('.unmute').on('click', () => {
      session.unmute();
    });

    $modal.find('.hold').on('click', () => {
      session
        .hold()
        .then(() => {
          console.log('Holding');
        })
        .catch((e) => {
          console.error('Holding failed', e.stack || e);
        });
    });

    $modal.find('.unhold').on('click', () => {
      session
        .unhold()
        .then(() => {
          console.log('UnHolding');
        })
        .catch((e) => {
          console.error('UnHolding failed', e.stack || e);
        });
    });
    $modal.find('.startRecord').on('click', () => {
      session
        .startRecord()
        .then(() => {
          console.log('Recording Started');
        })
        .catch((e) => {
          console.error('Recording Start failed', e.stack || e);
        });
    });

    $modal.find('.stopRecord').on('click', () => {
      session
        .stopRecord()
        .then(() => {
          console.log('Recording Stopped');
        })
        .catch((e) => {
          console.error('Recording Stop failed', e.stack || e);
        });
    });

    $modal.find('.park').on('click', () => {
      session
        .park()
        .then(() => {
          console.log('Parked');
        })
        .catch((e) => {
          console.error('Park failed', e.stack || e);
        });
    });

    $modal.find('.transfer-form').on('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      session
        .transfer($transfer.val().trim())
        .then(() => {
          console.log('Transferred');
          $modal.modal('hide');
        })
        .catch((e2) => {
          console.error('Transfer failed', e2.stack || e2);
        });
    });

    $modal.find('.transfer-form button.warm').on('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      session.hold().then(() => {
        console.log('Placing the call on hold, initiating attended transfer');
        const newSession = session.userAgent.invite($transfer.val().trim());
        newSession.once('established', () => {
          console.log('New call initated. Click Complete to complete the transfer');
          $modal.find('.transfer-form button.complete').on('click', () => {
            session
              .warmTransfer(newSession)
              .then(() => {
                console.log('Warm transfer completed');
              })
              .catch((e2) => {
                console.error('Transfer failed', e2.stack || e2);
              });
          });
        });
      });
    });

    $modal.find('.flip-form').on('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      session
        .flip($flip.val().trim())
        .then(() => {
          console.log('Flipped');
        })
        .catch((e2) => {
          console.error('Flip failed', e2.stack || e2);
        });
      $flip.val('');
    });

    $modal.find('.dtmf-form').on('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
      session.dtmf($dtmf.val().trim());
      $dtmf.val('');
    });

    const $startConfButton = $modal.find('.startConf');

    $startConfButton.on('click', () => {
      initConference();
    });

    $modal.find('.hangup').on('click', () => {
      session.dispose();
    });

    session.on('established', () => {
      console.log('Event: Established');
      captureActiveCallInfo(session);
    });
    session.on('progress', () => {
      console.log('Event: Progress');
    });
    session.on('rejected', () => {
      console.log('Event: Rejected');
      close();
    });
    session.on('failed', function () {
      console.log('Event: Failed', arguments);
      close();
    });
    session.on('terminated', () => {
      console.log('Event: Terminated');
      localStorage.setItem('activeCallInfo', '');
      close();
    });
    session.on('cancel', () => {
      console.log('Event: Cancel');
      close();
    });
    session.on('refer', () => {
      console.log('Event: Refer');
      close();
    });
    session.on('replaced', (newSession) => {
      console.log('Event: Replaced: old session', session, 'has been replaced with', newSession);
      close();
      onAccepted(newSession);
    });
    session.on('dtmf', () => {
      console.log('Event: DTMF');
    });
    session.on('muted', () => {
      console.log('Event: Muted');
    });
    session.on('unmuted', () => {
      console.log('Event: Unmuted');
    });
    session.on('connecting', () => {
      console.log('Event: Connecting');
    });
    session.on('bye', () => {
      console.log('Event: Bye');
      close();
    });
  }

  function makeCall(number, homeCountryId) {
    outboundCall = true;
    // eslint-disable-next-line no-param-reassign
    homeCountryId = homeCountryId || extension?.regionalSettings?.homeCountry?.id || null;

    const session = webPhone.userAgent.invite(number, {
      fromNumber: primaryNumber,
      homeCountryId,
    });

    onAccepted(session);
  }

  function switchCall() {
    const activeCallItem = JSON.parse(localStorage.getItem('activeCallInfo')!);
    console.log('Switching active call to current tab: ', activeCallItem);
    const session = webPhone.userAgent.switchFrom(activeCallItem, {});
    onAccepted(session);
  }

  let onConference = false;

  function initConference() {
    if (!onConference) {
      getPresenceActiveCalls()
        .then((res) => res.json())
        .then((response) => {
          const partyId = response.activeCalls[0].partyId;
          const telephonySessionId = response.activeCalls[0].telephonySessionId;
          getConfVoiceToken().then((voiceToken) => {
            startConferenceCall(voiceToken, partyId, telephonySessionId);
            onConference = true;
          });
        });
    } else {
      alert('A conference is already in progress');
    }
  }

  function getPresenceActiveCalls() {
    return platform.get('/restapi/v1.0/account/~/extension/~/presence?detailedTelephonyState=true');
  }

  function getConfVoiceToken() {
    return platform
      .post('/restapi/v1.0/account/~/telephony/conference', {})
      .then((res) => res.json())
      .then((res) => {
        confSessionId = res.session.id;
        return res.session.voiceCallToken;
      });
  }

  function startConferenceCall(voiceToken, partyId, telephonySessionId) {
    const session = webPhone.userAgent.invite(voiceToken, {
      fromNumber: primaryNumber,
    });
    session.on('established', () => {
      onAccepted(session);
      console.log('Conference call started');
      bringIn(telephonySessionId, partyId)
        .then((res) => res.json())
        .then((response) => {
          console.log('Adding call to conference succesful', response);
        })
        .catch((e) => {
          console.error('Conference call failed', e.stack || e);
        });
    });
  }

  function bringIn(telephonySessionId, partyId) {
    const url = '/restapi/v1.0/account/~/telephony/sessions/' + confSessionId + '/parties/bring-in';
    return platform.post(url, {
      telephonySessionId: telephonySessionId,
      partyId: partyId,
    });
  }

  function makeCallForm() {
    const $form = cloneTemplate($callTemplate);

    const $number = $form.find('input[name=number]').eq(0);
    const $homeCountry = $form.find('input[name=homeCountry]').eq(0);
    const $username = $form.find('.username').eq(0);
    const $logout = $form.find('.logout').eq(0);
    const $switch = $form.find('.switch').eq(0);

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
        '<dt>From Phone Number</dt><dd>' +
        primaryNumber +
        '</dd>' +
        '</dl>',
    );

    $logout.on('click', (e) => {
      webPhone.userAgent.unregister();
      e.preventDefault();
      location.reload();
    });

    $switch.on('click', () => {
      switchCall();
    });

    $number.val(localStorage.getItem('webPhoneLastNumber') || '');

    $form.on('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();

      localStorage.setItem('webPhoneLastNumber', $number.val() || '');

      makeCall($number.val(), $homeCountry.val());
    });

    $app.empty().append($form);
  }

  function makeLoginForm() {
    const $form = cloneTemplate($loginTemplate);
    const $authForm = cloneTemplate($authFlowTemplate);

    const $server = $authForm.find('input[name=server]').eq(0);
    const $clientId = $authForm.find('input[name=clientId]').eq(0);
    const $clientSecret = $authForm.find('input[name=clientSecret]').eq(0);
    const $jwtToken = $form.find('input[name=jwtToken]').eq(0);
    const $logLevel = $authForm.find('select[name=logLevel]').eq(0);

    $server.val(localStorage.getItem('webPhoneServer') || SDK.server.sandbox);
    $clientId.val(localStorage.getItem('webPhoneclientId') || '');
    $clientSecret.val(localStorage.getItem('webPhoneclientSecret') || '');
    $jwtToken.val(localStorage.getItem('webPhoneJwtToken') || '');
    $logLevel.val(localStorage.getItem('webPhoneLogLevel') || logLevel);

    $form.on('submit', (e) => {
      console.log('Normal Flow');

      e.preventDefault();
      e.stopPropagation();

      login($server.val(), $clientId.val(), $clientSecret.val(), $jwtToken.val(), $logLevel.val());
    });
    //
    $authForm.on('submit', (e) => {
      console.log('Authorized Flow');

      e.preventDefault();
      e.stopPropagation();

      show3LeggedLogin($server.val(), $clientId.val(), $clientSecret.val(), $logLevel.val());
    });

    $app.empty().append($authForm).append($form);
  }

  makeLoginForm();
});
