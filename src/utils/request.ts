import axios from 'axios'
import StatusConstant from '@/constant/statusConstant'
import { ElMessage } from 'element-plus'
import LocalStorage from './localStorage'
import router from '@/router'

console.log(
  'import.meta.env.VITE_APP_BASE_API',
  import.meta.env.VITE_APP_BASE_API,
)

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = LocalStorage.get('token')
  if (token) {
    config.headers.token = `${token}`
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    console.log('err', err)
    let message = ''
    switch (err.response.status) {
      case 401:
        message = StatusConstant[401]
        break
      case 403:
        message = StatusConstant[403]
        break
      case 404:
        message = StatusConstant[404]
        break
      case 500:
        message = StatusConstant[500]
        break
      default:
        message = StatusConstant.other
        break
    }
    ElMessage.error(message)
    return Promise.reject(err)
  },
)

export default request
