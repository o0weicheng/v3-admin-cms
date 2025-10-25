// @ts-ignore
import { defineFakeRoute } from "vite-plugin-fake-server"
import { faker } from '@faker-js/faker'

/**
 * 生成商品数据
 */
const createProduct = (id: number) => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  category: faker.commerce.department(),
  price: Number(faker.commerce.price({ min: 10, max: 999, dec: 2 })),
  stock: faker.number.int({ min: 0, max: 500 }),
  sales: faker.number.int({ min: 0, max: 1000 }),
  image: faker.image.urlPicsumPhotos({ width: 200, height: 200 }),
  description: faker.commerce.productDescription(),
  createdAt: faker.date.past().toISOString(),
  updatedAt: faker.date.recent().toISOString(),
  status: faker.number.int({ min: 0, max: 1 }),
})

// 生成初始商品列表
// @ts-ignore
const products = Array.from({ length: 50 }).map((_, i) => createProduct(i + 1))

export default defineFakeRoute([
  // 获取商品列表（分页）
  {
    url: '/api/product/list',
    method: 'GET',
    response: ({ query }) => {
      const page = Number(query.page || 1)
      const pageSize = Number(query.pageSize || 10)
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const list = products.slice(start, end)
      return {
        code: 200,
        message: `Successfully list of products`,
        data: {
          list,
          pagination: {
            total: products.length,
            page,
            pageSize,
            limit: end,
          },
        },
      }
    },
  },

  // 获取商品详情
  {
    url: '/api/product/detail',
    method: 'GET',
    response: ({ query }) => {
      const id = Number(query.id)
      const product = products.find((p) => p.id === id)
      if (!product) {
        return { code: 404, message: '商品不存在', data: null }
      }
      return { code: 200, message: 'ok', data: product }
    },
  },

  // 新增商品
  {
    url: '/api/product/create',
    method: 'POST',
    response: ({ body }) => {
      const id = products.length + 1
      const newProduct = {
        id,
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      products.unshift(newProduct)
      return { code: 200, message: '创建成功', data: newProduct }
    },
  },

  // 编辑商品
  {
    url: '/api/product/update',
    method: 'PUT',
    response: ({ body }) => {
      const index = products.findIndex((p) => p.id === body.id)
      if (index === -1) {
        return { code: 404, message: '商品不存在', data: null }
      }
      products[index] = { ...products[index], ...body, updatedAt: new Date().toISOString() }
      return { code: 200, message: '更新成功', data: products[index] }
    },
  },

  // 删除商品
  {
    url: '/api/product/delete',
    method: 'DELETE',
    response: ({ query }) => {
      const id = query.id
      const index = products.findIndex((p) => p.id === id)
      if (index === -1) {
        return { code: 404, message: '商品不存在', data: null }
      }
      products.splice(index, 1)
      return { code: 200, message: '删除成功', data: true }
    },
  },
])
