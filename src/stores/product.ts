import { defineStore } from 'pinia'
import type { ProductResponse } from '@/api'

export const useProductStore = defineStore('product', () => {
  const detail = reactive<ProductResponse>({
    id: 0,
    name: '',
    categoryId: '',
    categoryName: '',
    price: 0,
    stock: 0,
    sales: 0,
    image: '',
    description: '',
    createdAt: '',
    updatedAt: '',
    status: 0,
  })

  const setDetail = (payload: ProductResponse) => {
    Object.assign(detail, payload)
  }

  const $reset = () => {
    Object.assign(detail, {
      id: 0,
      name: '',
      categoryId: '',
      categoryName: '',
      price: 0,
      stock: 0,
      sales: 0,
      image: '',
      description: '',
      createdAt: '',
      updatedAt: '',
      status: 0,
    })
  }

  return {
    detail,
    setDetail,
    $reset
  }
})