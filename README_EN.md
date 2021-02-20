# EpageVant

vant based [epage-core](https://github.com/epage-team/epage-core) rendering package

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
import { render } from 'epage-core'
import Epage from 'epage'
import widgets, { entry } from 'epage-vant'
import 'epage/src/style/main.less'
import 'epage-vant/src/style/main.less'
import schema from './schema.json'

// create Designer
new Epage({
  el,
  schema,
  view: 'h5',
  h5: {
    widgets,
    Render: render.VueRender,
    component: entry
  }
})

// create Render
new Render({ el, widgets, schema, component: entry })
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

<script src="./epage-core.min.js"></script>
<script src="./epage.min.js"></script>
<script src="./epage-vant.min.js"></script>

<script>

const el = document.getElementById('root')
const { default: widgets, entry } = EpageVant
const { render } = EpageCore


new Epage({
  el,
  schema,
  view: 'h5',
  h5: {
    widgets,
    Render: render.VueRender,
    component: entry
  }
})
// create Render
new render.VueRender({ el, widgets, schema, component: entry })
</script>

```

## Communication Group

QQ group

<img src="https://img-hxy021.didistatic.com/static/star/epage-qrcode-qq.png" width="250">

## License

[MIT](http://opensource.org/licenses/MIT)
