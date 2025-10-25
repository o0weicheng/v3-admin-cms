<script setup lang="ts">
import { reactive, ref, toRaw, watch } from 'vue'
import type { FormInstance } from 'element-plus'

import type { FieldType } from './types'

interface FieldOption {
  label: string
  value: string | number | any
  [key: string]: any
}

export interface Field {
  type: FieldType
  label: string
  value?: any
  options?: FieldOption[]
  prop: string
  props?: Record<string, unknown>
  placeholder?: string
}

const detailFormRef = ref<FormInstance>()

defineProps<{
  fields: Field[]
}>()

</script>

<template>
  <el-form ref="detailFormRef" :model="fields" class="detail-form-wrap">
    <template v-for="field in fields" :key="field.prop">
      <el-form-item :label="field.label" :prop="field.prop">
        <template v-if="field.type === 'text'">
          <el-text v-bind="field.props">{{ field.value }}</el-text>
        </template>
        <template v-else-if="field.type === 'input'">
          <el-input v-bind="field.props" v-model="field.value" />
        </template>
        <template v-else-if="field.type === 'number'">
          <el-input-number
            v-bind="field.props"
            v-model.number="field.value"
            type="number"
          ></el-input-number>
        </template>
        <template v-else-if="field.type === 'select'">
          <el-select
            v-bind="field.props"
            v-model="field.value"
            :placeholder="field.placeholder || '请选择'"
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
            v-bind="field.props"
            v-model="field.value"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </template>
        <template v-else-if="field.type === 'cascader'">
          <el-cascader v-bind="field.props" v-model="field.value" :options="field.options" />
        </template>
        <slot name="item" :prop="field.prop"></slot>
      </el-form-item>
    </template>
    <slot name="footer"></slot>
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
}
</style>
