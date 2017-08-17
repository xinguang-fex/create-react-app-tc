const path = require('path')
const fs = require('fs')
const filePath = {
    outputPath: path.resolve(__dirname, '../dist'),
    publicPath: '/'
}

const pagesPath = path.resolve(__dirname, '../src/views')
const pagesDir = fs.readdirSync(pagesPath)
const pages = pagesDir.map(function (page) {
    return {
        name: page,
        pagePath: pagesPath + '/' + page + '/index.jsx'
    }
})

// console.log('pages', pages)
module.exports = {
    filePath: filePath,
    pages: pages,
    defaultPort: 9000
}