import { http } from '@/plugins/http'
import type { PaginationResponse, ProductResponse } from '.'

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
  products?: ProductResponse[]
}

type MemberListResponse = PaginationResponse<Member>

// 会员查询列表 api
export const apiMembers = async (payload: MemberPayload): Promise<MemberListResponse> => {
  let query = `page=${payload.page}&pageSize=${payload.pageSize}`
  payload.name ? (query += `&name=${payload.name}`) : null
  payload.level ? (query += `&level=${payload.level}`) : null
  if (payload.status === 1 || payload.status === 0) query += `&status=${payload.status}`
  return http.get(`/api/members/list?${query}`)
}

export const apiMemberDetail = async (id: string): Promise<Member> =>
  http.get(`/api/member/detail/${id}`)

// 新增会员 api
export const apiCreateMember = async (payload: Partial<Member>): Promise<Member> =>
  http.post(`/api/member/create`, { body: payload })

// 编辑会员 api
export const apiUpdateMember = async (payload: Member): Promise<Member> =>
  http.put(`/api/member/update/${payload.id}`, { body: payload })

// 删除会员 api
// 删除成功返回 true
// 没找到会员返回 null
export const apiDeleteMember = async (id: string): Promise<boolean | null> =>
  http.delete(`/api/member/delete/${id}`)
