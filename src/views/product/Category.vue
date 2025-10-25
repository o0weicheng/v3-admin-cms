<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { categoryList, type CategoryRow } from '@/static/product'

import type { Field } from '@/components/QueryForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { QueryDataOptions } from '@/components/QueryDataTable.vue'

const drawer = ref<boolean>(false)
const rename = ref<string>('')
const isChildrenEdit = ref<boolean>(false)
const categoryDetail = reactive({
  value: '',
  label: '',
  status: 0,
  createTime: null,
  children: [],
})
const fields = ref<Field[]>([
  { type: 'input', label: '类别名称', prop: 'name', placeholder: '请输入商品类名' },
  {
    type: 'select',
    label: '状态',
    prop: 'status',
    placeholder: '选择状态',
    clearable: true,
    options: [
      {
        label: '启用',
        value: 1,
      },
      {
        label: '禁用',
        value: 0,
      },
    ],
  },
])

const dataOptions: QueryDataOptions[] = [
  {
    label: 'id',
    prop: 'value',
  },
  {
    label: '类别名称',
    prop: 'label',
  },
  {
    label: '子类',
    prop: 'children',
  },
  {
    label: '状态',
    prop: 'status',
    type: 'status',
    fmt: (value) => (value === 1 ? '启用' : '禁用'),
  },
]

const subDataOptions: QueryDataOptions[] = [
  {
    label: '类别名称',
    prop: 'label',
  },
  {
    label: '状态',
    prop: 'status',
    type: 'status',
    fmt: (value) => (value === 1 ? '启用' : '禁用'),
  },
]

const onSearch = (e: Record<string, any>) => {
  console.log(e)
}

const onShowDrawer = (category: object) => {
  drawer.value = true
  Object.assign(categoryDetail, category)
}

const onCategoryRename = () => {
  if (!rename.value) return
  categoryDetail.label = rename.value
  ElMessage({
    message: '类别名称修改成功',
    type: 'success',
    placement: 'top-right',
  })
}

const onShowDeleteMessage = (label: string): void => {
  ElMessageBox({
    type: 'warning',
    title: '删除类别',
    message: `确认删除类别<strong>${label}</strong>?`,
    showCancelButton: true,
    cancelButtonText: '取消',
    confirmButtonText: '确认',
    confirmButtonClass: 'el-button--danger',
    dangerouslyUseHTMLString: true,
  }).then(() => {
    ElMessage.success(`类别 ${label} 已删除`)
  })
}

const onConfirm = () => {
  ElMessage.success({
    message: '修改成功',
    placement: 'top-right',
  })
  drawer.value = false
}
</script>

<template>
  <el-card>
    <query-form :fields="fields" @search="onSearch" />
  </el-card>
  <el-card mt-2>
    <query-data-table
      :selection="true"
      :data="categoryList.data"
      v-model:pagination="categoryList.pagination"
      :options="dataOptions"
    >
      <template #children="scope">
        <el-tag mr-1 v-if="scope.row.children?.length" v-for="sub in scope.row.children">{{
          sub.label
        }}</el-tag>
        <el-tag v-else type="danger">暂无子类</el-tag>
      </template>
      <template #operate="scope">
        <!-- <el-button size="small" type="default" @click="onShowDrawer(scope.row)">查看</el-button> -->
        <el-button size="small" type="primary" @click="onShowDrawer(scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="onShowDeleteMessage(scope.row?.label)"
          >删除</el-button
        >
      </template>
    </query-data-table>
  </el-card>
  <el-drawer
    class="el-drawer__wrap"
    v-model="drawer"
    resizable
    append-to-body
    :title="categoryDetail.label"
  >
    <div flex flex-col h-full overflow-hidden>
      <el-scrollbar flex-1>
        <el-alert
          title="此处修改不会即刻生效，需点击下方确认按钮生效"
          effect="dark"
          :closable="false"
          type="info"
        />
        <el-form pt="4" inline>
          <el-form-item label="重命名">
            <el-input v-model="rename" />
          </el-form-item>
          <el-form-item>
            <el-button size="small" @click="onCategoryRename">确定</el-button>
          </el-form-item>
          <el-form-item label="状态">
            <el-switch
              v-model="categoryDetail.status"
              class="ml-2"
              :active-text="categoryDetail.status ? '启用' : '禁用'"
              :active-value="1"
              :inactive-value="0"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
            />
          </el-form-item>
        </el-form>
        <h3 flex justify-between>
          子类<el-button size="small" @click="isChildrenEdit = true">修改</el-button>
        </h3>
        <query-data-table
          :data="categoryDetail.children"
          :options="subDataOptions"
        ></query-data-table>
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
