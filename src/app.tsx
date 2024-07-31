import React from 'react';
import { notification, Typography } from 'antd';
import { auto } from 'manate/react';
import type { Managed } from 'manate/models';

import type { Store } from './models/store';
import Login from './components/login';
import Phone from './components/phone';

const App = (props: { store: Managed<Store> }) => {
  const { store } = props;
  const [api, contextHolder] = notification.useNotification();
  global.notifier = api;
  const render = () => (
    <>
      {contextHolder}
      <Typography.Title>RingCentral Web Phone 2 Demo</Typography.Title>
      {store.rcToken === '' ? <Login store={store} /> : <Phone store={store} />}
    </>
  );
  return auto(render, props);
};

export default App;
