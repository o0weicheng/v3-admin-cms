import { Coin } from '@element-plus/icons-vue'
import type { RouteRecordRaw } from 'vue-router'

export default {
  path: '/recipes',
  meta: { title: '食谱管理', icon: Coin, menus: true },
  name: 'recipes',
  children: [
    {
      path: 'list',
      component: () => import('@/views/recipes/List.vue'),
      meta: { title: '菜谱列表' },
    },
    {
      path: 'edit',
      component: () => import('@/views/recipes/Edit.vue'),
      meta: { title: '添加菜谱' },
    },
    {
      path: 'category',
      component: () => import('@/views/recipes/Category.vue'),
      meta: { title: '菜谱分类' },
    },
  ],
} as RouteRecordRaw
