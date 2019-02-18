// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from '@/store/store'
import axios from 'axios'
import App from './App'
import router from './router'
import moment from 'moment'
import showdown from 'showdown'
// import hljs from 'highlight.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.prototype.$moment = moment
// var converter = new showdown.Converter()
var converter = new showdown.Converter()

Vue.prototype.converter = converter
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$http = axios
Vue.prototype.$http.defaults.withCredentials = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
