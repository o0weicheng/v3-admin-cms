<script lang="ts" setup>
import { apiMembers, type MemberPayload, type Member, type PaginationResponse } from '@/api'
import type { QueryDataOptions } from '@/components/QueryDataTable.vue'
import type { Field } from '@/components/QueryForm.vue'
import { formatTime } from '@/plugins/TimeFormat'

const router = useRouter()
const members = ref<Member[]>([])
const fields = ref<Field[]>([
  { type: 'input', label: '会员名称', prop: 'name', placeholder: '请输入会员名称' },
  {
    type: 'select',
    label: '会员等级',
    prop: 'level',
    placeholder: '选择会员等级',
    clearable: true,
    options: [
      {
        label: '普通会员',
        value: '普通会员',
      },
      {
        label: '黄金会员',
        value: '黄金会员',
      },
      {
        label: '白金会员',
        value: '白金会员',
      },
      {
        label: '钻石会员',
        value: '钻石会员',
      },
    ],
  },
  {
    type: 'select',
    label: '会员状态',
    prop: 'status',
    placeholder: '选择会员状态',
    clearable: true,
    options: [
      {
        label: '正常',
        value: 1,
      },
      {
        label: '封禁',
        value: 0,
      },
    ],
  },
])

const dataOptions: QueryDataOptions[] = [
  {
    label: 'ID',
    prop: 'id',
    width: 180,
  },
  {
    label: '头像',
    prop: 'avatar',
    width: 60,
  },
  {
    label: '会员名称',
    prop: 'name',
    width: 150,
  },
  {
    label: '会员等级',
    prop: 'level',
    width: 120,
  },
  {
    label: '会员积分',
    prop: 'points',
    width: 100,
  },
  {
    label: '手机号',
    prop: 'phone',
    width: 140,
  },
  {
    label: '注册时间',
    prop: 'createdAt',
    fmt: (value: string) => formatTime(value, 'YYYY-MM-DD HH:mm'),
    width: 180,
  },
  {
    label: '性别',
    prop: 'gender',
    width: 80,
  },
  {
    label: '状态',
    prop: 'status',
    type: 'tag',
    fmt: (value: number) => (value === 1 ? '正常' : '封禁'),
    width: 100,
  },
]

const form = reactive<MemberPayload>({
  name: '',
  level: '',
  status: null,
  page: 1,
  pageSize: 10,
})

const pagination = ref<PaginationResponse['pagination']>({
  pageSize: 10,
  total: 0,
  limit: 0,
  page: 1,
})

const getMember = async () => {
  console.log(form)

  const res = await apiMembers(toRaw(form))
  members.value = res.list
  pagination.value = res.pagination
}

onBeforeMount(() => {
  getMember()
})

watch(
  () => pagination.value.page,
  () => {
    form.page = pagination.value.page
    form.pageSize = pagination.value.pageSize
    getMember()
    // console.log(pagination.value);
  },
)

const onSearch = (data: Record<string, any>) => {
  Object.assign(form, data)
  if (pagination.value.page !== 1) pagination.value.page = 1
  else getMember()
}

const goToMemberDetail = (member: Member) => {
  router.push({ name: 'member-detail', params: { id: member.id } })
}
</script>

<template>
  <el-card>
    <query-form :fields="fields" @search="onSearch" />
  </el-card>
  <el-card mt-2>
    <query-data-table
      :selection="true"
      :data="members"
      :options="dataOptions"
      v-model:pagination="pagination"
    >
      <template #avatar="scoped">
        <el-image fit="cover" lazy w="20px" h="20px" :src="scoped.row.avatar" />
      </template>
      <template #operate="scoped">
        <el-button type="primary" size="small" @click="goToMemberDetail(scoped.row)"
          >详情</el-button
        >
        <el-button :disabled="scoped.row.status === 0" type="danger" size="small">封禁</el-button>
      </template>
    </query-data-table>
  </el-card>
</template>

<style lang="scss" scoped></style>
