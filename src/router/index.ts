import { createWebHistory, createRouter } from 'vue-router'
import { constantRoutes } from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  // 滚动行为
  scrollBehavior() {
    return { top: 0, left: 0 }
  },
})

export default router
