import type { App } from 'vue'

// 时间小于10，返回 0x
function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

export function formatTime(input?: string | number | Date, fmt = 'YYYY-MM-DD HH:mm:ss'): string {
  if (input == null || input === '') return ''

  const d = input instanceof Date ? input : new Date(input as string | number | Date)
  if (Number.isNaN(d.getTime())) return ''
  const map: Record<string, string> = {
    YYYY: String(d.getFullYear()),
    YY: String(d.getFullYear()).slice(-2),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    hh: pad(d.getHours() % 12 || 12),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
    M: String(d.getMonth() + 1),
    D: String(d.getDate()),
    H: String(d.getHours()),
    h: String(d.getHours() % 12 || 12),
    m: String(d.getMinutes()),
    s: String(d.getSeconds()),
  }

  return fmt.replace(/YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s/g, (token) => map[token] ?? token)
}

export default {
  install(app: App) {
    app.config.globalProperties.$formatTime = formatTime
    app.provide('formatTime', formatTime)
  },
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $formatTime: (input?: string | number | Date, fmt?: string) => string
  }
}
