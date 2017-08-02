# 使用说明

## 安装

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
components为组件目录


