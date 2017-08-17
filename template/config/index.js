var path = require('path')

module.exports = {
  build: {
    dll:{
      basePath: "../common/production",
      fileName: '../common/production/lib.js',
      manifest: '../common/production/mainfest.json',
      outputPath: "./common/lib", // 生成目录
      publicPath: "/common/lib" //注入地址
    },
    env: require('./prod.env'),
  },
  dev: {
    dll:{
      basePath: "../common/debug",
      fileName: '../common/debug/lib.js',
      manifest: '../common/debug/mainfest.json',
      outputPath: "./common/lib", // 生成目录
      publicPath: "/common/lib" //注入地址
    },
    env: require('./dev.env'),
  }
}
