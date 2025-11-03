<script setup lang="ts">
import {
  usePermissionStore,
} from '@/stores'

const { permissionOperateMaps, permissionModelMaps, permissionMaps } = usePermissionStore()

</script>

<template>
  <el-card mb-2 v-for="(keys, label) of permissionMaps">
    <template #header>
      <h2 text-xl m-0 text-gray-6>{{ permissionModelMaps[label] }}</h2>
    </template>
    <div grid grid-cols-5 gap-2>
      <template v-for="key in keys" :key="key">
        <el-tag size="large" effect="plain"
          ><b text-base>{{ permissionOperateMaps[key] }}</b> [{{ label }}:{{ key }}]</el-tag
        >
      </template>
    </div>
  </el-card>
</template>

<style scoped lang="scss"></style>
