<script setup lang="ts">
import type { MessagePlacement } from 'element-plus'

const {
  size = 12,
  color = 'gray',
  content = '?',
  placement = 'top',
} = defineProps<{
  label: string
  tips: string
  color?: string
  size?: number
  content?: '?' | '!'
  placement?: MessagePlacement
}>()
</script>

<template>
  <div flex items-center justify-center>
    <span>{{ label }}</span>
    <el-tooltip :content="tips" :placement="placement">
      <span
        inline-flex
        items-center
        justify-center
        border-solid
        ml-1
        rounded-full
        border
        :style="{
          width: `${size}px`,
          height: `${size}px`,
          'font-size': `${size! - 2}px`,
          color: color,
          'border-color': color,
        }"
        >{{ content }}</span
      >
    </el-tooltip>
  </div>
</template>
