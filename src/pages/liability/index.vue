<script setup lang="ts">
import { ref, computed } from 'vue'
import RecordListPage from '@/components/common/RecordListPage.vue'
import { useLiabilityStore } from '@/stores/liability'
import { useCustomLiabilityTypeStore } from '@/stores/customLiabilityType'
import { formatAmount } from '@/utils/format'

const liabilityStore = useLiabilityStore()
const customLiabilityTypeStore = useCustomLiabilityTypeStore()

const activeFilter = ref<string>('all')

const filterOptions = computed(() => {
  const opts: { key: string; label: string }[] = [{ key: 'all', label: '全部' }]
  for (const t of customLiabilityTypeStore.allLiabilityTypes) {
    opts.push({ key: t, label: customLiabilityTypeStore.getLabel(t) })
  }
  return opts
})

const filteredLiabilities = computed(() => {
  if (activeFilter.value === 'all') return liabilityStore.liabilities
  return liabilityStore.liabilities.filter((l) => l.type === activeFilter.value)
})

const listItems = computed(() =>
  filteredLiabilities.value.map((item) => ({
    id: item.id,
    icon: customLiabilityTypeStore.getIcon(item.type),
    name: item.name,
    meta: [
      customLiabilityTypeStore.getLabel(item.type),
      item.institution,
      item.monthlyPayment > 0 ? `月供 ¥${item.monthlyPayment.toFixed(0)}` : '',
    ]
      .filter(Boolean)
      .join(' · '),
    amount: formatAmount(item.remainingAmount),
  })),
)

function goAdd() {
  uni.navigateTo({ url: '/pages/liability/form' })
}

function goEdit(id: string) {
  uni.navigateTo({ url: '/pages/liability/form?id=' + id })
}

function confirmDelete(id: string, name: string) {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除「${name}」吗？删除后不可恢复。`,
    confirmText: '删除',
    confirmColor: '#f44336',
    success: (res) => {
      if (res.confirm) {
        liabilityStore.removeLiability(id)
        uni.showToast({ title: '已删除', icon: 'none' })
      }
    },
  })
}
</script>

<template>
  <RecordListPage
    v-model:active-filter="activeFilter"
    tone="red"
    summary-label="总负债"
    :summary-amount="formatAmount(liabilityStore.totalLiabilities)"
    :summary-sub="`共 ${filteredLiabilities.length} 项负债`"
    :filter-options="filterOptions"
    :items="listItems"
    empty-text="暂无负债记录"
    empty-action-text="添加负债"
    @add="goAdd"
    @edit="goEdit"
    @remove="confirmDelete"
  />
</template>
