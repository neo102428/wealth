export type AssetType = string

export const BUILTIN_ASSET_TYPES: AssetType[] = ['cash', 'fixed', 'investment', 'credit', 'other']

export interface CustomAssetType {
  key: string
  label: string
  icon: string
}

export type ValuationMethod = 'market' | 'cost' | 'income' | 'net'

export type LiabilityType = string

export const BUILTIN_LIABILITY_TYPES: LiabilityType[] = [
  'mortgage',
  'car_loan',
  'credit_card',
  'huabei',
  'jiebei',
  'online_loan',
  'installment',
  'friend_loan',
  'other',
]

export interface ValuationHistory {
  id: string
  assetId: string
  value: number
  date: string
  note: string
}

export interface Asset {
  id: string
  name: string
  type: AssetType
  category: string
  initialValue: number
  currentValue: number
  purchaseDate: string
  valuationMethod: ValuationMethod
  institution: string
  rate: number
  note: string
  createTime: string
  updateTime: string
}

export interface Liability {
  id: string
  name: string
  type: LiabilityType
  initialAmount: number
  remainingAmount: number
  monthlyPayment: number
  repaymentDay: number
  institution: string
  rate: number
  note: string
  createTime: string
  updateTime: string
}

export interface DailySnapshot {
  date: string
  totalAssets: number
  totalLiabilities: number
  netWorth: number
  cashAssets: number
  fixedAssets: number
  investmentAssets: number
  creditAssets: number
  otherAssets: number
  todayChange: number
}

export interface MonthlyReport {
  month: string
  startAssets: number
  endAssets: number
  startLiabilities: number
  endLiabilities: number
  startNetWorth: number
  endNetWorth: number
  netWorthChange: number
  cashChange: number
  fixedChange: number
  investmentChange: number
  creditChange: number
  otherChange: number
  snapshotCount: number
  insufficient: boolean
}

export interface UserInfo {
  id: string
  name: string
  avatar: string
  phone: string
  email: string
}

export const ASSET_TYPE_LABELS: Record<string, string> = {
  cash: '现金资产',
  fixed: '固定资产',
  investment: '投资资产',
  credit: '债权资产',
  other: '其他资产',
}

export const ASSET_TYPE_ICONS: Record<string, string> = {
  cash: '💰',
  fixed: '🏠',
  investment: '📈',
  credit: '📜',
  other: '📦',
}

export const ASSET_CATEGORIES: Record<string, string[]> = {
  cash: ['银行存款', '现金', '第三方支付', '货币基金', '其他'],
  fixed: ['房产', '车辆', '土地', '设备', '其他'],
  investment: ['股票', '基金', '理财产品', '信托', '其他'],
  credit: ['国债', '企业债', '可转债', '应收账款', '其他'],
  other: ['保险', '贵金属', '收藏品', '其他'],
}

export const VALUATION_METHOD_LABELS: Record<ValuationMethod, string> = {
  market: '市价法',
  cost: '成本法',
  income: '收益法',
  net: '净值法',
}

export const LIABILITY_TYPE_LABELS: Record<string, string> = {
  mortgage: '房贷',
  car_loan: '车贷',
  credit_card: '信用卡',
  huabei: '花呗',
  jiebei: '借呗',
  online_loan: '网贷',
  installment: '消费分期',
  friend_loan: '亲友借款',
  other: '其他负债',
}

export const LIABILITY_TYPE_ICONS: Record<string, string> = {
  mortgage: '🏠',
  car_loan: '🚗',
  credit_card: '💳',
  huabei: '🌸',
  jiebei: '💰',
  online_loan: '🌐',
  installment: '📱',
  friend_loan: '👥',
  other: '📋',
}
