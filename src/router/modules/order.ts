import { List, Tickets } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/order',
  meta: { title: '订单管理', icon: Tickets, menus: true },
  name: 'order',
  children: [
    {
      path: 'overview',
      name: 'order-overview',
      component: () => import('@/views/order/overview.vue'),
      meta: {
        title: '订单管理',
        icon: Tickets,
      },
    },
    {
      path: 'detail/:id',
      name: 'order-detail',
      component: () => import('@/views/order/detail.vue'),
      meta: {
        title: '订单详情',
        hidden: true,
      },
    },
  ],
} as RouteRecordRaw
