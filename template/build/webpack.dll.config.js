var path = require("path");
var webpack = require('webpack');
var lib = require("../config/lib.dependencies");

var defaultSettings = require('./defaults');
var filePath = defaultSettings.filePath;
var isDebug = process.env.NODE_ENV  === "development";

var outputPath = isDebug ? path.join(__dirname, "../common/debug") : path.join(__dirname, "../common/production"); //common/production
// var outputPath = path.join(__dirname, "../common/production");

var plugin = [
    new webpack.DllPlugin({
        /**
         * path
         * 定义 manifest 文件生成的位置
         * [name]的部分由entry的名字替换
         */
        path: path.join(outputPath, "mainfest.json"),
         /**
         * name
         * dll bundle 输出到那个全局变量上
         * 和 output.library 一样即可。
         */
        name: '[name]',
        context: __dirname
    })/*,
    // OccurenceOrderPlugin :为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new webpack.optimize.OccurenceOrderPlugin()*/
];


//如果是生产环境，对预编译的lib.js 文件进行优化压缩处理
if(!isDebug) {
    plugin.push(
        new webpack.DefinePlugin({
            'process.env':{
              'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress: {
              warnings: false
            },
            mangle: {
              except: ['$super', '$', 'exports', 'require']
            },
            output: {
              comments: false
            },
            exclude: /\.min\.js$/
        })
    )
}

module.exports= {
    devtool: "source-map",
    entry: {
        "lib": lib,
    },
    output: {
        path: outputPath,
        filename: '[name].js',
        library: '[name]',
    },
    plugins: plugin
};