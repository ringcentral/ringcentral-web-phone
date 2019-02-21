const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        'ringcentral-web-phone': './src/index.ts',
        'ringcentral-web-phone.min': './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        library: ['RingCentral', 'WebPhone'],
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
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
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                include: /\.min\.js$/
            })
        ]
    }
};
