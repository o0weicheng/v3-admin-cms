import { http } from '@/plugins/http'
import type { PaginationResponse } from '.'

export interface MemberPayload {
  page: number
  pageSize: number
  name?: string
  level?: '普通会员' | '黄金会员' | '白金会员' | '钻石会员' | ''
  status?: 0 | 1 | null
}

export interface Member {
  id: string
  avatar: string
  name: string
  phone: string
  email: string
  level: '普通会员' | '黄金会员' | '白金会员' | '钻石会员'
  balance: number
  points: number
  gender: '男' | '女' | '未知'
  status: 0 | 1
  registerAt: string
  lastLoginAt: string
  remark: string
  createdAt: string
  updatedAt: string
}

type MemberListResponse = PaginationResponse<Member>

// 会员查询列表 api
export const apiMembers = async (payload: MemberPayload): Promise<MemberListResponse> => {
  let query = `page=${payload.page}&pageSize=${payload.pageSize}`
  payload.name ? (query += `&name=${payload.name}`) : null
  payload.level ? (query += `&level=${payload.level}`) : null
  payload.status ? (query += `&name=${payload.status}`) : null

  return http.get(`/api/members/list?${query}`)
}
