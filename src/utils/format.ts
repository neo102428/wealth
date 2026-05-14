export function formatAmount(value: number): string {
  const fixed = value.toFixed(2)
  const parts = fixed.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `¥${parts.join('.')}`
}

export function formatDate(dateStr: string): string {
  return dateStr
}
