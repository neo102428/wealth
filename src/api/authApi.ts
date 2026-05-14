import { http } from './request'
import type { UserInfo } from '@/types'

// ============ 请求参数 ============

export interface LoginParams {
  phone: string
  code: string
}

export interface RegisterParams {
  phone: string
  code: string
  name: string
}

export interface UpdateProfileParams {
  name?: string
  avatar?: string
  email?: string
}

// ============ 响应类型 ============

export interface LoginResult {
  token: string
  userInfo: UserInfo
}

// ============ API 方法 ============

export const authApi = {
  /** 发送验证码 */
  sendSms(phone: string) {
    // TODO: replace with real API call
    return http.post<void>('/auth/send-sms', { phone })
  },

  /** 手机号验证码登录 */
  login(params: LoginParams) {
    // TODO: replace with real API call
    return http.post<LoginResult>('/auth/login', params)
  },

  /** 注册 */
  register(params: RegisterParams) {
    // TODO: replace with real API call
    return http.post<LoginResult>('/auth/register', params)
  },

  /** 获取当前用户信息 */
  getUserInfo() {
    // TODO: replace with real API call
    return http.get<UserInfo>('/auth/userinfo')
  },

  /** 更新个人资料 */
  updateProfile(params: UpdateProfileParams) {
    // TODO: replace with real API call
    return http.put<UserInfo>('/auth/profile', params)
  },

  /** 退出登录 */
  logout() {
    // TODO: replace with real API call
    return http.post<void>('/auth/logout')
  },
}
