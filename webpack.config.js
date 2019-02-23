const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const isKarma = !isProduction && process.env.NODE_ENV === 'karma';

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {'ringcentral-web-phone': './src/index.ts'},
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
                use: [
                    'cache-loader',
                    {
                        loader: 'ts-loader',
                        options: {
                            onlyCompileBundledFiles: true
                        }
                    }
                ],
                include: path.resolve('src')
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
    devServer: {
        contentBase: __dirname,
        port: 8080,
        overlay: true,
        publicPath: '/dist/'
    }
};

if (isProduction) {
    const [key, src] = Object.entries(module.exports.entry);
    module.exports.mode = 'production';
    module.exports.devtool = 'source-map';
    module.exports.entry = {
        ...module.exports.entry,
        [`${key}.min`]: src
    };
    module.exports.optimization = {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                include: /\.min\.js$/
            })
        ]
    };
}

if (isKarma) {
    delete module.exports.entry;
    delete module.exports.output;
    delete module.exports.externals;
    module.exports.module.rules.push({
        test: /\.tsx?$/,
        exclude: [/spec/],
        enforce: 'post',
        use: {
            loader: 'istanbul-instrumenter-loader',
            options: {esModules: true}
        }
    });
    // console.log(module.exports.module.rules[0].use);
    // process.exit();
}
