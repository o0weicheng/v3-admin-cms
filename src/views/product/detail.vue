<script setup lang="ts">
import { useProductStore } from '@/stores/product.ts'
import type { ProductResponse } from '@/api'
import { categoryList } from '@/static/product.ts'
import { CopyDocument } from '@element-plus/icons-vue'
import type { Field } from '@/components/DetailForm.vue'
import { formatDate } from '@vueuse/core'

const { detail, setDetail } = useProductStore()
const router = useRouter()

onMounted(() => {
  // 用户刷新页面导致 store 数据丢失
  // 从 localStorage 取
  if (!detail.id) {
    const storageProduct: ProductResponse = JSON.parse(<string>localStorage.getItem('product'))
    setDetail(storageProduct)
  }
})

// 使用 computed 自动追踪响应数据
// ref 的话还要在 nextTick 里面重新赋值一次
// 所以这里用 computed 方便一点
const fields = computed<Field[]>(() => [
  {
    type: 'text',
    label: '商品编号',
    prop: 'id',
    value: detail.id,
  },
  {
    type: 'text',
    label: '创建时间',
    prop: 'createAt',
    value: formatDate(new Date(detail.createdAt), 'YYYY-MM-DD HH:mm:ss'),
  },
  {
    type: 'input',
    label: '商品名称',
    prop: 'name',
    props: { placeholder: '请输入商品名' },
    value: detail.name,
  },
  {
    type: 'cascader',
    label: '商品类别',
    prop: 'category',
    props: { placeholder: '选择商品类别' },
    options: categoryList.data,
    value: detail.category,
  },
  {
    type: 'number',
    label: '商品售价',
    prop: 'price',
    props: { placeholder: '请输入商品销售价格', precision: 2, 'controls-position': 'right' },
    value: detail.price,
  },
  {
    type: 'select',
    label: '状态',
    prop: 'status',
    props: { placeholder: '选择状态' },
    value: detail.status,
    options: [
      {
        label: '上架',
        value: 1,
      },
      {
        label: '下架',
        value: 0,
      },
    ],
  },
  {
    type: 'input',
    label: '商品详情',
    prop: 'description',
    props: { placeholder: '请输入商品详情', row: 4, type: 'textarea' },
    value: detail.description,
  },
])

const onBack = () => {
  router.go(-1)
}

const onSaveProduct = () => {
  const newDetail = toRaw(fields.value)
  ElMessage.success('保存成功')
  router.go(-1)
}
</script>

<template>
  <el-page-header @back="onBack">
    <template #breadcrumb>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/product/overview' }">商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品详情</el-breadcrumb-item>
      </el-breadcrumb>
    </template>
    <template #content>
      <h2 m-0 font-bold text-xl>{{ detail.name }}</h2>
    </template>
  </el-page-header>
  <el-row mt-4 :gutter="20">
    <el-col :span="10">
      <el-card>
        <detail-form :fields="fields">
          <template #item="scoped">
            <div v-if="scoped.prop === 'id'" ml-2 self-baseline cursor-pointer>
              <el-icon><CopyDocument /></el-icon>
            </div>
          </template>
          <template #footer>
            <div flex>
              <el-button type="primary" flex-1 @click="onSaveProduct">保存</el-button>
              <el-button flex-1 @click="router.go(-1)">取消</el-button>
            </div>
          </template>
        </detail-form>
      </el-card>
    </el-col>
    <el-col :span="14">
      <el-card>
        <el-descriptions title="Width horizontal list" border>
          <el-descriptions-item
            :rowspan="2"
            :width="140"
            label="Photo"
            align="center"
          >
            <el-image
              style="width: 100px; height: 100px"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
          </el-descriptions-item>
          <template v-for="field in fields" :key="field.label">
          <el-descriptions-item label="Username">{{ field.label }}</el-descriptions-item>
          </template>
        </el-descriptions>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="scss"></style>
