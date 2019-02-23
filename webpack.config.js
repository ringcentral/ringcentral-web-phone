const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const isKarma = !isProduction && process.env.NODE_ENV === 'karma';

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        'ringcentral-web-phone': './src/index.ts'
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
        publicPath: '/'
    }
};

if (isProduction) {
    const [key, src] = Object.entries(module.exports.entry)[0];
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
    delete module.exports.plugins;
    module.exports.module.rules.push({
        test: /\.tsx?$/,
        exclude: [/spec/],
        enforce: 'post',
        use: {
            loader: 'istanbul-instrumenter-loader',
            options: {esModules: true}
        }
    });
} else {
    const libConfig = module.exports;
    module.exports = [
        libConfig,
        {
            mode: libConfig.mode,
            devtool: libConfig.devtool,
            entry: {
                demo: './demo/index.js',
                demoCallback: './demo/callback.js'
            },
            output: {
                path: libConfig.output.path,
                filename: libConfig.output.filename
            },
            externals: {
                'ringcentral-web-phone': {
                    commonjs: 'ringcentral-web-phone',
                    commonjs2: 'ringcentral-web-phone',
                    amd: 'ringcentral-web-phone',
                    root: ['RingCentral', 'WebPhone']
                }
            },
            plugins: [
                new HtmlWebpackPlugin({
                    template: './demo/index.html',
                    inject: false,
                    chunks: ['demo', 'demoVendor']
                }),
                new HtmlWebpackPlugin({
                    template: './demo/callback.html',
                    filename: 'callback.html',
                    chunks: ['demoCallback', 'demoVendor']
                }),
                //FIXME Replace with file loader
                new CopyPlugin([
                    {from: 'node_modules/bootstrap', to: 'bootstrap'},
                    {from: 'audio', to: 'audio'},
                    {from: 'demo/img', to: 'img'}
                ])
            ],
            optimization: {
                minimize: true,
                splitChunks: {
                    cacheGroups: {
                        vendor: {
                            test: /node_modules/,
                            name: 'demoVendor',
                            chunks: 'all'
                        }
                    }
                }
            }
        }
    ];
}
