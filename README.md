# 打包管理系统

>  vue 管理后台 它只包含了 Element UI & axios & iconfont & permission control & lint，这些搭建后台必要的东西。

[线上地址](http://172.16.3.212:8081/#/package_management/game_list)

## 运行

```bash
# Clone project
git clone https://github.com/PanJiaChen/vue-admin-template.git

# Install dependencies
npm install

# 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# Serve with hot reload at localhost:9528
npm run dev

# Build for production with minification
npm run build

# Build for production and view the bundle analyzer report
npm run build --report
```

## 项目构成
```
  build 系统打包配置目录

  config 系统环境配置目录
      dev.env.js 开发测试环境
      index.js 线上和开发公共的
      prod.env.js 打发线上发行环境

  dist 项目打包文件生成目录

  mock 模拟数据配置(在后端接口未给到的时,开发界面时需要,发行线上需关闭)

  src 项目主文件目录
    api  
      login.js 定义mock模拟请求数据
      module.js 定义共用的post/get请求
    assets
    components
    icons
    router  页面路由配置
    store
    styles
    utils
    views  定义组件相关视图模块
    App.vue
    main.js
    permission.js
  static  静态资源目录














```
   


## Element-Ui 使用 cdn 教程

首先找到 `index.html` ([根目录下](https://github.com/PanJiaChen/vue-admin-template/blob/element-ui-cdn/index.html))

引入 Element 的 css 和 js ，并且引入 vue 。因为 Element-Ui 是依赖 vue 的，所以必须在它之前引入 vue 。

之后找到 [webpack.base.conf.js](https://github.com/PanJiaChen/vue-admin-template/blob/element-ui-cdn/build/webpack.base.conf.js) 加入 `externals` 让 webpack 不打包 vue 和 element

```
externals: {
  vue: 'Vue',
  'element-ui':'ELEMENT'
}
```

之后还有一个小细节是如果你用了全局对象方式引入 vue，就不需要 手动 `Vue.use(Vuex）` ，它会自动挂载，具体见 [issue](https://github.com/vuejs/vuex/issues/731)

最终你可以使用 `npm run build --report` 查看效果






