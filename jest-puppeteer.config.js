module.exports = {
    launch: {
      dumpio: true, // enable this to see console.log
      headless: true,
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--allow-http-screen-capture',
        '--no-sandbox',
        '--disable-web-security',
      ],
    },
    server: {
        command: 'yarn serve --port 8888',
        debug: false,
        port: 8888,
        launchTimeout: 30000
    }
  };
