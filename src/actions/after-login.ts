import RingCentral from '@rc-ex/core';
import { exclude } from 'manate';

import WebPhone from '../web-phone';
import store from '../store';

const afterLogin = async () => {
  if (store.rcToken === '') {
    return;
  }
  const rc = new RingCentral();
  rc.token = { access_token: store.rcToken, refresh_token: store.refreshToken };

  // fetch extension and phone number info
  store.extInfo = await rc.restapi().account().extension().get();
  const numberList = await rc.restapi().account().extension().phoneNumber().get();
  store.primaryNumber = numberList.records?.find((n) => n.primary)?.phoneNumber ?? '';

  const r = await rc
    .restapi()
    .clientInfo()
    .sipProvision()
    .post({
      sipInfo: [{ transport: 'WSS' }],
    });
  const webPhone = new WebPhone(r.sipInfo![0]);
  store.webPhone = exclude(webPhone);
  await webPhone.register();
};

export default afterLogin;
