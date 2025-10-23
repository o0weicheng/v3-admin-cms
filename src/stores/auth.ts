import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { authApi, type LoginPayload, type LoginResponse } from '@/api'

interface SetUserOptions {
  key: string
  set: unknown
}

export const useAuthStore = defineStore('auth', () => {
  const userInfo = reactive({})

  async function login(loginInfo: LoginPayload): Promise<LoginResponse | null> {
    const { code, data } = await authApi.login(loginInfo)
    if (code !== 200) return null
    setUserInfo(data)
    return data
  }

  function setUserInfo(info: Record<string, any>): void
  function setUserInfo(info: Record<string, any>, userOptions: SetUserOptions): void

  function setUserInfo(info: Record<string, any>, userOptions?: SetUserOptions) {
    if (userOptions) {
      info[userOptions.key] = userOptions.set
      return
    }
    Object.assign(userInfo, info)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  }

  return { userInfo, login, setUserInfo }
})
