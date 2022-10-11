module.exports = {
    launch: {
        dumpio: true,
        headless: process.env.CI,
        args: [
            // '--single-process',
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            '--allow-http-screen-capture',
            '--no-sandbox',
            '--disable-web-security'
        ]
    },
    server: {
        command: 'yarn start --port 8888',
        debug: false,
        port: 8888,
        launchTimeout: 30000
    }
};
