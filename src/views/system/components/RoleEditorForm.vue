<script setup lang="ts">
import { type CheckboxValueType } from 'element-plus'
import { watch } from 'vue'
import type { Role } from '@/api'
const form = defineModel<Role<string>>('form', { required: true })
const map = defineModel<Record<string, string>>('map', { required: true })

const checkAll = ref<boolean>(false)
const mapObjectLength = computed(() => Object.keys(map.value).length)
const permissions = computed(() => form.value.permissions.length)
const isIndeterminate = computed(() => !!permissions.value && permissions.value < mapObjectLength.value)

const handleCheckAllChange = (val: CheckboxValueType) => {
  form.value.permissions = val ? Object.keys(map.value) : []
}

watch(() => form.value.permissions, () => {
  checkAll.value = permissions.value === mapObjectLength.value
}, { immediate: true })

const emit = defineEmits<{
  submit: []
  visibility: []
}>()
</script>

<template>
  <el-form flex flex-col h-full :model="form">
    <div flex-1 h-full w-full>
      <el-form-item label="角色">
        <el-input v-model="form.role"></el-input>
      </el-form-item>
      <el-form-item label="角色名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="角色权限">
        <el-card shadow="never">
          <el-checkbox v-model="checkAll" mb-2 :indeterminate="isIndeterminate" border size="small" label="全选" @change="handleCheckAllChange" />
          <el-checkbox-group v-model="form.permissions">
            <template v-for="permission in Object.keys(map)">
              <el-checkbox  :label="map[permission]" :value="permission"></el-checkbox>
            </template>
          </el-checkbox-group>
        </el-card>
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
