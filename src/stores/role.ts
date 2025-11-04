import { defineStore } from 'pinia'

export const useRoleStore = defineStore('role', () => {
  const Role = {
    Admin: 'admin',
    User: 'user',
    Guest: 'guest',
  } as const

  type Role = typeof Role[keyof typeof Role]

  const roleMap: Record<Role, string> = {
    [Role.Admin]: '管理员',
    [Role.User]: '普通用户',
    [Role.Guest]: '访客'
  }
  return {}
})