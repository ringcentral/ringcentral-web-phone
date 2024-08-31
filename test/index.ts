import { autoRun, manage } from 'manate';

import WebPhone from '../src';
import { uuid } from '../src/utils';

global.setup = async (sipInfo: string) => {
  const webPhone = new WebPhone({ sipInfo: JSON.parse(sipInfo), instanceId: uuid(), debug: true });
  global.webPhone = manage(webPhone);
  const { start, stop } = autoRun(global.webPhone, () => {
    global.inboundCalls = webPhone.callSessions.filter((call) => call.direction === 'inbound');
    global.outboundCalls = webPhone.callSessions.filter((call) => call.direction === 'outbound');
  });
  start();
  await webPhone.register();
  global.stopAutoRun = stop;
};

global.teardown = async () => {
  for (const call of global.webPhone.callSessions) {
    if (call.state === 'answered') {
      await call.hangup();
    } else if (call.direction === 'inbound') {
      await call.decline();
    } else {
      // outbound
      await call.cancel();
    }
  }
  global.stopAutoRun();
  global.stopAutoRun = undefined;
  await global.webPhone.dispose();
  global.webPhone = undefined;
  global.inboundCalls = undefined;
  global.outboundCalls = undefined;
};
