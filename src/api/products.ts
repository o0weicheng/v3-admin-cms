import { http } from '@/plugins/http'
import type { PaginationResponse } from '@/api/index.ts'

export interface ProductResponse {
  id: number
  name: string
  category: string
  price: number
  stock: number
  sales: number
  image: string
  description: string
  createdAt: string
  updatedAt: string
  status: number
}

export interface ProductPayload {
  page: number
  pageSize: number
}

type ProductListResponse = PaginationResponse<ProductResponse>

// 商品查询列表 api
export const apiProducts = async (payload: ProductPayload): Promise<ProductListResponse> =>
  http.get(`/api/product/list?page=${payload.page}&pageSize=${payload.pageSize}`)

// 商品删除 api
// 删除成功返回 true
// 没找到商品返回 null
export const apiDeleteProduct = async (id: number): Promise<boolean | null> =>
  http.delete(`/api/product/delete?id=${id}`)

// 新增商品
export const apiCreateProduct = async (payload: ProductResponse): Promise<ProductResponse> =>
  http.post(`/api/product/create`, { body: payload })
// 编辑商品
export const apiUpdateProduct = async (payload: ProductResponse): Promise<ProductResponse> =>
  http.put('/api/product/update/', { body: payload })
