import { User } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/product',
  meta: { title: '商品管理', icon: User, menus: true },
  name: 'product',
  children: [
    {
      path: 'overview',
      name: 'product-overview',
      component: () => import('@/views/product/overview.vue'),
      meta: { title: '商品管理' },
    },
    {
      path: 'category',
      name: 'product-category',
      component: () => import('@/views/product/category.vue'),
      meta: { title: '商品分类' },
    },
    {
      path: 'stock',
      name: 'product-stock',
      component: () => import('@/views/product/stock.vue'),
      meta: { title: '商品库存' },
    },
    {
      path: 'product-detail',
      name: 'product-detail',
      component: () => import('@/views/product/detail.vue'),
      meta: {
        title: '商品详情',
        hidden: true,
      }
    }
  ],
} as RouteRecordRaw
