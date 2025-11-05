import { http } from '@/plugins/http'

export interface LoginPayload {
  username: string
  password: string
  remember: boolean
}

export interface LoginResponse {
  token: string
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

export const apiLogin = async (payload: LoginPayload) =>
  await http.post('/api/auth/login', { body: payload })
export const apiForgotPassword = async (payload: ForgotPasswordPayload) =>
  await http.post('/api/auth/forgot-password', { body: payload })
export const apiResetPassword = async (payload: ResetPasswordPayload) =>
  await http.put('/api/auth/reset-password', { body: payload })
