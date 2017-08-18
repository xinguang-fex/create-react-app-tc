const path = require('path')
const webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const ip = require('ip')
var os = require('os');
const open = require('open')
const config= require('./config')
const webpackDevServer = require('webpack-dev-server')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const HappyPack = require('happypack');
var happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

var nodeModulesPath = path.resolve(__dirname, '../node_modules');

const utils = require('./utils')
const templatePath = path.resolve(__dirname, '../index.html')
const env_config = require('../config')


/**
 * [resolve 公用获取路径方法]
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

var webpackConfig = {
    node: {
        fs: "empty"
    },
    entry: {},
    output: {
        path: config.filePath.outputPath,
        filename: '[name]/index.js',
        publicPath: config.filePath.publicPath 
    },
    cache: true,
    devtool: 'source-map',
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
                test: /\.(js|jsx)$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: [resolve('src')],
                options: {
                  formatter: require('eslint-friendly-formatter')
                }
            },
            // 
            /*{
                test: /\.js|jsx$/,
                loader: 'happypack/loader?id=happybabel',
                exclude: /node_modules/
            },*/
            {
                test: require.resolve('zepto'),
                use: {
                    loader: 'imports-loader',
                    options: 'this=>window',
                }
            },
            {
                test: /\.jsx?$/,
                use: ['react-hot-loader', 'babel-loader?cacheDirectory=true&presets[]=es2015&presets[]=react&presets[]=stage-0&presets[]=stage-1&presets[]=stage-3&plugins[]=transform-runtime', 'webpack-module-hot-accept' ],
                include: [
                    path.resolve(__dirname, '../src')
                ],
                exclude: nodeModulesPath
            },
            {
                test: /\.scss/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer]
                        }
                    },
                    'sass-loader?outputStyle=compressed'
                ],
                include: [
                    path.resolve(__dirname, '../src')
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [autoprefixer]
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
                use: ['file-loader?limit=1&name=res/[name].[ext]']
            }/*,
            {
                test: /\.json$/,
                use: 'json-loader'
            }*/
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': env_config.dev.env,
            // 'PRODUCTION': JSON.stringify(false),
            //enable production build for react
            //https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: '[name].css'
        }),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: "zepto",
            zepto: "zepto",
            "window.zepto": "zepto"
        }),
         new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(env_config.dev.dll.manifest),
        }),
        new AddAssetHtmlPlugin([
            {
                filepath: path.resolve(__dirname, env_config.dev.dll.fileName),
                outputPath: path.join(env_config.dev.dll.outputPath),
                publicPath: path.join(env_config.dev.dll.publicPath),
                includeSourcemap: true
            }
        ])/*,
        new HappyPack({
            id: 'happybabel',
            cache: true,
            loaders: ['babel-loader?presets[]=es2015&presets[]=react&presets[]=stage-0&presets[]=stage-1&presets[]=stage-3'],
            threadPool: happyThreadPool
        })*/
    ],
};
function injectEntry() {
    config.pages.forEach(function (item) {
        webpackConfig.entry[item.name] = [
            'webpack-dev-server/client?http://' + ip.address() + ':' + config.defaultPort,
            'webpack/hot/only-dev-server',
            'babel-polyfill',
            item.pagePath
        ];
    });
}

injectEntry()
utils.injectHtmlWebpack(webpackConfig)

const compiler = webpack(webpackConfig)
new webpackDevServer(compiler, {
    contentBase: './',
    //historyApiFallback: true,
    hot: true,
    noInfo: false,
    //in development mode, publicPath must be '/', otherwise, html-webpack-plugin will can't inject assets.
    publicPath: '/',
    public: ip.address() + ':' + config.defaultPort
}).listen(config.defaultPort, (err) => {
    if (err) {
        throw err
    }
    open('http://' + ip.address() + ':' + config.defaultPort +'/Test')
})