const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const ip = require('ip')
const open = require('open')
const config = require('./config')
const webpackDevServer = require('webpack-dev-server')
const utils = require('./utils')
const templatePath = path.resolve(__dirname, '../index.html')

var webpackConfig = {
    node: {
        fs: "empty"
    },
    entry: {},
    output: {
        path: config.filePath.outputPath,
        filename: '[name]/index.js',
        publicPath: '/'
    },
    cache: true,
    devtool: 'source-map',
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
                ]
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
                    'sass-loader'
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
                use: ['file-loader?name=res/[name].[ext]']
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'PRODUCTION': JSON.stringify(false),
            //enable production build for react
            //https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: "zepto",
            zepto: "zepto",
            "window.zepto": "zepto"
        })
    ],
};
function injectEntry() {
    config.pages.forEach(function (item) {
        webpackConfig.entry[item.name] = [
            'webpack-dev-server/client?http://' + ip.address() + ':' + config.defaultPort,
            'webpack/hot/only-dev-server',
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
    public: ip.address() + ':' + '9000'
}).listen(9000, (err) => {
    if (err) {
        throw err
    }
    open('http://' + ip.address() + ':9000/Test')
})