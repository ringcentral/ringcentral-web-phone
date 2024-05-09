import { defineConfig } from '@playwright/test';

export default defineConfig({
  webServer: {
    command: 'yarn build && yarn http-server docs -c-1 -p8888',
    url: 'http://localhost:8888/',
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
  use: {
    baseURL: 'http://localhost:8888/',
    headless: true,
    launchOptions: {
      args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
    },
  },
});
