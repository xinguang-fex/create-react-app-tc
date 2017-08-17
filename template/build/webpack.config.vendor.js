const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')
const baseConfig = require('./config')
const config = {
    entry: {
        vendor: ['react', 'react-dom']
    },
    output: {
        path: baseConfig.filePath.outputPath,
        filename: 'vendor/[name].[chunkhash:8].js',
        library: '[name]'
    },
    plugins: [
        new ManifestPlugin({
            //publicPath: path.resolve(__dirname, '../dist/vendor/'),
            fileName: 'vendor-name.json'
        }),
        new webpack.DllPlugin({
            context: baseConfig.filePath.rootPath,
            name: '[name]',
            path: baseConfig.filePath.vendorManifestPath
        })
    ]
}
webpack(config, (err) => {
    if(err) throw err
    replaceVendorJS()
})

/**
 * Replace the hash of vendor.js in template.
 */
function replaceVendorJS() {
    var vendorJSONPath = path.resolve(__dirname, '../dist/vendor-name.json')
    var isExist = fs.existsSync(vendorJSONPath)
    var fileContent,
        newContent
    if(!isExist) {
        throw 'vendor-name.json is nonexistent.Please check the process of build-dll.'
    } else {
        if(!fs.existsSync(baseConfig.filePath.templatePath)) {
            throw 'index.html is nonexistent, please provide it in the root directory.'
        }
        fileContent = fs.readFileSync(baseConfig.filePath.templatePath, {encoding: 'utf8'})
        var fileName = require(path.resolve(__dirname, '../dist/vendor-name.json'))['vendor.js']
        var lastSlash = fileName.lastIndexOf('/')

        if(fileContent.indexOf('/dist/vendor/') !== -1) {
            newContent = fileContent.replace(/vendor\.[0-9a-z]+\.js/, function(_) {
                return fileName.slice(lastSlash+1)
             })
            fs.writeFile(baseConfig.filePath.templatePath, newContent, function (err) {
                if(err) throw 'Replace hash of vendor.js in template failed.'
                console.log('The hash of vendor.js has been modified to the latest.')
            })
        }else {
            newContent = fileContent.replace(/\<\/body\>/, function(_) {
                return '<script src="/dist/vendor/'+ fileName.slice(lastSlash+1) + '"></script>' + '</body>'
            })
            fs.writeFile(baseConfig.filePath.templatePath, newContent, function (err) {
                if(err) throw 'Add vendor.js to template failed.'
                console.log('The path of vendor.js has been adding to the template.')
            })
        }
    }
}
