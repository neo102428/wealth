<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const menuItems = [
  { icon: '👤', title: '个人信息', key: 'info' },
  { icon: '🔒', title: '安全设置', key: 'security' },
  { icon: 'ℹ️', title: '关于', key: 'about' },
]

function handleMenuClick(key: string) {
  uni.showToast({ title: `${key} 功能开发中`, icon: 'none' })
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res: any) => {
      if (res.confirm) {
        userStore.logout()
        uni.showToast({ title: '已退出', icon: 'none' })
      }
    },
  })
}
</script>

<template>
  <view class="page">
    <view class="user-header">
      <view class="avatar">
        <text class="avatar-text">{{ userStore.userName.charAt(0) }}</text>
      </view>
      <text class="user-name">{{ userStore.userName }}</text>
      <text class="user-phone">{{ userStore.userInfo.phone }}</text>
    </view>

    <view class="menu-section">
      <view
        v-for="item in menuItems"
        :key="item.key"
        class="menu-item"
        @click="handleMenuClick(item.key)"
      >
        <view class="menu-left">
          <text class="menu-icon">{{ item.icon }}</text>
          <text class="menu-title">{{ item.title }}</text>
        </view>
        <text class="menu-arrow">›</text>
      </view>
    </view>

    <view class="logout-section">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.page {
  padding-bottom: 40rpx;
}

.user-header {
  background: $card-bg;
  padding: 48rpx 32rpx 36rpx;
  margin: 20rpx;
  border-radius: $card-radius;
  box-shadow: $card-shadow;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background: linear-gradient(135deg, #2979ff, #5c9bff);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}

.avatar-text {
  color: #fff;
  font-size: 48rpx;
  font-weight: 600;
}

.user-name {
  font-size: 36rpx;
  font-weight: 600;
  margin-bottom: 4rpx;
}

.user-phone {
  font-size: 26rpx;
  color: $text-hint;
}

.menu-section {
  background: $card-bg;
  margin: 0 20rpx;
  border-radius: $card-radius;
  overflow: hidden;
  box-shadow: $card-shadow;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.menu-icon {
  font-size: 36rpx;
}

.menu-title {
  font-size: 28rpx;
}

.menu-arrow {
  font-size: 40rpx;
  color: #ccc;
}

.logout-section {
  margin: 40rpx 20rpx;
}

.logout-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  background: $card-bg;
  color: $danger-color;
  font-size: 30rpx;
  border-radius: $card-radius;
  border: none;
  box-shadow: $card-shadow;

  &::after {
    border: none;
  }
}
</style>
