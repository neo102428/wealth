<script setup lang="ts">
import { ref, computed } from 'vue'
import PieChart from '@/components/common/PieChart.vue'
import NetWorthCard from '@/components/common/NetWorthCard.vue'
import AssetLiabilitySummary from '@/components/common/AssetLiabilitySummary.vue'
import DebtRatioBar from '@/components/common/DebtRatioBar.vue'
import CategorySummaryList from '@/components/common/CategorySummaryList.vue'
import { useAssetStore } from '@/stores/asset'
import { useLiabilityStore } from '@/stores/liability'
import { useSnapshotStore } from '@/stores/snapshot'
import { useCustomAssetTypeStore } from '@/stores/customAssetType'
import { useUserStore } from '@/stores/user'
import { formatAmount } from '@/utils/format'

const assetStore = useAssetStore()
const liabilityStore = useLiabilityStore()
const snapshotStore = useSnapshotStore()
const customTypeStore = useCustomAssetTypeStore()
const userStore = useUserStore()

const ASSET_CHART_COLORS = [
  '#2979ff',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
  '#ec4899',
  '#84cc16',
  '#f97316',
  '#64748b',
]

const netWorth = computed(() => assetStore.totalAssets - liabilityStore.totalLiabilities)

const debtRatio = computed(() => {
  if (assetStore.totalAssets === 0) return 0
  return (liabilityStore.totalLiabilities / assetStore.totalAssets) * 100
})

const todayChange = computed(() => snapshotStore.todayNetWorthChange)

const monthlyChange = computed(() => snapshotStore.monthlyNetWorthChange)

const assetTypeKeys = computed(() => {
  const keys = new Set<string>(customTypeStore.allAssetTypes)
  for (const asset of assetStore.assets) {
    keys.add(asset.type)
  }
  return Array.from(keys)
})

const assetCategories = computed(() =>
  assetTypeKeys.value.map((type, index) => {
    const items = assetStore.assets.filter((asset) => asset.type === type)
    const total = items.reduce((sum, asset) => sum + asset.currentValue, 0)
    return {
      type,
      label: customTypeStore.getLabel(type),
      icon: customTypeStore.getIcon(type),
      total,
      count: items.length,
      color: ASSET_CHART_COLORS[index % ASSET_CHART_COLORS.length],
      percent: assetStore.totalAssets > 0 ? (total / assetStore.totalAssets) * 100 : 0,
    }
  }),
)

const selectedAssetType = ref<string | null>(null)

const selectedAssetCategory = computed(() =>
  assetCategories.value.find((category) => category.type === selectedAssetType.value),
)

const chartSegments = computed(() => {
  if (!selectedAssetType.value) {
    return assetCategories.value
      .filter((cat) => cat.total > 0)
      .map((cat) => ({
        key: cat.type,
        label: cat.label,
        icon: cat.icon,
        value: cat.total,
        valueText: formatAmount(cat.total),
        color: cat.color,
      }))
  }

  return assetStore.assets
    .filter((asset) => asset.type === selectedAssetType.value && asset.currentValue > 0)
    .sort((left, right) => right.currentValue - left.currentValue)
    .map((asset, index) => ({
      key: asset.id,
      label: asset.name,
      icon: customTypeStore.getIcon(asset.type),
      value: asset.currentValue,
      valueText: formatAmount(asset.currentValue),
      color: ASSET_CHART_COLORS[index % ASSET_CHART_COLORS.length],
    }))
})

const chartTitle = computed(() => {
  if (!selectedAssetType.value) return '资产分布'
  return `${selectedAssetCategory.value?.label || '资产'}明细`
})

const chartTotalLabel = computed(() => {
  if (!selectedAssetType.value) return '总资产'
  return selectedAssetCategory.value?.label || '资产'
})

const chartTotalText = computed(() => {
  if (!selectedAssetType.value) return formatAmount(assetStore.totalAssets)
  return selectedAssetCategory.value ? formatAmount(selectedAssetCategory.value.total) : ''
})

function onChartSegmentClick(key: string) {
  if (key === '__back__') {
    selectedAssetType.value = null
    return
  }

  if (!selectedAssetType.value) {
    selectedAssetType.value = key
  }
}
</script>

<template>
  <view class="page">
    <NetWorthCard
      :net-worth="netWorth"
      :today-change="todayChange"
      :monthly-change="monthlyChange"
      :avatar="userStore.userAvatar"
      :user-name="userStore.userName"
      @avatar-click="uni.navigateTo({ url: '/pages/profile/index' })"
    />

    <AssetLiabilitySummary
      :asset-total="assetStore.totalAssets"
      :asset-count="assetStore.assetCount"
      :liability-total="liabilityStore.totalLiabilities"
      :liability-count="liabilityStore.liabilityCount"
      @click-asset="uni.switchTab({ url: '/pages/finance/index' })"
      @click-liability="uni.switchTab({ url: '/pages/finance/index' })"
    />

    <DebtRatioBar :ratio="debtRatio" />

    <view class="section">
      <view class="section-header">
        <text class="section-title">{{ chartTitle }}</text>
        <text v-if="selectedAssetType" class="back-link" @tap="selectedAssetType = null">
          ‹ 返回总览
        </text>
      </view>
      <PieChart
        canvas-id="assetPieChart"
        :segments="chartSegments"
        :total-label="chartTotalLabel"
        :total-text="chartTotalText"
        empty-text="暂无资产数据"
        @segment-click="onChartSegmentClick"
      />
    </view>

    <view class="section">
      <text class="section-title">资产分类</text>
      <CategorySummaryList :categories="assetCategories" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  padding-bottom: 40rpx;
}

.section {
  margin: 0 20rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    display: block;
  }
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.back-link {
  font-size: 26rpx;
  color: $primary-color;
  padding: 8rpx 0;
}
</style>
