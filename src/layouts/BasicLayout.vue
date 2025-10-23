<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import BasicHeader from './BasicHeader.vue'
import BasicSide from './BasicSide.vue'

const router = useRouter()
  .getRoutes()
  .filter((r) => r.meta?.menus)
const route = useRoute()

// 一级导航（顶部）
</script>

<template>
  <el-config-provider>
    <BasicHeader />
    <div
      py-2
      flex
      flex-1
      bg-gradient-to-b
      from="primary"
      to="#81b5df"
      h="[calc(100vh-var(--el-menu-item-height)-40px)]"
      box-border
    >
      <el-scrollbar>
        <BasicSide :menus="router" :active="route.path" />
      </el-scrollbar>
      <div class="flex-1" rounded-l-2xl overflow-hidden bg="#f8f9f7">
        <el-scrollbar wrap-class="pr-2" view-class="pt-2 pb-4 px-4 overflow-hidden mb-6">
          <RouterView />
        </el-scrollbar>
      </div>
    </div>
  </el-config-provider>
</template>

<style lang="scss"></style>
