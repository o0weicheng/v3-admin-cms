import { User } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/member',
  meta: { title: '会员管理', menus: true },
  name: 'member',
  children: [
    {
      path: 'overview',
      name: 'member-overview',
      component: () => import('@/views/member/overview.vue'),
      meta: { title: '会员管理', icon: User },
    },
    {
      path: 'detail/:id',
      name: 'member-detail',
      component: () => import('@/views/member/detail.vue'),
      meta: {
        title: '会员详情',
        hidden: true,
      },
    },
  ],
} as RouteRecordRaw
