import React from 'react';
import { auto } from 'manate/react';
import { Button } from 'antd';

import type { Store } from '../models/store';

const Phone = (props: { store: Store }) => {
  const { store } = props;
  const render = () => (
    <>
      <Button id="logout-btn" onClick={() => store.logout()}>
        Log out
      </Button>
      I am the phone!
    </>
  );
  return auto(render, props);
};

export default Phone;
