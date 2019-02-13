module.exports = function(config) {

    require('dotenv').config({silent: true});

    var path = require('path');

    config.set({

        frameworks: [
            'mocha',
            'chai',
            'sinon-chai'
        ],

        files: [
            require.resolve('sip.js/dist/sip'),
            require.resolve('pubnub/dist/web/pubnub'),
            require.resolve('getstats/getStats'),
            require.resolve('ringcentral/build/ringcentral'),
            {pattern: './audio/**/*.ogg', included: false},
            './src/ringcentral-web-phone.js',
            './src/**/*.spec.js'
        ],

        reporters: ['mocha'],

        logLevel: config.LOG_INFO,

        browsers: [
            //TODO Firefox
            'ChromeNoSecurity'
        ],

        customLaunchers: {
            ChromeNoSecurity: {
                flags: [
                    '--use-fake-ui-for-media-stream',
                    '--use-fake-device-for-media-stream',
                    '--allow-http-screen-capture',
                    '--disable-web-security'
                ].concat(process.env.CI || process.env.TRAVIS ? ['--no-sandbox'] : []),
                chromeDataDir: path.resolve(__dirname, '.chrome'),
                base: 'Chrome'
            }
        },

        plugins: [
            'karma-chrome-launcher',
            'karma-mocha',
            'karma-mocha-reporter',
            'karma-chai-plugins'
        ],

        client: {
            captureConsole: true,
            showDebugMessages: true,
            mocha: {
                // bail: true,
                ui: 'bdd',
                timeout: 5000
            },
            // config: {
            //     browserConsoleLogOptions: true
            // },
            env: process.env
        }

    });

};