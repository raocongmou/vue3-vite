import { defineStore } from 'pinia'
import { constantRoutes } from '@/router/routes'
import type { RouteRecordRaw } from 'vue-router'

const useRoutesStore = defineStore('routes', () => {
  const routes = ref<RouteRecordRaw[]>(constantRoutes)

  const remove = () => {}

  return { routes }
})

export default useRoutesStore
