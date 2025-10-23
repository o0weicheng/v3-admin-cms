<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, useTemplateRef, watch, watchEffect } from 'vue'
// SalesTrendChart.vue
import { Chart, type ChartData, type ChartOptions, type ChartType, registerables } from 'chart.js'

// 手动注册
Chart.register(...registerables)

interface Props {
  title: string
  data: ChartData
  type?: ChartType
  options?: ChartOptions
  height?: number
}

const { data, type, options, title } = defineProps<Props>()

const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
let chartInstance: Chart | null = null

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  amination: {
    duration: 500,
    easing: 'easeOutQuart',
  },
  plugins: {
    title: {
      display: true,
      text: title,
      align: 'start',
      font: { size: 16, weight: 'bold' },
      padding: { top: 12 },
    },
    legend: {
      labels: { boxWidth: 12, font: { size: 12 } },
    },
    tooltip: { mode: 'index', intersect: false },
  },
}

const renderChart = async () => {
  // 重绘时销毁实例
  if (chartInstance) chartInstance.destroy()
  await nextTick()

  // 确保canvas存在
  if (!canvas.value) return
  chartInstance = new Chart(canvas.value as HTMLCanvasElement, {
    type: type || 'line',
    data,
    options: Object.assign(defaultOptions, options),
  })
}

onMounted(() => renderChart())

watch(
  () => data,
  (newData) => {
    if (chartInstance) {
      chartInstance.data = newData
      chartInstance?.update()
    }
  },
  { deep: true },
)

// ✅ 组件卸载时销毁 Chart 实例
onBeforeUnmount(() => chartInstance?.destroy())
</script>

<template>
  <div :style="{ height: `${height || 320}px` }">
    <!-- <h3 class="text-lg font-semibold mb-4">{{ title }}</h3> -->
    <canvas ref="canvas"></canvas>
  </div>
</template>
