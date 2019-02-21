const path = require('path');
const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');

module.exports = {
    mode: 'production',
    // devtool: 'source-map', // #
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    onlyCompileBundledFiles: true
                }
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'ringcentral-web-phone.min.js',
        library: ['RingCentral', 'WebPhone'],
        libraryTarget: 'umd'
    },
    externals: {
        getstats: {
            commonjs: 'getstats',
            commonjs2: 'getstats',
            amd: 'getstats',
            root: 'getStats'
        },
        'sip.js': {
            commonjs: 'sip.js',
            commonjs2: 'sip.js',
            amd: 'sip.js',
            root: 'SIP'
        }
    },
    plugins: [new UnminifiedWebpackPlugin()]
};
