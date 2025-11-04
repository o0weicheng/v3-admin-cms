import { defineStore } from 'pinia'
import type { CategoryResponse } from '@/api'

export const useCategoryStore = defineStore('category', () => {
  const detail = reactive<CategoryResponse>({
    id: 0,
    name: '',
    parentId: 0,
    createdAt: '',
    updatedAt: '',
    children: []
  })

  const setDetail = (payload: CategoryResponse) => {
    Object.assign(detail, payload)
  }

  const $reset = () => {
    Object.assign(detail, {
      id: 0,
      name: '',
      parentId: 0,
      createdAt: '',
      updatedAt: '',
      children: []
    })
  }

  return {
    detail,
    setDetail,
    $reset
  }
})