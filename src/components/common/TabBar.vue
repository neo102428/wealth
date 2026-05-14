<script setup lang="ts">
interface Tab {
  key: string
  label: string
}

defineProps<{
  tabs: Tab[]
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', key: string): void
}>()
</script>

<template>
  <view class="tab-bar">
    <view
      v-for="tab in tabs"
      :key="tab.key"
      class="tab-item"
      :class="{ active: modelValue === tab.key }"
      @click="emit('update:modelValue', tab.key)"
    >
      {{ tab.label }}
    </view>
  </view>
</template>

<style lang="scss" scoped>
.tab-bar {
  display: flex;
  margin: 0 20rpx 16rpx;
  background: $card-bg;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: $card-shadow;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: $text-secondary;
  position: relative;

  &.active {
    color: $primary-color;
    font-weight: 600;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60rpx;
      height: 6rpx;
      background: $primary-color;
      border-radius: 3rpx;
    }
  }
}
</style>
