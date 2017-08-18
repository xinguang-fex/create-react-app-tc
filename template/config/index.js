var path = require('path')
var prodVendorName = require('../common/production/vendor-name.json')['lib.js'],
    devVendorName = require('../common/debug/vendor-name.json')['lib.js']
module.exports = {
  build: {
    dll:{
      basePath: "../common/production",
      fileName: '../common/production/'+prodVendorName,
      manifest: '../common/production/mainfest.json',
      outputPath: "./common/lib", // 生成目录
      publicPath: "/common/lib" //注入地址
    },
    env: require('./prod.env'),
  },
  dev: {
    dll:{
      basePath: "../common/debug",
      fileName: '../common/debug/'+devVendorName,
      manifest: '../common/debug/mainfest.json',
      outputPath: "./common/lib", // 生成目录
      publicPath: "/common/lib" //注入地址
    },
    env: require('./dev.env'),
  }
}
