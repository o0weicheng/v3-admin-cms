<script lang="ts" setup>
import { type PaginationResponse, type Log, apiLogList, apiLogUsers, type LogPayload } from '@/api'
import type { QueryDataOptions } from '@/components/QueryDataTable.vue'
import type { Field, FieldOption } from '@/components/QueryForm.vue'
import { formatDate } from '@vueuse/core'

const logs = ref<Log[]>([])
const logDetail = ref<Log>({
  id: '',
  username: '',
  action: '',
  module: '',
  ip: '',
  status: 0,
  message: '',
  createdAt: '',
})
const users = ref<string[]>([])
const drawer = ref<boolean>(false)

const fields = ref<Field[]>([
  {
    type: 'select',
    label: '操作员',
    prop: 'user',
    placeholder: '选择操作员',
    clearable: true,
    options: computed(() =>
      users.value.map((user) => ({
        label: user,
        value: user,
      })),
    ),
  },
])

const dataOptions: QueryDataOptions[] = [
  {
    label: 'ID',
    prop: 'id',
    width: 180,
  },
  {
    label: '操作员',
    prop: 'username',
  },
  {
    label: '所属模块',
    prop: 'module',
  },
  {
    label: '操作类型',
    prop: 'action',
    width: 100,
  },
  {
    label: '操作时间',
    prop: 'createdAt',
    width: 180,
    fmt: (value: string) => formatDate(new Date(value), 'YYYY-MM-DD HH:mm:ss'),
  },
  {
    label: '操作详情',
    prop: 'message',
  },
]

const form = reactive<LogPayload>({
  user: '',
  page: 1,
  pageSize: 10,
})

const pagination = ref<PaginationResponse['pagination']>({
  pageSize: 10,
  total: 0,
  limit: 0,
  page: 1,
})

const getLogs = async () => {
  const res = await apiLogList(toRaw(form))
  logs.value = res.list
  pagination.value = res.pagination
}

const getLogUser = async () => {
  const res = await apiLogUsers()
  users.value = res
}

onBeforeMount(() => {
  getLogs()
  getLogUser()
})

watch(
  () => pagination.value.page,
  () => {
    form.page = pagination.value.page
    form.pageSize = pagination.value.pageSize
    getLogs()
  },
)

// 加入分页判断
// 如果页面数大于1，且当前页数据为空，则将页码减1后重新获取数据
const onSearch = (data?: Record<string, any>) => {
  Object.assign(form, data)
  console.log(form)

  if (pagination.value.page !== 1) pagination.value.page = 1
  else getLogs()
}

const onShowDrawer = (log?: Log) => {
  drawer.value = true
  // 使用原生结构深拷贝 api: structuredClone
  // 避免外层 categories 双向绑定
  if (log?.id) {
    logDetail.value = structuredClone(toRaw(log))
  }
}
const onDrawerClose = () => {
  logDetail.value = {
    id: '',
    username: '',
    action: '',
    module: '',
    ip: '',
    status: 0,
    message: '',
    createdAt: '',
  }
}
</script>

<template>
  <el-card>
    <query-form :fields="fields" @search="onSearch" />
  </el-card>
  <el-card mt-2>
    <query-data-table
      :data="logs"
      :options="dataOptions"
      v-model:pagination="pagination"
      :operate-width="75"
    >
      <template #avatar="scoped">
        <el-image fit="cover" lazy w="20px" h="20px" :src="scoped.row.avatar" />
      </template>
      <template #operate="scoped">
        <el-button type="primary" size="small" @click="onShowDrawer(scoped.row)">详情</el-button>
      </template>
    </query-data-table>
  </el-card>

  <el-drawer
    class="el-drawer__wrap"
    v-model="drawer"
    size="40vw"
    resizable
    append-to-body
    title="日志详情"
    @close="onDrawerClose"
  >
    <div flex flex-col h-full overflow-hidden>
      <el-scrollbar flex-1>
        <el-descriptions :column="1" direction="vertical" title="" border>
          <el-descriptions-item label="id">{{ logDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="操作员">{{ logDetail.username }}</el-descriptions-item>
          <el-descriptions-item label="操作行为">{{ logDetail.action }}</el-descriptions-item>
          <el-descriptions-item label="所属模块">
            <el-tag size="small">{{ logDetail.module }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="ip">
            {{ logDetail.ip }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            {{ logDetail.status ? '成功' : '失败' }}
          </el-descriptions-item>
          <el-descriptions-item label="详情信息">
            {{ logDetail.message }}
          </el-descriptions-item>
          <el-descriptions-item label="操作时间">
            {{ formatDate(new Date(logDetail.createdAt), 'YYYY-MM-DD HH:mm:ss') }}
          </el-descriptions-item>
        </el-descriptions>
      </el-scrollbar>
    </div>
  </el-drawer>
</template>

<style lang="scss" scoped></style>
