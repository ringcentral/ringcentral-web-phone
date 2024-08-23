import test, { expect } from '@playwright/test';

import { register, callerSipInfo } from './common';

test('registration', async ({ context }) => {
  const { messages } = await register({ context, sipInfo: callerSipInfo });
  expect(messages.length).toBe(6);
  expect(messages.map((m) => m.subject)).toEqual([
    'REGISTER sip:sip.ringcentral.com SIP/2.0',
    'SIP/2.0 100 Trying',
    'SIP/2.0 401 Unauthorized',
    'REGISTER sip:sip.ringcentral.com SIP/2.0',
    'SIP/2.0 100 Trying',
    'SIP/2.0 200 OK',
  ]);
  expect(messages.map((m) => m.direction)).toEqual([
    'outbound',
    'inbound',
    'inbound',
    'outbound',
    'inbound',
    'inbound',
  ]);
});
