import router from './router'
import useUserStore from './store/modules/user'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

nprogress.configure({ showSpinner: false })

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 进度条开始
  nprogress.start()
  // 获取浏览器页签标题
  document.title = import.meta.env.VITE_APP_TITLE + ' ' + to.meta.title
  const userStore = useUserStore()
  const token = userStore.token
  const userInfo = userStore.userInfo
  // 如果有token 证明用户已经登录过了
  if (token) {
    // 如果要去到login 不让去
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 有用户信息 放行
      if (userInfo?.id) {
        next()
      } else {
        //   没有用户信息  先去接口获取 再放行
        try {
          await userStore.fetchUserInfo()
          next()
        } catch (err) {
          // token失效 走登出逻辑
          await userStore.logout()
          // 去到登录界面重新登录
          next({
            path: '/login',
            query: {
              redirect: to.path,
            },
          })
        }
      }
    }
  } else {
    // 没有token  想去login界面  直接放行
    if (to.path === '/login') {
      next()
    } else {
      // 没token去到其他页面 直接跳转到login界面  保留当前想要去的路由地址
      next({
        path: '/login',
        query: {
          redirect: to.path,
        },
      })
    }
  }
})

router.afterEach((to, from) => {
  nprogress.done()
})
