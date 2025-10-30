import { http } from '@/plugins/http'
import type { PaginationResponse } from '.'

export interface LogPayload {
  page: number
  pageSize: number
  user: string
}

export interface Log {
  id: string
  username: string
  action: string
  module: string
  ip: string
  status: number
  message: string
  createdAt: string
}

type OrderListResponse = PaginationResponse<Log>

export const apiLogList = (payload: LogPayload): Promise<OrderListResponse> =>
  http.get(`/api/logs?page=${payload.page}&pageSize=${payload.pageSize}&user=${payload.user}`)

export const apiCreateLog = (payload: Omit<Log, 'id' | 'createdAt'>): Promise<Log> =>
  http.post('/api/logs', { body: payload })

export const apiUpdateLog = (
  id: string,
  payload: Partial<Omit<Log, 'id' | 'createdAt'>>,
): Promise<Log> => http.put(`/api/logs/${id}`, { body: payload })

export const apiDeleteLog = (id: string): Promise<boolean | null> => http.delete(`/api/logs/${id}`)

export const apiLogUsers = (): Promise<string[]> => http.get('/api/logs/users')
