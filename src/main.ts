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
import App from './App.vue'
import Components from '@/components'
import pinia from './store'
import router from './router'
import './permission'
import './plugins'
import i18n from './i18n'
import LocalStorage from '@/utils/localStorage'

import VxeUIBase from 'vxe-pc-ui'
import 'vxe-pc-ui/es/style.css'

const clamp = (value: number, min = 0, max = 255) =>
  Math.min(max, Math.max(min, value))
const hexToRgb = (hex: string) => {
  const normalized = hex.replace('#', '')
  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16)
    const g = parseInt(normalized[1] + normalized[1], 16)
    const b = parseInt(normalized[2] + normalized[2], 16)
    return { r, g, b }
  }
  const r = parseInt(normalized.slice(0, 2), 16)
  const g = parseInt(normalized.slice(2, 4), 16)
  const b = parseInt(normalized.slice(4, 6), 16)
  return { r, g, b }
}
const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
const mix = (color1: string, color2: string, weight: number) => {
  const w = Math.max(0, Math.min(1, weight))
  const c1 = hexToRgb(color1)
  const c2 = hexToRgb(color2)
  const r = Math.round(c1.r * (1 - w) + c2.r * w)
  const g = Math.round(c1.g * (1 - w) + c2.g * w)
  const b = Math.round(c1.b * (1 - w) + c2.b * w)
  return rgbToHex(r, g, b)
}
const setThemeColor = (color: string) => {
  if (!color) return
  const root = document.documentElement
  root.style.setProperty('--el-color-primary', color)
  for (let i = 1; i <= 9; i += 1) {
    root.style.setProperty(
      `--el-color-primary-light-${i}`,
      mix(color, '#ffffff', i / 10),
    )
  }
  root.style.setProperty('--el-color-primary-dark-2', mix(color, '#000000', 0.2))
  root.style.setProperty('--vxe-ui-font-primary-color', color)
}

const applyInitialTheme = () => {
  const savedTheme = LocalStorage.get<string>('theme') || 'light'
  const isDark = savedTheme === 'dark'
  const root = document.documentElement
  root.classList.toggle('dark', isDark)
  root.setAttribute('data-theme', isDark ? 'dark' : 'light')
  root.setAttribute('data-vxe-ui-theme', isDark ? 'dark' : 'light')
  const savedColor = LocalStorage.get<string>('theme-color')
  if (savedColor) {
    setThemeColor(savedColor)
  }
}

applyInitialTheme()

const app = createApp(App)

app
  .use(ElementPlus, {
    size: '',
  })
  .use(i18n)
  .use(VxeUIBase)
  .use(lazyVxeTable)
  .use(Components)
  .use(router)
  .use(pinia)
  .mount('#app')
