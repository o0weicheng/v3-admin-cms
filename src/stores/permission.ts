import { defineStore } from 'pinia'

export type PermissionOperateKeys = 'add' | 'delete' | 'edit' | 'search' | 'assign'
export type PermissionModelKeys =
  | 'user'
  | 'role'
  | 'member'
  | 'article'
  | 'product'
  | 'order'
  | 'permission'
export type Split<S extends string> = S extends `${infer T}:${infer U}` ? [T, U] : never
export type permissionName = `${PermissionModelKeys}:${PermissionOperateKeys}`

interface PermissionValuesOption<K extends string = string> {
  value: K
  label: string
  disabled?: boolean
}

export const usePermissionStore = defineStore('permission', () => {
  const permissionOperateMaps: Record<PermissionOperateKeys, string> = {
    add: '增加',
    delete: '删除',
    edit: '修改',
    search: '查询',
    assign: '分配',
  } as const

  const permissionModelMaps: Record<PermissionModelKeys, string> = {
    user: '账号',
    role: '角色',
    member: '会员',
    article: '文章',
    product: '商品',
    order: '订单',
    permission: '权限',
  } as const

  const permissionMaps: Record<PermissionModelKeys, PermissionOperateKeys[]> = {
    user: ['add', 'edit', 'search', 'delete'],
    role: ['add', 'edit', 'search', 'delete', 'assign'],
    member: ['add', 'edit', 'search', 'delete'],
    article: ['add', 'edit', 'search', 'delete'],
    product: ['add', 'edit', 'search', 'delete'],
    order: ['add', 'edit', 'search', 'delete'],
    permission: ['add', 'edit', 'search', 'delete', 'assign'],
  } as const

  const permissionValuesOption = computed(() => {
    const options: Record<'model' | 'operate', PermissionValuesOption[]> = {
      'model': [],
      'operate': [],
    }
    options.model = (Object.keys(permissionMaps) as PermissionModelKeys[]).map(key => ({
      label: permissionModelMaps[key],
      value: key,
    }))
    options.operate = (Object.keys(permissionOperateMaps) as PermissionOperateKeys[]).map(key => ({
      label: permissionOperateMaps[key],
      value: key,
    }))
    return options
  })

  const permissionValuesMap = <T extends permissionName>(
    value: T,
  ): Split<T> => value.split(':') as Split<T>

  const getPermissionLabel = (model: PermissionModelKeys, operate: PermissionOperateKeys): string =>
    `${permissionOperateMaps[operate]}${permissionModelMaps[model]}`
  return {
    permissionMaps,
    permissionModelMaps,
    permissionOperateMaps,
    permissionValuesOption,
    getPermissionLabel,
    permissionValuesMap
  }
})
