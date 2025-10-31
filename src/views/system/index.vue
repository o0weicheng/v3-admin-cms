<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import LabelTips from './components/LabelTips.vue'
import type { Field } from '@/components/DetailForm.vue'

interface Site {
  imageUrl: string
  title: string
  domain: string
  seo: string
  description: string
  icp: string
  email: string
  phone: string
}

interface Parametes {
  allowRegister: boolean
  maintenanceMode: boolean
  timezone: number
}
interface WechatConfig {
  enable: boolean
  appId: string
  mchId: string
  apiKey: string
  notifyUrl: string
  certificate: string
}
interface AlipayConfig {
  enable: boolean
  appId: string
  privateKey: string
  publicKey: string
  notifyUrl: string
  signType: 'RSA2' | 'RSA'
  gatewayUrl: string
}
const site = ref<Site>({
  imageUrl: '',
  title: '',
  domain: '',
  seo: '',
  description: '',
  icp: '',
  email: '',
  phone: '',
})

const weChatConfig = ref<WechatConfig>({
  enable: false,
  appId: '',
  mchId: '',
  apiKey: '',
  notifyUrl: '',
  certificate: '',
})

const weChatFields = ref<Field<WechatConfig>[]>([
  { type: 'switch', label: '启用微信支付', prop: 'enable' },
  {
    type: 'input',
    label: 'AppId',
    prop: 'appId',
    props: { placeholder: '请输入 AppId' },
  },
  {
    type: 'input',
    label: '商户号（MchID）',
    prop: 'mchId',
    props: { placeholder: '请输入商户号（MchID）' },
  },
  {
    type: 'input',
    label: 'ApiKey',
    prop: 'apiKey',
    props: { type: 'textarea', rows: 4, placeholder: '请输入 ApiKey' },
  },
  {
    type: 'upload',
    label: '支付证书',
    prop: 'certificate',
  },
  {
    type: 'input',
    label: '回调 URL',
    prop: 'notifyUrl',
    props: { placeholder: '请输入回调 URL' },
  },
])

const alipayConfig = ref<AlipayConfig>({
  enable: false,
  appId: '',
  privateKey: '',
  publicKey: '',
  notifyUrl: '',
  signType: 'RSA2',
  gatewayUrl: '',
})

const aliPayFields = ref<Field<AlipayConfig>[]>([
  { type: 'switch', label: '启用支付宝支付', prop: 'enable' },
  {
    type: 'input',
    label: 'AppId',
    prop: 'appId',
    props: { placeholder: '请输入 AppId' },
  },
  {
    type: 'input',
    label: '应用私钥',
    props: { type: 'textarea', rows: 4, placeholder: '请输入应用私钥' },
    prop: 'privateKey',
  },
  {
    type: 'input',
    label: '应用公钥',
    prop: 'publicKey',
    props: { type: 'textarea', rows: 4, placeholder: '请输入应用公钥' },
  },
  {
    type: 'select',
    label: '签名类型',
    prop: 'signType',
    value: alipayConfig.value.signType,
    options: [
      { label: 'RSA2', value: 'RSA2' },
      { label: 'RSA', value: 'RSA' },
    ],
  },
  {
    type: 'input',
    label: '回调 URL',
    prop: 'gatewayUrl',
    props: { placeholder: 'https://openapi.alipay.com/gateway.do' },
  },
])
const parametes = ref<Parametes>({
  allowRegister: true,
  maintenanceMode: false,
  timezone: 120,
})

const colorTheme = ref({
  default: '#2b73af',
  button: '#2b73af',
})

const handleLogoSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  site.value.imageUrl = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('仅支持 jpeg 格式的图片!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片过大，logo 不超过 2MB!')
    return false
  }
  return true
}
</script>

<template>
  <el-card>
    <h3 m-0 py-2>站点信息</h3>
    <el-form p-2>
      <el-form-item label="站点 LOGO">
        <el-upload
          class="uploader"
          :show-file-list="false"
          :on-success="handleLogoSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="site.imageUrl" :src="site.imageUrl" class="logo" />
          <el-icon v-else class="uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="站点名称">
        <el-input v-model="site.title" placeholder="页面标题" />
      </el-form-item>
      <el-form-item label="网站域名">
        <el-input v-model="site.domain" type="url" placeholder="网站访问地址" />
      </el-form-item>
      <el-form-item label="网站关键词">
        <el-input v-model="site.seo" placeholder="SEO 关键词" />
      </el-form-item>
      <el-form-item label="网站描述">
        <el-input v-model="site.description" placeholder="SEO 描述/简介" />
      </el-form-item>
      <el-form-item label="ICP 备案号">
        <el-input v-model="site.icp" placeholder="网站备案号"></el-input>
      </el-form-item>
      <el-form-item label="联系邮箱">
        <el-input v-model="site.email" type="email" placeholder="客服或系统邮件"></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="site.phone" placeholder="客服电话"></el-input>
      </el-form-item>
      <el-form-item>
        <div flex justify-end w-full>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
  <el-space fill :fill-ratio="45">
    <el-card mt-2>
      <h3 m-0 py-2>微信支付设置</h3>
      <detail-form :fields="weChatFields" :detail="weChatConfig">
        <template #certificate="scoped">
          <el-upload class="uploader" :show-file-list="false">
            <el-icon class="uploader-icon"><Plus /></el-icon>
          </el-upload>
        </template>
        <template #footer>
          <div flex w-full>
            <el-button flex-1>测试支付</el-button>
            <el-button flex-1 type="primary">保存配置</el-button>
          </div>
        </template>
      </detail-form>
    </el-card>
    <el-card mt-2>
      <h3 m-0 py-2>支付宝支付设置</h3>
      <detail-form :fields="aliPayFields" :detail="alipayConfig">
        <template #footer>
          <div flex w-full>
            <el-button flex-1>测试支付</el-button>
            <el-button flex-1 type="primary">保存配置</el-button>
          </div>
        </template>
      </detail-form>
    </el-card>
  </el-space>
  <el-card mt-2>
    <h3 m-0 py-2>基础参数</h3>
    <el-form p-2>
      <el-form-item label="是否允许注册">
        <el-checkbox v-model="parametes.allowRegister"></el-checkbox>
      </el-form-item>
      <el-form-item>
        <template #label>
          <label-tips label="网站维护" tips="开启后网站不可访问"></label-tips>
        </template>
        <el-switch v-model="parametes.maintenanceMode"></el-switch>
      </el-form-item>
      <el-form-item>
        <template #label>
          <label-tips label="登录过期时间" tips="单位（分钟）"></label-tips>
        </template>
        <el-input-number v-model="parametes.timezone"></el-input-number>
      </el-form-item>
      <el-form-item>
        <div flex justify-end w-full>
          <el-button type="primary">保存</el-button>
          <el-button>取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<style scoped lang="scss">
.uploader {
  --logo-size: 90px;
  .logo {
    width: var(--logo-size);
    height: var(--logo-size);
    display: block;
  }
}
</style>

<style lang="scss">
.uploader {
  .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  .el-upload:hover {
    border-color: var(--el-color-primary);
  }
}

.el-icon.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: var(--logo-size);
  height: var(--logo-size);
  text-align: center;
}
</style>
