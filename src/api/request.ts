export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

export interface RequestConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>
type ResponseInterceptor = (
  response: ApiResponse<unknown>,
) => ApiResponse<unknown> | Promise<ApiResponse<unknown>>
type ErrorInterceptor = (error: Error) => void
type RequestData = string | ArrayBuffer | object

const defaultBaseURL = ''

let baseURL = defaultBaseURL
const requestInterceptors: RequestInterceptor[] = []
const responseInterceptors: ResponseInterceptor[] = []
const errorInterceptors: ErrorInterceptor[] = []

/** 设置全局 baseURL */
export function setBaseURL(url: string) {
  baseURL = url
}

/** 添加请求拦截器 */
export function onRequest(fn: RequestInterceptor) {
  requestInterceptors.push(fn)
}

/** 添加响应拦截器 */
export function onResponse(fn: ResponseInterceptor) {
  responseInterceptors.push(fn)
}

/** 添加错误拦截器 */
export function onError(fn: ErrorInterceptor) {
  errorInterceptors.push(fn)
}

// 内置拦截器：从本地缓存读取 token
onRequest(async (config) => {
  try {
    const token = uni.getStorageSync('wealth_token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }
  } catch (_) {
    /* ignore */
  }
  return config
})

// 内置拦截器：统一错误处理
onError((error) => {
  console.error('[API Error]', error.message)
  uni.showToast({ title: error.message || '网络请求失败', icon: 'none' })
})

async function applyRequestInterceptors(config: RequestConfig): Promise<RequestConfig> {
  let c = config
  for (const fn of requestInterceptors) {
    c = await fn(c)
  }
  return c
}

async function applyResponseInterceptors<T>(response: ApiResponse<T>): Promise<ApiResponse<T>> {
  let r = response as ApiResponse<unknown>
  for (const fn of responseInterceptors) {
    r = await fn(r)
  }
  return r as ApiResponse<T>
}

function applyErrorInterceptors(error: Error) {
  for (const fn of errorInterceptors) {
    fn(error)
  }
}

async function request<T = unknown>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  data?: RequestData,
  config?: RequestConfig,
): Promise<ApiResponse<T>> {
  let mergedConfig: RequestConfig = {
    baseURL: config?.baseURL ?? baseURL,
    timeout: config?.timeout ?? 15000,
    headers: {
      'Content-Type': 'application/json',
      ...config?.headers,
    },
  }

  mergedConfig = await applyRequestInterceptors(mergedConfig)

  const fullUrl = (mergedConfig.baseURL ?? '') + url

  return new Promise((resolve, reject) => {
    uni.request({
      url: fullUrl,
      method,
      data: data as string | AnyObject | ArrayBuffer | undefined,
      header: mergedConfig.headers,
      timeout: mergedConfig.timeout,
      success: async (res) => {
        try {
          const statusCode = res.statusCode
          const body = res.data as ApiResponse<T>

          // 统一处理 HTTP 状态码
          if (statusCode === 401) {
            uni.removeStorageSync('wealth_token')
            uni.showToast({ title: '登录已过期，请重新登录', icon: 'none' })
            reject(new Error('未授权'))
            return
          }

          if (statusCode === 403) {
            reject(new Error('无权限'))
            return
          }

          if (statusCode >= 500) {
            reject(new Error('服务器错误'))
            return
          }

          // 处理业务状态码
          if (body && typeof body.code === 'number' && body.code !== 0) {
            const err = new Error(body.message || '请求失败')
            applyErrorInterceptors(err)
            reject(err)
            return
          }

          const processed = await applyResponseInterceptors<T>(
            body ?? { code: 0, data: null as T, message: 'ok' },
          )
          resolve(processed)
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err))
          applyErrorInterceptors(error)
          reject(error)
        }
      },
      fail: (err) => {
        const error = new Error(err.errMsg || '网络请求失败')
        applyErrorInterceptors(error)
        reject(error)
      },
    })
  })
}

export const http = {
  get<T = unknown>(url: string, params?: object, config?: RequestConfig) {
    // 将 params 拼接到 url
    let fullUrl = url
    if (params) {
      const qs = Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&')
      if (qs) fullUrl += '?' + qs
    }
    return request<T>('GET', fullUrl, undefined, config)
  },

  post<T = unknown>(url: string, data?: RequestData, config?: RequestConfig) {
    return request<T>('POST', url, data, config)
  },

  put<T = unknown>(url: string, data?: RequestData, config?: RequestConfig) {
    return request<T>('PUT', url, data, config)
  },

  del<T = unknown>(url: string, config?: RequestConfig) {
    return request<T>('DELETE', url, undefined, config)
  },
}
