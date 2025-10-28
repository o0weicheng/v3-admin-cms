import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import product from './modules/product'
import recipes from './modules/recipes'
import memos from './modules/memos'
import system from './modules/system'
import dashboard from './modules/dashboard'
import { ElMessage } from 'element-plus'
import member from './modules/member'

export const modulesRoute = [dashboard, product, recipes, memos, member, system]

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
