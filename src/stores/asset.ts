import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Asset, ValuationHistory } from '@/types'
import { mockAssets, mockValuationHistories } from '@/mock'

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function today(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = uni.getStorageSync(key)
    if (raw) return JSON.parse(raw) as T
  } catch (_) {
    /* ignore */
  }
  return fallback
}

function saveToStorage(key: string, data: unknown) {
  try {
    uni.setStorageSync(key, JSON.stringify(data))
  } catch (_) {
    /* ignore */
  }
}

export const useAssetStore = defineStore('asset', () => {
  const assets = ref<Asset[]>(loadFromStorage('wealth_assets', mockAssets))
  const valuationHistories = ref<ValuationHistory[]>(
    loadFromStorage('wealth_val_histories', mockValuationHistories),
  )

  const totalAssets = computed(() => assets.value.reduce((sum, a) => sum + a.currentValue, 0))

  const assetCount = computed(() => assets.value.length)

  const assetsByType = computed(() => {
    const map: Record<string, Asset[]> = {}
    for (const a of assets.value) {
      if (!map[a.type]) map[a.type] = []
      map[a.type].push(a)
    }
    return map
  })

  function getHistoriesByAssetId(assetId: string): ValuationHistory[] {
    return valuationHistories.value
      .filter((h) => h.assetId === assetId)
      .sort((a, b) => b.date.localeCompare(a.date))
  }

  function persist() {
    saveToStorage('wealth_assets', assets.value)
    saveToStorage('wealth_val_histories', valuationHistories.value)
  }

  function addAsset(asset: Asset) {
    assets.value.push(asset)
    persist()
  }

  function updateAsset(id: string, data: Partial<Asset>) {
    const index = assets.value.findIndex((a) => a.id === id)
    if (index === -1) return
    const old = assets.value[index]

    const merged = { ...old, ...data, updateTime: today() }
    assets.value[index] = merged

    if (data.currentValue !== undefined && data.currentValue !== old.currentValue) {
      valuationHistories.value.push({
        id: genId(),
        assetId: id,
        value: data.currentValue,
        date: today(),
        note: '手动更新估值',
      })
    }

    persist()
  }

  function removeAsset(id: string) {
    assets.value = assets.value.filter((a) => a.id !== id)
    valuationHistories.value = valuationHistories.value.filter((h) => h.assetId !== id)
    persist()
  }

  return {
    assets,
    valuationHistories,
    totalAssets,
    assetCount,
    assetsByType,
    getHistoriesByAssetId,
    addAsset,
    updateAsset,
    removeAsset,
  }
})
