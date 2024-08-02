import RingCentral from '@rc-ex/core';
import { message } from 'antd';
import AuthorizeUriExtension from '@rc-ex/authorize-uri';
import type GetExtensionInfoResponse from '@rc-ex/core/lib/definitions/GetExtensionInfoResponse';

import afterLogin from '../actions/after-login';
import type WebPhone from '../web-phone';
import type CallSession from '../call-session';

export class Store {
  public rcToken = '';
  public refreshToken = '';
  public server = 'https://platform.ringcentral.com';
  public clientId = '';
  public clientSecret = '';
  public jwtToken = '';
  public extInfo: GetExtensionInfoResponse;
  public primaryNumber = '';
  public callerIds: string[] = [];

  public webPhone: WebPhone; // reference but do not track. Ref: https://github.com/tylerlong/manate?tab=readme-ov-file#reference-but-do-not-track
  public callSessions: CallSession[] = [];

  public addCallSession(callSession: CallSession) {
    this.callSessions.push(callSession);
    callSession.once('disposed', () => {
      this.callSessions = this.callSessions.filter((cs) => cs.callId !== callSession.callId);
    });
  }

  public async logout() {
    const rc = new RingCentral({
      server: this.server,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });
    rc.token = { access_token: this.rcToken, refresh_token: this.refreshToken };
    await rc.revoke();
    this.rcToken = '';
    this.refreshToken = '';
    location.reload();
  }

  public async jwtFlow() {
    if (this.server === '' || this.clientId === '' || this.clientSecret === '' || this.jwtToken === '') {
      message.error('Please input server, client ID, client secret and JWT token');
      return;
    }
    const rc = new RingCentral({
      server: this.server,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });
    try {
      const token = await rc.authorize({ jwt: this.jwtToken });
      this.rcToken = token.access_token!;
      this.refreshToken = token.refresh_token!;
      afterLogin();
    } catch (e) {
      message.open({ duration: 10, type: 'error', content: e.message });
    }
  }

  public async authCodeFlow() {
    if (this.server === '' || this.clientId === '' || this.clientSecret === '') {
      message.error('Please input server, client ID and client secret');
      return;
    }
    const rc = new RingCentral({
      server: this.server,
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });
    const authorizeUriExtension = new AuthorizeUriExtension();
    await rc.installExtension(authorizeUriExtension);
    const authorizeUri = authorizeUriExtension.buildUri({
      redirect_uri: window.location.origin + window.location.pathname + 'callback.html',
    });
    window.open(
      authorizeUri,
      'popupWindow',
      `width=600,height=600,left=${window.screenX + 256},top=${window.screenY + 128}`,
    )!;
    window.addEventListener('message', async (event) => {
      if (event.data.source === 'oauth-callback') {
        const token = await rc.authorize({
          code: event.data.code,
          redirect_uri: window.location.origin + window.location.pathname + 'callback.html',
        });
        this.rcToken = token.access_token!;
        this.refreshToken = token.refresh_token!;
        afterLogin();
      }
    });
  }

  public async startConference() {
    const rc = new RingCentral({ server: this.server });
    rc.token = { access_token: this.rcToken };
    const r = await rc.restapi().account().telephony().conference().post();
    await this.webPhone.call(r.session!.voiceCallToken!);
  }

  public async inviteToConference(targetNumber: string) {
    const confSession = this.callSessions.find((cs) => cs.isConference);
    if (!confSession) {
      return;
    }
    const callSession = await this.webPhone.call(targetNumber);
    callSession.once('answered', async () => {
      const rc = new RingCentral({ server: this.server });
      rc.token = { access_token: this.rcToken };
      await rc.restapi().account().telephony().sessions(confSession.sessionId).parties().bringIn().post({
        sessionId: callSession.sessionId,
        partyId: callSession.partyId,
      });
    });
  }

  public async mergeToConference(callSession: CallSession) {
    const confSession = this.callSessions.find((cs) => cs.isConference);
    if (!confSession) {
      return;
    }
    const rc = new RingCentral({ server: this.server });
    rc.token = { access_token: this.rcToken };
    await rc.restapi().account().telephony().sessions(confSession.sessionId).parties().bringIn().post({
      sessionId: callSession.sessionId,
      partyId: callSession.partyId,
    });
  }
}

export default Store;
