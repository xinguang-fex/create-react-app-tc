const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const ip = require('ip')
const open = require('open')
const config = require('./config')
const webpackDevServer = require('webpack-dev-server')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
const templatePath = path.resolve(__dirname, '../index.html')
var webpackConfig = {
    node: {
        fs: "empty"
    },
    entry: {},
    output: {
        path: config.filePath.outputPath,
        filename: '[name].js',
        //publicPath: config.filePath.publicPath
    },
    cache: true,
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            path.resolve(__dirname, 'src'),
            "node_modules"
        ]
    },
    module: {
        noParse: [
            path.join(__dirname, '../node_modules/jquery/dist/jquery.min.js')
        ],
        rules: [
            {
                test: /.jsx?$/,
                use: ['babel-loader?cacheDirectory=true&presets[]=es2015&presets[]=react&presets[]=stage-0'],
                exclude: /node_modules/,
                // noParse: [pathToReact,pathToReactDOM,pathToReactRouter]
            },
            {
                test: /\.scss/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    "sass-loader?outputStyle=compressed"
                ]
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader"
                ]
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
                use: ['url-loader?limit=1&name=res/[name].[hash:8].[ext]']
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'PRODUCTION': JSON.stringify(false)
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
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "../dist"),

        port: 9000,
    }
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

function injectHtmlWebpack() {
    config.pages.forEach(function (item) {
        webpackConfig.plugins.push(
            new HtmlWebpackPlugin({
                filename: `${item.name}/index.html`,
                template: templatePath,
                chunks: [`${item.name}`],
                inject: true
            })
        );
    });
}
injectEntry()
injectHtmlWebpack()
const compiler = new webpack(webpackConfig)
new webpackDevServer(compiler, {
    contentBase: './',
    historyApiFallback: true,
    hot: true,
    noInfo: false,
    publicPath: config.filePath.publicPath,
    public: ip.address() + ':' + '9000'
}).listen(9000, (err) => {
    if (err) {
        throw err
    }
    open('http://'+ip.address() + ':9000/Test')
})