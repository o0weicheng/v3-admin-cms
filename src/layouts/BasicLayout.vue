<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import BasicHeader from './BasicHeader.vue'
import BasicSide from './BasicSide.vue'

const router = useRouter()
  .getRoutes()
  .filter((r) => r.meta?.menus)
const route = useRoute()

// 一级导航（顶部）
console.log(router)
</script>

<template>
  <el-config-provider>
    <BasicHeader />
    <div class="flex flex-1 h-[calc(100vh-var(--el-menu-item-height)-40px)] pt-4 box-border">
      <el-scrollbar wrap-class="pl-6">
        <BasicSide :menus="router" :active="route.path" />
      </el-scrollbar>
      <div class="flex-1">
        <el-scrollbar wrap-class="pr-6" view-class="pb-6 pl-6">
          <RouterView />
        </el-scrollbar>
      </div>
    </div>
  </el-config-provider>
</template>

<style lang="scss"></style>
