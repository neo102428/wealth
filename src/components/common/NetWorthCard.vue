<script setup lang="ts">
import { formatAmount } from '@/utils/format'

defineProps<{
  netWorth: number
  todayChange: number
  monthlyChange: number
  avatar?: string
  userName: string
}>()

const emit = defineEmits<{
  (e: 'avatar-click'): void
}>()
</script>

<template>
  <view class="net-worth-card">
    <view class="user-avatar" @click="emit('avatar-click')">
      <image v-if="avatar" :src="avatar" class="avatar-img" />
      <text v-else class="avatar-text">{{ userName?.charAt(0) || '用' }}</text>
    </view>
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
</template>

<style lang="scss" scoped>
.net-worth-card {
  background: linear-gradient(135deg, $primary-color, #5c9bff);
  margin: 20rpx;
  padding: 40rpx 32rpx;
  border-radius: 20rpx;
  color: #fff;
  position: relative;

  .user-avatar {
    position: absolute;
    top: 28rpx;
    right: 28rpx;
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    z-index: 1;
  }

  .avatar-img {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
  }

  .avatar-text {
    font-size: 28rpx;
    font-weight: 600;
    color: #fff;
  }

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

.text-red {
  color: #ef9a9a;
}
</style>
