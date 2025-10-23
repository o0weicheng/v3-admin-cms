import { defineFakeRoute } from 'vite-plugin-fake-server'
import { faker } from '@faker-js/faker'

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
            type: 'doughnut',
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
      data: Array.from({ length: 8 }).map(() => ({
        id: faker.string.uuid(),
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        stock: faker.number.int({ min: 0, max: 500 }),
        price: faker.commerce.price({ min: 10, max: 200 }),
        sold: faker.number.int({ min: 50, max: 1000 }),
        rating: faker.number.float({ min: 3, max: 5, precision: 0.1 }),
      })),
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
      data: Array.from({ length: 10 }).map(() => ({
        id: faker.string.uuid(),
        orderNo: faker.string.alphanumeric({ length: 10 }),
        customer: faker.person.fullName(),
        amount: faker.commerce.price({ min: 20, max: 2000 }),
        status: faker.helpers.arrayElement(['已完成', '待发货', '已取消', '退款中']),
        createdAt: faker.date.recent({ days: 7 }),
      })),
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
      data: Array.from({ length: 15 }).map(() => ({
        id: faker.string.uuid(),
        user: faker.person.fullName(),
        action: faker.helpers.arrayElement([
          '登录系统',
          '新增商品',
          '删除订单',
          '编辑文章',
          '导出报表',
        ]),
        ip: faker.internet.ip(),
        time: faker.date.recent({ days: 3 }),
      })),
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
      data: Array.from({ length: 10 }).map(() => ({
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        level: faker.helpers.arrayElement(['普通用户', '会员', 'VIP']),
        registerTime: faker.date.past({ years: 1 }),
        lastLogin: faker.date.recent({ days: 15 }),
        region: faker.location.city(),
      })),
    }),
  },
])
