# create-react-app-tc

## 安装运行

```
1. npm i create-react-app-tc -g
2. create-react-app-tc project-name
3. cd project-name
4. npm install
5. npm start
```

以上步骤把本项目的template目录下的内容拷贝到新的项目中，并运行新的项目。

## 项目结构

以下是生成的新项目的目录结构。
```
.
├── README.md
├── build                       构建文件目录
├── docs                        文档目录
├── index.html                  首页模板，html-webpack-plugin以此生成页面
├── node_modules
├── package.json
└── src
    ├── assets                   公共静态资源目录
    ├── components               组件目录
    │   └── TopBar               TopBar组件
    │       ├── index.jsx
    │       └── index.scss
    ├── utils                    工具函数目录
    └── views                    页面目录
        └── Test                 Test页面
            ├── config.json      页面title等配置，为html-webpack-plugin提供配置
            ├── img              页面图片目录，如果页面图片少，可直接把图片放在外层
            │   └── react.logo.svg
            ├── index.jsx
            └── index.scss

```

上面的目录结构中，build为构建文件目录，build的目录为dist目录。

src目录中，assets用来存放公共的静态资源文件。组件/页面级别的静态资源分别放在对应的组件/页面目录下面。

components为组件目录，每个组件下面为组件的js/scss，以及图片等内容。

views为页面级目录，每个页面目录下存放页面用的资源。

> components目录存放的组件为公共组件。如果是某一个页面用的组件，非公共组件，可以放在每个页面对应的目录下。

## 页面模板

此项目为多页面的项目。配置文件会遍历views目录下的文件夹，每个文件夹对应一个页面。每个页面的入口文件为目录下的index.jsx文件。

> 新建页面时注意提供页面目录下的index.jsx文件，该文件为页面入口，此项为必需项。

html-webpack-plugin会为views下面的每个文件夹生成一个对应的html，并把对应的js/css等资源注入到html中。所有页面的模版均为根目录下的index.html。页面的title由每个页面下的config.json提供。

## 工具函数

utils目录用来存放自己的工具函数。项目创建成功后的package.json中包含的工具类包括：

* [axios](https://github.com/mzabriskie/axios) Ajax请求库
* [eruda](https://github.com/liriliri/eruda) 移动端Console控制台
* [js-cookie](https://github.com/js-cookie/js-cookie) Cookie操作库
* [query-string](https://github.com/sindresorhus/query-string) URL查询字符串操作库
* [zepto](https://github.com/madrobby/zepto) DOM操作库

具体使用参考对应的Github项目说明文档。

## 构建
```
npm run build
```
构建后产出的文件会放在dist目录下。
下面为产出的内容目录结构：
```
├── Test
│   ├── index.78265c92.js
│   ├── index.html
│   └── styles.78265c92.css
├── manifest.json
├── res
│   └── react.logo.876a8325.svg
└── vendor
    └── index.da952f59.js
```
Test为Test页面内容的目录，每个页面会有一个对应的目录。vendor为公共库的打包文件。res为静态资源的目录。文件加上了8位的chunkhash。
manifest.json为打包后的文件映射，内容如下：

```
{
  "Test.css": "Test/styles.78265c92.css",
  "Test.js": "Test/index.78265c92.js",
  "res/react.logo.svg": "res/react.logo.876a8325.svg",
  "vendor.js": "vendor/index.da952f59.js"
}
```

manifest.json文件每次构建后会被更新，因此我们可以根据此文件定期对服务器上的冗余资源做清理。