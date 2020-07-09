import Vue from 'vue'
import vant from 'vant'
import Demo from './demo'
import './style.less'

Vue.use(vant)
const el = document.getElementById('epage')

/* eslint-disable no-new */
new Vue({
  el,
  render: h => h(Demo)
})
