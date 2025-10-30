import { http } from '@/plugins/http'

// --------------------- 类型定义 ---------------------

export interface DashboardSummaryResponse {
  totalUsers: number
  totalOrders: number
  totalSales: number
  newUsers: number
  totalLogs: number
  todayOrders: number
}

export interface DashboardChartData {
  title: string
  type: 'line' | 'bar' | 'doughnut'
  data: any
}

export interface DashboardProductItem {
  id: string
  name: string
  category: string
  stock: number
  price: string
  sold: number
  rating: number
}

export interface DashboardArticleItem {
  id: string
  title: string
  views: number
  likes: number
  author: string
  createdAt: string
}

export interface DashboardRecentOrder {
  id: string
  orderNo: string
  customer: string
  amount: string
  status: string
  createdAt: string
}

export interface DashboardLogs {
  id: string
  user: string
  action: string
  ip: string
  time: string
}

export interface DashboardMarketingItem {
  id: string
  name: string
  type: string
  status: string
  startTime: string
  endTime: string
}

export interface DashboardInventory {
  id: string
  name: string
  stock: number
  threshold: number
  status: string
}

export interface DashboardUser {
  id: string
  name: string
  level: string
  registerTime: string
  lastLogin: string
  region: string
}

// --------------------- API 函数 ---------------------

// 仪表盘总览
export const apiSummary = async (): Promise<DashboardSummaryResponse> => {
  return await http.get('/api/dashboard/summary')
}

// 图表数据
export const apiCharts = async (): Promise<Record<string, DashboardChartData>> => {
  return await http.get('/api/dashboard/charts')
}

// 商品列表
export const apiDashboardProducts = async (): Promise<DashboardProductItem[]> => {
  return await http.get('/api/dashboard/products')
}

// 文章列表
export const apiDashboardArticles = async (): Promise<DashboardArticleItem[]> => {
  return await http.get('/api/dashboard/articles')
}

// 订单列表
export const apiDashboardOrders = async (): Promise<DashboardRecentOrder[]> => {
  return await http.get('/api/dashboard/orders')
}

// 日志列表
export const apiDashboardLogs = async (): Promise<DashboardLogs[]> => {
  return await http.get('/api/dashboard/logs')
}

// 营销活动
export const apiDashboardMarketing = async (): Promise<DashboardMarketingItem[]> => {
  return await http.get('/api/dashboard/marketing')
}

// 库存信息
export const apiDashboardInventory = async (): Promise<DashboardInventory[]> => {
  return await http.get('/api/dashboard/inventory')
}

// 用户列表
export const apiDashboardUsers = async (): Promise<DashboardUser[]> => {
  return await http.get('/api/dashboard/users')
}
