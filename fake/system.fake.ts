// @ts-nocheck
import { faker } from '@faker-js/faker'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import type { PermissionModelKeys, PermissionOperateKeys } from '../src/stores'

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

export const permissionKeys = {
  user: ['add', 'edit', 'delete', 'search'],
  role: ['add', 'edit', 'delete', 'assign', 'search'],
  member: ['add', 'edit', 'delete', 'search'],
  article: ['add', 'edit', 'delete', 'search'],
  permission: ['add', 'edit', 'delete', 'search'],
  product: ['add', 'edit', 'delete', 'search'],
  order: ['add', 'edit', 'delete', 'search'],
}

export let permissions = Object.entries(permissionKeys).flatMap(([model, ops]) =>
  ops.map((operate) => ({
    id: faker.string.uuid(),
    name: `${model}:${operate}`,
    label: `${permissionOperateMaps[operate]}${permissionModelMaps[model]}`,
    description: `暂无详情`,
    createBy: '系统',
    createdAt: faker.date.recent({ days: 60 }).toISOString(),
  }))
)

export let roles = [
  {
    id: faker.string.uuid(),
    name: 'admin',
    role: '管理员',
    description: '拥有系统所有权限',
    permissions: permissions.map((p) => p.name),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
    createBy: '系统',
  },
  {
    id: faker.string.uuid(),
    name: 'editor',
    role: '编辑',
    description: '负责内容发布、修改',
    permissions: permissions
      .filter((p) => p.name.startsWith('article:') || p.name.startsWith('user:search'))
      .map((p) => p.name),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
    createBy: '系统',
  },
  {
    id: faker.string.uuid(),
    name: 'visitor',
    role: '访客',
    description: '仅浏览权限',
    permissions: permissions
      .filter((p) => p.name.endsWith(':search'))
      .map((p) => p.name),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
    createBy: '系统',
  },
]

export let users = [
  {
    id: faker.string.uuid(),
    username: 'admin',
    password: '123456',
    nickname: '超级管理员',
    role: roles[0].name,
    roleId: roles[0].id,
    status: 1,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
  {
    id: faker.string.uuid(),
    username: 'editor',
    password: '123456',
    nickname: '内容编辑',
    role: roles[1].name,
    roleId: roles[1].id,
    status: 1,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
  {
    id: faker.string.uuid(),
    username: 'visitor',
    password: '123456',
    nickname: '访客',
    role: roles[2].name,
    roleId: roles[2].id,
    status: 1,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
]

export const menus = [
  {
    id: faker.string.uuid(),
    name: '系统管理',
    path: '/system',
    icon: 'Settings',
    children: [
      { id: faker.string.uuid(), name: '用户管理', path: '/system/user', permission: 'user:search' },
      { id: faker.string.uuid(), name: '角色管理', path: '/system/role', permission: 'role:search' },
      { id: faker.string.uuid(), name: '权限管理', path: '/system/permission', permission: 'permission:search' },
    ],
  },
  {
    id: faker.string.uuid(),
    name: '内容管理',
    path: '/content',
    icon: 'FileText',
    children: [
      { id: faker.string.uuid(), name: '文章列表', path: '/content/article', permission: 'article:search' },
      { id: faker.string.uuid(), name: '新增文章', path: '/content/add', permission: 'article:add' },
    ],
  },
]

const tokenMap = new Map() // username -> token
export default defineFakeRoute([
  {
    url: '/api/system/users/create',
    method: 'post',
    response: ({ body }) => {
      const id = faker.string.uuid()
      const role = roles.find((r) => r.name === body.role)
      users.push({
        id,
        ...body,
        roleId: role?.id,
        createdAt: new Date().toISOString(),
        status: 1,
      })
      return { code: 200, message: '用户创建成功' }
    },
  },
  {
    url: '/api/system/users',
    method: 'get',
    response: () => {
      return {
        code: 200,
        data: users,
        message: ''
      }
    }
  },
  {
    url: '/api/system/users/update/:id',
    method: 'put',
    response: ({ params, body }) => {
      users = users.map((u) => (u.id === params.id ? { ...u, ...body } : u))
      return { code: 200, message: '用户更新成功', data: users }
    },
  },
  {
    url: '/api/system/users/delete/:id',
    method: 'delete',
    response: ({ params }) => {
      users = users.filter((u) => u.id !== params.id)
      return { code: 200, message: '用户删除成功', data: users }
    },
  },
  {
    url: '/api/system/roles',
    method: 'get',
    response: () => ({ code: 200, message: 'success', data: roles }),
  },
  {
    url: '/api/system/roles/create',
    method: 'post',
    response: ({ body }) => {
      const id = faker.string.uuid()
      roles.push({
        id,
        ...body,
        createdAt: new Date().toISOString(),
        createBy: '系统',
      })
      return { code: 200, message: '角色创建成功', data: roles }
    },
  },
  {
    url: '/api/system/roles/update/:id',
    method: 'put',
    response: ({ params, body }) => {
      const idx = roles.findIndex((r) => r.id === params.id)
      if (idx === -1) {
        return { code: 404, message: '找不到角色', data: null }
      }
      roles[idx] = Object.assign(roles[idx], body)
      return { code: 200, message: '角色更新成功', data: roles }
    },
  },
  {
    url: '/api/system/roles/delete/:id',
    method: 'delete',
    response: ({ params }) => {
      roles = roles.filter((r) => r.id !== params.id)
      return { code: 200, message: '角色删除成功', data: roles }
    },
  },

  {
    url: '/api/system/permissions',
    method: 'get',
    response: () => ({ code: 200, message: 'success', data: permissions }),
  },

  {
    url: '/api/system/menus',
    method: 'get',
    response: () => ({ code: 200, message: 'success', data: menus }),
  },
])
