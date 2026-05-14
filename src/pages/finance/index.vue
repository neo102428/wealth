<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAssetStore } from '@/stores/asset'
import { useLiabilityStore } from '@/stores/liability'
import {
  ASSET_TYPE_LABELS,
  ASSET_TYPE_ICONS,
  LIABILITY_TYPE_LABELS,
  LIABILITY_TYPE_ICONS,
} from '@/types'
import type { AssetType, LiabilityType } from '@/types'
import { formatAmount } from '@/utils/format'

const assetStore = useAssetStore()
const liabilityStore = useLiabilityStore()

const activeTab = ref<'asset' | 'liability'>('asset')
const activeAssetFilter = ref<AssetType | 'all'>('all')
const activeLiabilityFilter = ref<LiabilityType | 'all'>('all')

const assetFilterOptions = computed(() => {
  const opts: { key: AssetType | 'all'; label: string }[] = [{ key: 'all', label: '全部' }]
  const types: AssetType[] = ['cash', 'fixed', 'investment', 'credit', 'other']
  for (const t of types) {
    opts.push({ key: t, label: ASSET_TYPE_LABELS[t] })
  }
  return opts
})

const liabilityFilterOptions = computed(() => {
  const opts: { key: LiabilityType | 'all'; label: string }[] = [{ key: 'all', label: '全部' }]
  const types: LiabilityType[] = [
    'mortgage',
    'car_loan',
    'credit_card',
    'huabei',
    'jiebei',
    'online_loan',
    'installment',
    'friend_loan',
    'other',
  ]
  for (const t of types) {
    opts.push({ key: t, label: LIABILITY_TYPE_LABELS[t] })
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
    icon: ASSET_TYPE_ICONS[item.type],
    name: item.name,
    meta: `${item.category} · ${item.institution || '--'}`,
    amount: formatAmount(item.currentValue),
    amountClass: 'amount-green',
  })),
)

