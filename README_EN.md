# EpageVant

vant based [epage](https://github.com/didichuxing/epage) rendering package

English Introduction | [中文介绍](./README.md)

## Documents

Official website：[http://epage.didichuxing.com](http://epage.didichuxing.com)

- [Quick Start](http://epage.didichuxing.com/usage/#快速起步)
- [Development Documentation](http://epage.didichuxing.com/developer/)
- [Epage API](http://epage.didichuxing.com/developer/epage.html)
- [How to develop widget?](http://epage.didichuxing.com/developer/widget.html)
- [Online Demos](http://epage.didichuxing.com/examples/)

## Demo

**[Demo](http://epage.didichuxing.com/examples/render.html)**

## Install

```sh
npm install epage-vant -S
# or yarn add epage-vant
```

## Usage

-  `npm` (recommend)

```js
import Vue from 'vue'
import Vuex from 'vuex'
import vant from 'vant'
import widgets, { Render, Epage } from 'epage-vant'
import schema from './schema.json'
import 'epage-vant/src/style/main.less'

// if already used in the project, don't use it here
Vue.use(Vuex)
Vue.use(vant)

const el = document.getElementById('root')
// Instantiate Designer
new Epage({ el, widgets, schema, Render })
// or create Render
new Render({ el, widgets, schema })
```

-  `script`

```html
<!-- third-party style -->
<link href='https://cdn.jsdelivr.net/npm/vant@2.8/lib/index.css' rel='stylesheet'></link>
<link href='./epage.css' rel='stylesheet'></link>
<link href='./epage-vant.css' rel='stylesheet'></link>

<!-- third lib -->
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

// Instantiate Designer
new Epage({ el, widgets, Render })
// or create Render
new Render({ el, widgets, schema })
</script>

```

## License

[MIT](http://opensource.org/licenses/MIT)
