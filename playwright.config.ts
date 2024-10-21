import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 20000,
  webServer: {
    command: 'yarn serve -p 8888',
    url: 'http://localhost:8888/',
    stdout: 'ignore',
    stderr: 'ignore',
  },
  use: {
    baseURL: 'http://localhost:8888/',
    headless: true,
    launchOptions: {
      args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
    },
  },
});
