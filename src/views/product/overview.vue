<script setup lang="ts">
import { h, onMounted, ref, watch } from 'vue'
import { categoryList } from '@/static/product'
import { apiDeleteProduct, apiProducts, type PaginationResponse, type ProductResponse } from '@/api'

import type { Field } from '@/components/QueryForm.vue'
import type { QueryDataOptions } from '@/components/QueryDataTable.vue'

import { formatTime } from '@/plugins/TimeFormat'
import { useProductStore } from '@/stores/product.ts'

const router = useRouter()

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
    label: '商品名称',
    prop: 'name',
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    type: 'time',
    fmt: (value: string) => formatTime(value, 'YYYY-MM-DD'),
  },
  {
    label: '售价',
    prop: 'price',
    fmt: (value: string) => `¥ ${value}`,
  },
  {
    label: '销量',
    prop: 'sales',
  },
  {
    label: '库存',
    prop: 'stock',
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

const products = ref<ProductResponse[]>([])
const pagination = ref<PaginationResponse['pagination']>({
  pageSize: 10,
  total: 0,
  limit: 0,
  page: 1,
})

const getProducts = async () => {
  const data = await apiProducts({
    page: pagination.value.page,
    pageSize: pagination.value.pageSize,
  })
  products.value = data.list
  pagination.value = data.pagination
}

watch(
  () => pagination.value.page,
  () => {
    getProducts()
    console.log(pagination.value)
  },
)

onMounted(() => {
  getProducts()
})

const onSearch = (e: Record<string, any>) => {
  getProducts()
}

const onShowDeleteMessage = (row: ProductResponse): void => {
  ElMessageBox({
    type: 'warning',
    title: '删除商品',
    message: `确认删除商品：<strong>${row.name}</strong>?`,
    showCancelButton: true,
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    confirmButtonClass: 'el-button--danger',
    dangerouslyUseHTMLString: true,
    appendTo: 'body'
  }).then(async () => {
    const res = await apiDeleteProduct(row.id)
    ElMessage.success(`商品：${row.name} 已删除`)
    await getProducts()
  })
}

const { setDetail } = useProductStore()
const goToProductEdit = (row: ProductResponse): void => {
  setDetail(row)
  // 存到 localStorage 防止页面手动刷新丢失数据
  localStorage.setItem('product', JSON.stringify(row))
  router.push({
    name: 'product-detail',
    params: {
      id: row.id,
    }
  })
}
</script>

<template>
  <el-card>
    <query-form :fields="fields" @search="onSearch" />
  </el-card>
  <el-card mt-2>
    <query-data-table
      v-model:pagination="pagination"
      :selection="true"
      :data="products"
      :options="dataOptions"
    >
      <template #operate="scoped">
<!--        <el-button size="small" type="default">查看</el-button>-->
        <el-button size="small" type="primary" @click="goToProductEdit(scoped.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="onShowDeleteMessage(scoped.row)"
          >删除</el-button
        >
      </template>
    </query-data-table>
  </el-card>
</template>

<style lang="scss">
.query-form-inline {
  .el-select {
    --el-select-width: 220px;
  }
}
</style>
