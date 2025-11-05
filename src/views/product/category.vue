<script setup lang="ts">
import { ref } from 'vue'

import type { Field } from '@/components/QueryForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { QueryDataOptions } from '@/components/QueryDataTable.vue'
import { apiCategories, apiCreateCategory, apiDeleteCategory, apiUpdateCategory, type CategoryResponse } from '@/api'
import { formatTime } from '@/plugins/TimeFormat.ts'

const categories = ref<CategoryResponse[]>([])

const drawer = ref<boolean>(false)
const drawerMode = ref<'create' | 'edit'>('create')
const rename = ref<string>('')
const categoryDetail = ref<CategoryResponse>({
  name: '',
  id: 0,
  parentId: 0,
  children: [],
  createdAt: '',
  updatedAt: '',
})
const fields = ref<Field[]>([
  { type: 'input', label: '类别名称', prop: 'name', placeholder: '请输入商品类名' },
])

const dataOptions: QueryDataOptions[] = [
  {
    label: '类别名称',
    prop: 'name',
  },
  {
    label: 'ID',
    prop: 'id',
    width: 300,
  },
  {
    label: '子类',
    prop: 'children',
    width: 300,
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    type: 'time',
    fmt: (value: string) => formatTime(value, 'YYYY-MM-DD'),
  },
]

const getCategories = async () => {
  categories.value = await apiCategories()
}

onBeforeMount(() => {
  getCategories()
})

const onSearch = (e: Record<string, any>) => {
  console.log(e)
}

const onShowDrawer = (type: 'create' | 'edit', category?: CategoryResponse) => {
  drawer.value = true
  drawerMode.value = type
  // 使用原生结构深拷贝 api: structuredClone
  // 避免外层 categories 双向绑定
  if (category?.id) {
    categoryDetail.value = structuredClone(toRaw(category))
  }
}

const onShowDeleteMessage = (category: CategoryResponse): void => {
  ElMessageBox({
    type: 'warning',
    title: '删除类别',
    message: `确认删除类别<strong>${category.name}</strong>?`,
    showCancelButton: true,
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    confirmButtonClass: 'el-button--danger',
    dangerouslyUseHTMLString: true,
  }).then(async () => {
    await apiDeleteCategory(category.id)
    ElMessage.success(`类别 ${category.name} 已删除`)
    await getCategories()
  })
}

// 提交修改 or 新增
const onConfirm = async () => {
  if (rename.value) {
    categoryDetail.value.name = rename.value
  }
  if (drawerMode.value === 'create') {
    if (!rename.value) return ElMessage.error('新增分类需要分类名称')
    await apiCreateCategory(categoryDetail.value)
    ElMessage.success({
      message: `新增分类 ${rename.value}`,
      placement: 'top-right',
    })
  } else {
    await apiUpdateCategory(categoryDetail.value)
    ElMessage.success({
      message: '修改成功',
      placement: 'top-right',
    })
  }
  drawer.value = false
  rename.value = ''
  await getCategories()
}
// 删除子类
const onDeleteSubCategory = (subCategory: CategoryResponse) => {
  if (!categoryDetail.value.children) return
  categoryDetail.value.children = categoryDetail?.value?.children.filter(
    (s) => s.id !== subCategory.id,
  )
}
// 添加子类
const onAddSubCategory = () => {
  ElMessageBox.prompt('', '新增子类', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
  }).then(({ value }) => {
    categoryDetail.value?.children.push({
      id: 0,
      name: value,
      parentId: categoryDetail.value.id,
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  })
}


const onDrawerClose = () => {
  categoryDetail.value = {
    name: '',
    id: 0,
    parentId: 0,
    children: [],
    createdAt: '',
    updatedAt: '',
  }
}
</script>

<template>
  <el-card>
    <div flex justify-between items-center>
      <query-form flex-1 :fields="fields" @search="onSearch" />
      <el-button @click="onShowDrawer('create')">新增</el-button>
    </div>
  </el-card>
  <el-card mt-2>
    <query-data-table :selection="true" :data="categories" :options="dataOptions">
      <template #children="scope">
        <el-tag mr-1 v-if="scope.row.children?.length" v-for="sub in scope.row.children">{{
          sub.name
        }}</el-tag>
        <el-tag v-else type="danger">暂无子类</el-tag>
      </template>
      <template #operate="scope">
        <el-button size="small" type="primary" @click="onShowDrawer('edit', scope.row)"
          >编辑</el-button
        >
        <el-button size="small" type="danger" @click="onShowDeleteMessage(scope.row)"
          >删除</el-button
        >
      </template>
    </query-data-table>
  </el-card>
  <el-drawer
    class="el-drawer__wrap"
    v-model="drawer"
    size="40vw"
    resizable
    append-to-body
    :title="categoryDetail.name || '新增分类'"
    @close="onDrawerClose"
  >
    <div flex flex-col h-full overflow-hidden>
      <el-scrollbar flex-1>
        <el-alert
          title="此处修改不会即刻生效，需点击下方确认按钮生效"
          effect="dark"
          :closable="false"
          type="info"
        />
        <label mt-4 flex>
          <el-text ws-nowrap>重命名</el-text>
          <span pl-2 flex-1>
            <el-input name="rename" v-model="rename" />
          </span>
        </label>
        <div flex justify-between items-center>
          <h3>子类</h3>
          <el-button type="primary" size="small" @click="onAddSubCategory">新增</el-button>
        </div>
        <el-table w-full :data="categoryDetail.children">
          <el-table-column fixed prop="name" label="名称" width="100">
            <template #default="scoped">
              <el-input v-model="scoped.row.name"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="ID" width="330">
            <template #default="scoped">
              <span>{{ scoped.row.id || 'ID 暂未生成' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="180" />
          <el-table-column label="操作" fixed="right">
            <template #default="scoped">
              <el-button type="danger" size="small" @click="onDeleteSubCategory(scoped.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <div pt="6" box-border flex justify-end w-full>
        <el-button type="primary" @click="onConfirm">确认修改</el-button>
        <el-button @click="drawer = false">取消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style lang="scss">
.el-drawer__wrap {
  .el-drawer__header {
    margin-bottom: 10px;
  }
}
</style>
