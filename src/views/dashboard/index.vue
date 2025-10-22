<script setup lang="ts">
import {
  getLedgerTrend,
  getRecentRecords,
  getRecipeStats,
  getSummary,
  type SummaryResponse,
} from '@/api/dashboard'
import { onMounted, reactive, ref, toRaw, toRefs, unref, watch, type Ref } from 'vue'
import { topProductsData, trendData, userGrowthData, topProductsOptions } from './useChartsData'
import type { ChartData } from 'chart.js/auto'

type summaryKey = keyof SummaryResponse

const summary = ref<SummaryResponse>({
  incomeToday: 0,
  expenseToday: 0,
  recipesToday: 0,
  pendingMemos: 0,
})

const salesTrend = ref<SalesTrendResponse>({
  sales: [],
  days: [],
  orders: [],
})

const userGrowth = ref<UserGrowthResponse>({
  totalUsers: [],
  days: [],
  newUsers: [],
})

const topProducts = ref<TopProductsResponse[]>([
  {
    name: '',
    sales: 0,
    revenue: 0,
  },
])

const orders = ref<RecentOrdersResponse[]>([
  {
    orderNo: '',
    userName: '',
    productName: '',
    amount: 0,
    status: '',
    createTime: '',
  },
])

const topCards = ref<
  {
    label: string
    key: summaryKey
  }[]
>([
  { label: '今日支出', key: 'incomeToday' },
  { label: '今日收入', key: 'expenseToday' },
  { label: '今日菜谱', key: 'recipesToday' },
  { label: '备忘录', key: 'pendingMemos' },
])

onMounted(async () => {
  // 并行请求
  const [summaryRes, ledgetRes, recipeRes, recentRes] = await Promise.all([
    getSummary(),
    getLedgerTrend(),
    getRecipeStats(),
    getRecentRecords(),
  ])
  if (summaryRes) summary.value = summaryRes
  if (ledgetRes) salesTrend.value = ledgetRes
  if (recipeRes) userGrowth.value = recipeRes
  if (recentRes) topProducts.value = recentRes
})

const datasetsDataMap = (datasets: any, set: any) => {
  datasets.forEach((item: any, i: number) => {
    item['data'] = set[i]
  })
  return datasets
}

// 封装 watch
const useDataWatcher = <S, T extends Ref<any>, D = unknown>(
  source: Ref<S>,
  target: T,
  mapFn: (val: S, target: T, datasets: D) => void,
): void => {
  watch(
    source,
    (val) => {
      if (!val) return
      const _val = unref(val)
      const { datasets } = unref(target)
      mapFn(_val, target, datasets)
    },
    { deep: true },
  )
}

useDataWatcher(salesTrend, trendData, (_val, target, datasets) => {
  target.value.labels = _val.days
  target.value.datasets = datasetsDataMap(datasets, [_val.sales, _val.orders])
})
useDataWatcher(userGrowth, userGrowthData, (_val, target, datasets) => {
  target.value.labels = _val.days
  target.value.datasets = datasetsDataMap(datasets, [_val.newUsers, _val.totalUsers])
})
useDataWatcher(topProducts, topProductsData, (_val, target, datasets) => {
  target.value.labels = _val.map((p) => p.name)
  const newSales = _val.map((p) => p.sales)
  target.value.datasets = datasetsDataMap(datasets, [newSales])
})
</script>

<template>
  <div w-full overflow-hidden h-full pb-4>
    <el-row :gutter="20">
      <el-col :span="6" v-for="card in topCards">
        <el-card shadow="hover">
          <div flex justify-between>
            <el-text>{{ card.label }}</el-text>
            <CountTo :value="overview[card.key]" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" mb="10">
      <el-col :span="16">
        <Chart title="销售趋势" :data="trendData" />
      </el-col>
      <el-col :span="8">
        <Chart
          title="热销商品 Top 5"
          :data="topProductsData"
          type="bar"
          :options="topProductsOptions"
        />
      </el-col>
    </el-row>
    <el-row :gutter="20" mb="12">
      <el-col :span="24">
        <Chart title="用户增长趋势" :data="userGrowthData" />
      </el-col>
    </el-row>
    <el-card shadow="hover">
      <template #header>
        <h3 class="text-lg font-semibold mb-4">最近订单</h3>
      </template>
      <el-table :data="orders" w-full stripe>
        <el-table-column prop="orderNo" label="订单号" />
        <el-table-column prop="userName" label="用户" />
        <el-table-column prop="productName" label="购买商品" />
        <el-table-column prop="amount" label="价格" />
        <el-table-column prop="status" label="商品状态" />
        <el-table-column prop="createTime" label="购买时间" />
      </el-table>
    </el-card>
  </div>
</template>

<style scoped lang="scss"></style>
