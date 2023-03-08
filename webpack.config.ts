import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import {Configuration} from 'webpack';

const commonConfig = {
  devtool: 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      querystring: require.resolve('querystring-es3'),
      crypto: require.resolve('crypto-browserify'),
      buffer: require.resolve('buffer/'),
      stream: require.resolve('stream-browserify'),
    },
  },
};

const libConfig: Configuration = {
  ...commonConfig,
  mode: 'development',
  entry: {
    'ringcentral-web-phone': './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: ['RingCentral', 'WebPhone'],
    libraryTarget: 'umd',
    libraryExport: 'default',
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
              onlyCompileBundledFiles: true,
            },
          },
        ],
        include: path.resolve('src'),
      },
      {
        test: /\.m?js?$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  externals: {
    'sip.js': {
      commonjs: 'sip.js',
      commonjs2: 'sip.js',
      amd: 'sip.js',
      root: 'SIP',
    },
  },
};

const demoConfig = {
  ...commonConfig,
  mode: libConfig.mode,
  entry: {
    demo: './demo/index.js',
    demoCallback: './demo/callback.js',
  },
  output: {
    path: libConfig.output!.path,
    filename: libConfig.output!.filename,
  },
  externals: {
    'ringcentral-web-phone': {
      commonjs: 'ringcentral-web-phone',
      commonjs2: 'ringcentral-web-phone',
      amd: 'ringcentral-web-phone',
      root: ['RingCentral', 'WebPhone'],
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js?$/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './demo/index.html',
      inject: false,
      chunks: ['demo', 'demoVendor'],
    }),
    new HtmlWebpackPlugin({
      template: './demo/callback.html',
      filename: 'callback.html',
      chunks: ['demoCallback', 'demoVendor'],
    }),
    // FIXME Replace with file loader
    new CopyPlugin({
      patterns: [
        {from: 'audio', to: 'audio'},
        {from: 'demo/img', to: 'img'},
      ],
    }),
  ],
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'demoVendor',
          chunks: 'all',
        },
      },
    },
  },
};

export default [libConfig, demoConfig];
