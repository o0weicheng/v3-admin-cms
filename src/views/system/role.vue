<script lang="ts" setup>
import {
  apiPermissionList,
  apiRoleCreate,
  apiRoleDelete,
  apiRoleEdit,
  apiRoleList,
  type Permission,
  type PermissionMap,
  type Role,
} from '@/api'
import { ref } from 'vue'

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
const init = async () => {
  await Promise.all([getPermissions(), getRoles()])
}
const getPermissions = async () => {
  PermissionList.value = await apiPermissionList()
}
const getRoles = async () => {
  roleList.value = await apiRoleList()
}

const autoCompleteSearch = (query: string, cb: (arg: any) => void) => {
  const results = query ? roleList.value.filter((r) => r.name.indexOf(query) === 0) : roleList.value
  console.log(results)

  // call callback function to return suggestions
  cb(results)
}
onBeforeMount(() => {
  init()
})

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
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>

  <el-drawer v-model="drawerConfig.visibility" :title="drawerConfig.title" @close="onDrawerClose">
    <el-form flex flex-col h-full :model="roleDetail">
      <div flex-1 h-full w-full>
        <el-form-item label="角色名称">
          <el-autocomplete
            v-model="roleDetail.name"
            value-key="name"
            :fetch-suggestions="autoCompleteSearch"
            :trigger-on-focus="false"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="roleDetail.role"></el-input>
        </el-form-item>
        <el-form-item label="角色权限">
          <el-checkbox-group v-model="roleDetail.permissions">
            <template v-for="permission in Object.keys(permissionsMap)">
              <el-checkbox
                :label="permissionsMap[permission as keyof PermissionMap]"
                :value="permission"
              ></el-checkbox>
            </template>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <el-form-item>
        <div flex-1></div>
        <el-button type="primary" @click="onSubmitRoleEditor">保存</el-button>
        <el-button @click="drawerConfig.visibility = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style scoped></style>
