// /mock/system.ts
import { defineFakeRoute } from 'vite-plugin-fake-server'

let systemConfig = {
  siteName: 'xx特产商城',
  logo: 'https://loremflickr.com/100/100/shop,logo/all',
  themeColor: '#409EFF',
  language: 'zh-CN',
  timezone: 'Asia/Shanghai',
  fileUploadLimit: 50, // MB
  companyInfo: {
    name: 'xx市味道电商有限公司',
    contactEmail: 'support@techan.com',
    contactPhone: '0754-88888888',
    address: '广东省xx市xx区xx路88号',
  },
  smtp: {
    host: 'smtp.qq.com',
    port: 465,
    user: 'admin@qq.com',
    fromName: 'xx商城',
    enabled: true,
  },
  storage: {
    type: 'oss',
    endpoint: 'oss-cn-shenzhen.aliyuncs.com',
    bucket: 'techan-static',
    domain: 'https://cdn.techan.com',
  },
  security: {
    loginVerify: true,
    passwordExpireDays: 90,
    maxLoginRetry: 5,
    ipWhitelist: ['127.0.0.1'],
  },
  maintenanceMode: false,
  version: '1.0.0',
  updateTime: new Date().toISOString(),
}

export default defineFakeRoute([
  // 获取系统配置
  {
    url: '/api/system/config',
    method: 'get',
    response: () => {
      return {
        code: 200,
        message: '获取系统配置成功',
        data: systemConfig,
      }
    },
  },

  // 更新系统配置
  {
    url: '/api/system/config',
    method: 'post',
    response: ({ body }) => {
      systemConfig = { ...systemConfig, ...body, updateTime: new Date().toISOString() }
      return {
        code: 200,
        message: '系统配置已更新',
        data: systemConfig,
      }
    },
  },

  // 恢复默认配置
  {
    url: '/api/system/reset',
    method: 'post',
    response: () => {
      systemConfig = {
        siteName: 'xx特产商城',
        logo: 'https://loremflickr.com/100/100/shop,logo/all',
        themeColor: '#409EFF',
        language: 'zh-CN',
        timezone: 'Asia/Shanghai',
        fileUploadLimit: 50,
        companyInfo: {
          name: 'xx市味道电商有限公司',
          contactEmail: 'support@techan.com',
          contactPhone: '0754-88888888',
          address: '广东省xx市xx区xx路88号',
        },
        smtp: {
          host: 'smtp.qq.com',
          port: 465,
          user: 'admin@qq.com',
          fromName: 'xx商城',
          enabled: true,
        },
        storage: {
          type: 'oss',
          endpoint: 'oss-cn-shenzhen.aliyuncs.com',
          bucket: 'techan-static',
          domain: 'https://cdn.techan.com',
        },
        security: {
          loginVerify: true,
          passwordExpireDays: 90,
          maxLoginRetry: 5,
          ipWhitelist: ['127.0.0.1'],
        },
        maintenanceMode: false,
        version: '1.0.0',
        updateTime: new Date().toISOString(),
      }

      return {
        code: 200,
        message: '已恢复默认系统配置',
        data: systemConfig,
      }
    },
  },
])
