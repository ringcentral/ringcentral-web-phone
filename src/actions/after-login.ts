import RingCentral from '@rc-ex/core';
import { exclude } from 'manate';

import WebPhone from '../web-phone';
import store from '../store';
import type InboundCallSession from '../call-session/inbound';
import type OutboundCallSession from '../call-session/outbound';

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
  const webPhone = new WebPhone({ sipInfo: r.sipInfo![0], instanceId: 'my-unique-phone-instance-id' });
  store.webPhone = exclude(webPhone);
  await webPhone.enableDebugMode();
  await webPhone.register();

  webPhone.on('inboundCall', (inbundCallSession: InboundCallSession) => {
    store.addCallSession(inbundCallSession);
  });
  webPhone.on('outboundCall', (outboundCallSession: OutboundCallSession) => {
    store.addCallSession(outboundCallSession);
  });
};

export default afterLogin;
