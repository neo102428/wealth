import type {
  Asset,
  Liability,
  ValuationHistory,
  DailySnapshot,
  MonthlyReport,
  UserInfo,
} from '@/types'

export const mockAssets: Asset[] = [
  {
    id: 'a1',
    name: '工商银行储蓄卡',
    type: 'cash',
    category: '银行存款',
    initialValue: 50000.0,
    currentValue: 50000.0,
    purchaseDate: '2025-01-15',
    valuationMethod: 'net',
    institution: '工商银行',
    rate: 0.35,
    note: '日常流动资金',
    createTime: '2025-01-15',
    updateTime: '2026-05-10',
  },
  {
    id: 'a2',
    name: '支付宝余额',
    type: 'cash',
    category: '第三方支付',
    initialValue: 10000.0,
    currentValue: 12345.67,
    purchaseDate: '2025-01-15',
    valuationMethod: 'net',
    institution: '支付宝',
    rate: 1.5,
    note: '余额宝随时取用',
    createTime: '2025-01-15',
    updateTime: '2026-05-10',
  },
  {
    id: 'a3',
    name: '招商银行活期存款',
    type: 'cash',
    category: '银行存款',
    initialValue: 100000.0,
    currentValue: 100000.0,
    purchaseDate: '2025-03-01',
    valuationMethod: 'net',
    institution: '招商银行',
    rate: 0.3,
    note: '活期储蓄，应急备用',
    createTime: '2025-03-01',
    updateTime: '2026-05-10',
  },
  {
    id: 'a4',
    name: '自住房产',
    type: 'fixed',
    category: '房产',
    initialValue: 2800000.0,
    currentValue: 3000000.0,
    purchaseDate: '2021-06-20',
    valuationMethod: 'market',
    institution: '',
    rate: 2.0,
    note: '深圳市南山区，90平米',
    createTime: '2021-06-20',
    updateTime: '2021-06-20',
  },
  {
    id: 'a5',
    name: '家用轿车',
    type: 'fixed',
    category: '车辆',
    initialValue: 200000.0,
    currentValue: 150000.0,
    purchaseDate: '2024-01-15',
    valuationMethod: 'market',
    institution: '',
    rate: -10.0,
    note: '2024款，当前估值约15万',
    createTime: '2024-01-15',
    updateTime: '2026-05-01',
  },
  {
    id: 'a6',
    name: '易方达沪深300ETF联接',
    type: 'investment',
    category: '基金',
    initialValue: 60000.0,
    currentValue: 80000.0,
    purchaseDate: '2024-06-01',
    valuationMethod: 'market',
    institution: '天天基金',
    rate: 5.0,
    note: '定投中，每月2000元',
    createTime: '2024-06-01',
    updateTime: '2026-05-10',
  },
  {
    id: 'a7',
    name: '贵州茅台股票',
    type: 'investment',
    category: '股票',
    initialValue: 120000.0,
    currentValue: 150000.0,
    purchaseDate: '2023-03-15',
    valuationMethod: 'market',
    institution: '华泰证券',
    rate: 8.0,
    note: '长线持有',
    createTime: '2023-03-15',
    updateTime: '2026-05-10',
  },
  {
    id: 'a8',
    name: '招商中证白酒基金',
    type: 'investment',
    category: '基金',
    initialValue: 40000.0,
    currentValue: 50000.0,
    purchaseDate: '2025-06-01',
    valuationMethod: 'market',
    institution: '天天基金',
    rate: 6.0,
    note: '消费赛道布局',
    createTime: '2025-06-01',
    updateTime: '2026-05-10',
  },
  {
    id: 'a9',
    name: '国债逆回购',
    type: 'credit',
    category: '国债',
    initialValue: 30000.0,
    currentValue: 30000.0,
    purchaseDate: '2026-03-01',
    valuationMethod: 'net',
    institution: '华泰证券',
    rate: 2.2,
    note: '短期理财，流动性好',
    createTime: '2026-03-01',
    updateTime: '2026-05-10',
  },
  {
    id: 'a10',
    name: '企业债券基金',
    type: 'credit',
    category: '企业债',
    initialValue: 20000.0,
    currentValue: 20000.0,
    purchaseDate: '2025-09-15',
    valuationMethod: 'market',
    institution: '招商银行',
    rate: 3.5,
    note: '中低风险债基',
    createTime: '2025-09-15',
    updateTime: '2026-05-10',
  },
  {
    id: 'a11',
    name: '平安百万医疗险',
    type: 'other',
    category: '保险',
    initialValue: 5000.0,
    currentValue: 5000.0,
    purchaseDate: '2025-04-01',
    valuationMethod: 'cost',
    institution: '平安保险',
    rate: 0.0,
    note: '年缴型医疗险现金价值',
    createTime: '2025-04-01',
    updateTime: '2026-04-01',
  },
  {
    id: 'a12',
    name: '黄金饰品',
    type: 'other',
    category: '贵金属',
    initialValue: 18000.0,
    currentValue: 20000.0,
    purchaseDate: '2023-10-01',
    valuationMethod: 'market',
    institution: '',
    rate: 3.0,
    note: '约50克金饰，按市价估算',
    createTime: '2023-10-01',
    updateTime: '2026-05-10',
  },
]

