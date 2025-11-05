// @ts-nocheck

import { defineFakeRoute } from 'vite-plugin-fake-server'
import { faker } from '@faker-js/faker'
import { orderList } from './order.fake'
import { products } from './product.fake'
import { logs } from './logs.fake'
import { memberList } from './member.fake'

// 生成最近7天
function genDays(count = 7) {
  return Array.from({ length: count }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (count - i - 1))
    return `${d.getMonth() + 1}/${d.getDate()}`
  })
}

// 生成 Chart.js datasets
function makeDatasets(labels: string[], seriesNames: string[]) {
  const colors = ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC', '#EC407A']
  return seriesNames.map((name, i) => ({
    label: name,
    data: labels.map(() => faker.number.int({ min: 100, max: 1000 })),
    borderColor: colors[i % colors.length],
    backgroundColor: colors[i % colors.length] + '33',
    borderWidth: 2,
    tension: 0.3,
    fill: true,
  }))
}

export default defineFakeRoute([
  // -------------------------
  // 仪表盘总览
  // -------------------------
  {
    url: '/api/dashboard/summary',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: {
        totalUsers: faker.number.int({ min: 2000, max: 20000 }),
        totalOrders: faker.number.int({ min: 1000, max: 10000 }),
        totalSales: faker.number.int({ min: 100000, max: 900000 }),
        newUsers: faker.number.int({ min: 50, max: 500 }),
        totalLogs: faker.number.int({ min: 500, max: 5000 }),
        todayOrders: faker.number.int({ min: 50, max: 300 }),
      },
    }),
  },

  // -------------------------
  // 图表数据
  // -------------------------
  {
    url: '/api/dashboard/charts',
    method: 'get',
    response: () => {
      const labels = genDays(7)
      return {
        code: 200,
        message: 'ok',
        data: {
          sales: {
            title: '近7天销售额',
            type: 'line',
            data: {
              labels,
              datasets: makeDatasets(labels, ['总销售额', '利润']),
            },
          },
          orders: {
            title: '订单来源占比',
            type: 'pie',
            data: {
              labels: ['淘宝', '京东', '拼多多', '抖音'],
              datasets: [
                {
                  data: [320, 250, 180, 220].map(
                    (v) => v + faker.number.int({ min: -30, max: 30 }),
                  ),
                  backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EC407A'],
                  hoverOffset: 8,
                },
              ],
            },
          },
          users: {
            title: '新增用户趋势',
            type: 'bar',
            data: {
              labels,
              datasets: makeDatasets(labels, ['注册用户', '活跃用户']),
            },
          },
        },
      }
    },
  },

  // -------------------------
  // 商品
  // -------------------------
  {
    url: '/api/dashboard/products',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: products.slice(0, 10),
    }),
  },

  // -------------------------
  // 文章
  // -------------------------
  {
    url: '/api/dashboard/articles',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: Array.from({ length: 5 }).map(() => ({
        id: faker.string.uuid(),
        title: faker.lorem.sentence(5),
        views: faker.number.int({ min: 100, max: 5000 }),
        likes: faker.number.int({ min: 10, max: 300 }),
        author: faker.person.fullName(),
        createdAt: faker.date.recent({ days: 30 }),
      })),
    }),
  },

  // -------------------------
  // 订单
  // -------------------------
  {
    url: '/api/dashboard/orders',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: orderList.slice(0, 10),
    }),
  },

  // -------------------------
  // 日志
  // -------------------------
  {
    url: '/api/dashboard/logs',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: logs.slice(0,10),
    }),
  },

  // -------------------------
  // 营销
  // -------------------------
  {
    url: '/api/dashboard/marketing',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: Array.from({ length: 4 }).map(() => ({
        id: faker.string.uuid(),
        name: faker.commerce.productAdjective() + ' 活动',
        type: faker.helpers.arrayElement(['满减', '折扣', '新人专享', '限时秒杀']),
        status: faker.helpers.arrayElement(['进行中', '未开始', '已结束']),
        startTime: faker.date.recent({ days: 5 }),
        endTime: faker.date.soon({ days: 10 }),
      })),
    }),
  },

  // -------------------------
  // 库存
  // -------------------------
  {
    url: '/api/dashboard/inventory',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: Array.from({ length: 6 }).map(() => ({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        stock: faker.number.int({ min: 0, max: 50 }),
        threshold: 30,
        status: faker.helpers.arrayElement(['正常', '低库存', '缺货']),
      })),
    }),
  },

  // -------------------------
  // 用户
  // -------------------------
  {
    url: '/api/dashboard/users',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: memberList.slice(0, 10),
    }),
  },
])
