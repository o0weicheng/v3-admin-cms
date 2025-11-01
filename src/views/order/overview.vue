<script lang="ts" setup>
import { type PaginationResponse } from '@/api'
import { apiOrders, apiUpdateOrderStatus, type Order, type OrderPayload } from '@/api/order'
import type { QueryDataOptions } from '@/components/QueryDataTable.vue'
import type { Field } from '@/components/QueryForm.vue'
import { formatTime } from '@/plugins/TimeFormat'
import { pa } from 'element-plus/es/locales.mjs'

const router = useRouter()
const orders = ref<Order[]>([])
const fields = ref<Field[]>([
  { type: 'input', label: '订单号', prop: 'id', placeholder: '请输入订单号' },
  {
    type: 'select',
    label: '订单状态',
    prop: 'status',
    placeholder: '选择订单状态',
    clearable: true,
    options: [
      {
        label: '待支付',
        value: '待支付',
      },
      {
        label: '已支付',
        value: '已支付',
      },
      {
        label: '已发货',
        value: '已发货',
      },
      {
        label: '已完成',
        value: '已完成',
      },
      {
        label: '已取消',
        value: '已取消',
      },
    ],
  },
])

const dataOptions: QueryDataOptions[] = [
  {
    label: '订单号',
    prop: 'orderNo',
  },
  {
    label: '会员名称',
    prop: 'userName',
  },
  {
    label: '会员手机号',
    prop: 'userPhone',
  },
  {
    label: '会员 ID',
    prop: 'userId',
    width: 100,
  },
  {
    label: '支付方式',
    prop: 'payType',
    width: 100,
  },
  {
    label: '总金额',
    prop: 'totalAmount',
    fmt: (value: number) => `¥${value}`,
    width: 100,
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    fmt: (value: string) => formatTime(value, 'YYYY-MM-DD HH:mm'),
    width: 180,
  },
  {
    label: '状态',
    prop: 'status',
    width: 100,
  },
  {
    label: '订单备注',
    prop: 'remark',
    width: 100,
  },
]

const form = reactive<OrderPayload>({
  id: 0,
  status: '',
  page: 1,
  pageSize: 10,
})

const pagination = ref<PaginationResponse['pagination']>({
  pageSize: 10,
  total: 0,
  limit: 0,
  page: 1,
})

const getOrders = async () => {
  const res = await apiOrders(toRaw(form))
  orders.value = res.list
  pagination.value.total = res.pagination.total
}

onBeforeMount(() => {
  getOrders()
})

watch(
  () => pagination.value.page,
  () => {
    form.page = pagination.value.page
    form.pageSize = pagination.value.pageSize
    getOrders()
  },
)

// 加入分页判断
// 如果页面数大于1，且当前页数据为空，则将页码减1后重新获取数据
const onSearch = (data?: Record<string, any>) => {
  Object.assign(form, data)
  if (pagination.value.page !== 1) pagination.value.page = 1
  else getOrders()
}

const onCancelOrder = (order: Order) => {
  ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await apiUpdateOrderStatus(order.id, '已取消')
    await getOrders()
    ElMessage({
      type: 'success',
      message: '订单已取消',
    })
  })
}

const goToOrderDetail = (order: Order) => {
  router.push({ name: 'order-detail', params: { id: order.orderNo } })
}
</script>

<template>
  <el-card>
    <query-form :fields="fields" @search="onSearch" />
  </el-card>
  <el-card mt-2>
    <query-data-table
      :selection="true"
      :data="orders"
      :options="dataOptions"
      v-model:pagination="pagination"
    >
      <template #avatar="scoped">
        <el-image fit="cover" lazy w="20px" h="20px" :src="scoped.row.avatar" />
      </template>
      <template #operate="scoped">
        <el-button type="primary" size="small" @click="goToOrderDetail(scoped.row)">详情</el-button>
        <el-button
          :disabled="scoped.row.status === '已取消'"
          type="danger"
          size="small"
          @click="onCancelOrder(scoped.row)"
          >取消</el-button
        >
      </template>
    </query-data-table>
  </el-card>
</template>

<style lang="scss" scoped></style>
