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
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
  withCredentials: true,
})

let isRefreshing = false
const refreshQueue: Array<(token: string) => void> = []
const refreshFailQueue: Array<(error: any) => void> = []

const updateStoreToken = async (token: string) => {
  const [{ default: useUserStore }, { default: pinia }] = await Promise.all([
    import('@/store/modules/user'),
    import('@/store'),
  ])
  const userStore = useUserStore(pinia)
  userStore.token = token
}

const clearStoreAuth = async () => {
  const [{ default: useUserStore }, { default: pinia }] = await Promise.all([
    import('@/store/modules/user'),
    import('@/store'),
  ])
  const userStore = useUserStore(pinia)
  userStore.remove()
}

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
    const response = err.response
    const originalConfig = (err.config || {}) as any

    if (
      response &&
      response.status === 401 &&
      !originalConfig._retry &&
      !originalConfig.url?.includes('/user/login') &&
      !originalConfig.url?.includes('/user/refreshToken')
    ) {
      originalConfig._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((token: string) => {
            originalConfig.headers = originalConfig.headers || {}
            originalConfig.headers.token = token
            resolve(request(originalConfig))
          })
          refreshFailQueue.push(reject)
        })
      }

      isRefreshing = true
      return refreshClient
        .post('/user/refreshToken')
        .then(async (refreshRes) => {
          const data = refreshRes?.data || refreshRes
          if (data?.code === 200 && data?.data?.token) {
            const newToken = data.data.token
            LocalStorage.set('token', newToken)
            await updateStoreToken(newToken)

            refreshQueue.forEach((cb) => cb(newToken))
            refreshQueue.length = 0
            refreshFailQueue.length = 0

            originalConfig.headers = originalConfig.headers || {}
            originalConfig.headers.token = newToken
            return request(originalConfig)
          }

          throw new Error('refresh token failed')
        })
        .catch(async (refreshErr) => {
          refreshFailQueue.forEach((cb) => cb(refreshErr))
          refreshQueue.length = 0
          refreshFailQueue.length = 0

          await clearStoreAuth()
          LocalStorage.clear()
          router.push('/login')
          return Promise.reject(refreshErr)
        })
        .finally(() => {
          isRefreshing = false
        })
    }

    let message = response?.data?.msg || ''
    if (!message) {
      switch (response?.status) {
        case 400:
          message = StatusConstant[400]
          break
        case 401:
          message = StatusConstant[401]
          break
        case 403:
          message = StatusConstant[403]
          break
        case 404:
          message = StatusConstant[404]
          break
        case 410:
          message = StatusConstant[410]
          break
        case 500:
          message = StatusConstant[500]
          break
        default:
          message = StatusConstant.other
          break
      }
    }

    if (message) {
      ElMessage.error(message)
    }
    return Promise.reject(err)
  },
)

export default request
