const webpack = require('webpack');
const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV || 'production',
    devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : 'source-map',
    entry: {
        core: ['./src/pf-pre']
    },
    watch: process.env.NODE_ENV === 'development' ? true : false,
    target: 'web',
    resolve: {
        extensions: ['.js', '.json', '.wasm']
    },
    module: {
        rules: [
            {
                test: /\.wasm$/,
                type: 'javascript/auto',
                use: {
                    loader: 'arraybuffer-loader'
                }
            },
            {
                test: /\.js?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        presets: [
                            '@babel/env'
                        ]
                    }
                },
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(/mcl-wasm[\\\/]test\.js/, path.join(__dirname, '../src/noop.js')),
        new webpack.IgnorePlugin(new RegExp('^(fs|perf_hooks)$')),
        new webpack.DefinePlugin({
            'process.env': {
                'BUILD_TARGET': JSON.stringify('browser')
            }
        }),
    ],
    output: {
        path: path.join(__dirname, '../dist'),
        filename: 'index.js',
        library: 'ideafast-pre',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        webassemblyModuleFilename: "[hash].wasm"
    },
    optimization: {
        usedExports: true,
        namedModules: true,
        noEmitOnErrors: true,
        concatenateModules: true
    },
    performance: {
        maxEntrypointSize: 2048000,
        maxAssetSize: 2048000
    }
};