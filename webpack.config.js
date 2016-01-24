var webpack = require('webpack'),
    path = require('path');

function getExternal(root, cjs, amd) {
    if (!cjs) cjs = root;
    return {
        amd: amd || cjs,
        commonjs: cjs,
        commonjs2: cjs,
        root: root
    };
}

function createConfig(config) {

    return {

        debug: true,
        devtool: '#source-map',

        externals: config.externals,
        entry: config.entry,

        output: {
            filename: './build/[name]',
            libraryTarget: 'umd', //TODO RCSDK.noConflict()
            library: ['RingCentral', 'WebPhone'],
            sourcePrefix: ''
        },

        resolve: {
            extensions: ['', '.js', '.json']
        },

        module: {
            loaders: [
                {test: /\.json$/, loader: 'json'}
            ]
        },

        node: {
            buffer: false
        },

        plugins: [],

        watchDelay: 200

    };

}

module.exports = [
    createConfig({
        entry: {
            'ringcentral-web-phone.js': ['./src/index.js']
        },
        externals: {
            'ringcentral': getExternal(['RingCentral', 'SDK'], 'ringcentral')
        }
    })
];

//console.log('Webpack Config');
//console.log(JSON.stringify(module.exports, null, 2));
