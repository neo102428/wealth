import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DailySnapshot, MonthlyReport } from '@/types'
import { mockDailySnapshots, mockMonthlyReports } from '@/mock'
import { useAssetStore } from './asset'
import { useLiabilityStore } from './liability'
import { loadFromStorage, saveToStorage, today } from '@/utils/storage'

export const useSnapshotStore = defineStore('snapshot', () => {
  const dailySnapshots = ref<DailySnapshot[]>(
    loadFromStorage('wealth_snapshots', mockDailySnapshots),
  )
  const monthlyReports = ref<MonthlyReport[]>(loadFromStorage('wealth_monthly', mockMonthlyReports))

  const latestSnapshot = computed(() => {
    return dailySnapshots.value[dailySnapshots.value.length - 1] ?? null
  })

  const todayNetWorthChange = computed(() => latestSnapshot.value?.todayChange ?? 0)

  const monthlyNetWorthChange = computed(() => {
    const list = dailySnapshots.value
    if (list.length === 0) return 0
    const latest = list[list.length - 1]
    const currentMonth = latest.date.substring(0, 7)
    const firstOfMonth = list.find((s) => s.date.startsWith(currentMonth))
    if (!firstOfMonth) return 0
    return Math.round((latest.netWorth - firstOfMonth.netWorth) * 100) / 100
  })

  const snapshotByMonth = computed(() => {
    const map: Record<string, DailySnapshot[]> = {}
    for (const s of dailySnapshots.value) {
      const month = s.date.substring(0, 7)
      if (!map[month]) map[month] = []
      map[month].push(s)
    }
    return map
  })

  function generateMonthlyReport(month: string): MonthlyReport | null {
    const monthSnapshots = dailySnapshots.value
      .filter((s) => s.date.startsWith(month))
      .sort((a, b) => a.date.localeCompare(b.date))

    if (monthSnapshots.length === 0) return null

    const first = monthSnapshots[0]
    const last = monthSnapshots[monthSnapshots.length - 1]
    const insufficient = monthSnapshots.length < 2

    const round = (v: number) => Math.round(v * 100) / 100

    const report: MonthlyReport = {
      month,
      startAssets: first.totalAssets,
      endAssets: last.totalAssets,
      startLiabilities: first.totalLiabilities,
      endLiabilities: last.totalLiabilities,
      startNetWorth: first.netWorth,
      endNetWorth: last.netWorth,
      netWorthChange: round(last.netWorth - first.netWorth),
      cashChange: round(last.cashAssets - first.cashAssets),
      fixedChange: round(last.fixedAssets - first.fixedAssets),
      investmentChange: round(last.investmentAssets - first.investmentAssets),
      creditChange: round(last.creditAssets - first.creditAssets),
      otherChange: round(last.otherAssets - first.otherAssets),
      snapshotCount: monthSnapshots.length,
      insufficient,
    }

    // 更新或新增到 monthlyReports
    const idx = monthlyReports.value.findIndex((r) => r.month === month)
    if (idx !== -1) {
      monthlyReports.value[idx] = report
    } else {
      monthlyReports.value.push(report)
      monthlyReports.value.sort((a, b) => b.month.localeCompare(a.month))
    }

    persist()
    return report
  }

  function persist() {
    saveToStorage('wealth_snapshots', dailySnapshots.value)
    saveToStorage('wealth_monthly', monthlyReports.value)
  }

  function generateTodaySnapshot() {
    const assetStore = useAssetStore()
    const liabilityStore = useLiabilityStore()

    const dateStr = today()

    const totalAssets = assetStore.totalAssets
    const totalLiabilities = liabilityStore.totalLiabilities
    const netWorth = totalAssets - totalLiabilities

    const cashAssets = sumByType(assetStore, 'cash')
    const fixedAssets = sumByType(assetStore, 'fixed')
    const investmentAssets = sumByType(assetStore, 'investment')
    const creditAssets = sumByType(assetStore, 'credit')
    const otherAssets = sumByType(assetStore, 'other')

    // 今日变化 = 今日净资产 - 上一次快照净资产
    let todayChange = 0
    if (dailySnapshots.value.length > 0) {
      const prev = dailySnapshots.value[dailySnapshots.value.length - 1]
      todayChange = Math.round((netWorth - prev.netWorth) * 100) / 100
    }

    const snapshot: DailySnapshot = {
      date: dateStr,
      totalAssets: Math.round(totalAssets * 100) / 100,
      totalLiabilities: Math.round(totalLiabilities * 100) / 100,
      netWorth: Math.round(netWorth * 100) / 100,
      cashAssets: Math.round(cashAssets * 100) / 100,
      fixedAssets: Math.round(fixedAssets * 100) / 100,
      investmentAssets: Math.round(investmentAssets * 100) / 100,
      creditAssets: Math.round(creditAssets * 100) / 100,
      otherAssets: Math.round(otherAssets * 100) / 100,
      todayChange: Math.round(todayChange * 100) / 100,
    }

    // 如果今天已有快照，更新；否则新增
    const existingIndex = dailySnapshots.value.findIndex((s) => s.date === dateStr)
    if (existingIndex !== -1) {
      dailySnapshots.value[existingIndex] = snapshot
    } else {
      dailySnapshots.value.push(snapshot)
    }

    persist()
  }

  function sumByType(assetStore: ReturnType<typeof useAssetStore>, type: string): number {
    return assetStore.assets
      .filter((a) => a.type === type)
      .reduce((sum, a) => sum + a.currentValue, 0)
  }

  return {
    dailySnapshots,
    monthlyReports,
    latestSnapshot,
    todayNetWorthChange,
    monthlyNetWorthChange,
    snapshotByMonth,
    generateTodaySnapshot,
    generateMonthlyReport,
    persist,
  }
})
