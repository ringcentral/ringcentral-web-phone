import WebPhone from '../src';

global.initWebPhone = async (sipInfo: string) => {
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
