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
            'http://cdn.rawgit.com/onsip/SIP.js/0.7.8/dist/sip-0.7.8.js', //FIXME We use CDN because SIP.JS NPM does not have build version
            require.resolve('es6-promise/dist/es6-promise.auto'),
            require.resolve('pubnub/dist/web/pubnub'),
            require.resolve('whatwg-fetch'),
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
                    '--disable-web-security',
                    '--no-sandbox'
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

        singleRun: true,

        client: {
            captureConsole: true,
            showDebugMessages: true,
            mocha: {
                ui: "bdd",
                timeout: 5000
            },
            env: process.env
        }

    });

};