<script setup lang="ts">
import { computed } from 'vue'
import { useAssetStore } from '@/stores/asset'
import { useLiabilityStore } from '@/stores/liability'
import { useSnapshotStore } from '@/stores/snapshot'
import { ASSET_TYPE_LABELS, ASSET_TYPE_ICONS } from '@/types'
import type { AssetType } from '@/types'
import { formatAmount } from '@/utils/format'

const assetStore = useAssetStore()
const liabilityStore = useLiabilityStore()
const snapshotStore = useSnapshotStore()

const netWorth = computed(() => assetStore.totalAssets - liabilityStore.totalLiabilities)

const debtRatio = computed(() => {
  if (assetStore.totalAssets === 0) return 0
  return (liabilityStore.totalLiabilities / assetStore.totalAssets) * 100
})

const todayChange = computed(() => snapshotStore.todayNetWorthChange)

const monthlyChange = computed(() => snapshotStore.monthlyNetWorthChange)

const assetCategories = computed(() => {
  const categories: AssetType[] = ['cash', 'fixed', 'investment', 'credit', 'other']
  return categories.map((type) => {
    const items = assetStore.assets.filter((a) => a.type === type)
    const total = items.reduce((sum, a) => sum + a.currentValue, 0)
    return {
      type,
      label: ASSET_TYPE_LABELS[type],
      icon: ASSET_TYPE_ICONS[type],
      total,
      count: items.length,
      percent: assetStore.totalAssets > 0 ? (total / assetStore.totalAssets) * 100 : 0,
    }
  })
})
</script>

