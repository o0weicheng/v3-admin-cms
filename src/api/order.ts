import { http } from '@/plugins/http'
import type { PaginationResponse } from '.'

export interface OrderPayload {
  id: number
  status: string
  page: number
  pageSize: number
}

export interface OrderProduct {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

export interface Order {
  id: string
  orderNo: string
  userName: string
  userPhone: string
  userId: number
  products: OrderProduct[]
  totalAmount: number
  payType: '微信支付' | '支付宝' | '银行卡'
  status: '待支付' | '已支付' | '已发货' | '已完成' | '已取消'
  address: string
  createdAt: string
  updatedAt: string
  remark: string
}

type OrderListResponse = PaginationResponse<Order>

export const apiOrders = async (payload: OrderPayload): Promise<OrderListResponse> =>
  await http.get(
    `/api/orders?page=${payload.page}&pageSize=${payload.pageSize}&id=${payload.id || ''}&status=${payload.status || ''}`,
  )

export const apiUpdateOrder = async (payload: Order): Promise<Order> =>
  await http.put(`/api/order/update/${payload.id}`, { body: payload })

export const apiOrderDetail = async (orderNo: string): Promise<Order> =>
  await http.get(`/api/order/detail/${orderNo}`)

export const apiUpdateOrderStatus = async (id: string, status: Order['status']): Promise<Order> =>
  http.patch(`/api/order/${id}/status`, { body: { status } })

// 删除订单 api
// 删除成功返回 true
// 没找到订单返回 null
export const apiDeleteOrder = async (id: string): Promise<boolean | null> =>
  http.delete(`/api/order/delete/${id}`)
