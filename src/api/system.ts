import { http } from '@/plugins/http'

export type RoleName = 'admin' | 'editor' | 'visitor' | ''
export type PermissionMap = {
  'user:add': '新增用户'
  'user:edit': '编辑用户'
  'user:delete': '删除用户'
  'role:assign': '分配角色'
  'article:add': '新增文章'
  'article:edit': '编辑文章'
}

export interface User {
  id?: string
  username: RoleName
  nickname: string
  role: string
  status: 0 | 1
  createdAt?: string
}

export interface Role<T = keyof PermissionMap> {
  id?: string
  name: string
  role: RoleName
  permissions: T[]
}

export interface Permission {
  id?: string,
  name: string,
  label: string,
  description: string,
  createBy?: string,
  createdAt?: string,
}

// 账号
export const apiUserList = (): Promise<User[]> => http.get('/api/system/users')
export const apiUserEdit = (payload: User): Promise<User> => http.put(`/api/system/users/update/${payload.id}`, { body: payload })
export const apiUserCreate = (payload: User): Promise<User> => http.post(`/api/system/users/create`, { body: payload })
export const apiUserDelete = (id: string): Promise<User> => http.delete(`/api/system/users/delete/${id}`)
// 角色
export const apiRoleList = (): Promise<Role[]> => http.get('/api/system/roles')
export const apiRoleEdit = (payload: Role): Promise<Role> => http.put(`/api/system/roles/update/${payload.id}`, { body: payload })
export const apiRoleCreate = (payload: Role): Promise<Role> => http.post(`/api/system/roles/create`, { body: payload })
export const apiRoleDelete = (id: string): Promise<Role[]> => http.delete(`/api/system/roles/delete/${id}`)
// 权限
export const apiPermissionList = (): Promise<Permission[]> => http.get('/api/system/permissions')
export const apiPermissionEdit = (payload: Permission): Promise<Permission> => http.put(`/api/system/permissions/update/${payload.id}`, { body: payload })
export const apiPermissionCreate = (payload: Permission): Promise<Permission> => http.post(`/api/system/permissions/create`, { body: payload })
export const apiPermissionDelete = (id: string): Promise<Permission> => http.delete(`/api/system/permissions/delete/${id}`)
