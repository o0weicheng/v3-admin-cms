import { Files } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/work-logs',
  meta: { title: '日志管理', menus: true, icon: Files },
  name: 'logs',
  component: () => import('@/views/work-logs/index.vue'),
} as RouteRecordRaw
