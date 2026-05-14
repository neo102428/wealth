<script setup lang="ts">
import { formatAmount } from '@/utils/format'

interface CategoryItem {
  type: string
  label: string
  icon: string
  total: number
  count: number
  percent: number
}

defineProps<{
  categories: CategoryItem[]
}>()
</script>

<template>
  <view class="category-list">
    <view v-for="cat in categories" :key="cat.type" class="category-item">
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
</template>

<style lang="scss" scoped>
.category-list {
  background: $card-bg;
  border-radius: $card-radius;
  overflow: hidden;
  box-shadow: $card-shadow;
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
}

.cat-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
  min-width: 0;
}

.cat-icon {
  font-size: 40rpx;
  flex-shrink: 0;
}

.cat-info {
  min-width: 0;
}

.cat-name {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cat-count {
  display: block;
  font-size: 24rpx;
  color: $text-hint;
  margin-top: 2rpx;
}

.cat-amount {
  margin-left: 20rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: $text-primary;
  flex-shrink: 0;
}
</style>
