import { http } from './request'
import type { MonthlyReport } from '@/types'

// ============ 请求参数 ============

export interface MonthlyReportParams {
  month: string
}

// ============ 响应类型 ============

export interface ReportSummary {
  totalAssets: number
  totalLiabilities: number
  netWorth: number
  debtRatio: number
  snapshotCount: number
}

// ============ API 方法 ============

export const reportApi = {
  /** 获取报表概览 */
  getSummary() {
    // TODO: replace with real API call
    return http.get<ReportSummary>('/report/summary')
  },

  /** 获取指定月份月结表 */
  getMonthlyReport(month: string) {
    // TODO: replace with real API call
    return http.get<MonthlyReport | null>('/report/monthly', { month })
  },

  /** 生成指定月份月结表（服务端计算） */
  generateMonthlyReport(month: string) {
    // TODO: replace with real API call
    return http.post<MonthlyReport>('/report/monthly', { month })
  },

  /** 获取月结表列表 */
  getMonthlyList() {
    // TODO: replace with real API call
    return http.get<MonthlyReport[]>('/report/monthly/list')
  },
}
