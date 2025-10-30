export * from './auth'
export * from './dashboard'
export * from './products'
export * from './member'
export * from './order'

export interface PaginationResponse<T = any> {
  pagination: {
    total: number
    page: number
    pageSize: number
    limit?: number
  }
  list: T[]
}
