import { defineFakeRoute } from 'vite-plugin-fake-server'
import { faker } from '@faker-js/faker'

interface Log {
  id: string
  username: string
  action: string
  module: string
  ip: string
  status: number
  message: string
  createdAt: string
}

export const logs: Log[] = Array.from({ length: 80 }).map(() => ({
  id: faker.string.uuid(),
  username: faker.helpers.arrayElement(['admin', 'editor', 'guest', 'system']),
  action: faker.helpers.arrayElement(['新增', '修改', '删除', '登录', '登出', '查看']),
  module: faker.helpers.arrayElement(['商品管理', '订单管理', '会员管理', '库存管理', '系统设置']),
  ip: faker.internet.ip(),
  status: faker.helpers.arrayElement([0, 1]), // 0失败 1成功
  message: faker.lorem.sentence(),
  createdAt: faker.date.recent({ days: 30 }).toISOString(),
}))

export default defineFakeRoute([
  // ✅ 获取日志列表
  {
    url: '/api/logs',
    method: 'GET',
    response: ({ query }) => {
      const page = Number(query.page) || 1
      const pageSize = Number(query.pageSize) || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize
      let list = []
      if (query.user) {
        list = logs.filter((log) => log.username === query.user)
      } else {
        list = logs
      }
      const newList = list.slice(start, end)
      return {
        code: 200,
        message: 'success',
        data: {
          list: newList,
          pagination: {
            page,
            pageSize,
            total: list.length,
          },
        },
      }
    },
  },

  // 获取操作人员
  {
    url: '/api/logs/users',
    method: 'GET',
    response: () => {
      const users = Array.from(new Set(logs.map((log) => log.username)))
      return {
        code: 200,
        message: 'success',
        data: users,
      }
    },
  },

  // ✅ 新增日志
  {
    url: '/api/logs',
    method: 'POST',
    response: ({ body }) => {
      const newLog: Log = {
        id: faker.string.uuid(),
        username: body.username || 'system',
        action: body.action || '新增',
        module: body.module || '未知模块',
        ip: faker.internet.ip(),
        status: body.status ?? 1,
        message: body.message || '手动添加日志',
        createdAt: new Date().toISOString(),
      }
      logs.unshift(newLog)
      return {
        code: 200,
        message: '日志添加成功',
        data: newLog,
      }
    },
  },

  // ✅ 修改日志（一般系统日志不允许修改，这里只是演示）
  {
    url: '/api/logs/:id',
    method: 'PUT',
    response: ({ params, body }) => {
      const index = logs.findIndex((log) => log.id === params.id)
      if (index === -1) return { code: 1, message: '日志不存在' }

      logs[index] = { ...logs[index], ...body }
      return { code: 200, message: '日志修改成功', data: logs[index] }
    },
  },

  // ✅ 删除日志
  {
    url: '/api/logs/:id',
    method: 'DELETE',
    response: ({ params }) => {
      const index = logs.findIndex((log) => log.id === params.id)
      if (index === -1) return { code: 1, message: '日志不存在' }

      logs.splice(index, 1)
      return { code: 200, message: '删除成功' }
    },
  },
])
