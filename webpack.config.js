const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

const libConfig = {
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
    const [key, src] = Object.entries(libConfig.entry)[0];
    libConfig.mode = 'production';
    libConfig.devtool = 'source-map';
    libConfig.entry = {
        ...libConfig.entry,
        [`${key}.min`]: src
    };
    libConfig.optimization = {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                include: /\.min\.js$/
            })
        ]
    };
}

module.exports = [
    libConfig,
    // Demo
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
