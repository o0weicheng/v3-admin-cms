import { Setting } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/system',
  meta: { title: '系统', icon: Setting, menus: true },
  name: 'system',
  children: [
    {
      path: 'config',
      name: 'system-config',
      meta: { title: '系统设置' },
      component: () => import('@/views/system/index.vue'),
    },
    {
      path: 'role',
      name: 'system-role',
      meta: { title: '账号与角色' },
      component: () => import('@/views/system/role.vue'),
    },
    {
      path: 'permission',
      name: 'system-permission',
      meta: { title: '权限管理' },
      component: () => import('@/views/system/permission.vue'),
    },
  ],
} as RouteRecordRaw
