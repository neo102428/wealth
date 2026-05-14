<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'blue' | 'red'
    text?: string
  }>(),
  {
    tone: 'blue',
    text: '保存',
  },
)

const emit = defineEmits<{
  (e: 'save'): void
}>()
</script>

<template>
  <view class="btn-area">
    <button class="save-btn" :class="`tone-${tone}`" @click="emit('save')">{{ text }}</button>
  </view>
</template>

<style lang="scss" scoped>
.btn-area {
  padding: 32rpx 20rpx;
}

.save-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  color: #fff;
  font-size: 32rpx;
  border-radius: $card-radius;
  border: none;

  &::after {
    border: none;
  }
}

.tone-blue {
  background: $primary-color;
}

.tone-red {
  background: $danger-color;
}
</style>
