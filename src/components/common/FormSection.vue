<template>
  <view class="form-card">
    <slot />
  </view>
</template>

<style lang="scss" scoped>
.form-card {
  background: $card-bg;
  margin: 20rpx;
  border-radius: $card-radius;
  padding: 8rpx 28rpx;
  box-shadow: $card-shadow;
}
</style>
