<template>
  <view class="form-card">
    <slot />
  </view>
</template>

<style lang="scss" scoped>
.form-card {
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  padding: 8rpx 28rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}
</style>
