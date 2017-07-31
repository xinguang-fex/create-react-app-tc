const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const shell = require('shelljs')
const ip = require('ip')
const open = require('open')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const config = require('./config')
const templatePath = path.resolve(__dirname, '../index.html')

const webpackConfig = {
    node: {
        fs: "empty"
    },
    entry: {
        vendor: ["react", "react-dom", "zepto"]
    },
    output: {
        path: config.filePath.outputPath,
        filename: '[name]/index.[chunkhash:8].js',
        publicPath: config.filePath.publicPath
    },
    cache: false,
    devtool: 'cheap-module-source-map',
    target: 'web',
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            path.resolve(__dirname, '../src'),
            "node_modules"
        ],
        alias: {
            'components': path.resolve(__dirname, '../src/components'),
            'utils': path.resolve(__dirname, '../src/utils'),
            'public': path.resolve(__dirname, '../public'),
        }
    },
    module: {
        rules: [
            {
                test: require.resolve('zepto'),
                use: {
                    loader: 'imports-loader',
                    options: 'this=>window',
                }
            },
            {
                test: /\.jsx?$/,
                use: ['babel-loader?cacheDirectory=true&presets[]=es2015&presets[]=react&presets[]=stage-0'],
                include: [
                    path.resolve(__dirname, '../src')
                ]
            },
            {
                test: /\.scss/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        "loader": "css-loader",
                        options: {
                            minimize: true
                        }
                    }, {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [autoprefixer]
                        }
                    },{
                        "loader": "sass-loader"
                    }]
                }),
                include: [
                    path.resolve(__dirname, '../src')
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        "loader": "css-loader"
                    }, {
                        loader: "postcss-loader",
                        options: {
                            plugins: () => [autoprefixer]
                        }
                    }]
                })
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
                use: ['url-loader?limit=1&name=res/[name].[chunkhash:8].[ext]']
            }
        ]
    },
    plugins: [
        new ManifestPlugin,
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            'PRODUCTION': JSON.stringify(true)
        }),
        new ExtractTextPlugin('[name]/styles.[chunkhash:8].css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: Infinity
        }),
        new webpack.ProvidePlugin({
            $: "zepto",
            zepto: "zepto",
            "window.zepto": "zepto"
        })
    ]
};
function injectEntry() {
    config.pages.forEach(function (item) {
        webpackConfig.entry[item.name] = [
            item.pagePath
        ];
    });
}

function injectHtmlWebpack() {
    let configPath
    config.pages.forEach(function (item) {
        configPath = path.resolve(__dirname, `../src/views/${item.name}/config.json`)
        webpackConfig.plugins.push(
            new HtmlWebpackPlugin({
                filename: `${item.name}/index.html`,
                title: require(configPath).title,
                template: templatePath,
                //vendor.js is at the forefront in the JS list.
                chunksSortMode: function (chunk1, chunk2) {
                    var orders = ['vendor'];
                    var order1 = orders.indexOf(chunk1.names[0]);
                    var order2 = orders.indexOf(chunk2.names[0]);
                    if (order1 == 0) {
                        return -1;
                    } else {
                        return 1;
                    }
                },
                chunks: [`${item.name}`, 'vendor'],
                inject: true
            })
        );
    });
}

injectEntry()
injectHtmlWebpack()

shell.mkdir('-p', path.resolve(__dirname, '../dist'))

webpack(webpackConfig, (err) => {
    if (err) {
        throw err
    }
})

