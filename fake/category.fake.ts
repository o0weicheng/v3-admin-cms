// @ts-nocheck
import { defineFakeRoute } from 'vite-plugin-fake-server'

/**
 * 随机生成分类数据
 */
function generateFakeCategories(topLevelCount = 4, childCount = 3) {
  const now = new Date()
  const randomDate = () =>
    new Date(
      now.getTime() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)
    ).toISOString()

  const getName = (prefix: string, index: number) => `${prefix}${index + 1}`

  const categories = Array.from({ length: topLevelCount }).map((_, i) => {
    const parentId = i + 1
    const children = Array.from({ length: childCount }).map((_, j) => ({
      id: Number(`${parentId}${j + 1}`),
      name: getName('子分类', j),
      parentId,
      createTime: randomDate(),
      updateTime: randomDate(),
    }))

    return {
      id: parentId,
      name: getName('分类', i),
      parentId: 0,
      createTime: randomDate(),
      updateTime: randomDate(),
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
      code: 0,
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
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        children: [],
      }

      if (parentId === 0) {
        categories.push(newCategory)
      } else {
        const parent = categories.find((c) => c.id === parentId)
        if (parent) parent.children.push(newCategory)
      }

      return { code: 0, message: '创建成功', data: newCategory }
    },
  },

  // 删除分类
  {
    url: '/api/category/delete',
    method: 'post',
    response: ({ body }) => {
      const { id } = body
      categories = categories.filter((c) => c.id !== id)
      categories.forEach((c) => {
        c.children = c.children.filter((cc) => cc.id !== id)
      })
      return { code: 0, message: '删除成功' }
    },
  },

  // 重置分类数据
  {
    url: '/api/category/reset',
    method: 'post',
    response: () => {
      categories = generateFakeCategories(4, 3)
      return { code: 0, message: '分类数据已重置' }
    },
  },
])
