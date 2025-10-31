import { faker } from '@faker-js/faker'
// mock/system/account.ts
import { defineFakeRoute } from 'vite-plugin-fake-server/client'

let uuid = [faker.string.uuid(), faker.string.uuid(), faker.string.uuid()]
let users = [
  {
    id: uuid[0],
    username: 'admin',
    nickname: '超级管理员',
    role: 'admin',
    status: 1,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
  {
    id: uuid[1],
    username: 'editor',
    nickname: '内容编辑',
    role: 'editor',
    status: 1,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
  {
    id: uuid[2],
    username: 'visitor',
    nickname: '访客',
    role: 'visitor',
    status: 0,
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
  },
]

let roles = [
  {
    id: uuid[0],
    name: 'admin',
    role: '管理员',
    permissions: ['user:add', 'user:edit', 'user:delete', 'role:assign'],
  },
  { id: uuid[1], name: 'editor', role: '编辑', permissions: ['article:add', 'article:edit'] },
  { id: uuid[2], name: 'visitor', role: '访客', permissions: [] },
]

let permissions = [
  { id: faker.string.uuid(), name: 'user:add', label: '新增用户' },
  { id: faker.string.uuid(), name: 'user:edit', label: '编辑用户' },
  { id: faker.string.uuid(), name: 'user:delete', label: '删除用户' },
  { id: faker.string.uuid(), name: 'role:assign', label: '分配角色' },
  { id: faker.string.uuid(), name: 'article:add', label: '新增文章' },
  { id: faker.string.uuid(), name: 'article:edit', label: '编辑文章' },
]

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
    url: '/api/system/users',
    method: 'post',
    response: ({ body }) => {
      const id = Date.now()
      users.push({ id, ...body, createdAt: new Date().toISOString(), status: 1 })
      return { code: 200, message: '用户创建成功' }
    },
  },
  // 编辑用户
  {
    url: '/api/system/users/:id',
    method: 'put',
    response: ({ params, body }) => {
      users = users.map((u) => (u.id === Number(params.id) ? { ...u, ...body } : u))
      return { code: 200, message: '用户更新成功' }
    },
  },
  // 删除用户
  {
    url: '/api/system/users/:id',
    method: 'delete',
    response: ({ params }) => {
      users = users.filter((u) => u.id !== Number(params.id))
      return { code: 200, message: '用户删除成功' }
    },
  },
  // 获取角色列表
  {
    url: '/api/system/roles',
    method: 'get',
    response: () => ({ code: 200, message: 'success', data: roles }),
  },
  // 获取权限列表
  {
    url: '/api/system/permissions',
    method: 'get',
    response: () => ({ code: 200, message: 'success', data: permissions }),
  },
])
