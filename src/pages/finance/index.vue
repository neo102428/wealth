<script setup lang="ts">
import { ref, computed } from 'vue'
import AssetLiabilitySummary from '@/components/common/AssetLiabilitySummary.vue'
import TabBar from '@/components/common/TabBar.vue'
import RecordListPage from '@/components/common/RecordListPage.vue'
import TypeManagePanel from '@/components/common/TypeManagePanel.vue'
import { useAssetStore } from '@/stores/asset'
import { useLiabilityStore } from '@/stores/liability'
import { useCustomAssetTypeStore } from '@/stores/customAssetType'
import { useCustomLiabilityTypeStore } from '@/stores/customLiabilityType'
import { formatAmount } from '@/utils/format'

const assetStore = useAssetStore()
const liabilityStore = useLiabilityStore()
const customTypeStore = useCustomAssetTypeStore()
const customLiabilityTypeStore = useCustomLiabilityTypeStore()

const activeTab = ref<'asset' | 'liability'>('asset')
const activeAssetFilter = ref<string>('all')
const activeLiabilityFilter = ref<string>('all')

const tabOptions = [
  { key: 'asset', label: '资产' },
  { key: 'liability', label: '负债' },
]

const assetFilterOptions = computed(() => {
  const opts: { key: string; label: string }[] = [{ key: 'all', label: '全部' }]
  for (const t of customTypeStore.allAssetTypes) {
    opts.push({ key: t, label: customTypeStore.getLabel(t) })
  }
  return opts
})

const liabilityFilterOptions = computed(() => {
  const opts: { key: string; label: string }[] = [{ key: 'all', label: '全部' }]
  for (const t of customLiabilityTypeStore.allLiabilityTypes) {
    opts.push({ key: t, label: customLiabilityTypeStore.getLabel(t) })
  }
  return opts
})

const filteredAssets = computed(() => {
  if (activeAssetFilter.value === 'all') return assetStore.assets
  return assetStore.assets.filter((a) => a.type === activeAssetFilter.value)
})

const filteredLiabilities = computed(() => {
  if (activeLiabilityFilter.value === 'all') return liabilityStore.liabilities
  return liabilityStore.liabilities.filter((l) => l.type === activeLiabilityFilter.value)
})

const assetItems = computed(() =>
  filteredAssets.value.map((item) => ({
    id: item.id,
    icon: customTypeStore.getIcon(item.type),
    name: item.name,
    meta: `${item.category} · ${item.institution || '--'}`,
    amount: formatAmount(item.currentValue),
    amountClass: 'amount-green',
  })),
)

const liabilityItems = computed(() =>
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
    amountClass: 'amount-red',
  })),
)

function goAddAsset() {
  const type = activeAssetFilter.value === 'all' ? '' : activeAssetFilter.value
  const url = type ? `/pages/asset/form?type=${type}` : '/pages/asset/form'
  uni.navigateTo({ url })
}

function goAddLiability() {
  const type = activeLiabilityFilter.value === 'all' ? '' : activeLiabilityFilter.value
  const url = type ? `/pages/liability/form?type=${type}` : '/pages/liability/form'
  uni.navigateTo({ url })
}

function goEditAsset(id: string) {
  uni.navigateTo({ url: '/pages/asset/form?id=' + id })
}

function goEditLiability(id: string) {
  uni.navigateTo({ url: '/pages/liability/form?id=' + id })
}

