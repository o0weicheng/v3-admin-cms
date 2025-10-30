// @ts-nocheck
import { products } from './product.fake'

import { defineFakeRoute } from 'vite-plugin-fake-server'
import { faker } from '@faker-js/faker'

// 初始化模拟会员数据
let memberList = Array.from({ length: 80 }).map(() => ({
  id: faker.string.uuid(),
  avatar: faker.image.avatarGitHub(),
  name: faker.person.fullName(),
  phone: faker.phone.number({ style: 'international' }),
  email: faker.internet.email(),
  level: faker.helpers.arrayElement(['普通会员', '黄金会员', '白金会员', '钻石会员']),
  balance: faker.number.float({ min: 0, max: 2000, precision: 0.01 }),
  points: faker.number.int({ min: 0, max: 5000 }),
  gender: faker.helpers.arrayElement(['男', '女', '未知']),
  status: faker.number.int({ min: 0, max: 1 }), // 0=禁用 1=启用
  registerAt: faker.date.past({ years: 2 }).toISOString(),
  lastLoginAt: faker.date.recent({ days: 20 }).toISOString(),
  remark: faker.lorem.sentence(),
  createdAt: faker.date.anytime(),
  updatedAt: faker.date.anytime(),
}))

export default defineFakeRoute([
  // 获取会员列表（分页）
  {
    url: '/api/members/list',
    method: 'GET',
    response: ({ query }) => {
      const page = Number(query.page) || 1
      const pageSize = Number(query.pageSize) || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      let list = []
      if (query.name) {
        list = memberList.filter((member) => member.name.includes(query.name as string))
      } else if (query.status === '1' || query.status === '0') {
        list = memberList.filter((member) => member.status === Number(query.status))
      } else if (query.level) {
        list = memberList.filter((member) => member.level === (query.level as string))
      } else {
        list = memberList
      }
      const newList = list.slice(start, end)
      return {
        code: 200,
        message: 'ok',
        data: {
          list: newList,
          pagination: {
            page,
            pageSize,
            total: list.length,
            limit: end,
          },
        },
      }
    },
  },

  // 获取会员详情
  {
    url: '/api/member/detail/:id',
    method: 'GET',
    response: ({ params }) => {
      const member = memberList.find((m) => m.id === params.id)
      if (!member) return { code: 404, message: '会员不存在', data: null }

      return {
        code: 200,
        message: 'ok',
        data: { ...member, products: products.slice(0, faker.number.int({ min: 0, max: 12 })) },
      }
    },
  },

  // 新增会员
  {
    url: '/api/member/create',
    method: 'POST',
    response: ({ body }) => {
      const newMember = {
        id: faker.string.uuid(),
        avatar: body.avatar || faker.image.avatarGitHub(),
        name: body.name || faker.person.fullName(),
        phone: body.phone || faker.phone.number('1##########'),
        email: body.email || faker.internet.email(),
        level: body.level || '普通会员',
        balance: body.balance || 0,
        points: body.points || 0,
        gender: body.gender || '未知',
        status: 1,
        registerAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        remark: body.remark || '',
      }
      memberList.unshift(newMember)
      return { code: 200, message: '会员创建成功', data: newMember }
    },
  },

  // 编辑会员
  {
    url: '/api/member/update/:id',
    method: 'PUT',
    response: ({ params, body }) => {
      const index = memberList.findIndex((m) => m.id === params.id)
      if (index === -1) return { code: 404, message: '会员不存在', data: null }

      memberList[index] = { ...memberList[index], ...body, updatedAt: new Date().toISOString() }
      return { code: 200, message: '会员更新成功', data: memberList[index] }
    },
  },

  // 删除会员
  {
    url: '/api/member/delete/:id',
    method: 'DELETE',
    response: ({ params }) => {
      const index = memberList.findIndex((m) => m.id === params.id)
      if (index === -1) return { code: 404, message: '会员不存在', data: null }

      const removed = memberList.splice(index, 1)
      return { code: 200, message: '会员删除成功', data: removed[0] }
    },
  },
])
