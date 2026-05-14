import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Liability } from '@/types'
import { mockLiabilities } from '@/mock'

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

export const useLiabilityStore = defineStore('liability', () => {
  const liabilities = ref<Liability[]>(loadFromStorage('wealth_liabilities', mockLiabilities))

  const totalLiabilities = computed(() =>
    liabilities.value.reduce((sum, l) => sum + l.remainingAmount, 0),
  )

  const liabilityCount = computed(() => liabilities.value.length)

  const liabilitiesByType = computed(() => {
    const map: Record<string, Liability[]> = {}
    for (const l of liabilities.value) {
      if (!map[l.type]) map[l.type] = []
      map[l.type].push(l)
    }
    return map
  })

  function persist() {
    saveToStorage('wealth_liabilities', liabilities.value)
  }

  function addLiability(liability: Liability) {
    liabilities.value.push(liability)
    persist()
  }

  function updateLiability(id: string, data: Partial<Liability>) {
    const index = liabilities.value.findIndex((l) => l.id === id)
    if (index === -1) return
    liabilities.value[index] = { ...liabilities.value[index], ...data, updateTime: today() }
    persist()
  }

  function removeLiability(id: string) {
    liabilities.value = liabilities.value.filter((l) => l.id !== id)
    persist()
  }

  return {
    liabilities,
    totalLiabilities,
    liabilityCount,
    liabilitiesByType,
    addLiability,
    updateLiability,
    removeLiability,
  }
})
