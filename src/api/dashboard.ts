import { http, type ApiResponse } from '@/plugins/http'

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
export const getSummary = async (): Promise<ApiResponse<DashboardSummaryResponse>> => {
  return await http('/api/dashboard/summary')
}

// 图表数据
export const getCharts = async (): Promise<ApiResponse<Record<string, DashboardChartData>>> => {
  return await http('/api/dashboard/charts')
}

// 商品列表
export const getProducts = async (): Promise<ApiResponse<DashboardProductItem[]>> => {
  return await http('/api/dashboard/products')
}

// 文章列表
export const getArticles = async (): Promise<ApiResponse<DashboardArticleItem[]>> => {
  return await http('/api/dashboard/articles')
}

// 订单列表
export const getOrders = async (): Promise<ApiResponse<DashboardRecentOrder[]>> => {
  return await http('/api/dashboard/orders')
}

// 日志列表
export const getLogs = async (): Promise<ApiResponse<DashboardLogs[]>> => {
  return await http('/api/dashboard/logs')
}

// 营销活动
export const getMarketing = async (): Promise<ApiResponse<DashboardMarketingItem[]>> => {
  return await http('/api/dashboard/marketing')
}

// 库存信息
export const getInventory = async (): Promise<ApiResponse<DashboardInventory[]>> => {
  return await http('/api/dashboard/inventory')
}

// 用户列表
export const getUsers = async (): Promise<ApiResponse<DashboardUser[]>> => {
  return await http('/api/dashboard/users')
}
