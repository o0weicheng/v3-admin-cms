<script setup lang="ts">
import { authApi, type LoginPayload, type LoginResponse } from '@/api/auth'
import { Avatar } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const formRef = ref<FormInstance>()
const errorMsg = ref('')

const form = reactive<LoginPayload>({
  username: '',
  password: '',
  remember: false,
})

const rules = reactive<FormRules<LoginPayload>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const onLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const res = await authApi.login(form)
        console.log(res)

        if (res.token) {
          // 用户勾选了（记住我）
          if (form.remember) localStorage.setItem('token', res.token)
          localStorage.setItem('userInfo', JSON.stringify(res.userInfo))
          if (route.query.redirect) {
            router.push({
              path: route.query.redirect as string,
            })
          } else {
            router.push({
              name: 'DashBoard',
            })
          }
        } else {
          errorMsg.value = '登录失败，用户名或密码错误'
        }
      } catch (e: any) {
        errorMsg.value = e?.message ?? '登录失败，请联系管理员'
      }
    }
  })
}
</script>

<template>
  <div flex w-screen h-screen bg="primary">
    <div flex-1></div>
    <div
      w="40vw"
      p-6
      bg-white
      h-full
      rounded-l-2xl
      box-border
      flex
      justify-center
      items-center
      flex-col
    >
      <h2 class="flex items-center" color="primary">
        <el-icon>
          <Avatar />
        </el-icon>
        <span pl="2">欢迎回来</span>
      </h2>
      <el-form max-w="400px" w-full :model="form" label-width="auto" :rules="rules" ref="formRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <el-form-item>
          <el-text v-show="!!errorMsg" type="danger">{{ errorMsg }}</el-text>

          <el-button w="full" type="primary" @click="onLogin(formRef)">登录</el-button>
        </el-form-item>
        <el-form-item>
          <div flex items-center w-full justify-between>
            <el-checkbox v-model="form.remember">记住我</el-checkbox>
            <el-button type="danger" link>忘记密码</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
