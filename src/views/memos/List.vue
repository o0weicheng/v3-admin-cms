<script setup lang="ts">
import { ref } from 'vue'
import { categoryList, productList } from '@/static/product'

import type { Field } from '@/components/QueryForm.vue'
import type { QueryDataOptions } from '@/components/QueryDataTable.vue'

import { formatTime } from '@/plugins/TimeFormat'

const fields = ref<Field[]>([
  { type: 'input', label: '商品名称', prop: 'name', placeholder: '请输入商品名' },
  {
    type: 'input',
    label: '商品编号',
    prop: 'sku',
    placeholder: '请输入商品编号|sku',
    clearable: true,
  },
  {
    type: 'cascader',
    label: '商品类别',
    prop: 'category',
    placeholder: '选择商品类别',
    options: categoryList.data,
  },
  {
    type: 'date',
    label: '创建时间',
    prop: 'createTime',
  },
  {
    type: 'select',
    label: '状态',
    prop: 'status',
    placeholder: '选择状态',
    clearable: true,
    options: [
      {
        label: '已上架',
        value: 1,
      },
      {
        label: '已下架',
        value: 0,
      },
    ],
  },
])

const dataOptions: QueryDataOptions[] = [
  {
    label: 'id',
    prop: 'id',
  },
  {
    label: 'sku',
    prop: 'sku',
  },
  {
    label: '商品名称',
    prop: 'name',
  },
  {
    label: '创建时间',
    prop: 'createTime',
    type: 'time',
    fmt: (value: string) => formatTime(value, 'YYYY-MM-DD'),
  },
  {
    label: '状态',
    prop: 'status',
    type: 'status',
    fmt: (value) => (value === 1 ? '上架' : '下架'),
  },
  {
    label: '类别',
    prop: 'category',
    type: 'tag',
  },
]

const onSearch = (e: Record<string, any>) => {
  console.log(e)
}
</script>

<template>
  <query-form :fields="fields" @search="onSearch" />

  <query-data-table
    :pagination="productList.pagination"
    :selection="true"
    :data="productList.data"
    :options="dataOptions"
  >
    <template #operate>
      <el-button size="small" type="default">查看</el-button>
      <el-button size="small" type="primary">编辑</el-button>
      <el-button size="small" type="danger">删除</el-button>
    </template>
  </query-data-table>
</template>

<style scoped lang="scss">
.query-form-inline {
  .el-select {
    --el-select-width: 220px;
  }
}
</style>
