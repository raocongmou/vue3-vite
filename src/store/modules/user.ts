import { defineStore } from 'pinia'
import { getUserInfo, userLogin, userLogout } from '@/api/system/user'
import type {
  loginForm,
  loginResponse,
  userInfoInter,
} from '@/api/system/user/type'
import { useRouter, useRoute } from 'vue-router'
import useTabsStore from './tabs'
import LocalStorage from '@/utils/localStorage'

const useUserStore = defineStore('user', () => {
  // state
  const token = ref(LocalStorage.get('token') || '')
  const userInfo = ref<userInfoInter | null>(
    LocalStorage.get('userInfo') || null,
  )

  // actions
  const login = async (form: loginForm) => {
    const res: loginResponse = await userLogin(form)
    console.log('login', res)

    if (res.code === 200) {
      token.value = res.data.token
      LocalStorage.set('token', res.data.token)
      return Promise.resolve(res.msg)
    } else {
      return Promise.reject(new Error(res.msg))
    }
  }

  const logout = async () => {
    const res = await userLogout()
    if (res.code === 200) {
      const router = useRouter()
      const route = useRoute()
      const tabsStore = useTabsStore()
      tabsStore.remove()
      remove()
      LocalStorage.clear()
      return 'ok'
    } else {
      return Promise.reject(new Error('登出异常，请联系管理员!'))
    }
  }

  const fetchUserInfo = async () => {
    const res = await getUserInfo()
    console.log('fetchUserInfo', res)
    
    if (res.code === 200) {
      userInfo.value = res.data
      return 'ok'
    } else {
      return Promise.reject('error')
    }
  }

  const remove = () => {
    token.value = ''
    userInfo.value = null
  }

  // 返回state和actions
  return { token, userInfo, login, logout, fetchUserInfo, remove }
})

export default useUserStore