export const mockValuationHistories: ValuationHistory[] = [
  { id: 'vh1', assetId: 'a5', value: 180000.0, date: '2025-07-01', note: '年中估值调整' },
  { id: 'vh2', assetId: 'a5', value: 150000.0, date: '2026-01-01', note: '年末估值调整' },
  { id: 'vh3', assetId: 'a6', value: 70000.0, date: '2025-06-01', note: '市场上涨' },
  { id: 'vh4', assetId: 'a6', value: 80000.0, date: '2026-01-01', note: '年末估值' },
  { id: 'vh5', assetId: 'a7', value: 140000.0, date: '2025-06-01', note: '股价上涨' },
  { id: 'vh6', assetId: 'a7', value: 150000.0, date: '2026-01-01', note: '年末估值' },
  { id: 'vh7', assetId: 'a4', value: 3000000.0, date: '2025-06-01', note: '房产升值' },
  { id: 'vh8', assetId: 'a2', value: 12345.67, date: '2026-04-01', note: '余额宝收益增加' },
  { id: 'vh9', assetId: 'a12', value: 20000.0, date: '2026-01-01', note: '金价上涨' },
  { id: 'vh10', assetId: 'a8', value: 50000.0, date: '2026-03-01', note: '基金净值增长' },
]

export const mockLiabilities: Liability[] = [
  {
    id: 'l1',
    name: '住房按揭贷款',
    type: 'mortgage',
    initialAmount: 1500000.0,
    remainingAmount: 1200000.0,
    monthlyPayment: 5800.0,
    repaymentDay: 15,
    institution: '工商银行',
    rate: 4.2,
    note: '30年期，等额本息',
    createTime: '2021-06-20',
    updateTime: '2026-05-01',
  },
  {
    id: 'l2',
    name: '信用卡账单',
    type: 'credit_card',
    initialAmount: 15000.0,
    remainingAmount: 15000.0,
    monthlyPayment: 0,
    repaymentDay: 25,
    institution: '招商银行',
    rate: 0.0,
    note: '5月账单，到期还款日5月25日',
    createTime: '2026-05-01',
    updateTime: '2026-05-10',
  },
  {
    id: 'l3',
    name: '车贷',
    type: 'car_loan',
    initialAmount: 120000.0,
    remainingAmount: 80000.0,
    monthlyPayment: 1470.0,
    repaymentDay: 10,
    institution: '平安银行',
    rate: 3.85,
    note: '5年期，已还2年',
    createTime: '2024-01-15',
    updateTime: '2026-05-01',
  },
  {
    id: 'l4',
    name: '花呗账单',
    type: 'huabei',
    initialAmount: 3500.0,
    remainingAmount: 3500.0,
    monthlyPayment: 0,
    repaymentDay: 20,
    institution: '支付宝',
    rate: 0.0,
    note: '5月消费，次月还款',
    createTime: '2026-05-05',
    updateTime: '2026-05-10',
  },
  {
    id: 'l5',
    name: '借呗借款',
    type: 'jiebei',
    initialAmount: 30000.0,
    remainingAmount: 20000.0,
    monthlyPayment: 2500.0,
    repaymentDay: 8,
    institution: '支付宝',
    rate: 10.8,
    note: '12期，已还4期',
    createTime: '2026-01-08',
    updateTime: '2026-05-08',
  },
  {
    id: 'l6',
    name: '微粒贷',
    type: 'online_loan',
    initialAmount: 20000.0,
    remainingAmount: 12000.0,
    monthlyPayment: 1800.0,
    repaymentDay: 5,
    institution: '微众银行',
    rate: 14.4,
    note: '装修急用，12期还清',
    createTime: '2026-02-05',
    updateTime: '2026-05-05',
  },
  {
    id: 'l7',
    name: 'iPhone分期',
    type: 'installment',
    initialAmount: 8999.0,
    remainingAmount: 4500.0,
    monthlyPayment: 750.0,
    repaymentDay: 18,
    institution: '京东白条',
    rate: 3.0,
    note: '12期免息分期，已还6期',
    createTime: '2025-11-18',
    updateTime: '2026-05-10',
  },
  {
    id: 'l8',
    name: '表哥借款',
    type: 'friend_loan',
    initialAmount: 50000.0,
    remainingAmount: 30000.0,
    monthlyPayment: 0,
    repaymentDay: 0,
    institution: '',
    rate: 0.0,
    note: '买房周转，已还2万，剩余约定年底还清',
    createTime: '2025-08-15',
    updateTime: '2026-04-01',
  },
  {
    id: 'l9',
    name: '京东白条',
    type: 'other',
    initialAmount: 2000.0,
    remainingAmount: 2000.0,
    monthlyPayment: 0,
    repaymentDay: 22,
    institution: '京东金融',
    rate: 0.0,
    note: '日常消费分期',
    createTime: '2026-05-01',
    updateTime: '2026-05-10',
  },
]

