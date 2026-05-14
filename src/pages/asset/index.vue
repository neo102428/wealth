<script setup lang="ts">
import { ref, computed } from 'vue'
import RecordListPage from '@/components/common/RecordListPage.vue'
import { useAssetStore } from '@/stores/asset'
import { useCustomAssetTypeStore } from '@/stores/customAssetType'
import { formatAmount } from '@/utils/format'

const assetStore = useAssetStore()
const customTypeStore = useCustomAssetTypeStore()

const activeFilter = ref<string>('all')

const filterOptions = computed(() => {
  const opts: { key: string; label: string }[] = [{ key: 'all', label: '全部' }]
  for (const t of customTypeStore.allAssetTypes) {
    opts.push({ key: t, label: customTypeStore.getLabel(t) })
  }
  return opts
})

const filteredAssets = computed(() => {
  if (activeFilter.value === 'all') return assetStore.assets
  return assetStore.assets.filter((a) => a.type === activeFilter.value)
})

const listItems = computed(() =>
  filteredAssets.value.map((item) => ({
    id: item.id,
    icon: customTypeStore.getIcon(item.type),
    name: item.name,
    meta: `${item.category} · ${item.institution || '--'}`,
    amount: formatAmount(item.currentValue),
  })),
)

function goAdd() {
  uni.showActionSheet({
    itemList: ['添加普通资产', '添加自定义资产'],
    success: (res) => {
      const url = res.tapIndex === 1 ? '/pages/asset/form?custom=1' : '/pages/asset/form'
      uni.navigateTo({ url })
    },
  })
}

function goEdit(id: string) {
  uni.navigateTo({ url: '/pages/asset/form?id=' + id })
}

function confirmDelete(id: string, name: string) {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除「${name}」吗？删除后不可恢复。`,
    confirmText: '删除',
    confirmColor: '#f44336',
    success: (res) => {
      if (res.confirm) {
        assetStore.removeAsset(id)
        uni.showToast({ title: '已删除', icon: 'none' })
      }
    },
  })
}
</script>

<template>
  <RecordListPage
    v-model:active-filter="activeFilter"
    tone="green"
    summary-label="总资产"
    :summary-amount="formatAmount(assetStore.totalAssets)"
    :summary-sub="`共 ${filteredAssets.length} 项资产`"
    :filter-options="filterOptions"
    :items="listItems"
    empty-text="暂无资产记录"
    empty-action-text="添加资产"
    @add="goAdd"
    @edit="goEdit"
    @remove="confirmDelete"
  />
</template>
