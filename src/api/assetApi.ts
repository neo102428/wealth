import { http } from './request'
import type { Asset, AssetType, ValuationMethod } from '@/types'

// ============ 请求参数 ============

export interface AddAssetParams {
  name: string
  type: AssetType
  category: string
  initialValue: number
  currentValue: number
  purchaseDate: string
  valuationMethod: ValuationMethod
  institution?: string
  rate?: number
  note?: string
}

export interface UpdateAssetParams extends Partial<AddAssetParams> {
  id: string
}

export interface AssetListParams {
  type?: AssetType
  keyword?: string
  page?: number
  pageSize?: number
}

// ============ 响应类型 ============

export interface AssetListResult {
  list: Asset[]
  total: number
  page: number
  pageSize: number
}

// ============ API 方法 ============

export const assetApi = {
  /** 获取资产列表 */
  getList(params?: AssetListParams) {
    // TODO: replace with real API call
    return http.get<AssetListResult>('/assets', params)
  },

  /** 获取资产详情 */
  getDetail(id: string) {
    // TODO: replace with real API call
    return http.get<Asset>(`/assets/${id}`)
  },

  /** 新增资产 */
  add(params: AddAssetParams) {
    // TODO: replace with real API call
    return http.post<Asset>('/assets', params)
  },

  /** 更新资产 */
  update(params: UpdateAssetParams) {
    // TODO: replace with real API call
    const { id, ...data } = params
    return http.put<Asset>(`/assets/${id}`, data)
  },

  /** 删除资产 */
  remove(id: string) {
    // TODO: replace with real API call
    return http.del<void>(`/assets/${id}`)
  },

  /** 获取估值历史 */
  getValuationHistory(assetId: string) {
    // TODO: replace with real API call
    return http.get<{ id: string; assetId: string; value: number; date: string; note: string }[]>(
      `/assets/${assetId}/valuation-history`,
    )
  },
}
