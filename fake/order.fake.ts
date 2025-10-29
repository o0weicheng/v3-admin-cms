import { defineFakeRoute } from 'vite-plugin-fake-server'
import { faker } from '@faker-js/faker'

// 模拟数据库：订单列表
let orderList = Array.from({ length: 120 }).map(() => {
  const orderId = faker.string.uuid()
  const productCount = faker.number.int({ min: 1, max: 5 })
  const products = Array.from({ length: productCount }).map(() => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    price: faker.number.float({ min: 10, max: 999, precision: 0.01 }),
    quantity: faker.number.int({ min: 1, max: 3 }),
    image: faker.image.urlLoremFlickr({ category: 'product' }),
  }))

  const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

  return {
    id: orderId,
    orderNo: faker.string.alphanumeric({ length: 10, casing: 'upper' }),
    userName: faker.person.fullName(),
    userPhone: faker.phone.number('1##########'),
    userId: faker.string.uuid(),
    products,
    totalAmount: Number(totalAmount.toFixed(2)),
    payType: faker.helpers.arrayElement(['微信支付', '支付宝', '银行卡']),
    status: faker.helpers.arrayElement(['待支付', '已支付', '已发货', '已完成', '已取消']),
    address: faker.location.streetAddress(),
    createdAt: faker.date.recent({ days: 30 }).toISOString(),
    updatedAt: faker.date.recent({ days: 5 }).toISOString(),
    remark: faker.lorem.sentence(),
  }
})

export default defineFakeRoute([
  // 获取订单列表（分页）
  {
    url: '/api/orders',
    method: 'get',
    response: ({ query }) => {
      const page = Number(query.page) || 1
      const pageSize = Number(query.pageSize) || 10
      const start = (page - 1) * pageSize
      const end = start + pageSize

      let list = []
      if (query.id) {
        list = orderList.filter((o) => o.orderNo === query.id)
      } else if (query.status) {
        list = orderList.filter((o) => o.status === query.status)
      } else {
        list = orderList
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
          },
        },
      }
    },
  },

  // 获取订单详情
  {
    url: '/api/order/:id',
    method: 'get',
    response: ({ params }) => {
      const order = orderList.find((o) => o.orderNo === params.id)
      if (!order) return { code: 404, message: '订单不存在', data: null }

      return { code: 200, message: 'ok', data: order }
    },
  },

  // 创建订单
  {
    url: '/api/order',
    method: 'post',
    response: ({ body }) => {
      const newOrder = {
        id: faker.string.uuid(),
        orderNo: faker.string.alphanumeric({ length: 10, casing: 'upper' }),
        userName: body.userName || faker.person.fullName(),
        userPhone: body.userPhone || faker.phone.number('1##########'),
        products: body.products || [],
        totalAmount: body.totalAmount || 0,
        payType: body.payType || '微信支付',
        status: '待支付',
        address: body.address || faker.location.streetAddress(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        remark: body.remark || '',
      }
      orderList.unshift(newOrder)
      return { code: 200, message: '订单创建成功', data: newOrder }
    },
  },

  // 更新订单
  {
    url: '/api/order/:id',
    method: 'put',
    response: ({ params, body }) => {
      const index = orderList.findIndex((o) => o.id === params.id)
      if (index === -1) return { code: 404, message: '订单不存在', data: null }

      orderList[index] = {
        ...orderList[index],
        ...body,
        updatedAt: new Date().toISOString(),
      }
      return { code: 200, message: '订单更新成功', data: orderList[index] }
    },
  },

  // 删除订单
  {
    url: '/api/order/:id',
    method: 'delete',
    response: ({ params }) => {
      const index = orderList.findIndex((o) => o.id === params.id)
      if (index === -1) return { code: 404, message: '订单不存在', data: null }

      const removed = orderList.splice(index, 1)
      return { code: 200, message: '订单删除成功', data: removed[0] }
    },
  },

  // 修改订单状态（发货、取消等）
  {
    url: '/api/order/:id/status',
    method: 'patch',
    response: ({ params, body }) => {
      const order = orderList.find((o) => o.id === params.id)
      if (!order) return { code: 404, message: '订单不存在', data: null }

      order.status = body.status
      order.updatedAt = new Date().toISOString()
      return { code: 200, message: '订单状态更新成功', data: order }
    },
  },
])
