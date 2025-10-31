<script lang="ts" setup>
import { ref } from 'vue'

interface Permission {
  id: number
  name: string
  description: string
}

const permissions = ref<Permission[]>([
  { id: 1, name: '查看用户', description: '查看用户信息' },
  { id: 2, name: '编辑用户', description: '编辑用户信息' },
])

const editPermission = (permission: Permission) => {
  console.log('Editing permission:', permission)
}

const deletePermission = (id: number) => {
  console.log('Deleting permission with id:', id)
}
</script>

<template>
  <div>
    <h1>权限管理</h1>
    <el-table :data="permissions" style="width: 100%">
      <el-table-column prop="name" label="权限名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="editPermission(scope.row)">编辑</el-button>
          <el-button @click="deletePermission(scope.row.id)" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 20px;
}
</style>
