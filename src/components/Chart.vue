<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue'
// SalesTrendChart.vue
import { Chart, type ChartData, type ChartOptions, type ChartType, registerables } from 'chart.js'

// 手动注册
Chart.register(...registerables)

interface Props {
  title: string
  data: ChartData<'bar' | 'line'>
  type?: ChartType
  options?: ChartOptions
  height?: number
}

const { data, type, options } = withDefaults(defineProps<Props>(), {
  type: 'line',
  height: 320,
})

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
let chartInstance: Chart | null = null

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { boxWidth: 12, font: { size: 12 } },
    },
    tooltip: { mode: 'index', intersect: false },
  },
  scales: {
    x: {
      type: 'category',
      grid: { display: false },
    },
    y: {
      type: 'linear',
      beginAtZero: true,
      grid: { color: '#eee' },
    },
  },
}

const renderChart = async () => {
  // 重绘时销毁实例
  if (chartInstance) chartInstance.destroy()
  await nextTick()

  // 确保canvas存在
  if (!canvas.value) return
  chartInstance = new Chart(canvas.value as HTMLCanvasElement, {
    type,
    data,
    options: Object.assign(defaultOptions, options),
  })
}

onMounted(renderChart)

watch(
  () => data,
  () => renderChart(),
  { deep: true },
)

// ✅ 组件卸载时销毁 Chart 实例
onBeforeUnmount(() => chartInstance?.destroy())
</script>

<template>
  <div :style="{ height: `${height}px` }">
    <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
    <canvas ref="canvas"></canvas>
  </div>
</template>
