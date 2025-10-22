import { Tickets } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/memos',
  meta: { title: '备忘录', icon: Tickets, menus: true },
  name: 'memos',
  children: [
    {
      path: 'list',
      component: () => import('@/views/memos/List.vue'),
      meta: { title: '待办列表' },
    },
    {
      path: 'calendar',
      component: () => import('@/views/memos/Calendar.vue'),
      meta: { title: '日历视图' },
    },
    {
      path: 'tags',
      component: () => import('@/views/memos/Tags.vue'),
      meta: { title: '标签管理' },
    },
  ],
} as RouteRecordRaw
