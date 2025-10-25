import { defineStore } from 'pinia'
import type { ProductResponse } from '@/api'

export const useProductStore = defineStore('product', () => {
  const detail = reactive<ProductResponse>({
    id: 0,
    name: '',
    category: '',
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

  return {
    detail,
    setDetail,
  }
})