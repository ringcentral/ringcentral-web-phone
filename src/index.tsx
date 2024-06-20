import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app';
import store from './store';

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(
  <StrictMode>
    <App store={store} />
  </StrictMode>,
);
