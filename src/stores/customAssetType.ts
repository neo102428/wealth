import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CustomAssetType } from '@/types'
import { BUILTIN_ASSET_TYPES, ASSET_TYPE_LABELS, ASSET_TYPE_ICONS } from '@/types'
import { loadFromStorage, saveToStorage } from '@/utils/storage'

export const useCustomAssetTypeStore = defineStore('customAssetType', () => {
  const customTypes = ref<CustomAssetType[]>(loadFromStorage('wealth_custom_asset_types', []))
  const removedBuiltins = ref<string[]>(loadFromStorage('wealth_removed_builtin_types', []))

  function persist() {
    saveToStorage('wealth_custom_asset_types', customTypes.value)
    saveToStorage('wealth_removed_builtin_types', removedBuiltins.value)
  }

  const allAssetTypes = computed(() => {
    const removed = new Set(removedBuiltins.value)
    return [
      ...BUILTIN_ASSET_TYPES.filter((t) => !removed.has(t)),
      ...customTypes.value.map((t) => t.key),
    ]
  })

  const customTypeMap = computed(() => {
    const map: Record<string, CustomAssetType> = {}
    for (const t of customTypes.value) {
      map[t.key] = t
    }
    return map
  })

  function getLabel(key: string): string {
    return customTypeMap.value[key]?.label ?? ASSET_TYPE_LABELS[key] ?? key
  }

  function getIcon(key: string): string {
    return customTypeMap.value[key]?.icon ?? ASSET_TYPE_ICONS[key] ?? '📦'
  }

  function addCustomType(label: string, icon: string): boolean {
    if (!label.trim()) return false
    const key = 'custom_' + Date.now().toString(36)
    customTypes.value.push({ key, label: label.trim(), icon: icon || '📦' })
    persist()
    return true
  }

  function restoreType(key: string) {
    removedBuiltins.value = removedBuiltins.value.filter((t) => t !== key)
    persist()
  }

  function removeType(key: string) {
    if (BUILTIN_ASSET_TYPES.includes(key)) {
      if (!removedBuiltins.value.includes(key)) {
        removedBuiltins.value.push(key)
      }
    } else {
      customTypes.value = customTypes.value.filter((t) => t.key !== key)
    }
    persist()
  }

  function removeCustomType(key: string) {
    customTypes.value = customTypes.value.filter((t) => t.key !== key)
    persist()
  }

  return {
    customTypes,
    allAssetTypes,
    getLabel,
    getIcon,
    addCustomType,
    restoreType,
    removeType,
    removeCustomType,
  }
})
