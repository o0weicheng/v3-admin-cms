<script lang="ts" setup>
import { type Member, apiMemberDetail, apiUpdateMember, apiDeleteMember } from '@/api'
import type { Field } from '@/components/DetailForm.vue'
import { Plus } from '@element-plus/icons-vue'
import { formatDate } from '@vueuse/core'

const router = useRouter()
const detail = ref<Member>({
  id: '',
  avatar: '',
  name: '',
  phone: '',
  email: '',
  level: '普通会员',
  balance: 0,
  points: 0,
  gender: '未知',
  status: 1,
  registerAt: '',
  lastLoginAt: '',
  remark: '',
  createdAt: '',
  updatedAt: '',
})

const fields = ref<Field<Member>[]>([
  {
    type: 'text',
    label: '会员ID',
    prop: 'id',
  },
  {
    type: 'input',
    label: '头像',
    prop: 'avatar',
  },
  {
    type: 'input',
    label: '会员名称',
    prop: 'name',
    props: { placeholder: '请输入会员名称' },
  },
  {
    type: 'input',
    label: '手机号',
    prop: 'phone',
    props: { placeholder: '请输入手机号' },
  },
  {
    type: 'input',
    label: '邮箱',
    prop: 'email',
    props: { placeholder: '请输入邮箱' },
  },
  {
    type: 'select',
    label: '会员等级',
    prop: 'level',
    props: { placeholder: '选择会员等级' },
    value: detail.value.level,
    options: [
      { label: '普通会员', value: '普通会员' },
      { label: '黄金会员', value: '黄金会员' },
      { label: '白金会员', value: '白金会员' },
      { label: '钻石会员', value: '钻石会员' },
    ],
    fmt: (value: string) => value,
  },
  {
    type: 'select',
    label: '会员状态',
    prop: 'status',
    props: { placeholder: '选择会员状态' },
    value: detail.value.status,
    options: [
      { label: '正常', value: 1 },
      { label: '封禁', value: 0 },
    ],
    fmt: (value: number) => (value === 1 ? '正常' : '封禁'),
  },
  {
    type: 'textarea',
    label: '备注',
    prop: 'remark',
    props: { placeholder: '请输入备注', row: 4 },
    value: detail.value.remark,
  },
])

const getMemberDetail = async () => {
  const route = useRoute()
  const res = await apiMemberDetail(route.params.id as string)
  detail.value = res
}

onBeforeMount(() => {
  getMemberDetail()
})

const onBack = () => {
  router.back()
}

const onSaveMember = async () => {
  console.log('保存会员信息', detail.value)
  await apiUpdateMember(detail.value)
  ElMessage.success('会员信息保存成功')
}

const onDeleteMember = async () => {
  ElMessageBox.confirm('确定要删除该会员吗？', '删除会员', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await apiDeleteMember(detail.value.id)
    ElMessage.success('会员删除成功')
    router.back()
  })
}
</script>

<template>
  <el-page-header @back="onBack">
    <template #breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/member/overview' }">会员管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员详情</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <template #content>
      <h2 m-0 font-bold text-xl>{{ detail.name }}</h2>
    </template>
  </el-page-header>
  <el-card mt-4>
    <el-descriptions :column="2" border>
      <el-descriptions-item :rowspan="2" label="头像">
        <el-avatar :src="detail.avatar" fit="cover" size="large" />
      </el-descriptions-item>
      <el-descriptions-item label="会员名称">{{ detail.name }}</el-descriptions-item>

      <el-descriptions-item label="会员ID">{{ detail.id }}</el-descriptions-item>
      <el-descriptions-item label="手机号">{{ detail.phone }}</el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ detail.email }}</el-descriptions-item>
      <el-descriptions-item label="会员等级">{{ detail.level }}</el-descriptions-item>
      <el-descriptions-item label="账户余额"
        >¥ {{ Number(detail.balance).toFixed(2) }}</el-descriptions-item
      >
      <el-descriptions-item label="积分">{{ detail.points }}</el-descriptions-item>
      <el-descriptions-item label="性别">{{ detail.gender }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{
        detail.status === 1 ? '正常' : '封禁'
      }}</el-descriptions-item>
      <el-descriptions-item label="注册时间">{{
        formatDate(new Date(detail.registerAt), 'YYYY-MM-DD')
      }}</el-descriptions-item>
      <el-descriptions-item label="最后登录时间">{{
        formatDate(new Date(detail.lastLoginAt), 'YYYY-MM-DD')
      }}</el-descriptions-item>
      <el-descriptions-item label="备注">{{ detail.remark }}</el-descriptions-item>
    </el-descriptions>
  </el-card>
  <el-card mt-2 shadow="never">
    <div flex justify-end>
      <el-button type="danger" size="small" @click="onDeleteMember">删除会员</el-button>
    </div>
    <detail-form :fields="fields" :detail="detail">
      <template #avatar="scoped">
        <el-upload
          w="80px"
          h="80px"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :show-file-list="false"
        >
          <img v-if="scoped.row" :src="scoped.row" w="80px" h="80px" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </template>
      <template #footer>
        <div flex justify-end>
          <el-button type="primary" @click="onSaveMember">保存</el-button>
          <el-button>取消</el-button>
        </div>
      </template>
    </detail-form>
  </el-card>
</template>

<style lang="scss" scoped></style>
