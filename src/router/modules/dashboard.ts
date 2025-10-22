import { Odometer } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/dashboard',
  meta: { title: '仪表盘', icon: Odometer, menus: true },
  name: 'dashboard',
  component: () => import('@/views/dashboard/index.vue'),
} as RouteRecordRaw
