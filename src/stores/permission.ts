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

interface CascaderOptions {
  value: PermissionModelKeys | PermissionOperateKeys
  label: string
  children?: CascaderOptions[]
}

export const usePermissionStore = defineStore('permission', () => {
  const permissionOperateMaps: Record<PermissionOperateKeys, string> = {
    add: '增加',
    delete: '删除',
    edit: '修改',
    search: '查询',
    assign: '分配',
  }
  const permissionModelMaps: Record<PermissionModelKeys, string> = {
    user: '账号',
    role: '角色',
    member: '会员',
    article: '文章',
    product: '商品',
    order: '订单',
    permission: '权限',
  }

  const permissionMaps: Record<PermissionModelKeys, PermissionOperateKeys[]> = {
    user: ['add', 'edit', 'search', 'delete'],
    role: ['add', 'edit', 'search', 'delete', 'assign'],
    member: ['add', 'edit', 'search', 'delete'],
    article: ['add', 'edit', 'search', 'delete'],
    product: ['add', 'edit', 'search', 'delete'],
    order: ['add', 'edit', 'search', 'delete'],
    permission: ['add', 'edit', 'search', 'delete', 'assign'],
  }

  const permissionCascaderOptions = computed(() => {
    const options: CascaderOptions[] =  []
    for (const key of Object.keys(permissionMaps) as PermissionModelKeys[]) {
      const option: CascaderOptions = {
        label: permissionModelMaps[key],
        value: key,
        children: permissionMaps[key].map((item: PermissionOperateKeys) => ({ label: permissionOperateMaps[item], value: item })),
      }
      options.push(option)
    }
    return options
  })

  const getPermissionLabel = (model: PermissionModelKeys, operate: PermissionOperateKeys): string => `${permissionOperateMaps[operate]}${permissionModelMaps[model]}`

  return {
    permissionMaps,
    permissionModelMaps,
    permissionOperateMaps,
    permissionCascaderOptions,
    getPermissionLabel
  }
})