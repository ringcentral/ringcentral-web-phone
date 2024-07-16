import React from 'react';
import { auto } from 'manate/react';
import { Button, Space, Tag } from 'antd';

import type CallSession from '../call-session';
import type InboundCallSession from '../call-session/inbound';
import type OutboundCallSession from '../call-session/outbound';
import { extractNumber } from '../utils';

const Session = (props: { callSession: CallSession }) => {
  const { callSession } = props;
  const render = () =>
    callSession.direction === 'inbound' ? (
      <InboundSession session={callSession as InboundCallSession} />
    ) : callSession.state === 'init' ? (
      <>Initiating an outbound call</>
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
        {extractNumber(session.localPeer)} <Tag color="blue">{session.state}</Tag>{' '}
        {session.state === 'ringing' ? (
          <Space>
            <Button onClick={() => session.answer()} type="primary">
              Answer
            </Button>
            <Button onClick={() => session.decline()} danger>
              Decline
            </Button>
          </Space>
        ) : null}
        {session.state === 'answered' ? (
          <Space>
            <Button onClick={() => session.hangup()} danger>
              Hang up
            </Button>
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
  const render = () => {
    return (
      <div>
        <div>
          <strong>{session.direction}</strong> call from {extractNumber(session.localPeer)} to{' '}
          {extractNumber(session.remotePeer)}
          <Tag color="blue">{session.state}</Tag>{' '}
          {session.state === 'answered' ? (
            <Space>
              <Button onClick={() => session.hangup()} danger>
                Hang up
              </Button>
              <Button>Transfer</Button>
            </Space>
          ) : null}
        </div>
      </div>
    );
  };
  return auto(render, props);
};

export default Session;
