import WebPhone from '../src';

global.setup = async (sipInfo: string) => {
  const webPhone = new WebPhone({ sipInfo: JSON.parse(sipInfo) });
  global.webPhone = webPhone;
  global.inboundCalls = [];
  global.outboundCalls = [];
  webPhone.on('inboundCall', (call) => {
    global.inboundCalls.push(call);
  });
  webPhone.on('outboundCall', (call) => {
    global.outboundCalls.push(call);
  });
};

global.teardown = async () => {
  await global.webPhone.dispose();
  global.webPhone = undefined;
  global.inboundCalls = undefined;
  global.outboundCalls = undefined;
};
