<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

// ✅ 接收 props
const props = defineProps({
  value: { type: Number, required: true }, // 目标值
  duration: { type: Number, default: 1000 }, // 动画时间(ms)
  prefix: { type: String, default: '' }, // 前缀符号（如 ¥、$）
  suffix: { type: String, default: '' }, // 后缀符号（如 %）
  decimals: { type: Number, default: 0 }, // 小数位数
  separator: { type: Boolean, default: true }, // 是否千分位
  easing: { type: Boolean, default: true }, // 是否使用缓动动画
})

const displayValue = ref(0)
let startTime = 0,
  startValue = 0
let animationFrame: number | null = null

// ✅ 缓动函数（easeOutCubic）
const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3)

const formatNumber = (num: number) => {
  let n = num.toFixed(props.decimals)
  if (props.separator) {
    const parts: string[] = n.split('.')
    parts[0] = parts[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || ''
    n = parts.join('.')
  }
  return props.prefix + n + props.suffix
}

const animate = (timestamp: number) => {
  if (!startTime) startTime = timestamp
  const progress = Math.min((timestamp - startTime) / props.duration, 1)
  const eased = props.easing ? easeOutCubic(progress) : progress

  displayValue.value = startValue + (props.value - startValue) * eased

  if (progress < 1) {
    animationFrame = requestAnimationFrame(animate)
  } else {
    displayValue.value = props.value
  }
}

// ✅ 当 value 变化时重新动画
const startAnimation = () => {
  if (animationFrame) cancelAnimationFrame(animationFrame)
  startTime = 0
  startValue = displayValue.value
  animationFrame = requestAnimationFrame(animate)
}

onMounted(startAnimation)
watch(() => props.value, startAnimation)
onUnmounted(() => animationFrame && cancelAnimationFrame(animationFrame))
</script>

<template>
  <span>{{ formatNumber(displayValue) }}</span>
</template>

<style scoped>
span {
  display: inline-block;
  font-variant-numeric: tabular-nums; /* 数字宽度一致，避免跳动 */
}
</style>
