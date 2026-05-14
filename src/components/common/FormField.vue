<script setup lang="ts">
defineProps<{
  label: string
  required?: boolean
  error?: string
}>()
</script>

<template>
  <view class="form-item">
    <text class="form-label">
      {{ label }}
      <text v-if="required" class="required">*</text>
    </text>
    <slot />
    <text v-if="error" class="form-error">{{ error }}</text>
  </view>
</template>

<style lang="scss" scoped>
.form-item {
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.form-label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #333;
  margin-bottom: 12rpx;
}

.required {
  color: #f44336;
}

.form-error {
  font-size: 24rpx;
  color: #f44336;
  margin-top: 8rpx;
}

:deep(.form-input) {
  height: 80rpx;
  background: #f8f8f8;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

:deep(.form-textarea) {
  width: 100%;
  min-height: 140rpx;
  background: #f8f8f8;
  border-radius: 10rpx;
  padding: 16rpx 20rpx;
  font-size: 28rpx;
}

:deep(.form-picker) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80rpx;
  background: #f8f8f8;
  border-radius: 10rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

:deep(.placeholder) {
  color: #999;
}

:deep(.arrow) {
  font-size: 36rpx;
  color: #ccc;
}
</style>
