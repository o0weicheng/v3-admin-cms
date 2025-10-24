import { User } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/product',
  meta: { title: '商品管理', icon: User, menus: true },
  name: 'product',
  children: [
    {
      path: 'overview',
      component: () => import('@/views/product/overview.vue'),
      meta: { title: '商品管理' },
    },
    {
      path: 'category',
      component: () => import('@/views/product/category.vue'),
      meta: { title: '商品分类' },
    },
    {
      path: 'stock',
      component: () => import('@/views/product/stock.vue'),
      meta: { title: '商品库存' },
    },
  ],
} as RouteRecordRaw
