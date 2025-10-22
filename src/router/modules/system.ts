import { Setting } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/system',
  meta: { title: '系统设置', icon: Setting, menus: true },
  name: 'system',
  component: () => import('@/views/system/index.vue'),
} as RouteRecordRaw
