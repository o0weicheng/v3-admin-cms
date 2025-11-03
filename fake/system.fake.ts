// @ts-nocheck
import { faker } from '@faker-js/faker'
import { defineFakeRoute } from 'vite-plugin-fake-server/client'

export let users = [
  {
    id: faker.string.uuid(),
    username: 'admin',
    nickname: '超级管理员',
    role: '管理员',
    status: 1,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
  {
    id: faker.string.uuid(),
    username: 'editor',
    nickname: '内容编辑',
    role: '编辑',
    status: 1,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
  {
    id: faker.string.uuid(),
    username: 'visitor',
    nickname: '访客',
    role: '访客',
    status: 0,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
]

export let permissions = [
  {
    id: faker.string.uuid(),
    name: 'user:add',
    label: '新增用户',
    description: '可以新增用户（非账号）',
    createBy: users[0].nickname,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
  {
    id: faker.string.uuid(),
    name: 'user:edit',
    label: '编辑用户',
    description: '可以编辑用户（非账号）',
    createBy: users[0].nickname,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
  {
    id: faker.string.uuid(),
    name: 'user:delete',
    label: '删除用户',
    description: '可以删除用户（非账号）',
    createBy: users[0].nickname,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
  {
    id: faker.string.uuid(),
    name: 'role:assign',
    label: '分配角色',
    description: '用于分配下属账号角色',
    createBy: users[0].nickname,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
  {
    id: faker.string.uuid(),
    name: 'article:add',
    label: '新增文章',
    description: '可以新增文章',
    createBy: users[0].nickname,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
  {
    id: faker.string.uuid(),
    name: 'article:edit',
    label: '编辑文章',
    description: '可以编辑文章',
    createBy: users[0].nickname,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
  {
    id: faker.string.uuid(),
    name: 'permissions:add',
    label: '新增权限',
    description: '可以新增权限',
    createBy: users[0].nickname,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
  {
    id: faker.string.uuid(),
    name: 'permissions:edit',
    label: '编辑权限',
    description: '可以编辑权限',
    createBy: users[0].nickname,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
]
export let roles = [
  {
    id: faker.string.uuid(),
    name: 'admin',
    role: '管理员',
    permissions: [
      permissions[0].name,
      permissions[1].name,
      permissions[2].name,
      permissions[3].name,
    ],
  },
  {
    id: faker.string.uuid(),
    name: 'editor',
    role: '编辑',
    permissions: [permissions[4].name, permissions[5].name],
  },
  { id: faker.string.uuid(), name: 'visitor', role: '访客', permissions: [] },
]

export const permissionKeys = {
  user: ['add', 'edit', 'delete', 'search'],
  role: ['add', 'edit', 'delete'],
  member: ['add'],
  article: ['add', 'edit', 'delete', 'search'],
  permission: ['add', 'edit', 'delete', 'search', 'assign'],
  product: ['add', 'edit', 'delete', 'search'],
  order: ['add', 'edit', 'delete', 'search'],
}

export default defineFakeRoute([
  // 获取用户列表
  {
    url: '/api/system/users',
    method: 'get',
    response: ({ query }) => {
      const { keyword } = query
      let data = users
      if (keyword) {
        data = data.filter((u) => u.username.includes(keyword) || u.nickname.includes(keyword))
      }
      return { code: 200, message: 'success', data }
    },
  },
  // 新增用户
  {
    url: '/api/system/users/create',
    method: 'post',
    response: ({ body }) => {
      const id = faker.string.uuid()
      users.push({ id, ...body, createdAt: new Date().toISOString(), status: 1 })
      return { code: 200, message: '用户创建成功' }
    },
  },
  // 编辑用户
  {
    url: '/api/system/users/update/:id',
    method: 'put',
    response: ({ params, body }) => {
      users = users.map((u) => (u.id === params.id ? { ...u, ...body } : u))
      return { code: 200, message: '用户更新成功', data: users }
    },
  },
  // 删除用户
  {
    url: '/api/system/users/delete/:id',
    method: 'delete',
    response: ({ params }) => {
      users = users.filter((u) => u.id !== params.id)
      return { code: 200, message: '用户删除成功', data: users }
    },
  },
  // 获取角色列表
  {
    url: '/api/system/roles',
    method: 'get',
    response: () => ({ code: 200, message: 'success', data: roles }),
  },
  // 新增角色
  {
    url: '/api/system/roles/create',
    method: 'post',
    response: ({ body }) => {
      const id = faker.string.uuid()
      roles.push({
        id,
        ...body,
        createdAt: new Date().toISOString(),
        createBy: users[0].nickname
      })
      return { code: 200, message: 'success', data: roles }
    },
  },
  // 编辑角色
  {
    url: '/api/system/roles/update/:id',
    method: 'put',
    response: ({ params, body }) => {
      const idx = roles.findIndex((r) => r.id === params.id)
      if (idx === -1) {
        return { code: 404, message: '找不到角色', data: null }
      }
      roles[idx] = Object.assign(roles[idx], body)
      return { code: 200, message: '更新成功', data: roles }
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
  // 获取权限列表
  {
    url: '/api/system/permissions',
    method: 'get',
    response: () => ({ code: 200, message: 'success', data: permissions }),
  },
  {
    url: '/api/system/permissions/create',
    method: 'post',
    response: () => {
      const id = faker.string.uuid()
      permissions.push({
        id,
        ...body,
        createdAt: new Date().toISOString(),
      })
      return { code: 200, message: 'success', data: permissions }
    },
  },
  {
    url: '/api/system/permissions/update/:id',
    method: 'put',
    response: ({ params, body }) => {
      const idx = permissions.findIndex((p) => p.id === params.id)
      if (idx === -1) {
        return { code: 404, message: '找不到相关权限', data: null }
      }
      permissions[idx] = Object.assign(permissions[idx], body)
      return { code: 200, message: 'success', data: permissions }
    },
  },
  {
    url: '/api/system/permissions/delete/:id',
    method: 'delete',
    response: ({ params }) => {
      permissions = permissions.filter((p) => p.id !== params.id)
      return { code: 200, message: '删除成功', data: permissions }
    },
  }
])
