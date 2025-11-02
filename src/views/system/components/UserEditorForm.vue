<script setup lang="ts">
import type { Role, User } from '@/api'

const form = defineModel<User>('form', { required: true })
const roles = defineModel<Role[]>('roles', { required: true })

const autoCompleteSearch = (query: string, cb: (arg: any) => void) => {
  const results = query ? roles.value.filter((r) => r.role.indexOf(query) === 0) : roles.value
  cb(results)
}

const handleRoleSelect = (item: Record<string, any>) => {
  form.value.username = item.name
}

const emit = defineEmits<{
  submit: []
  visibility: []
}>()
</script>

<template>
  <el-form flex flex-col h-full :model="form">
    <div flex-1 h-full w-full>
      <el-form-item label="账号">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="角色名称">
        <el-text>{{ form.username || '--' }}</el-text>
      </el-form-item>
      <el-form-item label="角色">
        <el-autocomplete
          v-model="form.role"
          :fetch-suggestions="autoCompleteSearch"
          value-key="role"
          clearable
          placeholder="选择账号角色"
          @select="handleRoleSelect"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="form.status"
          :active-value="1"
          :inactive-value="0"
          style="
            --el-switch-on-color: var(--el-color-success);
            --el-switch-off-color: var(--el-color-danger);
          "
        ></el-switch>
      </el-form-item>
    </div>
    <el-form-item>
      <div flex-1></div>
      <el-button type="primary" @click="emit('submit')">保存</el-button>
      <el-button @click="emit('visibility')">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped lang="scss"></style>
