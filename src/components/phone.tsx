import React from 'react';
import { auto } from 'manate/react';
import { Button, Divider, Input, Space } from 'antd';

import type { Store } from '../models/store';

const Phone = (props: { store: Store }) => {
  const { store } = props;
  const [callee, setCallee] = React.useState<string>('');
  const render = () => (
    <>
      <Button id="logout-btn" onClick={() => store.logout()}>
        Log out
      </Button>
      <Space direction="vertical" style={{ display: 'flex' }}>
        <Divider>Outbound Call</Divider>
        <Space>
          <Input placeholder="16501234567" onChange={(e) => setCallee(e.target.value.trim())} value={callee} />
          <Button
            type="primary"
            onClick={() => {
              global.webPhone.call(callee);
            }}
            disabled={callee.trim().length < 3}
          >
            Call
          </Button>
        </Space>
      </Space>
    </>
  );
  return auto(render, props);
};

export default Phone;
