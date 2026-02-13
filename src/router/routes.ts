// 静态路由
export const constantRoutes = [
  {
    path: '/login',
    name: 'login', // 命名路由
    meta: {
      title: '登录',
      hidden: true,
    },
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/',
    name: 'layout', // 首页
    meta: {
      title: '',
      hidden: false,
      icon: '',
    },
    redirect: '/index',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/index',
        name: 'dashboard', // 首页
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled',
        },
        component: () => import('@/views/dashboard/index.vue'),
      },
    ],
  },
  {
    path: '/404',
    name: '404',
    meta: {
      title: '404',
      hidden: true,
    },
    component: () => import('@/views/404/index.vue'),
  },
  {
    path: '/:pathMatch(.*)*', // 匹配所有路径
    name: 'any',
    meta: {
      title: 'any',
      hidden: true,
    },
    redirect: '/404', // 重定向到 404 页面
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      title: '系统管理',
      hidden: false,
      icon: 'Setting',
    },
    redirect: '/system/user',
    component: () => import('@/layout/index.vue'),
    children: [
      {
        path: '/system/user',
        name: 'user',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User',
        },
        component: () => import('@/views/system/user/index.vue'),
      },
      // {
      //   path: '/system/user/detail',
      //   name: 'UserDetail',
      //   meta: {
      //     title: '用户管理详情',
      //     hidden: true,
      //     icon: 'User',
      //   },
      //   component: () => import('@/views/system/user/detail.vue'),
      // },
      {
        path: '/system/permission',
        name: 'permission',
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'Menu',
        },
        component: () => import('@/views/system/permission/index.vue'),
      },
      {
        path: '/system/role',
        name: 'role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'UserFilled',
        },
        component: () => import('@/views/system/role/index.vue'),
      },
    ],
  },
]
