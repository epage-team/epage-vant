import Vue from 'vue'
import vant from 'vant'
import VueRouter from 'vue-router'
import App from './app'
import Demo from './demo'
import DemoRender from './demo-render'
import './style.less'

Vue.use(vant)
Vue.use(VueRouter)
const el = document.getElementById('epage')

const router = new VueRouter({
  routes: [
    { path: '/', component: Demo },
    { path: '/render', component: DemoRender },
  ],
  mode: 'history'
})

/* eslint-disable no-new */
new Vue({
  el,
  router,
  render: h => h(App)
})
