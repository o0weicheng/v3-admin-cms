<script setup lang="ts">
import {
  apiCharts,
  apiSummary,
  apiDashboardOrders,
  type DashboardSummaryResponse,
  type DashboardChartData,
  type DashboardRecentOrder,
  type DashboardLogs,
  apiDashboardLogs,
  apiDashboardUsers,
  type DashboardUser,
  type DashboardInventory,
  apiDashboardInventory,
} from '@/api/dashboard'
import { Money, ShoppingCartFull, UserFilled, Document } from '@element-plus/icons-vue'
import { computed, reactive, ref, type ComputedRef } from 'vue'
import Chart from '@/components/Chart.vue'
import { formatTime } from '@/plugins/TimeFormat'
import { useTransition } from '@vueuse/core'

type DashboardChartWithSpan = DashboardChartData & { span?: number }

const summary = reactive<DashboardSummaryResponse>({
  totalUsers: 0,
  totalOrders: 0,
  totalSales: 0,
  newUsers: 0,
  totalLogs: 0,
  todayOrders: 0,
})
const chartSpanMap: [number, number, number] = [16, 8, 24]

const chartData = ref<DashboardChartWithSpan[]>([])
const dashboardOrders = ref<DashboardRecentOrder[]>([])
const dashboardLogs = ref<DashboardLogs[]>([])
const dashboardUsers = ref<DashboardUser[]>([])
const dashboardInventory = ref<DashboardInventory[]>([])

const useSummaryToAmination = (key: keyof DashboardSummaryResponse) =>
  useTransition(
    computed(() => summary[key]),
    { duration: 1000 },
  )

const topCards: {
  title: string
  icon: any
  num: ComputedRef<number>
  color: string
  prefix?: string
}[] = [
  {
    title: '用户总数',
    icon: UserFilled,
    num: useSummaryToAmination('totalUsers'),
    color: '#2b73af',
  },
  {
    title: '销售总额',
    icon: Money,
    num: useSummaryToAmination('totalSales'),
    color: '#4caf50',
    prefix: '¥',
  },
  {
    title: '订单总数',
    icon: ShoppingCartFull,
    num: useSummaryToAmination('totalOrders'),
    color: 'orange',
  },
  {
    title: '日志总数',
    icon: Document,
    num: useSummaryToAmination('totalLogs'),
    color: 'purple',
  },
]

// 初始化仪表盘数据
const initDashboardData = async () => {
  // 一次性获取仪表盘数据
  // 防止多次请求导致数据错乱
  const [oSummary, oCharts, oOrders, oLogs, oUser, oInventory] = await Promise.all([
    apiSummary(),
    apiCharts(),
    apiDashboardOrders(),
    apiDashboardLogs(),
    apiDashboardUsers(),
    apiDashboardInventory(),
  ])

  Object.assign(summary, oSummary)
  Object.assign(dashboardOrders.value, oOrders)
  Object.assign(dashboardLogs.value, oLogs)
  Object.assign(dashboardUsers.value, oUser)
  Object.assign(dashboardInventory.value, oInventory)
  // 加上 span 做 el-col 布局
  chartData.value = Object.values(oCharts).map(
    (chart, index): DashboardChartWithSpan => ({
      ...chart,
      span: chartSpanMap[index],
    }),
  )
}

onMounted(() => {
  initDashboardData()
})

window.setInterval(() => {
  initDashboardData()
}, 30 * 1000)

onUnmounted(() => {
  window.clearInterval(window.setInterval(() => {}))
})
</script>

<template>
  <div w-full overflow-hidden h-full pb-4>
    <el-row :gutter="20">
      <el-col :span="6" v-for="top in topCards">
        <el-card>
          <div flex-col flex items-center>
            <div flex items-center gap-2>
              <el-icon :color="top.color">
                <component :is="top.icon" />
              </el-icon>
              <h5 m-0 text-xs color="gray-500">{{ top.title }}</h5>
            </div>
            <el-statistic :value="top.num.value" :prefix="top.prefix"></el-statistic>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <el-row :gutter="10">
    <el-col mt="2" :span="chartData.span" v-for="chartData in chartData">
      <el-card shadow="never">
        <Chart :title="chartData.title" :type="chartData.type" :data="chartData.data" />
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="10" mt="2">
    <el-col :span="14" :md="18">
      <el-card shadow="never">
        <h3 text="#666 16px">最近订单</h3>
        <el-table :data="dashboardOrders" size="small">
          <el-table-column prop="orderNo" label="订单号" />
          <el-table-column prop="customer" label="客户姓名" />
          <el-table-column prop="createdAt" label="订单日期">
            <template #default="scoped">
              {{ formatTime(scoped.row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120" />
          <el-table-column prop="amount" label="总金额" width="120">
            <template #default="scoped">
              <span>¥</span><span>{{ scoped.row.amount }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-row mt-2 :gutter="10">
        <el-col :span="24" :md="12">
          <el-card shadow="never">
            <h3 text="#666 16px">最新会员</h3>
            <el-table :data="dashboardUsers" size="small">
              <el-table-column prop="name" label="会员名称" width="190" />
              <el-table-column prop="registerTime" label="注册时间" width="200">
                <template #default="scoped">
                  {{ formatTime(scoped.row.registerTime) }}
                </template>
              </el-table-column>
              <el-table-column prop="level" label="等级" width="120" />
              <el-table-column prop="region" label="地区" width="120" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="24" :md="12">
          <el-card shadow="never">
            <h3 text="#666 16px">库存信息</h3>
            <el-table :data="dashboardInventory" size="small">
              <el-table-column prop="name" label="商品名称" width="190" />
              <el-table-column prop="status" label="状态" />
              <el-table-column prop="stock" label="数量" width="80" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="10" :md="6">
      <el-card shadow="never" :body-style="{ padding: '0' }">
        <el-scrollbar max-height="800px" view-class="p-3">
          <h3 text="#666 16px">操作日志</h3>
          <el-timeline>
            <el-timeline-item
              center
              v-for="log in dashboardLogs"
              :key="log.id"
              :timestamp="formatTime(log.time)"
              placement="top"
            >
              <el-card>
                <h4 m-0 mb-2>{{ log.action }}</h4>
                <el-text size="small">操作人员：{{ log.user }}</el-text>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-scrollbar>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss"></style>
