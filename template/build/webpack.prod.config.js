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
var AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const config = require('./config')
const templatePath = path.resolve(__dirname, '../index.html')
const nodeModulesPath = path.resolve(__dirname, '../node_modules');

const env_config = require('../config')
var date = +new Date()

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

/**
 * [区分不同的环境，根据NODE_ENV定义不同的环境变量.]
 * 测试站项目根目录:"/tuchao_mobile"(/pages)
 * 开发站项目根目录:"/"(pages(待定))
 * 线上站项目根目录:"/"(pages)
 */
var env = process.env.NODE_ENV === 'testing'
  ? { NODE_ENV: '"testing"'}
  : ( (process.env.NODE_ENV === 'development' ) ? env_config.dev.env : env_config.build.env )

var test_Dir = ''

const webpackConfig = {
    node: {
        fs: "empty"
    },
    entry: {
        // vendor: ["react", "react-dom", "zepto"]
    },
    output: {
        path: config.filePath.outputPath,
        filename: '[name]/index.[chunkhash].js',
        publicPath: process.env.NODE_ENV === 'testing' ? (test_Dir + config.filePath.publicPath ) : config.filePath.publicPath
    },
    cache: false,
    devtool: false,
    target: 'web',
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            resolve('src'),
            resolve('node_modules')
        ],
        alias: {
            'components': path.resolve(__dirname, '../src/components'),
            'utils': path.resolve(__dirname, '../src/utils'),
            'assets': path.resolve(__dirname, '../src/assets'),
        }
    },
    module: {
        noParse: /zepto|axios/,
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
                ],
                exclude: nodeModulesPath
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
                    }, {
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
                use: ['file-loader?name=res/[name].[hash:8].[ext]']
            }
        ]
    },
    plugins: [
        new webpack.optimize.AggressiveMergingPlugin(),
        new ManifestPlugin,
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            //enable production build for react
            //https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
            'process.env':  env_config.build.env
        }),
        new ExtractTextPlugin({
            filename: '[name]/styles.[contenthash].css'
        }),

        new webpack.NoErrorsPlugin(),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "vendor",
        //     minChunks: Infinity
        // }),
        new webpack.ProvidePlugin({
            $: "zepto",
            zepto: "zepto",
            "window.zepto": "zepto"
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(env_config.build.dll.manifest),
        }),
        new AddAssetHtmlPlugin([
            {
                filepath: path.resolve(__dirname, env_config.build.dll.fileName),
                outputPath: path.join(env_config.build.dll.outputPath),
                publicPath: path.join(env_config.build.dll.publicPath),
                includeSourcemap: false
            }
        ])
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
                chunks: [`${item.name}`],//, 'vendor'
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
    console.log('compile time: ',+new Date() - date)
})

