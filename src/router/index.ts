import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import product from './modules/product'
import system from './modules/system'
import dashboard from './modules/dashboard'
import { ElMessage } from 'element-plus'
import member from './modules/member'
import order from './modules/order'
import logs from './modules/logs'

export const modulesRoute = [dashboard, order, product, member, logs, system]

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/layouts/BasicLayout.vue'),
    children: [...modulesRoute],
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录' },
    component: () => import('@/views/login/index.vue'),
  },
] as RouteRecordRaw[]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
// 路由白名单
const whiteRoute = ['Login']
router.beforeEach((to, from, next) => {
  const metaTitle = to.meta?.title

  if (typeof metaTitle === 'string') {
    document.title = metaTitle
  } else {
    document.title = ''
  }
  const token = localStorage.getItem('token')
  if (token) {
    if (to.name === 'Login') {
      return next({ name: 'Login' })
    } else if (to.path === '/') {
      return next({ name: 'dashboard' })
    }
    return next()
  } else {
    if (whiteRoute.includes(String(to.name))) {
      return next()
    }
    ElMessage.error('登录过期，请先登录')
    return next({
      name: 'Login',
      query: { redirect: to.fullPath },
    })
  }
})

export default router
