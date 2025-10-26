<script setup lang="ts">
import { ref } from 'vue'
import type { FormInstance } from 'element-plus'

import type { FieldType } from './types'

interface FieldOption {
  label: string
  value: string | number | any
  [key: string]: any
}

export type Formatter<T = any, R = string> = (value: T) => R

export interface Field<TData extends Record<string, any> = any, TValue = any, TResult = string> {
  type: FieldType
  label: string
  value?: any
  options?: FieldOption[]
  prop: keyof TData & string
  props?: Record<string, unknown>
  placeholder?: string
  fmt?: Formatter<TValue, TResult>
}

const detailFormRef = ref<FormInstance>()

defineProps<{
  fields: Field[]
  detail: Record<string, any>
}>()
</script>

<template>
  <el-form ref="detailFormRef" :model="fields" class="detail-form-wrap">
    <template v-for="field in fields" :key="field.prop">
      <el-form-item :label="field.label" :prop="field.prop">
        <template v-if="field.type === 'text'">
          <el-text v-bind="field.props">{{
            field.fmt ? field.fmt(detail[field.prop]) : detail[field.prop]
          }}</el-text>
        </template>
        <template v-else-if="field.type === 'input'">
          <el-input v-bind="field.props" v-model="detail[field.prop]" />
        </template>
        <template v-else-if="field.type === 'number'">
          <el-input-number
            v-bind="field.props"
            v-model.number="detail[field.prop]"
            type="number"
          ></el-input-number>
        </template>
        <template v-else-if="field.type === 'select'">
          <el-select
            v-bind="field.props"
            v-model="detail[field.prop]"
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
            v-model="detail[field.prop]"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </template>
        <template v-else-if="field.type === 'cascader'">
          <el-cascader v-bind="field.props" v-model="detail[field.prop]" :options="field.options" />
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
