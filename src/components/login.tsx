import React from 'react';
import { Button, Divider, Form, Input, Typography } from 'antd';
import { auto } from 'manate/react';

import type { Store } from '../models/store';

const { Text } = Typography;

const Login = (props: { store: Store }) => {
  const { store } = props;
  const render = () => (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 8 }}>
      <Form.Item label="Client ID" required>
        <Input
          onChange={(e) => {
            store.clientId = e.target.value;
          }}
          value={store.clientId}
        />
      </Form.Item>
      <Form.Item label="Client Secret" required>
        <Input.Password
          onChange={(e) => {
            store.clientSecret = e.target.value;
          }}
          value={store.clientSecret}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" onClick={() => store.authCodeFlow()}>
          Auth Code Flow
        </Button>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Text type="secondary">
          Note: Set the app's redirect URI to {window.location.origin + window.location.pathname}
          callback.html
        </Text>
      </Form.Item>
      <Divider>OR</Divider>
      <Form.Item label="JWT Token" required>
        <Input.Password
          onChange={(e) => {
            store.jwtToken = e.target.value;
          }}
          value={store.jwtToken}
        />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" onClick={() => store.jwtFlow()}>
          Personal JWT Flow
        </Button>
      </Form.Item>
    </Form>
  );
  return auto(render, props);
};

export default Login;
