<script lang="ts" setup>
import { ref } from 'vue'
import {
  apiPermissionCreate,
  apiPermissionDelete,
  apiPermissionEdit,
  apiPermissionList,
  type Permission,
} from '@/api'
import { formatDate } from '@vueuse/core'
import { usePermissionStore } from '@/stores'
const router = useRouter()
const { permissionCascaderOptions } = usePermissionStore()

const permissions = ref<Permission[]>([])
const permissionDetail = ref<Permission>({
  name: '',
  label: '',
  description: '',
})
const dialogConfig = ref<{
  visibility: boolean
  title: string
}>({
  visibility: false,
  title: '',
})

const getPermissions = async () => {
  permissions.value = await apiPermissionList()
}

const handleShowDialogEditor = (permission?: Permission) => {
  dialogConfig.value.visibility = true
  if (permission) {
    dialogConfig.value.title = '编辑权限'
    permissionDetail.value = structuredClone(toRaw(permission))
  } else {
    dialogConfig.value.title = '新增权限'
  }
}

const handleDeletePermission = (row: Permission) => {
  ElMessageBox.confirm(`删除权限 ${row.label}?`, '删除权限', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await apiPermissionDelete(row.id!)
    ElMessage.success(`权限 ${row.label} 已删除`)
    await getPermissions()
  })
}

const handleDialogClose = () => {
  permissionDetail.value = {
    name: '',
    label: '',
    description: '',
  }
}

const onConfirmPermissionEditor = async () => {
  if (permissionDetail.value?.id) {
    await apiPermissionEdit(toRaw(permissionDetail.value))
  } else {
    await apiPermissionCreate(toRaw(permissionDetail.value))
  }
  dialogConfig.value.visibility = false
  ElMessage.success('编辑成功')
  await getPermissions()
}

const goToPermissionMaps = () => {
  router.push({
    name: 'system-permission-maps',
  })
}
onBeforeMount(() => {
  getPermissions()
})
</script>

<template>
  <el-card>
    <template #header>
      <div flex justify-between items-center>
        <span>权限管理</span>
        <div>
          <el-button type="primary" link @click="goToPermissionMaps">权限映照表格</el-button>
          <el-button type="primary" @click="handleShowDialogEditor()">新增权限</el-button>
        </div>
      </div>
    </template>
    <el-table :data="permissions" border style="width: 100%">
      <el-table-column prop="label" label="权限名称" width="120" />
      <el-table-column prop="name" label="权限内容" width="140" />
      <el-table-column prop="createBy" label="创建者" width="120" />
      <el-table-column
        prop="createdAt"
        label="创建时间"
        width="200"
        :formatter="(row) => formatDate(new Date(row.createdAt), 'YYYY-MM-DD HH:mm:ss')"
      />

      <el-table-column prop="description" label="权限描述" />
      <el-table-column label="操作" width="135">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleShowDialogEditor(row)"
            >编辑</el-button
          >
          <el-button type="danger" size="small" @click="handleDeletePermission(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-dialog
    append-to-body
    v-model="dialogConfig.visibility"
    :title="dialogConfig.title"
    @close="handleDialogClose"
  >
    <el-form :model="permissionDetail">
      <el-form-item label="权限名称">
        <el-input v-model="permissionDetail.label" />
      </el-form-item>
      <el-form-item label="权限内容">
        <el-input v-model="permissionDetail.name" />
        <el-cascader v-model="permissionDetail.name" :options="permissionCascaderOptions"></el-cascader>
      </el-form-item>
      <el-form-item label="权限描述">
        <el-input v-model="permissionDetail.description" />
      </el-form-item>
      <el-form-item>
        <div flex-1></div>
        <el-button type="primary" @click="onConfirmPermissionEditor">确认</el-button>
        <el-button @click="dialogConfig.visibility = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
