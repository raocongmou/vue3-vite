import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'virtual:svg-icons-register'
import '@/styles/index.scss'
// 导入vxe相关的主题变量，也可以重写主题变量
import 'vxe-pc-ui/styles/cssvar.scss'
import 'vxe-table/styles/cssvar.scss'
import { lazyVxeTable } from '@/components/vxe-table'
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'
import App from './App.vue'
import Components from '@/components'
import pinia from './store'
import router from './router'
import './permission.ts'
import './plugins'

import VxeUIBase from 'vxe-pc-ui'
import 'vxe-pc-ui/es/style.css'

const app = createApp(App)

app
  .use(ElementPlus, {
    size: '',
  })
  .use(VxeUIBase)
  .use(lazyVxeTable)
  .use(Components)
  .use(router)
  .use(pinia)
  .mount('#app')
