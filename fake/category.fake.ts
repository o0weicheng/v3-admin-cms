// @ts-nocheck
import { defineFakeRoute } from 'vite-plugin-fake-server'
import { faker } from '@faker-js/faker'
const uuid = () => faker.string.uuid()
/**
 * 随机生成分类数据
 */
function generateFakeCategories(topLevelCount = 4, childCount = 3) {
  const now = new Date()
  const randomDate = () =>
    new Date(now.getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)).toISOString()

  const categories = Array.from({ length: topLevelCount }).map((_, i) => {
    const parentId = uuid()
    const children = Array.from({ length: childCount }).map((_, j) => ({
      id: uuid(),
      name: faker.word.adjective(),
      parentId,
      createdAt: randomDate(),
      updatedAt: randomDate(),
    }))

    return {
      id: parentId,
      name: faker.word.adjective(),
      parentId: 0,
      createdAt: randomDate(),
      updatedAt: randomDate(),
      children,
    }
  })

  return categories
}

/**
 * 初始化分类数据
 */
let categories = generateFakeCategories(4, 3)

export default defineFakeRoute([
  // 获取分类列表
  {
    url: '/api/category/list',
    method: 'get',
    response: () => ({
      code: 200,
      message: 'ok',
      data: categories,
    }),
  },

  // 新增分类
  {
    url: '/api/category/create',
    method: 'post',
    response: ({ body }) => {
      const { name, parentId = 0 } = body
      const newId = Date.now()
      const newCategory = {
        id: newId,
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
    url: '/api/category/update',
    method: 'put',
    response: ({ body }) => {
      const index = categories.findIndex((c) => c.id === body.id)
      if (index === -1) {
        return { code: 404, message: '分类不存在', data: null }
      }
      if (body.children.length > categories[index].children.length) {
        for (let i = 0; i < body.children.length; i++) {
          if (!body.children[i].id) {
            body.children[i].id = uuid()
          }
        }
      }
      categories[index] = { ...categories[index], ...body, updatedAt: new Date().toISOString() }
      return { code: 200, message: '更新成功', data: categories[index] }
    },
  },

  // 删除分类
  {
    url: '/api/category/delete',
    method: 'delete',
    response: ({ query }) => {
      const { id } = query
      categories = categories.filter((c) => c.id !== id)
      categories.forEach((c) => {
        c.children = c.children.filter((cc) => cc.id !== id)
      })
      return { code: 200, message: '删除成功', data: null }
    },
  },

  // 重置分类数据
  {
    url: '/api/category/reset',
    method: 'post',
    response: () => {
      categories = generateFakeCategories(4, 3)
      return { code: 200, message: '分类数据已重置', data: null }
    },
  },
])
