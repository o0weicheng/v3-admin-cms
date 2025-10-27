<script setup lang="ts">
import { reactive, ref, toRaw, watch } from 'vue'
import { Search, RefreshRight } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'

import type { FieldType } from './types'

export interface FieldOption {
  label: string
  value: string | number | any
  [key: string]: any
}

export interface Field {
  type: FieldType
  label: string
  value?: unknown
  options?: FieldOption[]
  prop: string
  clearable?: boolean
  placeholder?: string
}

const queryFormRef = ref<FormInstance>()

const form = reactive<Record<string, any>>({})

const props = defineProps<{
  fields: Field[]
}>()

const initForm = () => {
  // 初始化、重置 form
  props.fields?.forEach((f) => {
    form[f.prop] = f.value ?? ''
  })
}

initForm()

watch(
  () => props.fields,
  () => {
    initForm()
  },
  { deep: true, immediate: false },
)

const emits = defineEmits<{
  (e: 'search', payload: Record<string, any>): void
  (e: 'reset', payload: Record<string, any>): void
}>()

const onSearch = () => {
  emits('search', toRaw(form))
}

// 重置表单内容
// 清空内容
// 清空内容后刷新列表
const onReset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl?.resetFields()
  initForm()
  emits('reset', toRaw(form))
}

// 暴露方法给父组件
defineExpose({
  reset: onReset,
  search: onSearch,
})
</script>

<template>
  <el-form ref="queryFormRef" label-position="top" :model="fields" class="query-form-wrap">
    <el-row :gutter="18" align="bottom">
      <el-col v-for="field in fields" :span="6">
        <el-form-item :label="field.label" :prop="field.prop" :key="field.prop">
          <template v-if="field.type === 'input'">
            <el-input v-model="form[field.prop]" :placeholder="field.placeholder" />
          </template>
          <template v-else-if="field.type === 'number'">
            <el-input
              v-model.number="form[field.prop]"
              type="number"
              :placeholder="field.placeholder"
            ></el-input>
          </template>
          <template v-else-if="field.type === 'select'">
            <el-select
              v-model="form[field.prop]"
              :placeholder="field.placeholder || '请选择'"
              :clearable="field.clearable"
            >
              <el-option
                v-for="opt in field.options"
                :key="opt.value"
                :value="opt.value"
                :label="opt.label"
              />
            </el-select>
          </template>
          <template v-else-if="field.type === 'date'">
            <el-date-picker
              v-model="form[field.prop]"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="field.clearable"
            />
          </template>
          <template v-else-if="field.type === 'cascader'">
            <el-cascader
              v-model="form[field.prop]"
              :placeholder="field.placeholder"
              :options="field.options"
              :clearable="field.clearable"
            />
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-button type="primary" @click="onSearch">
            <el-icon><Search /></el-icon>
            &nbsp;查询
          </el-button>
          <el-button @click="onReset(queryFormRef)">
            <el-icon><RefreshRight /></el-icon>
            &nbsp;重置
          </el-button>
        </el-form-item></el-col
      >
    </el-row>
  </el-form>
</template>

<style lang="scss">
.query-form-wrap {
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-select {
    --el-select-width: 100%;
  }
  .el-cascader {
    width: 100%;
  }
  .el-form-item__label {
    margin-bottom: 0;
    background: #fff;
    position: relative;
    top: 8px;
    z-index: 99;
    border-radius: var(--el-border-radius);
    left: 5px;
    padding: 0 6px;
    color: rgba(var(--el-color-primary-rgb), 0.85);
  }
}
</style>
