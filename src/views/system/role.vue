<script lang="ts" setup>
import {
  apiPermissionList,
  apiRoleCreate,
  apiRoleDelete,
  apiRoleEdit,
  apiRoleList,
  apiUserList,
  type Permission,
  type PermissionMap,
  type Role,
  type User,
} from '@/api'
import { ref } from 'vue'
import { formatDate } from '@vueuse/core'
import RoleEditorForm from '@/views/system/components/RoleEditorForm.vue'

const userList = ref<User[]>([])
const userDetail = ref<Omit<User, 'createdAt'>>({
  nickname: '',
  username: '',
  role: '',
  status: 1
})
const roleList = ref<Role[]>([])
const roleDetail = ref<Role>({
  name: '',
  role: '',
  permissions: [],
})
const permissionsMap: PermissionMap = {
  'role:assign': '分配角色',
  'user:add': '新增用户',
  'user:edit': '编辑用户',
  'user:delete': '删除用户',
  'article:add': '新增文章',
  'article:edit': '编辑文章',
}
const PermissionList = ref<Permission[]>([])
const drawerConfig = ref<{
  visibility: boolean
  title: string
}>({
  visibility: false,
  title: '',
})
const init = () => {
  Promise.all([getPermissions(), getRoles(), getUsers()])
}
const getPermissions = async () => {
  PermissionList.value = await apiPermissionList()
}
const getRoles = async () => {
  roleList.value = await apiRoleList()
}
const getUsers = async () => {
  userList.value = await apiUserList()
}

const autoCompleteSearch = (query: string, cb: (arg: any) => void) => {
  const results = query ? roleList.value.filter((r) => r.name.indexOf(query) === 0) : roleList.value
  cb(results)
}

const handleAddRole = () => {
  drawerConfig.value = {
    visibility: true,
    title: '新增角色',
  }
}

const handleEdit = (row: Role) => {
  drawerConfig.value = {
    visibility: true,
    title: '编辑角色',
  }
  roleDetail.value = structuredClone(toRaw(row))
}

const onDrawerClose = () => {
  drawerConfig.value.title = ''
  roleDetail.value = {
    name: '',
    role: '',
    permissions: [],
  }
}

const handleDelete = (row: Role) => {
  ElMessageBox.confirm(`删除角色：${row.role}？`, '删除角色', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    await apiRoleDelete(row.id!)
    ElMessage.success(`角色${row.role}已删除`)

    await getRoles()
  })
}
const onSubmitRoleEditor = async () => {
  const newRoleDetail = toRaw(roleDetail.value)
  newRoleDetail.id ? await apiRoleEdit(newRoleDetail) : await apiRoleCreate(newRoleDetail)
  drawerConfig.value.visibility = false
  await getRoles()
}

onBeforeMount(() => {
  init()
})
</script>

<template>
  <el-card>
    <template #header>
      <div flex justify-between items-center>
        <span>角色管理</span>
        <el-button type="primary" @click="handleAddRole">新增角色</el-button>
      </div>
    </template>
    <el-table :data="roleList" border style="width: 100%">
      <el-table-column prop="name" label="角色名称" width="120" />
      <el-table-column prop="role" label="角色" width="100" />
      <el-table-column prop="permissions" label="角色权限">
        <template #default="scoped">
          <el-text v-if="!scoped?.row?.permissions?.length" type="info" m-1> 没有权限 </el-text>
          <template v-else v-for="permission in scoped.row.permissions">
            <el-tag effect="plain" m-1>{{
              PermissionList.find((p) => p.name === permission)?.label
            }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="135">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-card mt-2>
    <template #header>
      <div flex justify-between items-center>
        <span>账号管理</span>
        <el-button type="primary" @click="handleAddRole">添加账号</el-button>
      </div>
    </template>
    <el-table :data="userList" border style="width: 100%">
      <el-table-column prop="nickname" label="账号" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="status" label="状态">
        <template #default="scoped">
          <status-dot :label="scoped.row.status ? '正常' : '禁用'" :type="scoped.row.status ? 'success' : 'danger'" />
        </template>
      </el-table-column>
      <el-table-column prop="permissions" label="创建时间" :formatter="(row) => formatDate(new Date(row.createdAt), 'YYYY-MM-DD HH:mm:ss')" />
      <el-table-column label="操作" width="135">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-drawer v-model="drawerConfig.visibility" :title="drawerConfig.title" @close="onDrawerClose">
    <role-editor-form :form="roleDetail" :map="permissionsMap" @visibility="drawerConfig.visibility = false" @submit="onSubmitRoleEditor" />
  </el-drawer>
</template>

<style scoped></style>