<template>
  <view class="page">
    <!-- 净资产卡片 -->
    <view class="net-worth-card">
      <text class="nw-label">净资产</text>
      <text class="nw-amount" :class="netWorth >= 0 ? 'text-white' : 'text-red'">
        {{ formatAmount(netWorth) }}
      </text>
      <view class="nw-changes">
        <view class="change-item">
          <text class="change-label">今日</text>
          <text class="change-value" :class="todayChange >= 0 ? 'change-up' : 'change-down'">
            {{ todayChange >= 0 ? '+' : '' }}{{ formatAmount(todayChange) }}
          </text>
        </view>
        <view class="change-divider"></view>
        <view class="change-item">
          <text class="change-label">本月</text>
          <text class="change-value" :class="monthlyChange >= 0 ? 'change-up' : 'change-down'">
            {{ monthlyChange >= 0 ? '+' : '' }}{{ formatAmount(monthlyChange) }}
          </text>
        </view>
      </view>
    </view>

    <!-- 总资产 / 总负债 -->
    <view class="summary-row">
      <view class="summary-card" @click="uni.switchTab({ url: '/pages/finance/index' })">
        <text class="summary-label">总资产</text>
        <text class="summary-amount text-green">{{ formatAmount(assetStore.totalAssets) }}</text>
        <text class="summary-sub">{{ assetStore.assetCount }} 项</text>
      </view>
      <view class="summary-card" @click="uni.switchTab({ url: '/pages/finance/index' })">
        <text class="summary-label">总负债</text>
        <text class="summary-amount text-red">{{
          formatAmount(liabilityStore.totalLiabilities)
        }}</text>
        <text class="summary-sub">{{ liabilityStore.liabilityCount }} 项</text>
      </view>
    </view>

    <!-- 资产负债率 -->
    <view class="ratio-card">
      <view class="ratio-header">
        <text class="ratio-label">资产负债率</text>
        <text
          class="ratio-value"
          :class="debtRatio > 60 ? 'text-red' : debtRatio > 40 ? 'text-warn' : 'text-green'"
        >
          {{ debtRatio.toFixed(2) }}%
        </text>
      </view>
      <view class="ratio-bar">
        <view
          class="ratio-fill"
          :class="debtRatio > 60 ? 'bg-red' : debtRatio > 40 ? 'bg-warn' : 'bg-green'"
          :style="{ width: Math.min(debtRatio, 100) + '%' }"
        ></view>
      </view>
      <text class="ratio-tip">合理区间：40% ~ 60%</text>
    </view>

    <!-- 资产分类 -->
    <view class="section">
      <text class="section-title">资产分类</text>
      <view class="category-list">
        <view v-for="cat in assetCategories" :key="cat.type" class="category-item">
          <view class="cat-left">
            <text class="cat-icon">{{ cat.icon }}</text>
            <view class="cat-info">
              <text class="cat-name">{{ cat.label }}</text>
              <text class="cat-count">{{ cat.count }} 项 · {{ cat.percent.toFixed(1) }}%</text>
            </view>
          </view>
          <text class="cat-amount">{{ formatAmount(cat.total) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  padding-bottom: 40rpx;
}

/* 净资产卡片 */
.net-worth-card {
  background: linear-gradient(135deg, #2979ff, #5c9bff);
  margin: 20rpx;
  padding: 40rpx 32rpx;
  border-radius: 20rpx;
  color: #fff;

  .nw-label {
    font-size: 26rpx;
    opacity: 0.85;
  }

  .nw-amount {
    display: block;
    font-size: 60rpx;
    font-weight: 700;
    margin-top: 8rpx;
    letter-spacing: 2rpx;
  }

  .text-white {
    color: #fff;
  }

  .nw-changes {
    display: flex;
    align-items: center;
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid rgba(255, 255, 255, 0.2);

    .change-item {
      flex: 1;
      text-align: center;

      .change-label {
        display: block;
        font-size: 22rpx;
        opacity: 0.7;
        margin-bottom: 4rpx;
      }

      .change-value {
        font-size: 26rpx;
        font-weight: 500;
      }

      .change-up {
        color: #a5d6a7;
      }
      .change-down {
        color: #ef9a9a;
      }
    }

    .change-divider {
      width: 1rpx;
      height: 40rpx;
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

/* 总资产 / 总负债 */
.summary-row {
  display: flex;
  margin: 0 20rpx;
  gap: 16rpx;

  .summary-card {
    flex: 1;
    background: #fff;
    border-radius: 16rpx;
    padding: 28rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

    .summary-label {
      font-size: 26rpx;
      color: #999;
    }

    .summary-amount {
      display: block;
      font-size: 38rpx;
      font-weight: 600;
      margin-top: 10rpx;
    }

    .summary-sub {
      display: block;
      font-size: 24rpx;
      color: #999;
      margin-top: 6rpx;
    }
  }
}

.text-green {
  color: #4caf50;
}
.text-red {
  color: #f44336;
}
.text-warn {
  color: #ff9800;
}

/* 资产负债率 */
.ratio-card {
  background: #fff;
  margin: 20rpx;
  padding: 28rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);

  .ratio-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;

    .ratio-label {
      font-size: 28rpx;
      font-weight: 500;
    }

    .ratio-value {
      font-size: 32rpx;
      font-weight: 700;
    }
  }

  .ratio-bar {
    height: 12rpx;
    background: #f0f0f0;
    border-radius: 6rpx;
    overflow: hidden;

    .ratio-fill {
      height: 100%;
      border-radius: 6rpx;
      transition: width 0.4s ease;
    }
  }

  .bg-green {
    background: #4caf50;
  }
  .bg-red {
    background: #f44336;
  }
  .bg-warn {
    background: #ff9800;
  }

  .ratio-tip {
    display: block;
    font-size: 22rpx;
    color: #bbb;
    margin-top: 10rpx;
  }
}

/* 资产分类 */
.section {
  margin: 0 20rpx;

  .section-title {
    font-size: 32rpx;
    font-weight: 600;
    margin-bottom: 16rpx;
    display: block;
  }
}

.category-list {
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }

  .cat-left {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }

  .cat-icon {
    font-size: 40rpx;
  }

  .cat-info {
    .cat-name {
      display: block;
      font-size: 28rpx;
      font-weight: 500;
    }

    .cat-count {
      display: block;
      font-size: 24rpx;
      color: #999;
      margin-top: 2rpx;
    }
  }

  .cat-amount {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
  }
}
</style>
