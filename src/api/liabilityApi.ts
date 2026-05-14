import { http } from './request'
import type { Liability, LiabilityType } from '@/types'

// ============ 请求参数 ============

export interface AddLiabilityParams {
  name: string
  type: LiabilityType
  initialAmount: number
  remainingAmount: number
  monthlyPayment: number
  repaymentDay: number
  institution?: string
  rate?: number
  note?: string
}

export interface UpdateLiabilityParams extends Partial<AddLiabilityParams> {
  id: string
}

export interface LiabilityListParams {
  type?: LiabilityType
  keyword?: string
  page?: number
  pageSize?: number
}

// ============ 响应类型 ============

export interface LiabilityListResult {
  list: Liability[]
  total: number
  page: number
  pageSize: number
}

// ============ API 方法 ============

export const liabilityApi = {
  /** 获取负债列表 */
  getList(params?: LiabilityListParams) {
    // TODO: replace with real API call
    return http.get<LiabilityListResult>('/liabilities', params)
  },

  /** 获取负债详情 */
  getDetail(id: string) {
    // TODO: replace with real API call
    return http.get<Liability>(`/liabilities/${id}`)
  },

  /** 新增负债 */
  add(params: AddLiabilityParams) {
    // TODO: replace with real API call
    return http.post<Liability>('/liabilities', params)
  },

  /** 更新负债 */
  update(params: UpdateLiabilityParams) {
    // TODO: replace with real API call
    const { id, ...data } = params
    return http.put<Liability>(`/liabilities/${id}`, data)
  },

  /** 删除负债 */
  remove(id: string) {
    // TODO: replace with real API call
    return http.del<void>(`/liabilities/${id}`)
  },
}
