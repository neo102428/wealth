<script setup lang="ts">
import { formatAmount } from '@/utils/format'

defineProps<{
  assetTotal: number
  assetCount: number
  liabilityTotal: number
  liabilityCount: number
}>()

const emit = defineEmits<{
  (e: 'click-asset'): void
  (e: 'click-liability'): void
}>()
</script>

<template>
  <view class="summary-row">
    <view class="summary-card" @click="emit('click-asset')">
      <text class="summary-label">总资产</text>
      <text class="summary-amount amount-green">{{ formatAmount(assetTotal) }}</text>
      <text class="summary-sub">{{ assetCount }} 项</text>
    </view>
    <view class="summary-card" @click="emit('click-liability')">
      <text class="summary-label">总负债</text>
      <text class="summary-amount amount-red">{{ formatAmount(liabilityTotal) }}</text>
      <text class="summary-sub">{{ liabilityCount }} 项</text>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.summary-row {
  display: flex;
  margin: 20rpx;
  gap: 16rpx;
}

.summary-card {
  flex: 1;
  background: $card-bg;
  border-radius: $card-radius;
  padding: 28rpx;
  box-shadow: $card-shadow;
  text-align: center;
}

.summary-label {
  font-size: 26rpx;
  color: $text-hint;
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
  color: $text-hint;
  margin-top: 6rpx;
}

.amount-green {
  color: $success-color;
}

.amount-red {
  color: $danger-color;
}
</style>
