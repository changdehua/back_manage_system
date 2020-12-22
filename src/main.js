// import Antd from 'ant-design-vue'
import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/main.less'

import ZkTable from 'vue-table-with-tree-grid'
Vue.component('TreeGridTable', ZkTable)
Vue.use(ElementUI)
// import antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
// Vue.use(antd)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


console.log('good_cate');

console.log('hahahahahahh');
