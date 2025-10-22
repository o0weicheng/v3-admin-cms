import presetUno from '@unocss/preset-uno'
import presetAttributify from '@unocss/preset-attributify'

export default {
  theme: {
    colors: {
      primary: '#2b73af', // 主色
      success: '#4caf50', // 成功
      warning: '#ffb400', // 警告
      danger: '#f44336', // 错误
      info: '#2196f3', // 信息

      text: {
        primary: '#333333',
        secondary: '#666666',
        placeholder: '#999999',
      },

      bg: {
        base: '#f5f7fa',
        container: '#ffffff',
      },

      border: '#e4e7ed',
    },
    borderRadius: {
      base: '6px',
      card: '8px',
    },
  },
  presets: [presetUno(), presetAttributify()],
}
