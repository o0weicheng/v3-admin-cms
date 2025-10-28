<script lang="ts" setup>
import { apiMembers, type MemberPayload } from '@/api'
import type { Field } from '@/components/QueryForm.vue'

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

const form = reactive<MemberPayload>({
  name: '',
  level: '',
  status: null,
  page: 1,
  pageSize: 10,
})

const getMember = async () => {
  const res = await apiMembers(toRaw(form))
}

onBeforeMount(() => {
  getMember()
})

const onSearch = (data: Record<string, any>) => {
  Object.assign(form, data)
  getMember()
}
</script>

<template>
  <el-card>
    <query-form :fields="fields" @search="onSearch" />
  </el-card>
</template>

<style lang="scss" scoped></style>
