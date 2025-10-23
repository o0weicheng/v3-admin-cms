<script setup lang="ts">
import { getCharts, getSummary, type DashboardSummaryResponse } from '@/api/dashboard'
import { Money, ShoppingCartFull, UserFilled, Document } from '@element-plus/icons-vue'
import { onMounted, reactive } from 'vue'
import Chart from '@/components/Chart.vue'

const summary = reactive<DashboardSummaryResponse>({
  totalUsers: 0,
  totalOrders: 0,
  totalSales: 0,
  newUsers: 0,
  totalLogs: 0,
  todayOrders: 0,
})

const topCards = [
  {
    title: '用户总数',
    icon: UserFilled,
    value: () => summary.totalUsers,
    color: '#2b73af',
  },
  {
    title: '销售总额',
    icon: Money,
    value: () => summary.totalSales,
    color: '#4caf50',
    prefix: '¥',
  },
  {
    title: '订单总数',
    icon: ShoppingCartFull,
    value: () => summary.totalOrders,
    color: 'orange',
  },
  {
    title: '日志总数',
    icon: Document,
    value: () => summary.totalLogs,
    color: 'purple',
  },
]

const chartOrder = reactive({})

const getSummaryData = async () => {
  const [oSummary, oCharts] = await Promise.all([getSummary(), getCharts()])
  console.log(oCharts)

  Object.assign(summary, oSummary.data)
  Object.assign(chartOrder, oCharts.data.orders)
}

onMounted(() => {
  getSummaryData()
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
            <count-to
              :prefix="top.prefix"
              :value="top.value()"
              text-xl
              font-bold
              text="primary"
              mt="1"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <el-row :gutter="20" mt="4">
    <el-col :span="16">
      <Chart title="用户增长" :data="chartOrder" />
    </el-col>
  </el-row>
</template>

<style scoped lang="scss"></style>
