<script lang="ts" setup>
import { ElTag } from 'element-plus'

type DataOptionType = 'time' | 'status' | 'tag'

export interface QueryDataOptions<T = any, R = unknown> {
  prop: string
  label: string
  type?: DataOptionType
  fmt?: (value: T, row?: Record<string, unknown>, index?: number) => R
}

export interface QueryDataPagination {
  page: number
  pageSize: number
  total?: number
  limit?: number
}

defineProps<{
  selection?: boolean
  data: any[]
  options: QueryDataOptions[]
  edit?: boolean
}>()

const pagination = defineModel<QueryDataPagination>('pagination')
</script>

<template>
  <el-table :data="data" style="width: 100%" flexible show-overflow-tooltip>
    <el-table-column v-if="selection" type="selection" width="35" />
    <el-table-column v-for="opt in options" :label="opt.label" width="120">
      <template #default="scope">
        <template v-if="$slots[opt.prop]">
          <slot :name="opt.prop" :row="scope.row"></slot>
        </template>
        <template v-else>
          <div v-if="opt.prop === 'image'" w="50px">
            <el-image fit="cover" w="20px" :src="scope.row[opt.prop]" alt="" />
          </div>
          <template v-else-if="opt.fmt">
            <el-text
              v-if="opt.prop === 'status'"
              :type="(scope.row[opt.prop] && 'success') || 'warning'"
            >
              {{ opt.fmt ? opt.fmt(scope.row[opt.prop]) : scope.row[opt.prop] }}
            </el-text>
            <span v-else>
              {{ opt.fmt ? opt.fmt(scope.row[opt.prop]) : scope.row[opt.prop] }}
            </span>
          </template>
          <component v-else :is="opt.type === 'tag' ? ElTag : 'span'">
            {{ scope.row[opt.prop] }}
          </component>
        </template>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" v-if="$slots.operate" min-width="140">
      <template #default="scope">
        <slot name="operate" :row="scope.row"></slot>
      </template>
    </el-table-column>
  </el-table>
  <div v-if="pagination?.total" flex justify="end" pt="2">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="pagination.total"
      :hide-on-single-page="pagination.total > pagination.pageSize"
      v-model:page-size="pagination.pageSize"
      v-model:current-page="pagination.page"
    />
  </div>
</template>

<style scoped lang="scss"></style>
