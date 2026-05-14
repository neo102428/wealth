import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Liability } from '@/types'
import { mockLiabilities } from '@/mock'
import { loadFromStorage, saveToStorage, today } from '@/utils/storage'

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
