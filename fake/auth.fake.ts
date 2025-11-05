// @ts-nocheck
import { defineFakeRoute } from 'vite-plugin-fake-server'
import { faker } from '@faker-js/faker'
import { users, roles, permissions } from './system.fake'

export default defineFakeRoute([
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body

      const user = users.find((u) => u.username === username)
      if (!user) {
        return { code: 401, message: '用户不存在' }
      }
      if (password !== '123456') {
        return { code: 401, message: '密码错误' }
      }

      const userRoles = roles.filter((r) => user.roleId === r.id)

      return {
        code: 200,
        message: 'Login successful',
        data: {
          token: faker.string.uuid(),
          userInfo: {
            id: user.id,
            username: user.username,
            nickname: user.nickname,
            avatar: faker.image.avatar(),
            roles: userRoles.map((r) => r.name),
          },
        },
      }
    },
  },

  {
    url: '/api/auth/profile',
    method: 'get',
    response: () => {
      const user = users[0] // 默认 admin
      const userRoles = roles.filter((r) => user.roleIds.includes(r.id))
      const userPermissions = Array.from(new Set(userRoles.flatMap((r) => r.permissionIds))).map(
        (pid) => permissions.find((p) => p.id === pid),
      )

      return {
        code: 200,
        message: 'ok',
        data: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          email: faker.internet.email(),
          avatar: faker.image.avatar(),
          roles: userRoles.map((r) => r.name),
          permissions: userPermissions.map((p) => p.name),
        },
      }
    },
  },
  {
    url: '/api/auth/logout',
    method: 'post',
    response: ({ headers }) => {
      const token = headers.authorization?.replace('Bearer ', '')
      if (token && tokens[token]) delete tokens[token]
      return { code: 200, message: '退出登录成功' }
    },
  },
])
