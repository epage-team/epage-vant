# EpageVant

基于vant组件库的 [epage](https://github.com/didichuxing/epage) 渲染包

[English Introduction](./README_EN.md) | 中文介绍

## 文档

官网：[http://epage.didichuxing.com](http://epage.didichuxing.com)

- [快速起步](http://epage.didichuxing.com/usage/#快速起步)
- [开发文档](http://epage.didichuxing.com/developer/)
- [设计器API](http://epage.didichuxing.com/developer/epage.html)
- [如何开发widget?](http://epage.didichuxing.com/developer/widget.html)
- [在线示例](http://epage.didichuxing.com/examples/)

## 演示地址

**[Demo](http://epage.didichuxing.com/examples/render.html)**

## 安装

```sh
npm install epage-vant -S
# or yarn add epage-vant
```

## 设计器及渲染器示例

-  `npm` 方式引入（推荐）

```js
import Vue from 'vue'
import Vuex from 'vuex'
import Vant from 'vant'
import widgets, { Render, Epage } from 'epage-vant'
import schema from './schema.json'
import 'epage-vant/src/style/main.less'

// 如果项目中已经use，则此处不需要再次use
Vue.use(Vuex)
Vue.use(Vant)

const el = document.getElementById('root')
// 设计器
new Epage({ el, widgets, schema, Render })
// 或者创建渲染器
new Render({ el, widgets, schema })
```

-  `script` 方式引入

```html
<!-- 样式 -->
<link href='https://cdn.jsdelivr.net/npm/vant@2.8/lib/index.css' rel='stylesheet'></link>
<link href='./epage.css' rel='stylesheet'></link>
<link href='./epage-vant.css' rel='stylesheet'></link>

<!-- 第三方脚本 -->
<script src='https://cdn.bootcss.com/vue/2.6.10/vue.min.js' ></script>
<script src='https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js' ></script>
<script src='https://cdn.jsdelivr.net/npm/vant@2.8/lib/vant.min.js' ></script>

<script src="./epage.min.js"></script>
<script src="./epage-vant.min.js"></script>

<script>
Vue.use(Vuex)
Vue.use(Vant)
const el = document.getElementById('root')
const { default: widgets, Render } = EpageVant

// 设计器
new Epage({ el, widgets, Render })
// 或者创建渲染器
new Render({ el, widgets, schema })
</script>

```

## License

[MIT](http://opensource.org/licenses/MIT)
