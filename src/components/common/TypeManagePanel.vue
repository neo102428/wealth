<script setup lang="ts">
interface TypeItem {
  key: string
  label: string
  icon: string
}

defineProps<{
  visible: boolean
  title: string
  typeList: TypeItem[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'delete', key: string, label: string): void
  (e: 'add'): void
}>()
</script>

<template>
  <view v-if="visible" class="panel-mask" @click="emit('close')">
    <view class="panel" @click.stop>
      <view class="panel-header">
        <text class="panel-title">{{ title }}</text>
        <text class="panel-close" @click="emit('close')">✕</text>
      </view>
      <scroll-view scroll-y class="panel-body">
        <view v-for="item in typeList" :key="item.key" class="panel-row">
          <view class="panel-row-left">
            <text class="panel-icon">{{ item.icon }}</text>
            <text class="panel-label">{{ item.label }}</text>
          </view>
          <view class="panel-del" @click="emit('delete', item.key, item.label)">
            <text class="panel-del-text">删除</text>
          </view>
        </view>
        <view v-if="typeList.length === 0" class="panel-empty">
          <text>暂无分类</text>
        </view>
      </scroll-view>
      <view class="panel-footer" @click="emit('add')">
        <text class="panel-add-text">+ 添加分类</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.panel-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  align-items: flex-end;
}

.panel {
  width: 100%;
  max-height: 70vh;
  background: $card-bg;
  border-radius: 24rpx 24rpx 0 0;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid $border-color-light;
}

.panel-title {
  font-size: 32rpx;
  font-weight: 600;
}

.panel-close {
  font-size: 36rpx;
  color: $text-hint;
  padding: 8rpx;
}

.panel-body {
  flex: 1;
  max-height: 50vh;
}

.panel-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.panel-row-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.panel-icon {
  font-size: 36rpx;
}

.panel-label {
  font-size: 28rpx;
  color: $text-primary;
}

.panel-del {
  padding: 8rpx 24rpx;
}

.panel-del-text {
  font-size: 26rpx;
  color: $danger-color;
}

.panel-empty {
  padding: 60rpx 0;
  text-align: center;
  color: $text-hint;
  font-size: 28rpx;
}

.panel-footer {
  padding: 28rpx 32rpx;
  border-top: 1rpx solid $border-color-light;
  text-align: center;
}

.panel-add-text {
  font-size: 30rpx;
  color: $primary-color;
  font-weight: 500;
}
</style>
