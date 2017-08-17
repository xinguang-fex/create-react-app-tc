const path = require('path')
const fs = require('fs')
const filePath = {
    outputPath: path.resolve(__dirname, '../dist'),
    rootPath: path.resolve(__dirname, '../'),
    publicPath: '/dist/',
    vendorManifestPath: path.resolve(__dirname, '../dist/vendor/vendor-manifest.json'),
    templatePath: path.resolve(__dirname, '../index.html')
}

const pagesPath = path.resolve(__dirname, '../src/views')
const pagesDir = fs.readdirSync(pagesPath)

const pages = pagesDir.map(function (page) {
    return {
        name: page,
        pagePath: pagesPath + '/' + page + '/index.jsx'
    }
})

module.exports = {
    filePath: filePath,
    pages: pages,
    defaultPort: 9000
}