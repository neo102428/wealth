export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = uni.getStorageSync(key)
    if (raw) return JSON.parse(raw) as T
  } catch (_) {
    /* ignore */
  }
  return fallback
}

export function saveToStorage(key: string, data: unknown) {
  try {
    uni.setStorageSync(key, JSON.stringify(data))
  } catch (_) {
    /* ignore */
  }
}

export function today(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
