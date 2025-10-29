import { type FetchContext, type FetchOptions, ofetch } from 'ofetch'

export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

const REFRESH_TOKEN = 'refresh_token'
const TOKEN = 'token'

// 错误处理
const handleResponseError = (error: any) => {
  if (error?.response?._data) {
    const res = error.response._data
    console.error(`API Error ${res.message || error.message}`)
  } else {
    console.error(`Network Error ${error.message}`)
  }
  ElMessage.error(error.message)
  throw error
}

// 模拟 Token 刷新
const refreshToken = async (): Promise<string | unknown> => {
  const reToken = localStorage.getItem(REFRESH_TOKEN)
  if (!reToken) return null

  try {
    const res = await ofetch<ApiResponse<{ token: string }>>('/api/auth/refresh', {
      method: 'POST',
      body: { reToken },
    })
    localStorage.setItem(TOKEN, res.data.token)
    return res.data.token
  } catch {
    localStorage.removeItem(TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    return null
  }
}

// http header
const setHttpAuthHeader = <T extends HeadersInit>(header: T, token: string): Headers => {
  const h = new Headers(header)
  h.set('Authorization', `Bearer ${token}`)
  return h
}

// fetch 实例创建
const baseRequest = ofetch.create({
  baseURL: (import.meta.env.VITE_API_BASE as string) || '/api',
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
  retry: 0,

  onRequest: async ({ options }) => {
    const token = localStorage.getItem(TOKEN)
    if (!token) return
    options.headers = setHttpAuthHeader(options.headers, token)
  },

  onResponse: async ({ response }) => {
    const res = response._data as ApiResponse

    if (res.code !== 200) throw new Error(res.message)
  },

  onRequestError: async (ctx: FetchContext) => {
    const { request, options, response } = ctx
    // 处理 token 过期
    if (response?.status === 401) {
      const newToken = await refreshToken()
      if (newToken) {
        options.headers = setHttpAuthHeader(options.headers, newToken as string)

        ctx.response = await ofetch.raw(request, options)
        return
      }
    }

    handleResponseError(response)
  },
})

const oApi = async <T>(
  method: Method,
  url: string,
  options?: FetchOptions<'json', any>,
): Promise<T> => {
  try {
    const res = await baseRequest<ApiResponse<T>>(url, { method, ...options })
    if (res.code !== 200) new Error(res.message)
    // console.log(res)
    return res.data
  } catch (error: any) {
    handleResponseError(error)
    throw error
  }
}

export const http: Record<string, any> = {
  get: async <T>(url: string, options?: FetchOptions<'json', any>): Promise<T> =>
    await oApi<T>('GET', url, options),
  post: async <T>(url: string, options?: FetchOptions<'json', any>): Promise<T> =>
    await oApi<T>('POST', url, options),
  put: async <T>(url: string, options?: FetchOptions<'json', any>): Promise<T> =>
    await oApi<T>('PUT', url, options),
  delete: async <T>(url: string, options?: FetchOptions<'json', any>): Promise<T> =>
    await oApi<T>('DELETE', url, options),
  patch: async <T>(url: string, options?: FetchOptions<'json', any>): Promise<T> =>
    await oApi<T>('PATCH', url, options),
}

// export const http = async <T = any>(
//   url: string,
//   options?: FetchOptions<'json', any>,
// ): Promise<T> => {
//   try {
//     return await baseRequest<T>(url, options)
//   } catch (error: any) {
//     handleResponseError(error)
//     throw error
//   }
// }
