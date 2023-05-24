module.exports = {
  launch: {
    dumpio: false, // enable this to see console.log
    headless: 'old', // https://developer.chrome.com/articles/new-headless/, 'new' doesn't work
    args: [
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--allow-http-screen-capture',
      '--no-sandbox',
      '--disable-web-security',
    ],
  },
  server: {
    command: 'yarn build && yarn http-server docs -c-1 -p8888',
    debug: false,
    port: 8888,
    launchTimeout: 30000,
  },
};
