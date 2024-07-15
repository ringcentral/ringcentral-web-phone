import React from 'react';
import { auto } from 'manate/react';
import { Button, Space } from 'antd';

import type CallSession from '../call-session';
import type InboundCallSession from '../call-session/inbound';
import type OutboundCallSession from '../call-session/outbound';
import { extractNumber } from '../utils';

const Session = (props: { callSession: CallSession }) => {
  const { callSession } = props;
  const render = () =>
    callSession.direction === 'inbound' ? (
      <InboundSession session={callSession as InboundCallSession} />
    ) : (
      <OutboundSession session={callSession as OutboundCallSession} />
    );
  return auto(render, props);
};

const InboundSession = (props: { session: InboundCallSession }) => {
  const { session } = props;
  const render = () => (
    <div>
      <div>
        <strong>{session.direction}</strong> call from {extractNumber(session.remotePeer)} to{' '}
        {extractNumber(session.localPeer)}{' '}
        {session.state === 'ringing' ? (
          <Space>
            <Button>Answer</Button>
            <Button onClick={() => session.decline()}>Decline</Button>
          </Space>
        ) : null}
        {session.state === 'answered' ? (
          <Space>
            <Button onClick={() => session.hangup()}>Hang up</Button>
            <Button>Transfer</Button>
          </Space>
        ) : null}
      </div>
    </div>
  );
  return auto(render, props);
};

const OutboundSession = (props: { session: OutboundCallSession }) => {
  const { session } = props;
  const render = () => (
    <div>
      <div>
        <strong>{session.direction}</strong> call from {extractNumber(session.localPeer)} to{' '}
        {extractNumber(session.remotePeer)}{' '}
        {session.state === 'answered' ? (
          <Space>
            <Button onClick={() => session.hangup()}>Hang up</Button>
            <Button>Transfer</Button>
          </Space>
        ) : null}
      </div>
    </div>
  );
  return auto(render, props);
};

export default Session;
