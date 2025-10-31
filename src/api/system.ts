import { http } from '@/plugins/http'
import type { PaginationResponse } from '.'

type RoleName = 'admin' | 'editor' | 'visitor'

export interface User {
  id: string
  username: string
  nickname: string
  role: RoleName
  status: 0 | 1
  createdAt: string
}

export interface Role {
  id: string
  name: string
  role: RoleName
  permissions: string[]
}

export interface Permission {
  id: string
  name: string
  label: string
}

export const apiUserList = (): Promise<User[]> => http.get('/api/system/users')
export const apiRoleList = (): Promise<Role[]> => http.get('/api/system/roles')
export const apiPermissionList = (): Promise<Permission[]> => http.get('/api/system/permissions')
