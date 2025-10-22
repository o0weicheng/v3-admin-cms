<script lang="ts" setup>
import { User } from '@element-plus/icons-vue'
</script>

<template>
  <div h="50px" flex justify-between items-center px-6>
    <div>
      <el-input placeholder="搜索" />
    </div>
    <div>
      <el-avatar shape="square" size="small" :icon="User"></el-avatar>
    </div>
  </div>
</template>

<style lang="scss">
.el-menu-wrap {
  &.ep-menu--horizontal > .ep-menu-item:nth-child(1) {
    margin-right: auto;
  }
}
</style>