function confirmDeleteAsset(id: string, name: string) {
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

function confirmDeleteLiability(id: string, name: string) {
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

const showTypePanel = ref(false)
const typePanelMode = ref<'asset' | 'liability'>('asset')

function openTypePanel(mode: 'asset' | 'liability') {
  typePanelMode.value = mode
  showTypePanel.value = true
}

function closeTypePanel() {
  showTypePanel.value = false
}

function getTypeList() {
  if (typePanelMode.value === 'asset') {
    return customTypeStore.allAssetTypes.map((key) => ({
      key,
      label: customTypeStore.getLabel(key),
      icon: customTypeStore.getIcon(key),
    }))
  }
  return customLiabilityTypeStore.allLiabilityTypes.map((key) => ({
    key,
    label: customLiabilityTypeStore.getLabel(key),
    icon: customLiabilityTypeStore.getIcon(key),
  }))
}

function deleteFromPanel(key: string, label: string) {
  const store = typePanelMode.value === 'asset' ? customTypeStore : customLiabilityTypeStore
  uni.showModal({
    title: '确认删除',
    content: `确定要删除「${label}」吗？`,
    confirmText: '删除',
    confirmColor: '#f44336',
    success: (res) => {
      if (res.confirm) {
        store.removeType(key)
        if (typePanelMode.value === 'asset' && activeAssetFilter.value === key) {
          activeAssetFilter.value = 'all'
        }
        if (typePanelMode.value === 'liability' && activeLiabilityFilter.value === key) {
          activeLiabilityFilter.value = 'all'
        }
        uni.showToast({ title: '已删除', icon: 'none' })
      }
    },
  })
}

function addToPanel() {
  const isAsset = typePanelMode.value === 'asset'
  const presets = isAsset
    ? [
        { key: 'cash', label: '现金资产', icon: '💰' },
        { key: 'fixed', label: '固定资产', icon: '🏠' },
        { key: 'investment', label: '投资资产', icon: '📈' },
        { key: 'digital', label: '数码产品', icon: '📱' },
      ]
    : [
        { key: 'mortgage', label: '房贷', icon: '🏠' },
        { key: 'online_loan', label: '网贷', icon: '🌐' },
      ]
  const itemList = ['自定义', ...presets.map((p) => p.icon + ' ' + p.label)]

  uni.showActionSheet({
    itemList,
    success: (res) => {
      if (res.tapIndex === 0) {
        addCustomLabel(isAsset)
        return
      }
      const preset = presets[res.tapIndex - 1]
      const store = isAsset ? customTypeStore : customLiabilityTypeStore
      const allTypes = isAsset
        ? customTypeStore.allAssetTypes
        : customLiabilityTypeStore.allLiabilityTypes
      if (allTypes.includes(preset.key)) {
        uni.showToast({ title: '该分类已存在', icon: 'none' })
        return
      }
      if (isAsset) {
        customTypeStore.restoreType(preset.key)
      } else {
        customLiabilityTypeStore.restoreType(preset.key)
      }
      if (
        !(
          isAsset ? customTypeStore.allAssetTypes : customLiabilityTypeStore.allLiabilityTypes
        ).includes(preset.key)
      ) {
        store.addCustomType(preset.label, preset.icon)
      }
      uni.showToast({ title: '已添加', icon: 'success' })
    },
  })
}

function addCustomLabel(isAsset: boolean) {
  const store = isAsset ? customTypeStore : customLiabilityTypeStore
  uni.showModal({
    title: '输入分类名称',
    editable: true,
    placeholderText: '请输入分类名称',
    success: (res) => {
      if (res.confirm && res.content) {
        const label = res.content.trim()
        if (!label) return
        uni.showModal({
          title: '选择图标',
          editable: true,
          placeholderText: '输入一个 emoji 图标',
          success: (res2) => {
            if (res2.confirm) {
              const icon = (res2.content || '').trim() || (isAsset ? '📦' : '📋')
              store.addCustomType(label, icon)
              uni.showToast({ title: '已添加', icon: 'success' })
            }
          },
        })
      }
    },
  })
}
</script>

<template>
  <view class="finance-page">
    <AssetLiabilitySummary
      :asset-total="assetStore.totalAssets"
      :asset-count="assetStore.assetCount"
      :liability-total="liabilityStore.totalLiabilities"
      :liability-count="liabilityStore.liabilityCount"
      @click-asset="activeTab = 'asset'"
      @click-liability="activeTab = 'liability'"
    />

    <TabBar v-model="activeTab" :tabs="tabOptions" />

    <RecordListPage
      v-if="activeTab === 'asset'"
      v-model:active-filter="activeAssetFilter"
      tone="green"
      summary-label="总资产"
      :summary-amount="formatAmount(assetStore.totalAssets)"
      :summary-sub="`${assetStore.assetCount} 项`"
      :filter-options="assetFilterOptions"
      :items="assetItems"
      empty-text="暂无资产记录"
      empty-action-text="添加资产"
      @add="goAddAsset"
      @edit="goEditAsset"
      @remove="confirmDeleteAsset"
    >
      <template #extra-filter>
        <view class="filter-tag filter-tag-mgr" @click="openTypePanel('asset')">＋−</view>
      </template>
    </RecordListPage>

    <RecordListPage
      v-if="activeTab === 'liability'"
      v-model:active-filter="activeLiabilityFilter"
      tone="red"
      summary-label="总负债"
      :summary-amount="formatAmount(liabilityStore.totalLiabilities)"
      :summary-sub="`${liabilityStore.liabilityCount} 项`"
      :filter-options="liabilityFilterOptions"
      :items="liabilityItems"
      empty-text="暂无负债记录"
      empty-action-text="添加负债"
      @add="goAddLiability"
      @edit="goEditLiability"
      @remove="confirmDeleteLiability"
    >
      <template #extra-filter>
        <view class="filter-tag filter-tag-mgr" @click="openTypePanel('liability')">＋−</view>
      </template>
    </RecordListPage>

    <TypeManagePanel
      :visible="showTypePanel"
      :title="typePanelMode === 'asset' ? '资产分类管理' : '负债分类管理'"
      :type-list="getTypeList()"
      @close="closeTypePanel"
      @delete="deleteFromPanel"
      @add="addToPanel"
    />
  </view>
</template>

<style lang="scss" scoped>
.finance-page {
  padding-bottom: 120rpx;
}
</style>
