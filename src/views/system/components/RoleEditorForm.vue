<script setup lang="ts">
defineModel<{
  name: string
  role: string
  permissions: string[]
}>('form', { required: true })
defineModel<Record<string, string>>('map', { required: true })

const emit = defineEmits<{
  submit: [],
  visibility: [],
}>()
</script>

<template>
  <el-form flex flex-col h-full :model="form">
    <div flex-1 h-full w-full>
      <el-form-item label="角色名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="角色">
        <el-input v-model="form.role"></el-input>
      </el-form-item>
      <el-form-item label="角色权限">
        <el-checkbox-group v-model="form.permissions">
          <template v-for="permission in Object.keys(map)">
            <el-checkbox
              :label="map[permission]"
              :value="permission"
            ></el-checkbox>
          </template>
        </el-checkbox-group>
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
