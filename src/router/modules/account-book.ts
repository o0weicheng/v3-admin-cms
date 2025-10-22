import { User } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/account-book',
  meta: { title: '账本管理', icon: User, menus: true },
  name: 'account-book',
  children: [
    {
      path: 'overview',
      component: () => import('@/views/account-book/Overview.vue'),
      meta: { title: '收支概览' },
    },
    {
      path: 'record',
      component: () => import('@/views/account-book/Record.vue'),
      meta: { title: '记账记录' },
    },
    {
      path: 'category',
      component: () => import('@/views/account-book/Category.vue'),
      meta: { title: '分类管理' },
    },
  ],
} as RouteRecordRaw
