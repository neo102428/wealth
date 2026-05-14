import { http } from './request'
import type { DailySnapshot } from '@/types'

// ============ 请求参数 ============

export interface SnapshotListParams {
  startDate?: string
  endDate?: string
  page?: number
  pageSize?: number
}

// ============ 响应类型 ============

export interface SnapshotListResult {
  list: DailySnapshot[]
  total: number
  page: number
  pageSize: number
}

// ============ API 方法 ============

export const snapshotApi = {
  /** 获取每日快照列表 */
  getList(params?: SnapshotListParams) {
    // TODO: replace with real API call
    return http.get<SnapshotListResult>('/snapshots', params)
  },

  /** 获取今日快照 */
  getToday() {
    // TODO: replace with real API call
    return http.get<DailySnapshot | null>('/snapshots/today')
  },

  /** 生成今日快照（服务端计算） */
  generateToday() {
    // TODO: replace with real API call
    return http.post<DailySnapshot>('/snapshots/today')
  },
}
