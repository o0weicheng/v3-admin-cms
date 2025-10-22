import type { ChartData, ChartOptions } from 'chart.js/auto'
import { ref, type Ref } from 'vue'

export const trendData = ref({
  labels: [],
  datasets: [
    {
      label: '销售额（元）',
      data: [],
      borderColor: '#e54646ff',
      backgroundColor: 'rgba(229, 70, 70, 0.2)',
      tension: 0.4,
      fill: true,
    },
    {
      label: '订单数',
      data: [],
      borderColor: '#0a8282ff',
      backgroundColor: 'rgba(34, 197, 165, 0.2)',
      tension: 0.4,
      fill: true,
    },
  ],
}) as Ref<ChartData<'line'>>
export const userGrowthData = ref<ChartData<'line'>>({
  labels: [],
  datasets: [
    {
      label: '新用户',
      data: [],
      borderColor: '#e54646ff',
      backgroundColor: 'rgba(79,70,229,0.2)',
      tension: 0.4,
      fill: true,
    },
    {
      label: '总用户',
      data: [],
      borderColor: '#1b8945ff',
      backgroundColor: 'rgba(34,197,94,0.2)',
      tension: 0.4,
      fill: true,
    },
  ],
})

export const topProductsData = ref<ChartData<'bar'>>({
  labels: [],
  datasets: [
    {
      label: '销量（件）',
      data: [],
      backgroundColor: ['#e54646ff', '#d9b30bff', '#247d03ff', '#1066a3ff', '#3424aeff'],
      borderRadius: 4,
    },
  ],
})

// 配置
export const topProductsOptions: ChartOptions<'bar'> = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y} 件`,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#374151',
      },
      grid: {
        display: false,
      },
    },
    y: {
      ticks: {
        color: '#6B7280',
      },
      grid: {
        color: '#E5E7EB',
      },
    },
  },
}
