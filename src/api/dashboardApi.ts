import { http } from './request'

// ============ 响应类型 ============

export interface DashboardData {
  totalAssets: number
  totalLiabilities: number
  netWorth: number
  debtRatio: number
  todayNetWorthChange: number
  monthlyNetWorthChange: number
  assetBreakdown: {
    type: string
    label: string
    total: number
    count: number
    percent: number
  }[]
}

// ============ API 方法 ============

export const dashboardApi = {
  /** 获取首页看板数据 */
  getDashboard() {
    // TODO: replace with real API call
    return http.get<DashboardData>('/dashboard')
  },
}
