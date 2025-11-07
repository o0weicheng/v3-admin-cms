import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { apiLogin, type LoginPayload, type LoginResponse } from '@/api'
import { Storage } from '@/types'

interface SetUserOptions {
  key: string
  set: unknown
}

export const useAuthStore = defineStore('auth', () => {
  const userInfo = reactive({})

  async function login(loginInfo: LoginPayload): Promise<LoginResponse | null> {
    const { token, userInfo } = await apiLogin(loginInfo)
    localStorage.setItem(Storage.TOKEN, token)

    setUserInfo(userInfo)
    return { token, userInfo }
  }

  function setUserInfo(info: Record<string, any>): void
  function setUserInfo(info: Record<string, any>, userOptions: SetUserOptions): void

  function setUserInfo(info: Record<string, any>, userOptions?: SetUserOptions) {
    if (userOptions) {
      info[userOptions.key] = userOptions.set
      return
    }
    Object.assign(userInfo, info)
    localStorage.setItem(Storage.USERINFO, JSON.stringify(userInfo))
  }

  return { userInfo, login, setUserInfo }
}, {
  persist: true,
})
