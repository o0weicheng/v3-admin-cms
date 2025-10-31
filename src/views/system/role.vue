<script lang="ts" setup>
import { apiPermissionList, apiRoleList, type Permission, type Role } from '@/api'
import { ref } from 'vue'

const roleList = ref<Role[]>([])
const PermissionList = ref<Permission[]>([])

const getRoles = async () => {
  const [roles, permissions] = await Promise.all([apiRoleList(), apiPermissionList()])
  roleList.value = roles
  PermissionList.value = permissions
}

onBeforeMount(() => {
  getRoles()
})

const handleAddRole = () => {
  // 处理添加角色
}

const handleEdit = (row: any) => {
  // 处理编辑角色
}

const handleDelete = (row: any) => {
  // 处理删除角色
}
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
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="role" label="角色" />
      <el-table-column prop="permissions" label="角色权限">
        <template #default="scoped">
          <span v-if="!scoped.row.permissions.length"> 没有权限 </span>
          <template v-else v-for="permiss in scoped.row.permissions">
            <el-tag m-1>{{ PermissionList.find((p) => p.name === permiss)?.label }}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style scoped></style>
