// @ts-nocheck
import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import { faker } from '@faker-js/faker'
import { categories } from './category.fake'

const uuid = () => faker.string.uuid()

function randomDate(days = 60) {
  const now = new Date()
  return new Date(now.getTime() - Math.random() * days * 24 * 3600 * 1000).toISOString()
}

/**
 * 从分类中随机选一个分类
 */
function getRandomCategory() {
  const flatCategories = categories.flatMap(c => [c, ...(c.children || [])])
  return faker.helpers.arrayElement(flatCategories)
}

/**
 * 生成单个商品
 */
function createProduct() {
  const category = getRandomCategory()
  return {
    id: uuid(),
    name: faker.commerce.productName(),
    categoryId: category.id,
    categoryName: category.name,
    price: Number(faker.commerce.price({ min: 10, max: 999, dec: 2 })),
    stock: faker.number.int({ min: 0, max: 500 }),
    sales: faker.number.int({ min: 0, max: 1000 }),
    image: faker.image.urlPicsumPhotos({ width: 200, height: 200 }),
    description: faker.commerce.productDescription(),
    createdAt: randomDate(),
    updatedAt: randomDate(),
    status: faker.helpers.arrayElement([0, 1]), // 0 下架，1 上架
  }
}

// 初始商品数据
export let products = Array.from({ length: 40 }).map(createProduct)

export default defineFakeRoute([
  // 商品列表（分页）
  {
    url: '/api/product/list',
    method: 'get',
    response: ({ query }) => {
      const page = Number(query.page || 1)
      const pageSize = Number(query.pageSize || 10)
      const start = (page - 1) * pageSize
      const end = start + pageSize

      const list = products.slice(start, end)
      return {
        code: 200,
        message: 'ok',
        data: {
          list,
          pagination: {
            total: products.length,
            page,
            pageSize,
          },
        },
      }
    },
  },

  // 商品详情
  {
    url: '/api/product/detail/:id',
    method: 'get',
    response: ({ params }) => {
      const product = products.find(p => p.id === params.id)
      if (!product) return { code: 404, message: '商品不存在' }
      return { code: 200, message: 'ok', data: product }
    },
  },

  // 新增商品
  {
    url: '/api/product/create',
    method: 'post',
    response: ({ body }) => {
      const newProduct = {
        id: uuid(),
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      products.unshift(newProduct)
      return { code: 200, message: '创建成功', data: newProduct }
    },
  },

  // 更新商品
  {
    url: '/api/product/update/:id',
    method: 'put',
    response: ({ params, body }) => {
      const index = products.findIndex(p => p.id === params.id)
      if (index === -1)
        return { code: 404, message: '商品不存在' }

      products[index] = { ...products[index], ...body, updatedAt: new Date().toISOString() }
      return { code: 200, message: '更新成功', data: products[index] }
    },
  },

  // 删除商品
  {
    url: '/api/product/delete/:id',
    method: 'delete',
    response: ({ params }) => {
      products = products.filter(p => p.id !== params.id)
      return { code: 200, message: '删除成功' }
    },
  },
])
