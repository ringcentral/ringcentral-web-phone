import React from 'react';
import { auto } from 'manate/react';
import { Button, Divider, Input, Select, Space, Typography } from 'antd';

import type { Store } from '../models/store';
import CallSession from './call-session';

const Phone = (props: { store: Store }) => {
  const { store } = props;
  const [callee, setCallee] = React.useState<string>('');
  const [callerId, setCallerId] = React.useState<string>(store.callerIds[0]);
  const render = () => (
    <>
      <Button id="logout-btn" onClick={() => store.logout()}>
        Log out
      </Button>
      <Space direction="vertical" style={{ display: 'flex' }}>
        <Divider>Inbound Call</Divider>
        <Typography.Text>
          Logged in as{' '}
          <strong>
            {store.extInfo?.contact?.firstName} {store.extInfo?.contact?.lastName}
          </strong>
          . You may dial <strong>{store.primaryNumber}</strong> to reach this web phone.
        </Typography.Text>
        <Divider>Outbound Call</Divider>
        <Space>
          <Select
            value={callerId}
            onChange={(value) => setCallerId(value)}
            style={{ width: '12rem' }}
            options={store.callerIds.map((n) => ({ value: n, label: <span>{n}</span> }))}
          />
          <Input placeholder="16501234567" onChange={(e) => setCallee(e.target.value.trim())} value={callee} />
          <Button
            type="primary"
            onClick={() => store.webPhone.call(callee, callerId)}
            disabled={callee.trim().length < 3}
          >
            Call
          </Button>
        </Space>
        <Divider>Call Sessions</Divider>
        {store.callSessions.map((callSession) => (
          <div key={callSession.callId}>
            <CallSession callSession={callSession} />
          </div>
        ))}
      </Space>
    </>
  );
  return auto(render, props);
};

export default Phone;
