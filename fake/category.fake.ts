// @ts-nocheck
import { defineFakeRoute } from 'vite-plugin-fake-server/client'
import { faker } from '@faker-js/faker'

const uuid = () => faker.string.uuid()

function randomDate(days = 30) {
  const now = new Date()
  return new Date(now.getTime() - Math.random() * days * 24 * 3600 * 1000).toISOString()
}

/**
 * 生成带层级关系的分类
 */
function generateFakeCategories(topLevelCount = 4, childCount = 3) {
  return Array.from({ length: topLevelCount }).map(() => {
    const parentId = uuid()
    const parentName = faker.commerce.department()
    const children = Array.from({ length: childCount }).map(() => ({
      id: uuid(),
      name: faker.commerce.productAdjective(),
      parentId,
      createdAt: randomDate(),
      updatedAt: randomDate(),
    }))
    return {
      id: parentId,
      name: parentName,
      parentId: 0,
      createdAt: randomDate(),
      updatedAt: randomDate(),
      children,
    }
  })
}

export let categories = generateFakeCategories(4, 3)

export default defineFakeRoute([
  // 分类列表
  {
    url: '/api/category/list',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: categories,
    }),
  },

  // 创建分类
  {
    url: '/api/category/create',
    method: 'post',
    response: ({ body }) => {
      const { name, parentId = 0 } = body
      const newCategory = {
        id: uuid(),
        name,
        parentId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        children: [],
      }

      if (parentId === 0) {
        categories.push(newCategory)
      } else {
        const parent = categories.find((c) => c.id === parentId)
        if (parent) parent.children.push(newCategory)
      }

      return { code: 200, message: '创建成功', data: newCategory }
    },
  },

  // 更新分类
  {
    url: '/api/category/update/:id',
    method: 'put',
    response: ({ params, body }) => {
      const index = categories.findIndex((c) => c.id === params.id)
      if (index === -1)
        return { code: 404, message: '分类不存在', data: null }

      categories[index] = { ...categories[index], ...body, updatedAt: new Date().toISOString() }
      return { code: 200, message: '更新成功', data: categories[index] }
    },
  },

  // 删除分类
  {
    url: '/api/category/delete/:id',
    method: 'delete',
    response: ({ params }) => {
      const id = params.id
      categories = categories.filter((c) => c.id !== id)
      categories.forEach((c) => {
        c.children = c.children.filter((cc) => cc.id !== id)
      })
      return { code: 200, message: '删除成功' }
    },
  },
])
