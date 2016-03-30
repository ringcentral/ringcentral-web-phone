module.exports = function(config) {

    var path = require('path');

    config.set({

        frameworks: [
            'mocha',
            'chai',
            'sinon-chai'
        ],

        files: [
            {pattern: './audio/**/*.ogg', included: false},
            './credentials.js',
            './bower_components/ringcentral/build/ringcentral-bundle.js',
            './bower_components/sip.js/dist/sip.js',
            './src/ringcentral-web-phone.js',
            './tests/**/*.js'
        ],

        reporters: ['mocha'],

        logLevel: config.LOG_INFO,

        browsers: ['ChromeNoSecurity'], //TODO Firefox

        customLaunchers: {
            ChromeNoSecurity: {
                flags: ['--use-fake-ui-for-media-stream'], // '--disable-web-security'
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
            }
        }

    });

};