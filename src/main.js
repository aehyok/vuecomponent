import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store'
import ElementUI from 'element-ui'
import * as filters from '@/filters'
import * as directives from '@/directives'
import formCreate from '@form-create/element-ui'
import '@/styles/index.scss'
import './routerGuard'
require('./mock/mock.js')

// 判断配置文件是否开启日志调试 是否输出日志 True 输出 False 不输出
const logDebug = (process.env.NODE_ENV !== 'production')
console.log = (function (oriLogFunc) {
  return function () {
    if (logDebug) {
      oriLogFunc.apply(this, arguments);
    }
  }
})(console.log)


Vue.config.productionTip = false
Vue.use(ElementUI, {
  size: 'medium',
})
Vue.use(formCreate)
// 全局注册指令 v-permission
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

// Register global filter functions
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
