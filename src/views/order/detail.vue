<script lang="ts" setup>
import { type Order, apiOrderDetail, apiUpdateOrderStatus } from '@/api'
import type { QueryDataOptions } from '@/components/QueryDataTable.vue'
import { formatDate } from '@vueuse/core'

const router = useRouter()
const detail = ref<Order>({
  id: '',
  orderNo: '',
  userName: '',
  userPhone: '',
  userId: 0,
  products: [],
  totalAmount: 0,
  payType: '微信支付',
  status: '待支付',
  address: '',
  createdAt: '',
  updatedAt: '',
  remark: '',
})

const orderStatus = ref<Order['status'][]>(['待支付', '已支付', '已发货', '已完成', '已取消'])
const orderStatusIndex = computed(() => orderStatus.value.indexOf(detail.value.status))

const getMemberDetail = async () => {
  const route = useRoute()
  const res = await apiOrderDetail(route.params.id as string)
  detail.value = res
}

const dataOptions: QueryDataOptions[] = [
  {
    label: 'id',
    prop: 'id',
    width: 300,
  },
  {
    label: '商品名称',
    prop: 'name',
    width: 190,
  },
  {
    label: '购买数量',
    prop: 'quantity',
  },
  {
    label: '售价',
    prop: 'price',
    fmt: (value: string) => `¥ ${value}`,
  },
  {
    label: '类别',
    prop: 'category',
    type: 'tag',
  },
]

onBeforeMount(() => {
  getMemberDetail()
})

const onBack = () => {
  router.back()
}

const onCancelOrder = () => {
  ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await apiUpdateOrderStatus(detail.value.id, '已取消')
      ElMessage({
        type: 'success',
        message: '订单已取消',
      })
      detail.value.status = '已取消'
    })
    .catch(() => {
      // 取消操作
    })
}
</script>

<template>
  <el-page-header @back="onBack">
    <template #breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/order/overview' }">订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <template #content>
      <h2 m-0 font-bold text-xl>{{ detail.orderNo }}</h2>
    </template>
  </el-page-header>
  <el-card mt-4 shadow="never">
    <el-steps
      :finish-status="detail.status !== '已取消' ? 'success' : 'error'"
      :active="orderStatusIndex"
    >
      <el-step v-for="status in orderStatus" :title="status" />
    </el-steps>
    <div v-if="detail.status !== '已取消'" flex justify-end mt-2>
      <el-button type="danger" @click="onCancelOrder">取消订单</el-button>
    </div>
  </el-card>
  <el-card mt-2>
    <el-descriptions :column="2" border>
      <el-descriptions-item :span="2" label="订单号">{{ detail.orderNo }}</el-descriptions-item>
      <el-descriptions-item label="总金额"
        ><el-statistic prefix="¥" :value="detail.totalAmount"
      /></el-descriptions-item>
      <el-descriptions-item label="支付方式">{{ detail.payType }}</el-descriptions-item>
      <el-descriptions-item label="会员名称">{{ detail.userName }}</el-descriptions-item>
      <el-descriptions-item label="手机号">{{ detail.userPhone }}</el-descriptions-item>
      <el-descriptions-item label="收货地址">{{ detail.address }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{
        formatDate(new Date(detail.createdAt), 'YYYY-MM-DD HH:mm:ss')
      }}</el-descriptions-item>
      <el-descriptions-item label="备注">{{ detail.remark }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
  <el-card mt-2>
    <h2 class="m-0 text-gray text-lg">商品</h2>
    <query-data-table :data="detail.products" :options="dataOptions" />
  </el-card>
</template>

<style lang="scss" scoped></style>