const liabilityItems = computed(() =>
  filteredLiabilities.value.map((item) => ({
    id: item.id,
    icon: LIABILITY_TYPE_ICONS[item.type],
    name: item.name,
    meta: [
      LIABILITY_TYPE_LABELS[item.type],
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
  uni.showActionSheet({
    itemList: ['添加普通资产', '添加自定义资产'],
    success: (res) => {
      const url = res.tapIndex === 1 ? '/pages/asset/form?custom=1' : '/pages/asset/form'
      uni.navigateTo({ url })
    },
  })
}

function goAddLiability() {
  uni.navigateTo({ url: '/pages/liability/form' })
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
</script>

<template>
  <view class="finance-page">
    <!-- 顶部汇总卡片 -->
    <view class="summary-card">
      <view class="summary-row">
        <view class="summary-item" @click="activeTab = 'asset'">
          <text class="summary-label">总资产</text>
          <text class="summary-amount amount-green">{{
            formatAmount(assetStore.totalAssets)
          }}</text>
          <text class="summary-count">{{ assetStore.assetCount }} 项</text>
        </view>
        <view class="summary-divider"></view>
        <view class="summary-item" @click="activeTab = 'liability'">
          <text class="summary-label">总负债</text>
          <text class="summary-amount amount-red">{{
            formatAmount(liabilityStore.totalLiabilities)
          }}</text>
          <text class="summary-count">{{ liabilityStore.liabilityCount }} 项</text>
        </view>
      </view>
    </view>

    <!-- Tab 切换 -->
    <view class="tab-bar">
      <view
        class="tab-item"
        :class="{ active: activeTab === 'asset' }"
        @click="activeTab = 'asset'"
      >
        资产
      </view>
      <view
        class="tab-item"
        :class="{ active: activeTab === 'liability' }"
        @click="activeTab = 'liability'"
      >
        负债
      </view>
    </view>

    <!-- 资产列表 -->
    <view v-if="activeTab === 'asset'">
      <scroll-view scroll-x class="filter-bar">
        <view class="filter-inner">
          <view
            v-for="opt in assetFilterOptions"
            :key="opt.key"
            class="filter-tag"
            :class="{ active: activeAssetFilter === opt.key }"
            @click="activeAssetFilter = opt.key"
          >
            {{ opt.label }}
          </view>
        </view>
      </scroll-view>

      <view v-if="assetItems.length === 0" class="empty">
        <text class="empty-text">暂无资产记录</text>
        <view class="empty-action" @click="goAddAsset">添加资产</view>
      </view>

      <view
        v-for="item in assetItems"
        :key="item.id"
        class="item-card"
        @click="goEditAsset(item.id)"
      >
        <view class="item-main">
          <view class="item-left">
            <text class="item-icon">{{ item.icon }}</text>
            <view class="item-info">
              <text class="item-name">{{ item.name }}</text>
              <text class="item-meta">{{ item.meta }}</text>
            </view>
          </view>
          <view class="item-right">
            <text :class="['item-amount', item.amountClass]">{{ item.amount }}</text>
            <view class="delete-btn" @click.stop="confirmDeleteAsset(item.id, item.name)">
              <text class="delete-icon">删</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 负债列表 -->
    <view v-if="activeTab === 'liability'">
      <scroll-view scroll-x class="filter-bar">
        <view class="filter-inner">
          <view
            v-for="opt in liabilityFilterOptions"
            :key="opt.key"
            class="filter-tag"
            :class="{ active: activeLiabilityFilter === opt.key }"
            @click="activeLiabilityFilter = opt.key"
          >
            {{ opt.label }}
          </view>
        </view>
      </scroll-view>

      <view v-if="liabilityItems.length === 0" class="empty">
        <text class="empty-text">暂无负债记录</text>
        <view class="empty-action" @click="goAddLiability">添加负债</view>
      </view>

      <view
        v-for="item in liabilityItems"
        :key="item.id"
        class="item-card"
        @click="goEditLiability(item.id)"
      >
        <view class="item-main">
          <view class="item-left">
            <text class="item-icon">{{ item.icon }}</text>
            <view class="item-info">
              <text class="item-name">{{ item.name }}</text>
              <text class="item-meta">{{ item.meta }}</text>
            </view>
          </view>
          <view class="item-right">
            <text :class="['item-amount', item.amountClass]">{{ item.amount }}</text>
            <view class="delete-btn" @click.stop="confirmDeleteLiability(item.id, item.name)">
              <text class="delete-icon">删</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- FAB 按钮 -->
    <view class="fab" @click="activeTab === 'asset' ? goAddAsset() : goAddLiability()">
      <text class="fab-text">+</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.finance-page {
  padding-bottom: 120rpx;
}

.summary-card {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.summary-row {
  display: flex;
  align-items: center;
}

.summary-item {
  flex: 1;
  text-align: center;
}

.summary-label {
  font-size: 26rpx;
  color: #999;
}

.summary-amount {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  margin-top: 8rpx;
}

.summary-count {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
}

.summary-divider {
  width: 1rpx;
  height: 80rpx;
  background: #eee;
}

.amount-green {
  color: #4caf50;
}

.amount-red {
  color: #f44336;
}

.tab-bar {
  display: flex;
  margin: 0 20rpx 16rpx;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;

  &.active {
    color: #2979ff;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60rpx;
      height: 6rpx;
      background: #2979ff;
      border-radius: 3rpx;
    }
  }
}

.filter-bar {
  white-space: nowrap;
  margin-bottom: 8rpx;
}

.filter-inner {
  display: inline-flex;
  padding: 0 20rpx;
  gap: 12rpx;
}

.filter-tag {
  display: inline-block;
  padding: 12rpx 24rpx;
  font-size: 26rpx;
  color: #666;
  background: #fff;
  border-radius: 32rpx;
  white-space: nowrap;

  &.active {
    color: #fff;
    background: #2979ff;
  }
}

.empty {
  padding: 120rpx 0;
  text-align: center;

  .empty-text {
    display: block;
    color: #999;
    font-size: 28rpx;
    margin-bottom: 24rpx;
  }

  .empty-action {
    display: inline-block;
    padding: 16rpx 48rpx;
    color: #fff;
    background: #2979ff;
    border-radius: 32rpx;
    font-size: 28rpx;
  }
}

.item-card {
  background: #fff;
  margin: 0 20rpx 16rpx;
  border-radius: 16rpx;
  padding: 24rpx 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex: 1;
  min-width: 0;
}

.item-icon {
  font-size: 40rpx;
  flex-shrink: 0;
}

.item-info {
  min-width: 0;
}

.item-name {
  display: block;
  font-size: 30rpx;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-meta {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-shrink: 0;
  margin-left: 20rpx;
}

.item-amount {
  font-size: 30rpx;
  font-weight: 600;
}

.delete-btn {
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  .delete-icon {
    font-size: 24rpx;
    color: #999;
  }
}

.fab {
  position: fixed;
  right: 32rpx;
  bottom: 120rpx;
  width: 96rpx;
  height: 96rpx;
  border-radius: 48rpx;
  background: #2979ff;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99;
  box-shadow: 0 8rpx 24rpx rgba(41, 121, 255, 0.35);

  .fab-text {
    font-size: 48rpx;
    color: #fff;
    line-height: 1;
  }
}
</style>
