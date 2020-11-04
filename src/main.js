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
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor, /* { default global options } */)
Vue.component('TreeGridTable', ZkTable)
Vue.use(ElementUI)
// import antd from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
// Vue.use(antd)

Vue.config.productionTip = false

Vue.filter('date-format',(value)=>{
  const date=new Date(value)
  let y=date.getFullYear()
  let m=(date.getMonth()+1+'').padEnd(2,'0')
  let d=(date.getDate()+'').padEnd(2,'0')
  let h=(date.getHours()+'').padEnd(2,'0')
  let mm=(date.getMinutes()+'').padEnd(2,'0')
  let s=(date.getSeconds()+'').padEnd(2,'0')

  return `${y}/${m}/${d}-${h}:${mm}:${s}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
