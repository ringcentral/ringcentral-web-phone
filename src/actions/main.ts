import RingCentral from '@rc-ex/core';
import { autoRun } from 'manate';
import localForage from 'localforage';

import store from '../store';
import afterLogin from './after-login';

const main = async () => {
  store.rcToken = (await localForage.getItem('rcToken')) ?? '';
  store.refreshToken = (await localForage.getItem('refreshToken')) ?? '';
  store.server = (await localForage.getItem('server')) ?? 'https://platform.ringcentral.com';
  store.clientId = (await localForage.getItem('clientId')) ?? '';
  store.clientSecret = (await localForage.getItem('clientSecret')) ?? '';
  store.jwtToken = (await localForage.getItem('jwtToken')) ?? '';

  // auto save things to local
  const { start } = autoRun(store, () => {
    localForage.setItem('rcToken', store.rcToken);
    localForage.setItem('refreshToken', store.refreshToken);
    localForage.setItem('server', store.server);
    localForage.setItem('clientId', store.clientId);
    localForage.setItem('clientSecret', store.clientSecret);
    localForage.setItem('jwtToken', store.jwtToken);
  });
  start();

  const refreshToken = async () => {
    if (store.rcToken !== '') {
      const rc = new RingCentral({
        server: store.server,
        clientId: store.clientId,
        clientSecret: store.clientSecret,
      });
      rc.token = { access_token: store.rcToken, refresh_token: store.refreshToken };
      try {
        await rc.refresh();
        store.rcToken = rc.token!.access_token!;
        store.refreshToken = rc.token!.refresh_token!;
      } catch (ignoreErr) {
        store.rcToken = '';
        store.refreshToken = '';
      }
    }
  };
  await refreshToken();
  setInterval(() => refreshToken(), 30 * 60 * 1000);

  afterLogin();
};

export default main;