function generateDailySnapshots(): DailySnapshot[] {
  const snapshots: DailySnapshot[] = []
  const baseAssets = 3667345.67
  const baseLiabilities = 1367000.0
  const baseCash = 162345.67
  const baseFixed = 3150000.0
  const baseInvestment = 280000.0
  const baseCredit = 50000.0
  const baseOther = 25000.0
  const now = new Date()

  let prevNetWorth = 0

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = formatDate(date)

    const assetVariation = (Math.random() - 0.48) * 6000
    const liabilityVariation = i > 0 ? -3000 - Math.random() * 2000 : 0

    const totalAssets = Math.round((baseAssets + assetVariation) * 100) / 100
    const totalLiabilities = Math.round((baseLiabilities + liabilityVariation) * 100) / 100
    const netWorth = Math.round((totalAssets - totalLiabilities) * 100) / 100

    const cashAssets = Math.round((baseCash + (Math.random() - 0.5) * 1000) * 100) / 100
    const fixedAssets = baseFixed
    const investmentAssets =
      Math.round((baseInvestment + (Math.random() - 0.48) * 3000) * 100) / 100
    const creditAssets = Math.round((baseCredit + (Math.random() - 0.5) * 500) * 100) / 100
    const otherAssets = Math.round((baseOther + (Math.random() - 0.5) * 300) * 100) / 100

    const todayChange = prevNetWorth !== 0 ? Math.round((netWorth - prevNetWorth) * 100) / 100 : 0
    prevNetWorth = netWorth

    snapshots.push({
      date: dateStr,
      totalAssets,
      totalLiabilities,
      netWorth,
      cashAssets,
      fixedAssets,
      investmentAssets,
      creditAssets,
      otherAssets,
      todayChange,
    })
  }

  return snapshots
}

function generateMonthlyReports(): MonthlyReport[] {
  const reports: MonthlyReport[] = []
  const now = new Date()

  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStr = formatMonth(monthDate)

    const startAssets = Math.round((3620000 + Math.random() * 30000) * 100) / 100
    const endAssets = Math.round((startAssets + 3000 + Math.random() * 8000) * 100) / 100
    const startLiabilities =
      Math.round((1360000 - 2000 * (12 - i) + Math.random() * 2000) * 100) / 100
    const endLiabilities = Math.round((startLiabilities - 5000 - Math.random() * 3000) * 100) / 100
    const startNetWorth = Math.round((startAssets - startLiabilities) * 100) / 100
    const endNetWorth = Math.round((endAssets - endLiabilities) * 100) / 100

    reports.push({
      month: monthStr,
      startAssets,
      endAssets,
      startLiabilities,
      endLiabilities,
      startNetWorth,
      endNetWorth,
      netWorthChange: Math.round((endNetWorth - startNetWorth) * 100) / 100,
      cashChange: Math.round((300 + Math.random() * 1500) * 100) / 100,
      fixedChange: Math.round((1000 + Math.random() * 5000) * 100) / 100,
      investmentChange: Math.round((-500 + Math.random() * 3000) * 100) / 100,
      creditChange: Math.round((-200 + Math.random() * 800) * 100) / 100,
      otherChange: Math.round((-100 + Math.random() * 400) * 100) / 100,
      snapshotCount: 25 + Math.floor(Math.random() * 6),
      insufficient: false,
    })
  }

  return reports
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatMonth(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export const mockDailySnapshots = generateDailySnapshots()
export const mockMonthlyReports = generateMonthlyReports()

export const mockUser: UserInfo = {
  id: 'u1',
  name: '张三',
  avatar: '',
  phone: '138****8888',
  email: 'zhangsan@example.com',
}
