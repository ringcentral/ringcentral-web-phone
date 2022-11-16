module.exports = {
    launch: {
      dumpio: false, // enable this to see console.log
      headless: true,
      args: [
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        '--allow-http-screen-capture',
        '--no-sandbox',
        '--disable-web-security',
      ],
    },
  };
