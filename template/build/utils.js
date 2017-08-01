const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const templatePath = path.resolve(__dirname, '../index.html')
const config = require('./config')

function injectHtmlWebpack(webpackConfig) {
    let configPath
    config.pages.forEach(function (item) {
        configPath = path.resolve(__dirname, `../src/views/${item.name}/config.json`)
        webpackConfig.plugins.push(
            new HtmlWebpackPlugin({
                filename: `${item.name}/index.html`,
                title: require(configPath).title,
                template: templatePath,
                //chunks: [`${item.name}`],
                inject: true
            })
        );
    });
}
module.exports = {
    injectHtmlWebpack: injectHtmlWebpack
}