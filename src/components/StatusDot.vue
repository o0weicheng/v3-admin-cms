<script setup lang="ts">
const {type} = defineProps<{
  color?: string
  type?:  "primary" | "success" | "warning" | "danger" | "info"
  label: string
}>()

const dotStyle = computed(() => {
  let style = {}
  switch (type) {
    case "primary":
      style = {'--dot-color': 'var(--el-color-primary)'}
      break
    case "success":
      style = {'--dot-color': 'var(--el-color-success)'}
      break
    case "warning":
      style = {'--dot-color': 'var(--el-color-warning)'}
      break
    case "danger":
      style = {'--dot-color': 'var(--el-color-danger)'}
      break
    case "info":
      style = {'--dot-color': 'var(--el-color-info)'}
      break
    default:
      style = {'--dot-color': 'var(--el-color-info)'}
      break
  }
  return style
})

</script>

<template>
  <div class="dot" :style="dotStyle">
    <el-text>{{ label }}</el-text>
  </div>
</template>

<style scoped lang="scss">
.dot {
  display: flex;
  justify-content: center;
  align-items: center;
  &::before {
    content: '';
    display: block;
    --dot-size: 6px;
    width: var(--dot-size);
    height: var(--dot-size);
    background-color: var(--dot-color);
    border-radius: 100%;
    margin-right: 4px;
  }
}
</style>
