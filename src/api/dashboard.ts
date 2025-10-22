import { axiosInstance } from '@/plugins/axios'

export interface SummaryResponse {
  incomeToday: number
  expenseToday: number
  recipesToday: number
  pendingMemos: number
}

export interface LedgerTrendResponse {
  date: Date
  income: number
  expense: number
}

export interface RecipeStatsResponse {
  name: string
  value: number
}

export interface RecentRecordsResponse {
  orderNo: string
  userName: string
  productName: string
  amount: number
  status: string
  createTime: string
}

export const getSummary = async (): Promise<SummaryResponse> => {
  return await axiosInstance.get('/api/dashboard/summary')
}

export const getLedgerTrend = async (): Promise<LedgerTrendResponse> => {
  return await axiosInstance.get('/api/dashboard/ledger-trend')
}

export const getRecipeStats = async (): Promise<RecipeStatsResponse[]> => {
  return await axiosInstance.get('/api/dashboard/recipe-stats')
}

export const getRecentRecords = async (): Promise<RecentRecordsResponse[]> => {
  return await axiosInstance.get('/api/dashboard/recent-records')
}
