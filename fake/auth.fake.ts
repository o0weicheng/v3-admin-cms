// @ts-nocheck
import { defineFakeRoute } from 'vite-plugin-fake-server'
import { faker } from '@faker-js/faker'

export default defineFakeRoute([
  // Login
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }) => {
      const { username, password } = body
      if (username === 'admin' && password === '123456') {
        return {
          code: 200,
          message: 'Login successful',
          data: {
            token: faker.string.uuid(),
            userInfo: {
              id: 1,
              name: 'Admin User',
              avatar: faker.image.avatar(),
              role: 'admin',
            },
          },
        }
      }
      return { code: 401, message: 'Invalid username or password' }
    },
  },

  // Profile
  {
    url: '/api/auth/profile',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: {
        id: 1,
        name: 'Admin User',
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        role: 'admin',
      },
    }),
  },
])
