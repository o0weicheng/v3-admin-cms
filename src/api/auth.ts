import { http } from '@/plugins/http'

export interface LoginPayload {
  username: string
  password: string
  remember: boolean
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  userInfo: Record<string, any>
}

export interface RefreshPayload {
  refreshToken: string
}

export interface RefreshResponse {
  accessToken: string
}

export interface ForgotPasswordPayload {
  email?: string
  username?: string
}

export interface ResetPasswordPayload {
  token: string
  newPassword: string
}

export const authApi = {
  login: async (payload: LoginPayload) => {
    return await http<{ token: string; refreshToken: string; userInfo: any }>('/auth/login', {
      method: 'POST',
      body: payload,
    })
  },
  forgotPassword: async (payload: ForgotPasswordPayload) => {
    return await http('/auth/forgot-password', {
      method: 'POST',
      body: { username: payload.username },
    })
  },
  resetPassword: async (payload: ResetPasswordPayload) => {
    return await http('/auth/reset-password', {
      method: 'PUT',
      body: payload,
    })
  },
}
