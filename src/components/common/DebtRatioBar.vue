<script setup lang="ts">
defineProps<{
  ratio: number
}>()
</script>

<template>
  <view class="ratio-card">
    <view class="ratio-header">
      <text class="ratio-label">资产负债率</text>
      <text
        class="ratio-value"
        :class="ratio > 60 ? 'text-red' : ratio > 40 ? 'text-warn' : 'text-green'"
      >
        {{ ratio.toFixed(2) }}%
      </text>
    </view>
    <view class="ratio-bar">
      <view
        class="ratio-fill"
        :class="ratio > 60 ? 'bg-red' : ratio > 40 ? 'bg-warn' : 'bg-green'"
        :style="{ width: Math.min(ratio, 100) + '%' }"
      ></view>
    </view>
    <text class="ratio-tip">合理区间：40% ~ 60%</text>
  </view>
</template>

<style lang="scss" scoped>
.ratio-card {
  background: $card-bg;
  margin: 20rpx;
  padding: 28rpx;
  border-radius: $card-radius;
  box-shadow: $card-shadow;
}

.ratio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.ratio-label {
  font-size: 28rpx;
  font-weight: 500;
}

.ratio-value {
  font-size: 32rpx;
  font-weight: 700;
}

.ratio-bar {
  height: 12rpx;
  background: $border-color-light;
  border-radius: 6rpx;
  overflow: hidden;
}

.ratio-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.4s ease;
}

.text-green {
  color: $success-color;
}

.text-red {
  color: $danger-color;
}

.text-warn {
  color: $warning-color;
}

.bg-green {
  background: $success-color;
}

.bg-red {
  background: $danger-color;
}

.bg-warn {
  background: $warning-color;
}

.ratio-tip {
  display: block;
  font-size: 22rpx;
  color: #bbb;
  margin-top: 10rpx;
}
</style>
